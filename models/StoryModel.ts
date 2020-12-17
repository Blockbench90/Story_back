import { model, Schema, Document } from 'mongoose';
import { UserModelDocumentInterface } from './UserModel';

export interface StoryModelInterface {
  _id?: string;
  title?: string;
  text: string;
  user: UserModelDocumentInterface;
}

export type StoryModelDocumentInterface = StoryModelInterface & Document;

const StorySchema = new Schema<StoryModelInterface>({
  title: {
    required: true,
    type: String,
    maxlength: 1000
  },
  text: {
    required: true,
    type: String,
    maxlength: 3000,
  },
  user: {
    required: true,
    ref: 'User',
    type: Schema.Types.ObjectId,
  },
}, {
  timestamps: true
});

export const StoryModel = model<StoryModelDocumentInterface>('Story', StorySchema);
