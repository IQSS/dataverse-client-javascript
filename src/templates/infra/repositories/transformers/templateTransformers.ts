import { transformPayloadLicenseToLicense } from '../../../../licenses/domain/repositories/transformers/licenseTransformers'
import { Template } from '../../../domain/models/Template'
import { TemplatePayload } from './TemplatePayload'
import { transformPayloadToDatasetMetadataBlocks } from '../../../../datasets/infra/repositories/transformers/datasetTransformers'

export const transformTemplatePayloadToTemplate = (
  collectionDatasetTemplatePayload: TemplatePayload
): Template => {
  const template: Template = {
    id: collectionDatasetTemplatePayload.id,
    name: collectionDatasetTemplatePayload.name,
    collectionAlias: collectionDatasetTemplatePayload.dataverseAlias,
    isDefault: collectionDatasetTemplatePayload.isDefault,
    usageCount: collectionDatasetTemplatePayload.usageCount,
    createTime: collectionDatasetTemplatePayload.createTime,
    createDate: collectionDatasetTemplatePayload.createDate,
    datasetMetadataBlocks: transformPayloadToDatasetMetadataBlocks(
      collectionDatasetTemplatePayload.datasetFields,
      false
    ),
    instructions: collectionDatasetTemplatePayload.instructions.map((instruction) => ({
      instructionField: instruction.instructionField,
      instructionText: instruction.instructionText
    })),
    termsOfUse: {
      termsOfAccess: {
        fileAccessRequest: collectionDatasetTemplatePayload.termsOfUseAndAccess.fileAccessRequest,
        termsOfAccessForRestrictedFiles:
          collectionDatasetTemplatePayload.termsOfUseAndAccess.termsOfAccess,
        dataAccessPlace: collectionDatasetTemplatePayload.termsOfUseAndAccess.dataAccessPlace,
        originalArchive: collectionDatasetTemplatePayload.termsOfUseAndAccess.originalArchive,
        availabilityStatus: collectionDatasetTemplatePayload.termsOfUseAndAccess.availabilityStatus,
        contactForAccess: collectionDatasetTemplatePayload.termsOfUseAndAccess.contactForAccess,
        sizeOfCollection: collectionDatasetTemplatePayload.termsOfUseAndAccess.sizeOfCollection,
        studyCompletion: collectionDatasetTemplatePayload.termsOfUseAndAccess.studyCompletion
      }
    }
  }

  if (collectionDatasetTemplatePayload.termsOfUseAndAccess.license) {
    template.license = transformPayloadLicenseToLicense(
      collectionDatasetTemplatePayload.termsOfUseAndAccess.license
    )
  } else {
    template.termsOfUse.customTerms = {
      termsOfUse: collectionDatasetTemplatePayload.termsOfUseAndAccess.termsOfUse as string,
      confidentialityDeclaration: collectionDatasetTemplatePayload.termsOfUseAndAccess
        .confidentialityDeclaration as string,
      specialPermissions: collectionDatasetTemplatePayload.termsOfUseAndAccess
        .specialPermissions as string,
      restrictions: collectionDatasetTemplatePayload.termsOfUseAndAccess.restrictions as string,
      citationRequirements: collectionDatasetTemplatePayload.termsOfUseAndAccess
        .citationRequirements as string,
      depositorRequirements: collectionDatasetTemplatePayload.termsOfUseAndAccess
        .depositorRequirements as string,
      conditions: collectionDatasetTemplatePayload.termsOfUseAndAccess.conditions as string,
      disclaimer: collectionDatasetTemplatePayload.termsOfUseAndAccess.disclaimer as string
    }
  }

  return template
}

export const transformTemplatePayloadsToTemplates = (
  datasetTemplatePayloads: TemplatePayload[]
): Template[] => {
  return datasetTemplatePayloads.map((payload) => transformTemplatePayloadToTemplate(payload))
}
