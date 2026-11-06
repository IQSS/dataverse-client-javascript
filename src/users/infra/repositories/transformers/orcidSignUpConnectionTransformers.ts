import { AxiosResponse } from 'axios'
import { OrcidSignUpConnection } from '../../../domain/models/OrcidSignUpConnection'

export const transformOrcidSignUpConnectionResponseToOrcidSignUpConnection = (
  response: AxiosResponse
): OrcidSignUpConnection => {
  const data = response.data.data
  return {
    orcid: data.orcid,
    orcidToken: data.orcidToken,
    ...(data.firstName !== undefined && { firstName: data.firstName }),
    ...(data.lastName !== undefined && { lastName: data.lastName }),
    ...(data.emailAddress !== undefined && { emailAddress: data.emailAddress }),
    ...(data.affiliation !== undefined && { affiliation: data.affiliation }),
    ...(data.position !== undefined && { position: data.position })
  }
}
