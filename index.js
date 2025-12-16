const { Client, GatewayIntentBits, EmbedBuilder } = require("discord.js");
const config = require('./config.json');
const { checkService } = require('./utils/checkService');
const { sendAlert } = require('./utils/alertSystem');

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
    setInterval(updateStatus, config.refreshInterval || 60000);
});

let statusMessage;
let previousStates = {};

async function updateStatus() {
    const embed = new EmbedBuilder()
        .setTitle("Statut des Infrastructures")
        .setColor(0x0099ff);

    for (const service of config.domaine) {
        // 1. Check Status
        // checkService returns { status, latency, message, code }
        const result = await checkService(service.url);

        // 2. Build Embed Field
        let icon = '';
        let displayText = '';

        if (result.status === 'ONLINE') {
            icon = '<a:ON:1444440953195728946>'; // Online animation
            displayText = `${icon} || En ligne - Ping: ${result.latency}ms`;
        } else if (result.status === 'MAINTENANCE') {
            icon = '🚧'; // Maintenance icon
            displayText = `${icon} || Maintenance`;
        } else {
            icon = '<:874346wrong:1450528836407136307>'; // Offline icon
            displayText = `${icon} || Hors ligne - Error: ${result.message}`;
        }

        embed.addFields({
            name: service.name,
            value: displayText,
            inline: false,
        });

        // 3. Log Errors
        if (result.status === 'MAINTENANCE') {
            console.error(`DNS/Connection Error for ${service.name}: Could not resolve/connect to ${service.url}`);
        } else if (result.status === 'OFFLINE') {
            console.error(`Error checking ${service.name} (${service.url}):`, result.message);
        }

        // 4. Send Alert if Status Changed
        if (config.enableAlerts && config.webhookURL) {
            const lastStatus = previousStates[service.url];
            if (lastStatus && lastStatus !== result.status) {
                // Status changed!
                await sendAlert(config.webhookURL, service, result.status);
            }
        }
        previousStates[service.url] = result.status;
    }

    // 5. Finalize Embed
    embed.setDescription(`Prochaine actualisation dans ${config.refreshInterval / 1000} secondes`);
    embed.setColor("Random");
    embed.setTimestamp();
    embed.setURL(config.embedURL || "");
    embed.setFooter({ text: "Statut des Domaines" });

    // 6. Send/Edit Message
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
                // Try to find the last message from the bot
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

// Anti-crash
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