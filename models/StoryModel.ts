import { model, Schema, Document } from 'mongoose';
import { UserModelDocumentInterface } from './UserModel';

export interface StoryModelInterface {
  _id?: string;
  text: string;
  user: UserModelDocumentInterface;
}

export type StoryModelDocumentInterface = StoryModelInterface & Document;

const StorySchema = new Schema<StoryModelInterface>({
  text: {
    required: true,
    type: String,
    maxlength: 280,
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
