import { MainPageDataRequest, MainPageDataResponse } from "../static/interfaces/requestsInterfaces";
import { BaseEntityPreviewI } from "../static/interfaces/entity";
import CharacterSchema from "../schemas/character";
import SpaceSchema from "../schemas/space";
import CitySchema from "../schemas/city";
import sortArray from "sort-array";
import { EntityType } from "../static/enums";

export class CommonService {

  async mainPageData(params: MainPageDataRequest): Promise<MainPageDataResponse> {
    const newestData: Array<any> = await this.getLimitedEntities(5, "-created");
    const popularData: Array<any> = await this.getLimitedEntities(5, "-viewCount");
    const allArticlesData: Array<any> = await this.getAllEntities(params.query, params.type);
    console.log(allArticlesData);

    const viewNewestData: Array<BaseEntityPreviewI> = newestData.slice(0, 5).map((item) => ({
      id: item.id,
      images: item.images,
      name: item.name,
      type: item.type
    }));

    const viewPopularData: Array<BaseEntityPreviewI> = popularData.slice(0, 5).map((item) => ({
      id: item.id,
      images: item.images,
      name: item.name,
      type: item.type
    }));

    const viewAllArticlesData: Array<BaseEntityPreviewI> = allArticlesData.map((item) => ({
      id: item.id,
      images: item.images,
      name: item.name,
      type: item.type
    }));

    const newestArticles: Array<BaseEntityPreviewI> = viewNewestData;
    const mostPopularArticles: Array<BaseEntityPreviewI> = viewPopularData;
    const allArticles: Array<BaseEntityPreviewI> = viewAllArticlesData;

    return {
      mostPopularArticles,
      newestArticles,
      allArticles
    };
  }

  async getLimitedEntities(limit: number, sortBy: string) {

    const charactersData: Array<any> = await CharacterSchema.find({}).populate("images").sort(sortBy).limit(limit);

    const spacesData: Array<any> = await SpaceSchema.find({}).populate("images").sort(sortBy).limit(limit);

    const citiesData: Array<any> = await CitySchema.find({}).populate("images").sort(sortBy).limit(limit);

    const allData = [...(charactersData || []), ...(spacesData || []), ...(citiesData || [])]

    return sortArray(allData, {
      by: sortBy.replace("-", ""),
      order: "desc"
    })

  }

  async getAllEntities(query?: string, type?: EntityType) {

    let queryOptions: any = {}

    if (query) {
      queryOptions["name"] = {
        $regex: query,
        $options: "i"
      };
    }

    if (!type) {
      const allCharactersData: Array<any> = await CharacterSchema.find(queryOptions).populate("images");

      const allSpacesData: Array<any> = await SpaceSchema.find(queryOptions).populate("images");

      const allCitiesData: Array<any> = await CitySchema.find(queryOptions).populate("images");

      const allData = [...(allCharactersData || []), ...(allSpacesData || []), ...(allCitiesData || [])]

      return sortArray(allData, {
        by: "name",
        order: "asc"
      });
    }

    switch (type) {
      case EntityType.CHARACTER:
        const allCharactersData: Array<any> = await CharacterSchema.find(queryOptions).populate("images");
        return sortArray(allCharactersData, {
          by: "name",
          order: "asc"
        });
      case EntityType.SPACE:
        const allSpacesData: Array<any> = await SpaceSchema.find(queryOptions).populate("images");
        return sortArray(allSpacesData, {
          by: "name",
          order: "asc"
        });

      case EntityType.CITY:
        const allCitiesData: Array<any> = await CitySchema.find(queryOptions).populate("images");
        return sortArray(allCitiesData, {
          by: "name",
          order: "asc"
        });
    }

  }

}
