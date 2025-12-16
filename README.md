# 🤖 Infrastructure Status Bot

![Version](https://img.shields.io/badge/version-2.0.0-blue.svg)
![Discord](https://img.shields.io/badge/Discord-JS-5865F2.svg)
![License](https://img.shields.io/badge/License-MIT-green.svg)

Un bot Discord professionnel pour surveiller l'état de vos sites, API, et serveurs en temps réel.
Il met à jour automatiquement un message d'état et vous alerte en cas de panne.

⭐ **Si vous aimez ce projet, laissez une étoile !**

---

## ✨ Fonctionnalités

- **Surveillance en Temps Réel** : Vérifie vos services toutes les X secondes.
- **Message d'État Dynamique** : Met à jour un embed unique (pas de spam).
- **Détection Intelligente** : Distingue les pannes (OFFLINE) des maintenances/erreurs DNS (MAINTENANCE).
- **Alertes Webhook** : Vous notifie immédiatement sur un canal privé si un service tombe.
- **100% Configurable** : Noms personnalisés, icônes, délais, etc.

---

## 🚀 Installation

### Prérequis
- [Node.js](https://nodejs.org/) (v16.9.0 ou plus récent)
- Un Bot Discord et son Token.

### Étapes
1. **Cloner le projet**
   ```bash
   git clone https://github.com/soufly9009/Bot-url-discord-monitor-fr.git
   cd Bot-url-discord-monitor-fr
   ```

2. **Installer les dépendances**
   ```bash
   npm install
   ```

3. **Configurer**
   Ouvrez le fichier `config.json` et remplissez vos informations :
   ```json
   {
     "token": "VOTRE_TOKEN_DISCORD",
     "channelID": "ID_DU_SALON_STATUT",
     "webhookURL": "VOTRE_URL_WEBHOOK_POUR_ALERTES",
     "refreshInterval": 60000,
     "enableAlerts": true,
     "domaine": [
       { "name": "Site Web", "url": "https://votresite.com" },
       { "name": "API", "url": "https://api.votresite.com" }
     ],
     "embedURL": "https://votresite.com"
   }
   ```

4. **Lancer le bot**
   ```bash
   node .
   ```

---

## 🛠️ Structure du Projet

- `index.js` : Point d'entrée principal. Gère le cycle de vie du bot et l'affichage.
- `utils/checkService.js` : Module de vérification de staut (Latence, Code HTTP).
- `utils/alertSystem.js` : Module de gestion des alertes via Webhook.

---

## 🤝 Support & Crédits

- **Développeur** : `soufly_dev`
- **Serveur Support** : [Rejoindre le Discord](https://discord.gg/z3auwsQrUF)
- **Hébergeur Partenaire** : [UnioBot](https://uniobot.fr/)

---

*Créé avec ❤️ pour la communauté.*
