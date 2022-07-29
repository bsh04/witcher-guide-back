import { model, Schema, ObjectId } from "mongoose";
import { CharacterI } from "../static/interfaces/entity";
import { Collections } from "../static/enums";
import File from "./file";

const CharacterSchema = new Schema<CharacterI>({
  name: String,
  created: Number,
  viewCount: Number,
  creator: {
    type: Schema.Types.ObjectId,
    ref: "User"
  },
  description: [{
    title: String,
    content: String,
  }],
  images: [{
    type: Schema.Types.ObjectId,
    ref: "File"
  }],
}, { collection: Collections.CHARACTER });

CharacterSchema.set('toJSON', {
  virtuals: true
});

CharacterSchema.virtual('id').get(function(){
  return this._id.toHexString();
});


export default model<CharacterI>("Character", CharacterSchema);