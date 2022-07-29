import { CharacterI, ImageI } from "../static/interfaces/entity";
import { AddCharacterRequest } from "../static/interfaces/requestsInterfaces";
import Character from "../schemas/character";
import { findUserByToken } from "../helpers/findUserByToken";
import { onImagesToObjectIds } from "../helpers/fileHelpers";
import { v4 as uuidv4 } from "uuid";
import CharacterSchema from "../schemas/character";

export class CharacterService {
  async add(data: AddCharacterRequest, token?: string): Promise<CharacterI> {

    if (!token) {
      throw new Error("502");
    }

    const {user} = await findUserByToken(token)

    if (!user) {
      throw new Error("502");
    }

    if (!data.name) {
      throw new Error("name is required");
    }

    const isExistCharacterWithThisName = await Character.findOne({name: data.name})

    if (isExistCharacterWithThisName) {
      throw new Error("this name taken");
    }

    const images = await onImagesToObjectIds(data.images || [])

    const character = new Character({
      name: data.name,
      description: data.description,
      images: images.map((item) => item._id),
      created: Date.now(),
      creator: user,
    })

    await character.save()

    return character
  }

  async view(id?: string) {
    if (!id) {
      throw new Error("No id")
    }
    const character = await CharacterSchema.findById(id).populate("images").populate("description").populate("creator")

    if (!character) {
      throw new Error("No character")
    }
    await character.updateOne({viewCount: (character.viewCount || 0) + 1})

    const characterView: CharacterI = {
      id: character.id,
      name: character.name,
      created: character.created,
      images: character.images?.map((item: any) => ({id: item.id, name: item.name, type: item.type})),
      description: character.description?.map((item: any) => ({title: item.title, content: item.content})),
      creator: {
        id: character.creator?.id,
        login: character.creator?.login,
      },
      viewCount: character.viewCount || 0
    }

    return characterView

  }
}
