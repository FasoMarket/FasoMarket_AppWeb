# FasoMarket - Application Web

FasoMarket est une plateforme e-commerce (marketplace) innovante dédiée à la mise en valeur et à la vente des produits de l'artisanat local, des accessoires, de l'alimentation, et bien plus encore au Burkina Faso.

## 🚀 À propos du projet

FasoMarket connecte les artisans et vendeurs locaux aux acheteurs à travers une interface moderne, intuitive et sécurisée. L'application est divisée en trois espaces distincts avec des fonctionnalités dédiées pour répondre aux besoins de chaque type d'utilisateur :

1. **Espace Client** : Pour découvrir, rechercher et acheter des produits locaux facilement.
2. **Espace Vendeur** : Un tableau de bord complet dédié à la gestion de la boutique, des produits, des commandes et du suivi des performances.
3. **Espace Administrateur** : Un centre de contrôle global pour la gestion des utilisateurs, des vendeurs, la modération des produits signalés et la configuration des paramètres de la plateforme.

---

## ✨ Fonctionnalités Principales

### Pour les Clients 🛒
- **Catalogue de produits** : Navigation fluide avec catégories, filtrage et barre de recherche avancée.
- **Processus d'achat complet** : Gestion du panier d'achat et page de paiement (Checkout).
- **Profil Client** : Espace personnel, historique des commandes (tableau de bord inspiré de grandes plateformes de e-commerce).
- **UX/UI Premium** : Design responsive, propre, avec des modales épurées et des transitions douces.

### Pour les Vendeurs 🏪
- **Tableau de bord Vendeur** : Interface avec statistiques et analytiques rapides (Ventes, Commandes).
- **Gestion des Produits Dynamique** :
  - **Ajout/Édition** : Formulaires de création et de modification de produits intuitifs, avec upload d'images, gestion des prix/promotions, et quantité en stock.
  - **Vue Détaillée** : Affichage d'un modal élégant listant l'ensemble des caractéristiques d'un produit en un clic.
  - **Suppression Sécurisée** : Modales personnalisées pour confirmer la suppression d'un produit (pas d'alertes navigateur génériques).
- **Gestion des Commandes** : Suivi rigoureux des statuts de commandes.
- **Paramétrage** : Interface de configuration de la boutique vendeur.

### Pour les Administrateurs 🛡️
- **Tableau de bord Global** : Vue d'ensemble de l'activité.
- **Gestion des Utilisateurs & Vendeurs** : Ajout, modification, bannissement de comptes avec des formulaires modaux centralisés (incluant la gestion des mots de passe).
- **Modération (Produits Signalés)** : Capacité de voir les détails des signalements, d'ignorer la requête (modifiant son statut) ou de supprimer le rapport.
- **Paramètres de la Plateforme Avancés (par Intercalaires)** :
  - **Apparence et Thème** : Sélections du mode (Clair/Sombre/Système) et des couleurs principales.
  - **Sécurité et Accès** : Politique obligatoire 2FA (A2F), règles de mots de passe, timeout des sessions.
  - **Notifications (Push/Email)** : Activation ciblée des alertes selon les évènements.
  - **Facturation & Commissions** : Entrée et masquage/affichage sécurisé des clés d'API (Orange Money, Moov Money, Coris Bank).
  - **API & Webhooks** : Affichage stylisé de la Clé API globale (copier dans le presse-papier, regénérer) et configuration de l'URL du webhook.

---

## 🛠️ Technologies Utilisées

Le projet repose sur des technologies web modernes pour garantir une grande performance, une grande flexibilité et une excellente maintenabilité :

- **Frontend Core** : [React.js](https://reactjs.org/) (via [Vite](https://vitejs.dev/) pour un tooling ultra-rapide)
- **Routage** : [React Router DOM](https://reactrouter.com/)
- **Stylisation & Design System** : [Tailwind CSS](https://tailwindcss.com/)
- **Icônes** : [Lucide React](https://lucide.dev/)
- **Utilitaires CSS** : `clsx`, `tailwind-merge` (via un utilitaire combiné `cn`)

---

## 📦 Installation et Environnement Local

Suivez ces étapes pour récupérer le code et exécuter le projet sur votre machine locale :

1. **Cloner le dépôt**
   ```bash
   git clone https://github.com/FasoMarket/FasoMarket_AppWeb.git
   ```

2. **Accéder au dossier de l'application** (Exemple)
   ```bash
   cd fasomarket-app
   ```

3. **Installer les dépendances NPM**
   ```bash
   npm install
   ```

4. **Lancer le serveur de développement**
   ```bash
   npm run dev
   ```

5. **Accéder à l'application**
   Ouvrez votre navigateur web favori et accédez à `http://localhost:5173`.

---

## 📂 Structure du Projet (Sélection)

Voici un aperçu de l'organisation des fichiers locaux pour vous repérer rapidement :

```text
fasomarket-app/
├── public/                 # Assets statiques (icônes, etc.)
├── src/
│   ├── components/         # Composants d'interface (Listes, Boutons, Modales...)
│   ├── layouts/            # Templates de base (AdminLayout.jsx, VendorLayout.jsx)
│   ├── pages/              # Toutes les écrans / routes de l'application
│   │   ├── admin/          # Panneau d'administration
│   │   ├── vendor/         # Panneau de contrôle des vendeurs
│   │   └── ...             # Pages de l'application cliente principale
│   ├── utils/              # Fonctions globales (ex: cn() pour classNames)
│   ├── App.jsx             # Point d'entrée principal des Routes
│   └── main.jsx            # Point de montage de l'Application React
├── tailwind.config.js      # Configuration de Tailwind et customisation des thèmes
├── vite.config.js          # Options de build et de développement avec Vite
└── package.json            # Scripts de construction et liste des dépendances
```

---

## 🎨 Philosophie de Design (Premium Design)

L'application respecte à travers son code une direction artistique "Premium": 
- L'utilisation intensive des coins ronds modernes (`rounded-2xl` à `rounded-[2rem]`).
- Des ombres subtiles, profondes ou colorées (`shadow-lg`, `shadow-primary/20`) pour faire ressortir les éléments cliquables et modales.
- Des palettes de couleurs maîtrisées avec des fonds doux (`bg-slate-50`, `bg-[#f6f8f6]`).
- Des arrière-plans de modales utilisant l'effet `backdrop-blur` (glassmorphism) pour flouter le contenu en fond.
- Des micro-interactions (animations CSS, hover states fluides, effets de transition scale).

---

## 📄 Licence

Veuillez vous référer au fichier `LICENSE` inclus dans le dépôt source pour plus d'informations.

---

> _**FasoMarket** - Le meilleur de l'artisanat local, disponible en quelques clics._