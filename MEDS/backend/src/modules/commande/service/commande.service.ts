import { CreateCommandeDto } from "../dto/create-commande.dto";
import { UpdateStatusDto } from "../dto/update-status.dto";
import { CommandeRepository } from "../repository/impl/commande.repository";
import { getIO } from "../../../socket/socket.server";
import { WaveService } from "../../../utils/WaveService";
import { DeliveryService } from "../../../utils/DeliveryService";
import { PharmacieRepository } from "../../pharmacie/repository/impl/pharmacie.repository";
import { OrderStatus } from "../../../shared/enums/order-status.enum";
import { ModeRecuperation } from "../../../shared/enums/mode-recuperation.enum";
import { AppDataSource } from "../../../database/data-source";
import { Commande } from "../entity/commande.entity";
import { CommandeItem } from "../entity/commande-item.entity";

export class CommandeService {
  private repository = new CommandeRepository();
  private waveService = new WaveService();
  private deliveryService = new DeliveryService();
  private pharmacieRepository = new PharmacieRepository();

  async create(data: CreateCommandeDto) {
    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // 1. Créer la commande
      const commande = new Commande();
      commande.patientId = data.patientId;
      commande.pharmacieId = data.pharmacieId;
      commande.montantTotal = data.montantTotal;
      commande.statut = OrderStatus.EN_ATTENTE;
      commande.modeRecuperation = data.modeRecuperation || ModeRecuperation.LIVRAISON;

      const savedCommande = await queryRunner.manager.save(commande);

      // 2. Créer les items
      if (data.items && data.items.length > 0) {
        const items = data.items.map(item => {
          const ci = new CommandeItem();
          ci.commandeId = savedCommande.id;
          ci.medicamentId = item.medicamentId;
          ci.quantite = item.quantite;
          ci.prixUnitaire = item.prixUnitaire;
          return ci;
        });
        await queryRunner.manager.save(items);
      }

      // Génération du lien de paiement Wave (Avant le commit pour garantir la cohérence)
      const payment = await this.waveService.createPaymentSession(
        savedCommande.montantTotal,
        savedCommande.id
      );

      await queryRunner.commitTransaction();

      const io = getIO();
      // On recharge la commande avec ses relations pour l'event socket
      const fullCommande = await this.repository.findById(savedCommande.id);
      io.emit("nouvelle_commande", fullCommande);

      return {
        ...savedCommande,
        payment_url: payment.payment_url,
      };
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async findAll(pharmacieId?: number, patientId?: number, livreurId?: number) {
    return await this.repository.findAll(pharmacieId, patientId, livreurId);
  }

  async findById(id: number) {
    return await this.repository.findById(id);
  }

  async updateStatus(id: number, data: UpdateStatusDto) {
    await this.repository.updateStatus(id, data.statut);

    // Assignation automatique du livreur si payé ET en mode LIVRAISON
    if (data.statut === OrderStatus.PAYEE) {
      const commande = await this.repository.findById(id);
      if (commande && commande.modeRecuperation === ModeRecuperation.LIVRAISON) {
        const pharmacie = await this.pharmacieRepository.findById(commande.pharmacieId);
        if (pharmacie) {
          const livreur = await this.deliveryService.findNearestLivreur(
            pharmacie.latitude,
            pharmacie.longitude
          );
          if (livreur) {
            console.log(`[Delivery] Commande ${id} assignée au livreur ${livreur.livreurId}`);
            // Update the order with the livreurId
            await this.repository.assignLivreur(id, livreur.livreurId);
            
            const io = getIO();
            io.emit("course_assignee", {
              commandeId: id,
              livreurId: livreur.livreurId
            });
          }
        }
      } else if (commande && commande.modeRecuperation === ModeRecuperation.RETRAIT) {
        console.log(`[Pickup] Commande ${id} payée, prête pour retrait en pharmacie.`);
        // Optionnel: émettre un event socket spécifique pour le retrait
        const io = getIO();
        io.emit("commande_pret_retrait", {
          commandeId: id,
          patientId: commande.patientId
        });
      }
    }

    const io = getIO();
    io.emit("commande_statut", {
      commandeId: id,
      statut: data.statut,
    });
  }
}