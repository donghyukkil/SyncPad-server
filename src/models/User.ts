import mongoose, { Schema, Document } from 'mongoose';

interface IUser extends Document {
  email: string;
  token: string;
  texts: mongoose.Types.ObjectId[];
}

const userSchema: Schema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  token: {
    type: String,
    required: true,
    unique: true,
  },
  texts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Text",
    },
  ],
});

const User = mongoose.model<IUser>('User', userSchema);

export default User;
