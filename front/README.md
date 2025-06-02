# Élection 2027 — Le Jeu

Bienvenue dans **Élection 2027**, un jeu en ligne multijoueur où vous incarnez un(e) candidat(e) à la présidentielle. 

---

# Objectif du projet

Deux joueurs s'affrontent dans une partie de type Morpion :

- Choix d’un avatar de candidat
- Débat en ligne dans un "salon"
- Résultat de la partie (victoire, match nul…)
- Tableau des scores avec meilleurs candidats et statistiques

---

## Technologies utilisées

- **Frontend** : Angular (avec Forms, animations, composants dynamiques)
- **Backend** : Node.js + Express
- **WebSocket** : Socket.IO pour la communication en temps réel
- **Base de données** : MongoDB (Mongoose)
- **Styles** : CSS
---

# Lancer le projet en local

### Pré-requis

- Node.js
- Angular CLI
- MongoDB en local ou en ligne

### Installation

```bash
# Cloner le repo
git clone https://github.com/votre-utilisateur/election-2027.git
cd election-2027

# Installer les dépendances backend
cd server
npm install

# Démarrer le serveur
node app.js

# Installer les dépendances frontend
npm install

# Démarrer le frontend Angular
ng serve
