import { CharacterI } from "../static/interfaces/entity";
import { AddEntityRequest } from "../static/interfaces/requestsInterfaces";
import Character from "../schemas/character";
import { findUserByToken } from "../helpers/findUserByToken";
import { onImagesToObjectIds } from "../helpers/fileHelpers";
import CharacterSchema from "../schemas/character";
import { EntityType } from "../static/enums";
import Space from "../schemas/space";
import City from "../schemas/city";

export class CharacterService {
  async add(data: AddEntityRequest, token?: string): Promise<CharacterI> {

    if (!token) {
      throw new Error("502");
    }

    const { user } = await findUserByToken(token);

    if (!user) {
      throw new Error("502");
    }

    if (!data.name) {
      throw new Error("name is required");
    }

    if (!data.type) {
      throw new Error("type is required");
    }

    let isExistCharacterWithThisName = false;

    switch (data.type) {
      case EntityType.CHARACTER:
        isExistCharacterWithThisName = !!await Character.findOne({ name: data.name });
        break;
      case EntityType.SPACE:
        isExistCharacterWithThisName = !!await Space.findOne({ name: data.name });
        break;
      case EntityType.CITY:
        isExistCharacterWithThisName = !!await City.findOne({ name: data.name });
        break;
    }

    if (isExistCharacterWithThisName) {
      throw new Error("this name taken");
    }

    const images = await onImagesToObjectIds(data.images || []);

    const baseObject = {
      name: data.name,
      description: data.description,
      images: images.map((item) => item._id),
      created: Date.now(),
      creator: user
    }

    let entity

    switch (data.type) {
      case EntityType.CHARACTER:
        entity = await new Character(baseObject);
        break;
      case EntityType.SPACE:
        entity = await new Space(baseObject);
        break;
      case EntityType.CITY:
        entity = await new City(baseObject);
        break;
    }

    entity.save();

    return entity;
  }

  async view(id?: string) {
    if (!id) {
      throw new Error("No id");
    }

    const character = await CharacterSchema.findById(id).populate("images").populate("description").populate("creator");

    if (!character) {
      throw new Error("No character");
    }
    await character.updateOne({ viewCount: (character.viewCount || 0) + 1 });

    const characterView: CharacterI = {
      id: character.id,
      name: character.name,
      created: character.created,
      images: character.images?.map((item: any) => ({ id: item.id, name: item.name, type: item.type })),
      description: character.description?.map((item: any) => ({ title: item.title, content: item.content })),
      creator: {
        id: character.creator?.id,
        login: character.creator?.login
      },
      viewCount: character.viewCount || 0
    };

    return characterView;

  }
}
