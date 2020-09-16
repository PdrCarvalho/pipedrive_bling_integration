import mongoose from 'mongoose';

const RegisterSchema = new mongoose.Schema(
  {
    count: {
      type: Number,
      required: false,
    },
    update_time:{
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model('Register', RegisterSchema);