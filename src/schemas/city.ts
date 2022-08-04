import { model, Schema } from "mongoose";
import { CityI } from "../static/interfaces/entity";
import { Collections } from "../static/enums";

const CitySchema = new Schema<CityI>({
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
}, { collection: Collections.CITY });

CitySchema.set('toJSON', {
  virtuals: true
});

CitySchema.virtual('id').get(function(){
  return this._id.toHexString();
});


export default model<CityI>("City", CitySchema);