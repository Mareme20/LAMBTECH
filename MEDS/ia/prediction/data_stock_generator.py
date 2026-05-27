import pandas as pd # type: ignore
import numpy as np # type: ignore

def initialiser_stocks_officines():
    print("[Simulation Stocks] Initialisation des inventaires initiaux...")
    
    # Configuration des pharmacies et médicaments (identique à la semaine 2)
    pharmacies = [
        {"id": 1, "nom": "Pharmacie du Plateau", "zone": "Plateau"},
        {"id": 2, "nom": "Pharmacie de la Médina", "zone": "Medina"},
        {"id": 3, "nom": "Pharmacie Hassan II", "zone": "Medina"},
        {"id": 4, "nom": "Pharmacie Ndiaye Pikine", "zone": "Pikine"},
        {"id": 5, "nom": "Pharmacie Universelle Guédiawaye", "zone": "Guediawaye"}
    ]
    
    medicaments = [
        {"id": 101, "nom": "Artemether"},
        {"id": 102, "nom": "Paracetamol"},
        {"id": 103, "nom": "Amoxicilline"},
        {"id": 104, "nom": "Metronidazole"},
        {"id": 105, "nom": "Ibuprofène"}
    ]
    
    records = []
    
    # Fixer la graine pour la reproductibilité devant le jury
    np.random.seed(42)
    
    for phar in pharmacies:
        for med in medicaments:
            # Générer un stock de départ réaliste (Pikine est volontairement plus bas sur l'Artemether pour la démo)
            # SIMULATION DE CRISE : Pikine a un stock très bas et une grosse vitesse de croisière
            if phar["id"] == 4 and med["id"] == 101:
                stock_actuel = 22  # Il ne reste que 22 boîtes d'Artéméther !
                vitesse = 12.0     # Forte demande habituelle
            else:
                stock_actuel = np.random.randint(120, 300)
                vitesse = np.random.uniform(5.0, 12.0)
                
            records.append({
                "pharmacie_id": phar["id"],
                "nom_pharmacie": phar["nom"],
                "zone": phar["zone"],
                "medicament_id": med["id"],
                "nom_medicament": med["nom"],
                "stock_physique": stock_actuel,
                "seuil_securite_fixe": 30,
                "vitesse_croisiere_j": vitesse
            })
            
    df_stocks = pd.DataFrame(records)
    df_stocks.to_csv("stocks_actuels_dakar.csv", index=False)
    print(f"[Succès] Inventaire initial généré pour {len(df_stocks)} références.")
    return df_stocks

if __name__ == '__main__':
    initialiser_stocks_officines()