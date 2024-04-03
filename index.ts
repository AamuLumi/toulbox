import 'dotenv/config';
import { Client, Collection, Events, GatewayIntentBits } from 'discord.js';
import * as fs from 'node:fs';
import * as path from 'node:path';

const initPath = path.join(__dirname, 'init');
const initFiles = fs.readdirSync(initPath).filter((file) => file.endsWith('.ts'));
const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter((file) => file.endsWith('.ts'));

const client = new Client({
	intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildScheduledEvents],
});

// const foldersPath = path.join(__dirname, 'commands');
// const commandFolders = fs.readdirSync(foldersPath);
//
// for (const folder of commandFolders) {
//     const commandsPath = path.join(foldersPath, folder);
//     const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
//     for (const file of commandFiles) {
//         const filePath = path.join(commandsPath, file);
//         const command = require(filePath);
//         if ('data' in command && 'execute' in command) {
//             client.commands.set(command.data.name, command);
//         } else {
//             console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
//         }
//     }
// }

client.once(Events.ClientReady, (readyClient) => {
	console.log(`Ready! Logged in as ${readyClient.user.tag}`);

	initFiles.reduce(
		(p, file) =>
			p.then(async () => {
				const filePath = path.join(initPath, file);
				const init = (await import(filePath)).default as {
					execute(client: Client): Promise<void>;
				};

				console.log('run init', file);

				await init.execute(client);
			}),
		Promise.resolve(),
	);
});

eventFiles
	.reduce(
		(p, file) =>
			p.then(async () => {
				const filePath = path.join(eventsPath, file);
				const event = (await import(filePath)).default as {
					execute(...args: Array<unknown>): Promise<void>;

					name: string;
					once?: boolean;
				};

				if (event.once) {
					client.once(event.name, event.execute);
				} else {
					client.on(event.name, event.execute);
				}
			}),
		Promise.resolve(),
	)
	.then(() => client.login(process.env.DISCORD_TOKEN));
