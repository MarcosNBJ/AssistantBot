import { Job } from 'bullmq';
import SendSingleMessage from '../services/SendSingleMessage';

const SendMessageJob = (job: Job) => {
  SendSingleMessage(job.data.content, job.data.channelId);
  return Promise.resolve();
};

export default SendMessageJob;
