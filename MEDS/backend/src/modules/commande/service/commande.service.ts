import { CreateCommandeDto } from "../dto/create-commande.dto";
import { UpdateStatusDto } from "../dto/update-status.dto";
import { CommandeRepository } from "../repository/impl/commande.repository";
import { getIO } from "../../../socket/socket.server";
import { WaveService } from "../../../utils/WaveService";
import { DeliveryService } from "../../../utils/DeliveryService";
import { PharmacieRepository } from "../../pharmacie/repository/impl/pharmacie.repository";
import { OrderStatus } from "../../../shared/enums/order-status.enum";

export class CommandeService {
  private repository = new CommandeRepository();
  private waveService = new WaveService();
  private deliveryService = new DeliveryService();
  private pharmacieRepository = new PharmacieRepository();

  async create(data: CreateCommandeDto) {
    const commande = await this.repository.create(data as any);

    // Génération du lien de paiement Wave
    const payment = await this.waveService.createPaymentSession(
      commande.montantTotal,
      commande.id
    );

    const io = getIO();
    io.emit("nouvelle_commande", commande);

    return {
      ...commande,
      payment_url: payment.payment_url,
    };
  }

  async findAll() {
    return await this.repository.findAll();
  }

  async findById(id: number) {
    return await this.repository.findById(id);
  }

  async updateStatus(id: number, data: UpdateStatusDto) {
    await this.repository.updateStatus(id, data.statut);

    // Assignation automatique du livreur si payé
    if (data.statut === OrderStatus.PAYEE) {
      const commande = await this.repository.findById(id);
      if (commande) {
        const pharmacie = await this.pharmacieRepository.findById(commande.pharmacieId);
        if (pharmacie) {
          const livreur = await this.deliveryService.findNearestLivreur(
            pharmacie.latitude,
            pharmacie.longitude
          );
          if (livreur) {
            console.log(`[Delivery] Commande ${id} assignée au livreur ${livreur.livreurId}`);
            const io = getIO();
            io.emit("course_assignee", {
              commandeId: id,
              livreurId: livreur.livreurId
            });
          }
        }
      }
    }

    const io = getIO();
    io.emit("commande_statut", {
      commandeId: id,
      statut: data.statut,
    });
  }
}
