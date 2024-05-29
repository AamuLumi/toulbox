import * as Scheduler from 'node-schedule';
import { Collection, GuildScheduledEvent, GuildScheduledEventStatus } from 'discord.js';

const jobs: Record<string, Scheduler.Job> = {};

const Queue = {
	addGuildScheduledEvents: async (events: Collection<string, GuildScheduledEvent>) => {
		await events.reduce(
			(p, event) => p.then(() => Queue.addGuildScheduledEvent(event)),
			Promise.resolve(),
		);
	},

	addGuildScheduledEvent: async (event: GuildScheduledEvent) => {
		if (!event?.scheduledStartTimestamp) {
			return;
		}

		const startTime = new Date();

		startTime.setTime(event.scheduledStartTimestamp);

		jobs[event.id] = Scheduler.scheduleJob(startTime, async () => {
			console.log('update hello');
			await event.setStatus(GuildScheduledEventStatus.Active);

			delete jobs[event.id];
		});
	},

	deleteGuildScheduledEvent: async (event: GuildScheduledEvent) => {
		if (jobs[event.id]) {
			Scheduler.cancelJob(jobs[event.id]);
			delete jobs[event.id];
		}
	},
};

export default Queue;
