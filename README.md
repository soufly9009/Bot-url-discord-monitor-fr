# Infrastructure Bot Verification

Pour soutenir le projet merci de ⭐ le projet !

## À quoi sert le bot ?
- Le bot est un moniteur qui calcule la latence entre le nom de domaine et le serveur lui-même.
- Le bot peut surveiller plusieurs URL en même temps et vous dire si elles sont en ligne ou hors ligne.
- **Nouveau :** Affichage personnalisé ("Maintenance") si le site est inaccessible (DNS, Timeout, etc.).
- **Nouveau :** Possibilité de donner un **Nom** personnalisé à chaque service (ex: "Site Web", "Panel").

# Mise à jour à venir :
- Protection & status des API
- Annonce des down
- Mise à jour sur demande...

# LE SERVEUR DISCORD HÉBERGEUR : 
[DISCORD](https://discord.gg/z3auwsQrUF)

# Notre hébergeur gratuit
[DISCORD support](https://discord.gg/emm9Ydegeq)
[Site web](https://uniobot.fr/)

Contact discord pseudo: `soufly_dev`

Créé et mis à jour le 13/04/24 - Dernière mise à jour majeure le 16/12/25

---

## Configuration

La configuration se passe dans le fichier `config.json`.
Vous devez définir votre token, l'ID du salon, et la liste des domaines à surveiller.

**Exemple de `config.json` :**

```json
{
  "token": "VOTRE-TOKEN-ICI",
  "channelID": "ID-DU-SALON",
  "refreshInterval": 60000,
  "domaine": [
    { "name": "Site Web", "url": "https://votresite.fr" },
    { "name": "Panel", "url": "https://panel.votresite.fr" },
    { "name": "API", "url": "https://api.votresite.fr" }
  ],
  "embedURL": "https://votresite.fr"
}
```

### Champs :
- `token` : Le token de votre bot Discord.
- `channelID` : L'ID du salon où le message de statut sera envoyé/mis à jour.
- `refreshInterval` : Temps en millisecondes entre chaque vérification (60000 = 1 minute).
- `domaine` : Une liste d'objets, chacun contenant :
    - `name` : Le nom affiché dans l'embed (ex: "Site Web").
    - `url` : L'URL à vérifier.
- `embedURL` : L'URL vers laquelle pointe le titre de l'embed.

## Installation

1. Cloner le repo :
```bash
git clone https://github.com/mjumelmax001/statutsURLbotdiscord.git
```
2. Installer les dépendances :
```bash
npm install
```
3. Configurer `config.json`.
4. Lancer le bot :
```bash
node .
```

Le code est open source mais il est protégé par une LICENSE.
