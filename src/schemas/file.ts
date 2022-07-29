import { Collections } from "../static/enums";
import { model, Schema } from "mongoose";
import { ImageI } from "../static/interfaces/entity";

const FileSchema = new Schema<ImageI>({
  id: String,
  name: String,
  type: String
}, { collection: Collections.FILE });

export default model<any>("File", FileSchema);