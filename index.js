const axios = require("axios");
const { Client, GatewayIntentBits, EmbedBuilder } = require("discord.js");
const config = require('./config.json');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMessageReactions,
    ],
});

client.once("ready", () => {
    console.log("Le bot est en ligne!");
    setInterval(checkDomains, config.refreshInterval || 60000); 
});

let statusMessage;

async function checkDomains() {
    const embed = new EmbedBuilder()
        .setTitle("Statut des Infrastructures")
        .setColor(0x0099ff);

    for (const domain of config.domaine) {
        try {
            const start = Date.now();
            const response = await axios.get(domain);
            const ms = Date.now() - start;

            embed.addFields({
                name: domain,
                value: `<a:online:1226582126921646193> En ligne - Ping: ${ms}ms`,
                inline: false,
            });
        } catch (error) {
            embed.addFields({
                name: domain,
                value: `<a:offline:1226581540813672478> Hors ligne - Error: ${error.message}`,
                inline: false,
            });
            console.error(`Error checking ${domain}:`, error);
        }
    }

    embed.setDescription(`Prochaine actualisation dans ${config.refreshInterval / 1000} secondes`);
    embed.setColor("Random"); 
    embed.setTimestamp();
    embed.setURL(config.embedURL || ""); 
    embed.setFooter({ text: "Statut des Domaines" });

    const channel = client.channels.cache.get(config.channelID);
    if (channel) {
        if (statusMessage) {
            statusMessage.edit({ embeds: [embed] });
        } else {
            statusMessage = await channel.send({ embeds: [embed] });
        }
    }
}

client.login(config.token);