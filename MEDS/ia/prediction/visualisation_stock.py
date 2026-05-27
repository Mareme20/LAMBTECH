import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
import numpy as np

def generer_graphique_stocks():
    print("[Visualisation STOCKS] Génération du graphique de projection...")
    
    # Configuration du style graphique
    sns.set_theme(style="whitegrid")
    plt.figure(figsize=(11, 5.5))
    
    # Données issues de ton JSON
    stock_initial = 22
    vitesse_croisiere = 12.0
    vitesse_ia = 20.64
    
    # Grille de temps (de 0 à 48 heures)
    heures = np.linspace(0, 48, 100)
    
    # Projection 1 : Sans IA (Vitesse normale)
    stock_normal = stock_initial - (vitesse_croisiere / 24.0) * heures
    stock_normal = np.clip(stock_normal, 0, None) # Empêcher les stocks négatifs
    
    # Projection 2 : Avec IA (Accélération épidémique)
    stock_ia = stock_initial - (vitesse_ia / 24.0) * heures
    stock_ia = np.clip(stock_ia, 0, None)
    
    # Tracer les courbes
    plt.plot(heures, stock_normal, label="Projection classique (Vitesse stable)", color="#7f8c8d", linestyle="--", linewidth=2)
    plt.plot(heures, stock_ia, label="Projection MEDS (Couplage IA Épidémie +72%)", color="#e74c3c", linewidth=3)
    
    # Colorer la zone de rupture sous 48h
    plt.axvspan(0, 48, alpha=0.1, color='#f39c12', label="Fenêtre de Vigilance (48h)")
    plt.axvline(x=24, color='#c0392b', linestyle=':', alpha=0.7)
    
    # Marquer le point de rupture calculé par l'IA (à 25.6h)
    plt.scatter(25.6, 0, color='#c0392b', s=150, zorder=5, edgecolors='black', label="Rupture Réelle Anticipée (25.6h)")
    
    # Habillage textuel
    plt.title("MEDS Logistique - Modélisation de la Descente Critique de Stock (Pikine - Artéméther)", fontsize=13, fontweight='bold', pad=15)
    plt.xlabel("Heures à partir du snapshot actuel (T+0)", fontsize=11)
    plt.ylabel("Boîtes en stock physique", fontsize=11)
    plt.xlim(0, 48)
    plt.ylim(0, 25)
    
    # Annotations pour le jury
    plt.annotate('Alerte Classique\n(Rupture théorique à ~44h)', 
                 xy=(44, 0), xytext=(32, 6),
                 arrowprops=dict(facecolor='#7f8c8d', shrink=0.08, width=1, headwidth=6))
                 
    plt.annotate('Alerte Prédictive IA\nSauvetage de la chaîne (-18h)', 
                 xy=(25.6, 0), xytext=(5, 4),
                 arrowprops=dict(facecolor='#e74c3c', shrink=0.08, width=1.5, headwidth=7),
                 fontweight='bold', color='#c0392b', bbox=dict(boxstyle="round,pad=0.3", fc="#fdf2e9", ec="#e74c3c", lw=1))

    plt.legend(loc="upper right", frameon=True, facecolor="white")
    plt.tight_layout()
    
    nom_fichier = "evaluation_stocks_predictif.png"
    plt.savefig(nom_fichier, dpi=300)
    print(f"[Succès] Graphique logistique généré : '{nom_fichier}'")

if __name__ == '__main__':
    generer_graphique_stocks()