import { BaseEntityI, BaseEntityPreviewI, CharacterI } from "./entity";

import { Request } from 'express';
import { EntityType } from "../enums";


export interface MainPageDataRequest {
  query?: string
  type?: EntityType
}

export interface MainPageDataResponse {
  mostPopularArticles: Array<BaseEntityPreviewI>
  newestArticles: Array<BaseEntityPreviewI>
  allArticles: Array<BaseEntityPreviewI>
}

export interface CustomRequest<T> extends Request {
  body: T
}

export interface AddEntityRequest extends Omit<BaseEntityI, "created" | "creator" | "id"> {
  type: EntityType
}
