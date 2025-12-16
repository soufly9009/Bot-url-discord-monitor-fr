const { WebhookClient, EmbedBuilder } = require('discord.js');

/**
 * Sends an alert via Webhook if the status has changed.
 * @param {string} webhookURL - The Discord Webhook URL.
 * @param {Object} service - The service object { name, url }.
 * @param {string} newStatus - The new status (ONLINE, OFFLINE, MAINTENANCE).
 */
async function sendAlert(webhookURL, service, newStatus) {
    if (!webhookURL) return;

    const webhookClient = new WebhookClient({ url: webhookURL });
    const alertEmbed = new EmbedBuilder().setTimestamp();

    switch (newStatus) {
        case 'OFFLINE':
            alertEmbed.setTitle(`🔴 Service Down: ${service.name}`)
                .setDescription(`The service **${service.name}** (${service.url}) is now OFFLINE.`)
                .setColor('Red');
            break;
        case 'MAINTENANCE':
            alertEmbed.setTitle(`🚧 Service Maintenance: ${service.name}`)
                .setDescription(`The service **${service.name}** is facing connection issues.`)
                .setColor('Orange');
            break;
        case 'ONLINE':
            alertEmbed.setTitle(`🟢 Service Recovered: ${service.name}`)
                .setDescription(`The service **${service.name}** is back ONLINE.`)
                .setColor('Green');
            break;
        default:
            return; // No alert for unknown status
    }

    try {
        await webhookClient.send({ embeds: [alertEmbed] });
    } catch (error) {
        console.error(`Failed to send alert for ${service.name}:`, error.message);
    }
}

module.exports = { sendAlert };
