import { ImageI } from "../static/interfaces/entity";
import File from "../schemas/file";

export const onImagesToObjectIds = async (images: Array<ImageI>) => {
  const imagesIds = images.map((item) => item.id)
  return File.find({
    "id": { $in: imagesIds }
  });
}

export const onImagesFromObjectIds = async (images: Array<string>) => {
  return File.find({
    "_id": { $in: images }
  });
}