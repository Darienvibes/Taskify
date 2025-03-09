module.exports = {
    name: 'ping',
    description: 'Replies with Pong and bot latency!',
    async execute(message) {
        const msg = await message.channel.send('Pinging...'); // Send initial message
        const latency = msg.createdTimestamp - message.createdTimestamp; // Calculate latency
        const apiLatency = Math.max(0, Math.round(message.client.ws.ping)); // Prevent negative latency

        msg.edit(`🏓 Pong! Your ping is **${latency}ms**. API Latency is **${apiLatency}ms**.`);
    }
};