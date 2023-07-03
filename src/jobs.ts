import { Worker } from 'bullmq';
import SendMessageJob from './jobs/SendMessageJob';
import config from './config';

const worker = new Worker('jobQueue', SendMessageJob, {
  connection: {
    ...config.REDIS,
  },
});

worker.on('completed', (job) => {
  console.log(`Job ${job.id} completed!`);
});

worker.on('failed', (job, err) => {
  console.log(`Job ${job?.id} failed with error ${err.message}`);
});
