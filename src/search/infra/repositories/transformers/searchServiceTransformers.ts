import { AxiosResponse } from 'axios'
import { SearchService } from '../../../domain/models/SearchService'
import { SearchServicePayload } from './SearchServicePayload'

export const transformSearchServicesResponseToSearchServices = (
  response: AxiosResponse
): SearchService[] => {
  const searchServicesPayload = response.data.data.services
  const searchServices: SearchService[] = []
  searchServicesPayload.forEach(function (searchServicePayload: SearchServicePayload) {
    searchServices.push(transformSearchServicePayloadToSearchService(searchServicePayload))
  })

  return searchServices
}

const transformSearchServicePayloadToSearchService = (
  searchServicePayload: SearchServicePayload
): SearchService => {
  return {
    name: searchServicePayload.name,
    displayName: searchServicePayload.displayName
  }
}
