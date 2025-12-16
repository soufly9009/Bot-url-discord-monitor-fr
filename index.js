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

    for (const service of config.domaine) {
        try {
            const start = Date.now();
            const response = await axios.get(service.url);
            const ms = Date.now() - start;

            embed.addFields({
                name: service.name,
                value: `<a:ON:1444440953195728946> || En ligne - Ping: ${ms}ms`,
                inline: false,
            });
        } catch (error) {
            let statusText = `<:874346wrong:1450528836407136307> || Hors ligne - Error: ${error.message}`;

            if (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED' || error.code === 'ETIMEDOUT') {
                statusText = `🚧 || Maintenance`;
            }

            embed.addFields({
                name: service.name,
                value: statusText,
                inline: false,
            });

            if (error.code === 'ENOTFOUND') {
                console.error(`DNS Error: Could not resolve ${service.url}`);
            } else {
                console.error(`Error checking ${service.name} (${service.url}):`, error.message);
            }
        }
    }

    embed.setDescription(`Prochaine actualisation dans ${config.refreshInterval / 1000} secondes`);
    embed.setColor("Random");
    embed.setTimestamp();
    embed.setURL(config.embedURL || "");
    embed.setFooter({ text: "Statut des Domaines" });

    try {
        const channel = await client.channels.fetch(config.channelID);
        if (channel) {
            if (statusMessage) {
                try {
                    await statusMessage.edit({ embeds: [embed] });
                } catch (editError) {
                    console.error("Failed to edit message, sending new one:", editError);
                    statusMessage = await channel.send({ embeds: [embed] });
                }
            } else {
                // Try to find the last message from the bot to edit it instead of sending a new one always
                const messages = await channel.messages.fetch({ limit: 10 });
                const lastMessage = messages.find(m => m.author.id === client.user.id);

                if (lastMessage) {
                    statusMessage = lastMessage;
                    await statusMessage.edit({ embeds: [embed] });
                } else {
                    statusMessage = await channel.send({ embeds: [embed] });
                }
            }
        }
    } catch (error) {
        console.error("Error fetching channel or sending message:", error);
    }
}

// Anti-crash to prevent bot from dying on unhandled errors
process.on('unhandledRejection', error => {
    console.error('Unhandled promise rejection:', error);
});

process.on('uncaughtException', error => {
    console.error('Uncaught exception:', error);
});

client.on('error', error => {
    console.error('Discord Client Error:', error);
});

client.login(config.token);