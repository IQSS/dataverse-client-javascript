import { SearchService } from "../../../src/search/domain/models/SearchService"

export const createSearchServiceModelArray = (count: number): SearchService[] => {
  return Array.from({ length: count }, (_, index) => ({
    name: `role${index + 1}`,
    displayName: `Role ${index + 1}`,
  }))
}
