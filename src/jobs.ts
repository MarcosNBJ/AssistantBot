import { Worker } from 'bullmq';
import SendMessageJob from './jobs/SendMessageJob';

const worker = new Worker('jobQueue', SendMessageJob, {
  connection: {
    host: '127.0.0.1',
    port: 6379,
    password: 'foobarbaz',
  },
});

worker.on('completed', (job) => {
  console.log(`Job ${job.id} completed!`);
});

worker.on('failed', (job, err) => {
  console.log(`Job ${job?.id} failed with error ${err.message}`);
});
