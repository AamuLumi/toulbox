import { Events, GuildScheduledEvent, GuildScheduledEventStatus } from 'discord.js';
import EventQueue from '../tools/eventsQueue';

export default {
	name: Events.GuildScheduledEventUpdate,

	async execute(oldEvent: GuildScheduledEvent, newEvent: GuildScheduledEvent) {
		await EventQueue.deleteGuildScheduledEvent(oldEvent);
		await EventQueue.addGuildScheduledEvent(newEvent);
	},
};
