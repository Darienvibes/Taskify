const { ownerID } = require('../../config.json');

module.exports = {
    name: 'shutdown',
    description: 'Shuts down the bot (Owner only)',
    execute(message, args) {
        if (message.author.id !== ownerID) {
            return message.reply('❌ You don’t have permission to shut me down!');
        }

        message.reply('🛑 Shutting down...').then(() => {
            console.log('Bot is shutting down...');
            process.exit(); // Exits the process
        });
    },
};