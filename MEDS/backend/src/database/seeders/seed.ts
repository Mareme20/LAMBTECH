import { AppDataSource } from "../data-source.js";
import { Role } from "../../shared/enums/role.enum.js";

// Entities
import { User } from "../../modules/auth/entity/user.entity.js";
import { Medicament } from "../../modules/medicament/entity/medicament.entity.js";
import { Pharmacie } from "../../modules/pharmacie/entity/pharmacie.entity.js";
import { Stock } from "../../modules/stock/entity/stock.entity.js";
import { SearchLog } from "../../modules/stats/entity/search_log.entity.js";
import { LivreurPosition } from "../../modules/geolocalisation/entity/livreur_positions.js";

import { Commande } from "../../modules/commande/entity/commande.entity.js";
import { CommandeItem } from "../../modules/commande/entity/commande-item.entity.js";
import { OrderStatus } from "../../shared/enums/order-status.enum.js";

function randInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pick<T>(arr: T[]): T {
  if (arr.length === 0) throw new Error('pick() called with empty array');
  return arr[randInt(0, arr.length - 1)] as T;
}

function randomPhone() {
  return `77${randInt(1000000, 9999999).toString()}`;
}

async function seedRolesAndUsers() {
  const userRepo = AppDataSource.getRepository(User);

  const baseUsers = [
    {
      email: "patient1@meds.test",
      nom: "Diallo",
      prenom: "Amadou",
      nomComplet: "Diallo Amadou",
      telephone: "+221" + randomPhone(),
      role: Role.PATIENT,
      motDePasse: "$2b$10$uOe4o7wHn0y8v6eX4aYcFOm0b6y4u2l9p0u3vJgZ0nY0fF0lTQy1a",
    },
    {
      email: "pharmacie1@meds.test",
      nom: "Pharmacie",
      prenom: "Central",
      nomComplet: "Pharmacie Central",
      telephone: "+221" + randomPhone(),
      role: Role.PHARMACIE,
      motDePasse: "$2b$10$uOe4o7wHn0y8v6eX4aYcFOm0b6y4u2l9p0u3vJgZ0nY0fF0lTQy1a",
    },
    {
      email: "livreur1@meds.test",
      nom: "Kane",
      prenom: "Mamadou",
      nomComplet: "Kane Mamadou",
      telephone: "+221" + randomPhone(),
      role: Role.LIVREUR,
      motDePasse: "$2b$10$uOe4o7wHn0y8v6eX4aYcFOm0b6y4u2l9p0u3vJgZ0nY0fF0lTQy1a",
    },
    {
      email: "admin@meds.test",
      nom: "Admin",
      prenom: "MedS",
      nomComplet: "Admin MedS",
      telephone: "+221" + randomPhone(),
      role: Role.ADMIN,
      motDePasse: "$2b$10$uOe4o7wHn0y8v6eX4aYcFOm0b6y4u2l9p0u3vJgZ0nY0fF0lTQy1a",
    },
  ];

  for (const u of baseUsers) {
    const exists = await userRepo.findOne({ where: { email: u.email } });
    if (!exists) {
      const user = userRepo.create(u as any);
      await userRepo.save(user);
    }
  }
}

async function seedMedicaments() {
  const repo = AppDataSource.getRepository(Medicament);
  const medicaments = [
    { nomCommercial: "Paracétamol", molecule: "Paracétamol", forme: "500mg" },
    { nomCommercial: "Doliprane", molecule: "Paracétamol", forme: "1g" },
    { nomCommercial: "Amoxicilline", molecule: "Amoxicilline", forme: "1g" },
    { nomCommercial: "Ibuprofène", molecule: "Ibuprofène", forme: "400mg" },
    { nomCommercial: "Oméprazole", molecule: "Oméprazole", forme: "20mg" },
    { nomCommercial: "Augmentin", molecule: "Amoxicilline/Acide Clavulanique", forme: "1g" },
    { nomCommercial: "Spasfon", molecule: "Phloroglucinol", forme: "80mg" },
  ];

  for (const medSeed of medicaments) {
    const exists = await repo.findOne({
      where: { nomCommercial: medSeed.nomCommercial } as any,
    });

    if (!exists) {
      const med = repo.create({
        nomCommercial: medSeed.nomCommercial,
        molecule: medSeed.molecule,
        forme: medSeed.forme,
        prixUnitaire: randInt(1500, 12000),
      } as any);
      await repo.save(med);
    }
  }
}

async function seedPharmacies() {
  const repo = AppDataSource.getRepository(Pharmacie);

  const listToSeed = [
    {
      nom: "Pharmacie Nation (Centrale)",
      zone: "Plateau",
      adresse: "Place de l'Indépendance, Dakar Plateau",
      telephone: "+221338232425",
      latitude: 14.6698,
      longitude: -17.4332,
      estDeGarde: true,
      statutActivation: true,
      heureOuverture: "00:00",
      heureFermeture: "23:59",
      localisation: { type: "Point", coordinates: [-17.4332, 14.6698] }
    },
    {
      nom: "Pharmacie de la Médina",
      zone: "Médina",
      adresse: "Avenue Blaise Diagne, Médina",
      telephone: "+221338221144",
      latitude: 14.6812,
      longitude: -17.4515,
      estDeGarde: false,
      statutActivation: true,
      heureOuverture: "08:00",
      heureFermeture: "22:00",
      localisation: { type: "Point", coordinates: [-17.4515, 14.6812] }
    },
    {
      nom: "Pharmacie Cheikh Anta Diop",
      zone: "Fann",
      adresse: "Avenue Cheikh Anta Diop, face Université Fann",
      telephone: "+221338253030",
      latitude: 14.6901,
      longitude: -17.4684,
      estDeGarde: true,
      statutActivation: true,
      heureOuverture: "00:00",
      heureFermeture: "23:59",
      localisation: { type: "Point", coordinates: [-17.4684, 14.6901] }
    },
    {
      nom: "Pharmacie Atlantique Ouakam",
      zone: "Ouakam",
      adresse: "Route de la Corniche Ouest, Ouakam",
      telephone: "+221338201015",
      latitude: 14.7234,
      longitude: -17.4891,
      estDeGarde: false,
      statutActivation: true,
      heureOuverture: "08:00",
      heureFermeture: "23:00",
      localisation: { type: "Point", coordinates: [-17.4891, 14.7234] }
    },
    {
      nom: "Pharmacie des Almadies",
      zone: "Almadies",
      adresse: "Route des Almadies, Ngor",
      telephone: "+221338204545",
      latitude: 14.7472,
      longitude: -17.5144,
      estDeGarde: true,
      statutActivation: true,
      heureOuverture: "08:00",
      heureFermeture: "02:00",
      localisation: { type: "Point", coordinates: [-17.5144, 14.7472] }
    },
    {
      nom: "Pharmacie ZAC MBAO",
      zone: "Mbao",
      adresse: "ZAC Mbao, Cité Marine Française, face Route Nationale",
      telephone: "+221338972758",
      latitude: 14.7432,
      longitude: -17.3195,
      estDeGarde: false,
      statutActivation: true,
      heureOuverture: "08:00",
      heureFermeture: "23:00",
      localisation: { type: "Point", coordinates: [-17.3195, 14.7432] }
    },
    {
      nom: "Pharmacie Sicap Mbao",
      zone: "Mbao",
      adresse: "Sicap Mbao N° 315 Ts",
      telephone: "+221338345246",
      latitude: 14.7455,
      longitude: -17.3228,
      estDeGarde: true,
      statutActivation: true,
      heureOuverture: "00:00",
      heureFermeture: "23:59",
      localisation: { type: "Point", coordinates: [-17.3228, 14.7455] }
    },
    {
      nom: "Pharmacie Petit Mbao",
      zone: "Mbao",
      adresse: "Mame Venus Ciss, Petit Mbao Extension N°86",
      telephone: "+221338366656",
      latitude: 14.7389,
      longitude: -17.3304,
      estDeGarde: false,
      statutActivation: true,
      heureOuverture: "08:00",
      heureFermeture: "22:00",
      localisation: { type: "Point", coordinates: [-17.3304, 14.7389] }
    },
    {
      nom: "Pharmacie Fass Mbao",
      zone: "Mbao",
      adresse: "Km 18 Route de Rufisque, Fass Mbao",
      telephone: "+221338349313",
      latitude: 14.7502,
      longitude: -17.3411,
      estDeGarde: false,
      statutActivation: true,
      heureOuverture: "08:00",
      heureFermeture: "22:00",
      localisation: { type: "Point", coordinates: [-17.3411, 14.7502] }
    },
    {
      nom: "Pharmacie Dioma Keur Massar",
      zone: "Keur Massar",
      adresse: "755 Cité Aïnoumady, Keur Massar",
      telephone: "+221338377575",
      latitude: 14.7810,
      longitude: -17.3095,
      estDeGarde: true,
      statutActivation: true,
      heureOuverture: "00:00",
      heureFermeture: "23:59",
      localisation: { type: "Point", coordinates: [-17.3095, 14.7810] }
    },
    {
      nom: "Pharmacie Fatou Badji",
      zone: "Keur Massar",
      adresse: "Keur Massar Unité 14 n° 4",
      telephone: "+221338781532",
      latitude: 14.7865,
      longitude: -17.3150,
      estDeGarde: false,
      statutActivation: true,
      heureOuverture: "08:00",
      heureFermeture: "23:00",
      localisation: { type: "Point", coordinates: [-17.3150, 14.7865] }
    },
    {
      nom: "Pharmacie Golf Guédiawaye",
      zone: "Guédiawaye",
      adresse: "Quartier Golf Sud, Guédiawaye",
      telephone: "+221338357070",
      latitude: 14.7612,
      longitude: -17.3994,
      estDeGarde: false,
      statutActivation: true,
      heureOuverture: "08:00",
      heureFermeture: "22:00",
      localisation: { type: "Point", coordinates: [-17.3994, 14.7612] }
    },
    {
      nom: "Pharmacie Parcelles Assainies",
      zone: "Parcelles Assainies",
      adresse: "Unité 14, Parcelles Assainies",
      telephone: "+221338351212",
      latitude: 14.7521,
      longitude: -17.4328,
      estDeGarde: false,
      statutActivation: true,
      heureOuverture: "08:00",
      heureFermeture: "23:00",
      localisation: { type: "Point", coordinates: [-17.4328, 14.7521] }
    }
  ];

  for (const p of listToSeed) {
    let pharmacie = (await repo.findOne({ where: { nom: p.nom } })) as Pharmacie | null;
    if (!pharmacie) {
      pharmacie = (repo.create(p as any) as unknown) as Pharmacie;
      await repo.save(pharmacie);
    } else {
      repo.merge(pharmacie, p as any);
      await repo.save(pharmacie);
    }
  }
}

async function seedStocks() {
  const stockRepo = AppDataSource.getRepository(Stock);
  const pharmacieRepo = AppDataSource.getRepository(Pharmacie);
  const medicRepo = AppDataSource.getRepository(Medicament);

  const pharmacies = await pharmacieRepo.find();
  const meds = await medicRepo.find();

  for (const ph of pharmacies) {
    for (const med of meds) {
      const exists = await stockRepo.findOne({
        where: {
          pharmacieId: (ph as any).id,
          medicamentId: (med as any).id,
        } as any,
      });
      if (!exists) {
        const stock = stockRepo.create({
          pharmacieId: (ph as any).id,
          medicamentId: (med as any).id,
          quantite: randInt(5, 45),
        } as any);
        await stockRepo.save(stock);
      }
    }
  }
}

async function seedCommandes() {
  const commRepo = AppDataSource.getRepository(Commande);
  const itemRepo = AppDataSource.getRepository(CommandeItem);
  const userRepo = AppDataSource.getRepository(User);
  const pharmacieRepo = AppDataSource.getRepository(Pharmacie);
  const medicRepo = AppDataSource.getRepository(Medicament);

  const patients = await userRepo.find({ where: { role: Role.PATIENT } as any });
  const pharmacies = await pharmacieRepo.find();
  const meds = await medicRepo.find();

  if (patients.length === 0 || pharmacies.length === 0 || meds.length === 0) return;

  // Generate data for the last 30 days
  for (let i = 0; i < 200; i++) {
    const date = new Date();
    date.setDate(date.getDate() - randInt(0, 30));

    const patient = pick(patients);
    const pharmacieChoisie = pick(pharmacies);

    const commande = commRepo.create({
      patientId: (patient as any).id,
      pharmacieId: (pharmacieChoisie as any).id,
      statut: OrderStatus.LIVREE,
      montantTotal: 0,
      dateCommande: date,
    } as any);

    const savedComm = (await commRepo.save(commande) as unknown) as Commande;

    // Add 1-3 items per order
    let total = 0;
    const numItems = randInt(1, 3);
    for (let j = 0; j < numItems; j++) {
      const med = pick(meds);
      const quantite = randInt(1, 5);
      const prix = (med as any).prixUnitaire || randInt(1000, 5000);
      
      const item = itemRepo.create({
        commandeId: (savedComm as any).id,
        medicamentId: (med as any).id,
        quantite: quantite,
        prixUnitaire: prix,
      } as any);
      
      await itemRepo.save(item);
      total += prix * quantite;
    }

    savedComm.montantTotal = total;
    await commRepo.save(savedComm);
  }
}

async function seedLivreursPositions() {
  const repo = AppDataSource.getRepository(LivreurPosition);
  const userRepo = AppDataSource.getRepository(User);

  const livreurs = await userRepo.find({ where: { role: Role.LIVREUR } as any });
  if (livreurs.length === 0) return;

  for (const l of livreurs) {
    for (let i = 0; i < 3; i++) {
      const pos = repo.create({
        livreurId: (l as any).id,
        latitude: 14.7167 + (Math.random() - 0.5) * 0.05,
        longitude: -17.4677 + (Math.random() - 0.5) * 0.05,
      } as any);
      await repo.save(pos);
    }
  }
}

async function seedSearchLogs() {
  const repo = AppDataSource.getRepository(SearchLog);
  const meds = await AppDataSource.getRepository(Medicament).find();

  const medicaments = meds.map((m) => (m as any).nomCommercial);
  if (medicaments.length === 0) return;

  for (let i = 0; i < 60; i++) {
    const log = repo.create({
      medicamentNom: pick(medicaments),
      latitude: 14.7167 + (Math.random() - 0.5) * 0.2,
      longitude: -17.4677 + (Math.random() - 0.5) * 0.2,
      dateRecherche: new Date(Date.now() - randInt(0, 86400000 * 30)),
    } as any);
    await repo.save(log);
  }
}

async function main() {
  await AppDataSource.initialize();

  await seedRolesAndUsers();
  await seedMedicaments();
  await seedPharmacies();
  await seedStocks();
  await seedCommandes();
  await seedLivreursPositions();
  await seedSearchLogs();

  console.log("✅ Seed data completed with Dakar Pharmacies network and historic orders");
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error("❌ Seed data failed", e);
    process.exit(1);
  });
