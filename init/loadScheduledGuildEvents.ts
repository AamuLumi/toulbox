import {
	Client,
	Events,
	GuildScheduledEvent,
	GuildScheduledEventManager,
	GuildScheduledEventStatus,
} from 'discord.js';
import EventQueue from '../tools/eventsQueue';
import Queue from '../tools/eventsQueue';

export default {
	async execute(client: Client) {
		const guilds = await client.guilds.fetch();

		await guilds.reduce(
			(p, guild) =>
				p.then(async () => {
					const g = await guild.fetch();
					const events = await g.scheduledEvents.fetch();

					await Queue.addGuildScheduledEvents(events);
				}),
			Promise.resolve(),
		);
	},
};
