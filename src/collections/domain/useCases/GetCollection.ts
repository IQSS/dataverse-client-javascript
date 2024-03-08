import { UseCase } from "../../../core/domain/useCases/UseCase";
import { ICollectionsRepository } from "../repositories/ICollectionsRepository";
import { Collection } from "../models/Collection";

// export API_TOKEN=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
// export SERVER_URL=https://demo.dataverse.org
// export PARENT=root

// curl -H "X-Dataverse-key:$API_TOKEN" -X POST "$SERVER_URL/api/dataverses/$PARENT" --upload-file dataverse-complete.json

export class GetCollection implements UseCase<Collection>{
    private collectionsRepository: ICollectionsRepository

  constructor(collectionsRepository: ICollectionsRepository) {
    this.collectionsRepository = collectionsRepository
  }

  /**
   * Returns a Collection instance, given the search parameters to identify it.
   *
   * https://guides.dataverse.org/en/6.0/api/native-api.html#view-a-dataverse-collection
   * @param {number | string} [collectionId] - The dataset identifier ...
   * @param {number | string} [parentCollection]
   * @returns {Promise<Collection>}
   */
  async execute(
    collectionId: number | string, //TODO
    parentCollection:  number | string //TODO
  ): Promise<Collection> {
    return await this.collectionsRepository.getCollection(
      collectionId,
      parentCollection
    )
  }

}