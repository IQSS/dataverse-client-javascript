import { DatasetTemplate } from '../../../domain/models/DatasetTemplate'
import { DatasetTemplatePayload } from './DatasetTemplatePayload'

export const transformDatasetTemplatePayloadToDatasetTemplate = (
  collectionDatasetTemplatePayload: DatasetTemplatePayload[]
): DatasetTemplate[] => {
  return collectionDatasetTemplatePayload.map((payload) => {
    const datasetTemplate: DatasetTemplate = {
      id: payload.id,
      name: payload.name,
      alias: payload.dataverseAlias,
      isDefault: payload.isDefault,
      usageCount: payload.usageCount,
      createTime: payload.createTime,
      createDate: payload.createDate,
      datasetFields: payload.datasetFields as unknown as DatasetTemplate['datasetFields'],
      instructions: payload.instructions.map((instruction) => ({
        instructionField: instruction.instructionField,
        instructionText: instruction.instructionText
      })),
      termsOfUse: {
        termsOfAccess: {
          fileAccessRequest: payload.termsOfUseAndAccess.fileAccessRequest,
          termsOfAccessForRestrictedFiles: payload.termsOfUseAndAccess.termsOfAccess,
          dataAccessPlace: payload.termsOfUseAndAccess.dataAccessPlace,
          originalArchive: payload.termsOfUseAndAccess.originalArchive,
          availabilityStatus: payload.termsOfUseAndAccess.availabilityStatus,
          contactForAccess: payload.termsOfUseAndAccess.contactForAccess,
          sizeOfCollection: payload.termsOfUseAndAccess.sizeOfCollection,
          studyCompletion: payload.termsOfUseAndAccess.studyCompletion
        }
      }
    }

    if (payload.termsOfUseAndAccess.license) {
      datasetTemplate.license = {
        name: payload.termsOfUseAndAccess.license.name,
        uri: payload.termsOfUseAndAccess.license.uri,
        iconUri: payload.termsOfUseAndAccess.license.iconUrl
      }
    } else {
      datasetTemplate.termsOfUse.customTerms = {
        termsOfUse: payload.termsOfUseAndAccess.termsOfUse as string,
        confidentialityDeclaration: payload.termsOfUseAndAccess
          .confidentialityDeclaration as string,
        specialPermissions: payload.termsOfUseAndAccess.specialPermissions as string,
        restrictions: payload.termsOfUseAndAccess.restrictions as string,
        citationRequirements: payload.termsOfUseAndAccess.citationRequirements as string,
        depositorRequirements: payload.termsOfUseAndAccess.depositorRequirements as string,
        conditions: payload.termsOfUseAndAccess.conditions as string,
        disclaimer: payload.termsOfUseAndAccess.disclaimer as string
      }
    }

    return datasetTemplate
  })
}
