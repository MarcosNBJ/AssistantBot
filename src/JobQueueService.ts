import { Service } from 'typedi';
import { Queue } from 'bullmq';
import config from './config';

@Service()
export class JobQueueService {
  queue: Queue;

  constructor() {
    this.queue = new Queue('jobQueue', {
      connection: {
        ...config.REDIS,
      },
    });
  }

  async add(name: string, data: any, options?: any) {
    await this.queue.add(name, data, { ...options, removeOnComplete: true });
  }
}
