Élection 2027 — Jeu Multijoueur en Ligne
Élection 2027 est un jeu multijoueur en temps réel où deux joueurs s’affrontent dans une partie inspirée du Morpion, en incarnant des candidats fictifs à la présidentielle.
Le but : débattre, jouer, gagner… et grimper dans le classement des meilleurs candidats.

---

Fonctionnalités principales
• Choix d’un avatar de candidat
• Partie de Morpion multijoueur
• Résultats de match (victoire, défaite, égalité)
• Tableau des scores 
• Mises à jour en temps réel via WebSockets

---

Technologies utilisées
Frontend
• Angular
• Formulaires réactifs
• Composants dynamiques
• CSS

Backend
• Node.js
• Express
• Socket.IO (temps réel)
• MongoDB + Mongoose

---

Lancer le projet en local
Pré-requis
• Node.js
• Angular CLI
• MongoDB (local ou hébergé)

---

# Cloner le repo
git clone https://github.com/Ade3k/morpion

# Installer les dépendances backend
npm install

# Démarrer le serveur
node app.js

# Installer les dépendances frontend
npm install

# Démarrer le frontend Angular
ng serve

# À savoir
Lien de l'api : https://morpion-neon.vercel.app/ 
Important : les WebSockets fonctionnent en local sans restriction, mais plus difficilement e prroduction

    Routes :
    - /
    - /user/login
    - /user/signin
