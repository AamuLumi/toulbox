import { Events, GuildScheduledEvent, GuildScheduledEventStatus } from 'discord.js';
import EventQueue from '../tools/eventsQueue';

export default {
	name: Events.GuildScheduledEventDelete,

	async execute(interaction: GuildScheduledEvent) {
		await EventQueue.deleteGuildScheduledEvent(interaction);
	},
};
