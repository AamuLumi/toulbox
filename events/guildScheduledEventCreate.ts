import { Events, GuildScheduledEvent, GuildScheduledEventStatus } from 'discord.js';
import EventQueue from '../tools/eventsQueue';

export default {
	name: Events.GuildScheduledEventCreate,

	async execute(interaction: GuildScheduledEvent) {
		await EventQueue.addGuildScheduledEvent(interaction);
	},
};
