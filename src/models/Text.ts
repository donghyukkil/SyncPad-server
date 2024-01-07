import mongoose, { Schema, Document } from 'mongoose';

interface IText extends Document {
  userId: mongoose.Types.ObjectId;
  content: any[];
  backgroundColor: string;
  createdAt: Date;
  updatedAt: Date;
}

const textSchema: Schema = new Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  content: { type: Array, required: true },
  backgroundColor: { type: String, default: "#f7e79e" },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const Text = mongoose.model<IText>('Text', textSchema);

export default Text;
