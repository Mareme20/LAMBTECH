import pandas as pd # type: ignore
import matplotlib.pyplot as plt # type: ignore
import seaborn as sns # type: ignore
import os
from prediction import fetch_data_from_db

def generer_graphique_production():
    print("[Visualisation PROD] Chargement des données depuis la base...")
    df = fetch_data_from_db()
    
    if df.empty:
        print("[ERREUR] Aucune donnée disponible pour la visualisation.")
        return

    # Filtrer sur le cas le plus critique ou une pharmacie spécifique pour l'exemple
    # On prend la pharmacie qui a le plus de ventes pour la démo
    top_pharmacie = df.groupby('nom_pharmacie')['ventes'].sum().idxmax()
    df_plot = df[df['nom_pharmacie'] == top_pharmacie].copy()
    df_plot['date'] = pd.to_datetime(df_plot['date'])
    df_plot = df_plot.sort_values('date')

    # Configuration du style graphique
    sns.set_theme(style="whitegrid")
    plt.figure(figsize=(12, 6))
    
    # 1. Tracer la courbe des ventes réelles
    plt.plot(df_plot['date'], df_plot['ventes'], label=f"Ventes réelles ({top_pharmacie})", color="#2b3e50", linewidth=2, zorder=1)
    
    # 2. Calculer et tracer la tendance (Moyenne mobile)
    df_plot['tendance'] = df_plot['ventes'].rolling(window=7, min_periods=1).mean()
    plt.plot(df_plot['date'], df_plot['tendance'], label="Tendance normale (7j)", color="#18bc9c", linestyle="--", linewidth=1.5, zorder=2)
    
    # Habillage textuel
    plt.title(f"Analyse des Ventes - {top_pharmacie}", fontsize=14, fontweight='bold', pad=15)
    plt.xlabel("Date", fontsize=11)
    plt.ylabel("Quantité vendue", fontsize=11)
    
    plt.gcf().autofmt_xdate()
    plt.legend(loc="upper left")
    plt.tight_layout()
    
    # Sauvegarde
    output_dir = os.path.dirname(__file__)
    nom_fichier = os.path.join(output_dir, "evaluation_ml_production.png")
    plt.savefig(nom_fichier, dpi=300)
    print(f"[Succès] Graphique généré : '{nom_fichier}'")

if __name__ == '__main__':
    generer_graphique_production()