import mongoose, { Schema, Document } from 'mongoose';

interface IRoom extends Document {
  userId: mongoose.Types.ObjectId;
  textId?: string;
  roomId?: string;
  content: any[];
}

const RoomSchema: Schema = new Schema({
  userId: { type: String, ref: 'User', required: true },
  textId: String,
  roomId: String,
  content: Array,
});

const Room = mongoose.model<IRoom>('Room', RoomSchema);

export default Room;
