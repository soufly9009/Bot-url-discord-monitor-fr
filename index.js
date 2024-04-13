const axios = require("axios");
const { Client, GatewayIntentBits, EmbedBuilder } = require("discord.js");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMessageReactions,
  ],
});

const domains = ["https://namethedomaine/", "https://mondedomaine/"]; // Mettez ici vos nom de domaine est sous-domaine

client.once("ready", () => {
  console.log("Le bot est en ligne!");
  setInterval(checkDomains, 60000); // Exécute la fonction checkDomains toutes les minutes
});

let statusMessage;
// Fonction mise en embed
async function checkDomains() {
  const embed = new EmbedBuilder()
    .setTitle("Statut des Infrastruture ")
    .setColor(0x0099ff);

  for (const domain of domains) {
    try {
      const start = Date.now();
      const response = await axios.get(domain);
      const ms = Date.now() - start;

      embed.addFields({
        name: domain,
        value: `<a:online:1226582126921646193> En ligne - Ping: ${ms}ms`,
        inline: true,
      });
    } catch (error) {
      embed.addFields({
        name: domain,
        value: "<a:offline:1226581540813672478> Hors ligne",
        inline: true,
      });
      console.log(error);
    }
    embed.setDescription(`Prochaine actualisation dans 30 seconde `);
    embed.setColor("Random"); // Mise a jours d'un couleur ramdom cela changeras tous les 30 seconde de couleur
    embed.setTimestamp();
    embed.setURL("LINK RAMDOM A CHANGER");
    embed.setFooter({ text: "Statut des Domaines", iconURL: "URL_DE_IMG_PNG" });
  }

  const channel = client.channels.cache.get("CHANEL_ID_UPDATE"); // channel ou sous souhaiterais mettre a jour embed
  if (channel) {
    if (statusMessage) {
      statusMessage.edit({ embeds: [embed] }); // mise a jours du poste des status
    } else {
      statusMessage = await channel.send({ embeds: [embed] }); // envoye embed dans le 30 seconde afin que le programe ce lance
    }
  }
}

client.login(
  "" //// votre token de vos bot
);
