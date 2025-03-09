const { REST, Routes } = require('discord.js');
const { token, clientId, guildId } = require('./config.json'); // Load from config.json
const fs = require('fs');
const path = require('path');

const commands = [];

// Load slash commands from the slashCommands folder
const commandsPath = path.join(__dirname, 'src/slashCommands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./src/slashCommands/${file}`);
    commands.push(command.data.toJSON()); // Convert to JSON for Discord API
}

// Register commands using Discord's REST API
const rest = new REST({ version: '10' }).setToken(token);

(async () => {
    try {
        console.log(`🔄 Refreshing ${commands.length} slash command(s) for guild ${guildId}...`);

        await rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: commands });

        console.log('✅ Slash commands registered successfully!');
    } catch (error) {
        console.error('❌ Error registering commands:', error);
    }
})();