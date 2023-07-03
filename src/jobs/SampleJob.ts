import { Job } from 'bullmq';
import SendSingleMessage from '../services/SendSingleMessage';

const SampleJob = (job: Job) => {
  console.log('SampleJob');
  console.log(job.data);
  SendSingleMessage(job.data.content, job.data.channelId);
  return Promise.resolve();
};

export default SampleJob;
