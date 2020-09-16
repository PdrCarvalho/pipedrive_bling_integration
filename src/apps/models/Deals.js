import mongoose from 'mongoose';

const DealsSchema = new mongoose.Schema(
  {
    id_pipedrive: {
      type: Number,
      required: true,
    },
    id_bling:{
      type:Number,
      required:false
    },
    numero_bling:{
      type:Number,
      required:false
    },
    title: {
      type: String,
      required: true,
    },
    org_name:{
      type: String,
      required:true
    },
    won_time:{
      type: Date,
      required: true,
    },
    value:{
        type: Number,
        required: true
    }
  },
  {
    timestamps: true,
  },
);

export default mongoose.model('Deals', DealsSchema);