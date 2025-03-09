const { Client, GatewayIntentBits, Collection } = require('discord.js');
const fs = require('fs');
const path = require('path');
const connectDB = require('./database'); // Import MongoDB connection function
const { token, prefix, ownerID, clientId, guildId } = require('../config.json'); // Import token from config.json

// Connect to MongoDB
connectDB();

// Initialize Discord Bot
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

// Add this line to store slash commands
client.slashCommands = new Collection();
client.prefixCommands = new Collection();
const prefixCommandsPath = path.join(__dirname, 'commands');
const prefixCommandFiles = fs.readdirSync(prefixCommandsPath).filter(file => file.endsWith('.js'));

for (const file of prefixCommandFiles) {
    const command = require(`./commands/${file}`);
    client.prefixCommands.set(command.name, command);
}

// Load slash commands
const slashCommandsPath = path.join(__dirname, 'slashCommands'); 
const slashCommandFiles = fs.readdirSync(slashCommandsPath).filter(file => file.endsWith('.js'));

for (const file of slashCommandFiles) {
    const command = require(`./slashCommands/${file}`);
    client.slashCommands.set(command.data.name, command);
}

client.once('ready', () => {
    console.log(`✅ Logged in as ${client.user.tag}`);
});

// Prevent duplicate listeners
client.removeAllListeners('messageCreate'); 

client.on('messageCreate', message => {
    if (!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();

    if (client.prefixCommands.has(commandName)) {
        const command = client.prefixCommands.get(commandName);
        try {
            command.execute(message, args);
        } catch (error) {
            console.error(error);
            message.reply('❌ An error occurred while executing this command!');
        }
    }
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;

    const command = client.slashCommands.get(interaction.commandName);
    if (!command) return;

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        await interaction.reply({ content: '❌ An error occurred while executing this command!', ephemeral: true });
    }
});

// Login to Discord
client.login(token);
