// User
export interface UserI {
  id: string;
  login: string;
  password: string;
  token?: string;
}

export interface ViewUserI {
  id: string;
  login: string;
  token?: string;
}


export interface CharacterI extends BaseEntityI {
}

export interface SpaceI extends BaseEntityI {
}

export interface CityI extends BaseEntityI {
}


// Common
export interface BaseEntityI {
  id: string;
  name: string;
  created: number;
  creator: ViewUserI;
  images?: Array<ImageI>;
  description?: Array<DescriptionI>;
  viewCount: number
}
export interface BaseEntityPreviewI extends Omit<BaseEntityI, "creator" | "created" | "description" | "viewCount"> {
}

export interface ImageI {
  id: string;
  name: string;
  type: string;
}

export interface DescriptionI {
  title?: string;
  content: string;
}