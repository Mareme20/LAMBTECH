import pandas as pd # type: ignore
import numpy as np # type: ignore
from datetime import datetime, timedelta

def generer_donnees_test(n_jours=90):
    # 1. Correspondance avec la table 'pharmacies' de Marieme (20 pharmacies pilotes à Dakar)
    pharmacies = [
        {'id': 1, 'nom': 'Pharmacie du Plateau', 'zone': 'Plateau'},
        {'id': 2, 'nom': 'Pharmacie de la Médina', 'zone': 'Medina'},
        {'id': 3, 'nom': 'Pharmacie Hassan II', 'zone': 'Medina'},
        {'id': 4, 'nom': 'Pharmacie Ndiaye Pikine', 'zone': 'Pikine'},
        {'id': 5, 'nom': 'Pharmacie Universelle Guédiawaye', 'zone': 'Guediawaye'},
        {'id': 6, 'nom': 'Pharmacie des Parcelles', 'zone': 'Parcelles'},
        {'id': 7, 'nom': 'Pharmacie de la Liberté', 'zone': 'Liberté'},
        {'id': 8, 'nom': 'Pharmacie de la Médina', 'zone': 'Medina'},
        {'id': 9, 'nom': 'Pharmacie de la Corniche', 'zone': 'Corniche'},
        {'id': 10, 'nom': 'Pharmacie de la Gare', 'zone': 'Gare'},
        # ... Extensible jusqu'à 20 pharmacies
    ]
    
    # 2. Correspondance avec la table 'medicaments'
    medicaments = [
        {'id': 101, 'nom': 'Artemether', 'categorie': 'Antipaludéen'},
        {'id': 102, 'nom': 'Paracetamol', 'categorie': 'Analgésique'},
        {'id': 103, 'nom': 'Amoxicilline', 'categorie': 'Antibiotique'},
        {'id': 104, 'nom': 'Metronidazole', 'categorie': 'Antibiotique'},
        {'id': 105, 'nom': 'Ibuprofène', 'categorie': 'Anti-inflammatoire'},
         # ... Extensible jusqu'à 10 médicaments
    ]
    
    data = []
    base_date = datetime.now()
    
    for jour in range(n_jours):
        date_courante = base_date - timedelta(days=n_jours - jour)
        
        for phar in pharmacies:
            for med in medicaments:
                # Ventes de base quotidiennes aléatoires
                base_ventes = np.random.randint(5, 25)
                
                # Ajout d'un effet de saisonnalité (ex: Hivernage / Paludisme)
                # Si on simule une période de pluies (août/septembre par exemple)
                if med['nom'] == 'Artemether' and date_courante.month in [8, 9]:
                    base_ventes = int(base_ventes * 1.8)
                
                # Simulation d'un pic épidémique aigu (Anomalie) à Pikine sur l'Artemether (jours 60 à 72)
                if phar['zone'] == 'Pikine' and med['nom'] == 'Artemether' and jour > 75:
                    base_ventes = int(base_ventes * 8.0)
                    
                data.append({
                    'date': date_courante.date(),
                    'pharmacie_id': phar['id'],
                    'nom_pharmacie': phar['nom'],
                    'zone': phar['zone'],
                    'medicament_id': med['id'],
                    'nom_medicament': med['nom'],
                    'ventes': base_ventes
                })
                
    return pd.DataFrame(data)

if __name__ == '__main__':
    df = generer_donnees_test()
    print(f"Structure de simulation générée : {df.shape[0]} lignes.")
    print(df.head())