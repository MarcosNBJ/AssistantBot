import mongoose from 'mongoose';

const { Schema } = mongoose;

const ReminderSchema = new Schema({

  content: {
    type: String,
    required: true,
  },
  channelId: {
    type: Number,
    required: true,
  },
  dateToRemind: {
    type: Date,
    required: true,
  },
});

export default mongoose.model('Reminder', ReminderSchema);
