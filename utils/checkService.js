const axios = require('axios');

/**
 * Checks the status of a given URL.
 * @param {string} url - The URL to check.
 * @returns {Promise<Object>} - Status object { status, latency, message, code }.
 */
async function checkService(url) {
    const start = Date.now();
    try {
        await axios.get(url, { timeout: 10000 }); // Added timeout for safety
        const latency = Date.now() - start;
        return {
            status: 'ONLINE',
            latency: latency,
            message: 'En ligne',
            code: 200
        };
    } catch (error) {
        let status = 'OFFLINE';
        let message = error.message;

        if (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED' || error.code === 'ETIMEDOUT') {
            status = 'MAINTENANCE';
            message = 'Maintenance (Connection Error)';
        }

        return {
            status: status,
            latency: 0,
            message: message,
            code: error.code || 500
        };
    }
}

module.exports = { checkService };
