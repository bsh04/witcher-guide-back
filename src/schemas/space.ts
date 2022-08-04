import { model, Schema } from "mongoose";
import { CharacterI, SpaceI } from "../static/interfaces/entity";
import { Collections } from "../static/enums";

const SpaceSchema = new Schema<SpaceI>({
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
}, { collection: Collections.SPACE });

SpaceSchema.set('toJSON', {
  virtuals: true
});

SpaceSchema.virtual('id').get(function(){
  return this._id.toHexString();
});


export default model<SpaceI>("Space", SpaceSchema);