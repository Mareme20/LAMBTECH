import React from 'react';

const Legal: React.FC = () => {
  return (
    <div className="pt-32 pb-20 animate-fade-up">
      <div className="container mx-auto px-6 lg:px-12 max-w-4xl">
        <div className="mb-12">
          <h1 className="font-outfit font-black text-4xl text-primary mb-4">Mentions Légales & CGU</h1>
          <p className="text-gray-500 font-medium">Dernière mise à jour : 31 Mai 2026</p>
        </div>

        <div className="bg-white p-10 rounded-3xl shadow-soft border border-gray-100 prose prose-emerald max-w-none text-gray-600">
          <h2 className="font-outfit font-black text-2xl text-primary mt-0 mb-4">1. Éditeur de la plateforme</h2>
          <p className="mb-8">La plateforme MEDS est éditée par LambTech, société basée à Dakar, Sénégal. Notre mission est de faciliter l'accès aux produits pharmaceutiques.</p>

          <h2 className="font-outfit font-black text-2xl text-primary mb-4">2. Conditions Générales d'Utilisation</h2>
          <p className="mb-4">En utilisant la plateforme MEDS, vous acceptez de :</p>
          <ul className="list-disc pl-5 space-y-2 mb-8">
            <li>Fournir des informations exactes lors de votre inscription.</li>
            <li>Ne pas utiliser la plateforme pour des activités illégales.</li>
            <li>Respecter les conditions de délivrance des médicaments sur ordonnance. Les ordonnances doivent être lisibles et valides.</li>
          </ul>

          <h2 className="font-outfit font-black text-2xl text-primary mb-4">3. Protection des Données et Confidentialité</h2>
          <p className="mb-4">Vos données de santé (ordonnances, historique de commandes) sont strictement confidentielles. Elles ne sont partagées qu'avec la pharmacie que vous avez sélectionnée pour le traitement de votre commande.</p>
          <p className="mb-8">Conformément à la réglementation sur la protection des données personnelles, vous disposez d'un droit d'accès, de rectification et de suppression de vos données.</p>

          <h2 className="font-outfit font-black text-2xl text-primary mb-4">4. Responsabilité</h2>
          <p>MEDS agit en tant qu'intermédiaire technologique. La responsabilité de la délivrance des médicaments et des conseils associés incombe exclusivement au pharmacien diplômé partenaire.</p>
        </div>
      </div>
    </div>
  );
};

export default Legal;
