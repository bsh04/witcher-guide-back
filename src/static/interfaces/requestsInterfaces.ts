import { BaseEntityI, BaseEntityPreviewI, CharacterI } from "./entity";

import { Request } from 'express';


export interface MainPageDataRequest {
  query?: string
}

export interface MainPageDataResponse {
  mostPopularArticles: Array<BaseEntityPreviewI>
  newestArticles: Array<BaseEntityPreviewI>
}

export interface CustomRequest<T> extends Request {
  body: T
}

export interface AddCharacterRequest extends Omit<CharacterI, "created" | "creator" | "id"> {}