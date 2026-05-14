# 🚗 MarocAuto Premium - Location de Véhicules au Maroc

Bienvenue sur **MarocAuto Premium**, une plateforme moderne conçue pour simplifier la location de voitures de luxe et de tourisme au Maroc. Ce projet est né de l'envie de créer une expérience fluide, élégante et sécurisée pour les clients et les agences de location.

---

## 🌟 L'Expérience Utilisateur

L'application a été pensée pour offrir trois parcours distincts et complémentaires :
*   **Le Client** : Une interface épurée pour parcourir le catalogue, filtrer par ville ou catégorie, et réserver son véhicule en quelques clics.
*   **L'Entreprise (Agence)** : Un véritable outil de gestion métier. Chaque agence peut gérer son parc, voir les nouvelles demandes de location, et choisir de les **Accepter** ou de les **Refuser**.
*   **L'Admin** : Un chef d'orchestre qui possède une visibilité totale sur l'activité de la plateforme et le chiffre d'affaires global.

---

## 🛠️ Nos Choix Technologiques (Le "Pourquoi")

Pour ce projet, nous avons sélectionné des technologies performantes et actuelles :

### 🎨 Frontend : Élégance et Réactivité
*   **React.js (Vite)** : Pour une interface utilisateur ultra-rapide et une navigation sans rechargement de page.
*   **Tailwind CSS** : Ce framework nous a permis de concevoir un design "Premium" sur mesure, avec un mode sombre élégant et une interface totalement responsive.
*   **Framer Motion** : Pour ajouter de la vie au projet avec des animations fluides et des transitions soignées.
*   **Lucide React** : Une bibliothèque d'icônes modernes pour une navigation intuitive.

### ⚙️ Backend : Robustesse et Logique
*   **Node.js & Express** : Le cœur de notre application. Il gère toute la logique métier, l'authentification et les échanges de données via une API REST.
*   **MySQL** : Nous avons choisi une base de données relationnelle pour assurer la fiabilité des données et la gestion des liens entre véhicules, utilisateurs et réservations.

---

## 🚀 Guide d'Installation

Suivez ces étapes pour lancer le projet sur votre machine :

### 1. Configuration de la Base de Données
*   Lancez votre serveur **MySQL** (via XAMPP, WAMP ou MySQL Workbench).
*   Rendez-vous dans le dossier backend : `cd backend`
*   Initialisez la base de données : `node init_db.js`  
    *(Cette commande crée automatiquement la base `location_db` et insère des données de test).*

### 2. Lancement du Backend (API)
*   Dans le dossier `backend`, lancez : `node server.js`
*   Le serveur sera actif sur `http://localhost:5000`.

### 3. Lancement du Frontend (Site)
*   Revenez à la racine du projet.
*   Installez les modules nécessaires : `npm install`
*   Démarrez l'application : `npm run dev`
*   Accédez au site via l'URL indiquée (souvent `http://localhost:5173`).

---

## 🔐 Identifiants de Test
Utilisez ces comptes pour explorer les différents dashboards :
*   **Admin** : `admin@marocauto.ma` / `admin123`
*   **Agence** : `agence@autolux.ma` / `agency123`
*   **Client** : `client@email.ma` / `client123`

---
*Projet réalisé avec passion pour moderniser le secteur de la location de voitures au Maroc.* 🇲🇦
