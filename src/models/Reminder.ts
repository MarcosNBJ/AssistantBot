import mongoose from 'mongoose';

const { Schema } = mongoose;

const ReminderSchema = new Schema({

  content: {
    type: String,
    required: true,
  },
  dateToRemind: {
    type: Date,
    required: true,
  },
  jobId: {
    type: String,
  },
  type: {
    type: String,
    required: true,
  },
});

export default mongoose.model('Reminder', ReminderSchema);
