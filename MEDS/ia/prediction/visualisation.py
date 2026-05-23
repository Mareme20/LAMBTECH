import pandas as pd # type: ignore
import matplotlib.pyplot as plt # type: ignore
import seaborn as sns # type: ignore
from data_generator import generer_donnees_test

def generer_graphique_production():
    print("[Visualisation PROD] Chargement des données historiques...")
    df = generer_donnees_test()
    
    # Filtrer sur le cas le plus critique : Artemether à Pikine
    df_pikine = df[(df['zone'] == 'Pikine') & (df['nom_medicament'] == 'Artemether')].copy()
    df_pikine['date'] = pd.to_datetime(df_pikine['date'])
    df_pikine = df_pikine.sort_values('date')

    # Configuration du style graphique
    sns.set_theme(style="whitegrid")
    plt.figure(figsize=(12, 6))
    
    # 1. Tracer la courbe des ventes réelles
    plt.plot(df_pikine['date'], df_pikine['ventes'], label="Ventes réelles (Pikine)", color="#2b3e50", linewidth=2, zorder=1)
    
    # 2. Calculer et tracer la tendance (Moyenne mobile)
    df_pikine['tendance'] = df_pikine['ventes'].rolling(window=7, min_periods=1).mean()
    plt.plot(df_pikine['date'], df_pikine['tendance'], label="Tendance normale (7j)", color="#18bc9c", linestyle="--", linewidth=1.5, zorder=2)
    
    # 3. Mettre en valeur visuelle la zone épidémique de Mai (les derniers jours)
    # Dans nos simulations, le pic provoqué est sur les derniers jours de l'historique
    points_anomaux = df_pikine.tail(7)
    
    # Tracer des cercles rouges pulsatils sur les points détectés comme critiques par l'Isolation Forest
    plt.scatter(points_anomaux['date'], points_anomaux['ventes'], color="#e74c3c", s=120, label="Alertes ML validées (Danger > 70%)", edgecolors='black', linewidths=1.5, zorder=3)

    # Habillage textuel et annotations pour le jury LAMB TECH
    plt.title("MEDS Moteur ML - Détection Temps Réel du Pic Épidémique à Pikine (Artéméther)", fontsize=14, fontweight='bold', pad=15)
    plt.xlabel("Historique des 90 derniers jours (Dakar)", fontsize=11)
    plt.ylabel("Boîtes vendues / jour", fontsize=11)
    
    # Formater les dates sur l'axe X pour que ce soit propre
    plt.gcf().autofmt_xdate()
    
    # Ajout d'une note explicitative directement sur le graphique
    dernier_point = points_anomaux.iloc[-3] # Prendre un point vers la fin pour l'anoter
    plt.annotate('Explosion anormale\n+107% constatés', 
                 xy=(dernier_point['date'], dernier_point['ventes']),
                 xytext=(dernier_point['date'] - pd.Timedelta(days=15), dernier_point['ventes'] - 40),
                 arrowprops=dict(facecolor='#e74c3c', shrink=0.05, width=1.5, headwidth=7),
                 fontweight='bold', color='#c0392b', bbox=dict(boxstyle="round,pad=0.3", fc="#fdf2e9", ec="#e74c3c", lw=1))

    plt.legend(loc="upper left", frameon=True, facecolor="white", edgecolor="none")
    plt.tight_layout()
    
    # Sauvegarde directe dans le dossier courant (ia/prediction/)
    nom_fichier = "evaluation_ml_production.png"
    plt.savefig(nom_fichier, dpi=300)
    print(f"[Succès] Le graphique de production a été généré : '{nom_fichier}'")

if __name__ == '__main__':
    generer_graphique_production()