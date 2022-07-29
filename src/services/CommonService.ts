import { MainPageDataRequest, MainPageDataResponse } from "../static/interfaces/requestsInterfaces";
import { BaseEntityPreviewI } from "../static/interfaces/entity";
import CharacterSchema from "../schemas/character";
import { onImagesFromObjectIds } from "../helpers/fileHelpers";

export class CommonService {

  async mainPageData(params: MainPageDataRequest): Promise<MainPageDataResponse> {

    const newestData: Array<any> = await CharacterSchema.find({}).populate("images").sort("-date").limit(5)
    const popularData: Array<any> = await CharacterSchema.find({}).populate("images").sort("-viewCount").limit(5)

    const viewNewestData: Array<BaseEntityPreviewI> = newestData.map((item) => ({
      id: item.id,
      images: item.images,
      name: item.name
    }));

    const viewPopularData: Array<BaseEntityPreviewI> = popularData.map((item) => ({
      id: item.id,
      images: item.images,
      name: item.name
    }));

    const newestArticles: Array<BaseEntityPreviewI> = viewNewestData;
    const mostPopularArticles: Array<BaseEntityPreviewI> = viewPopularData;

    return {
      mostPopularArticles,
      newestArticles
    };
  }

}
