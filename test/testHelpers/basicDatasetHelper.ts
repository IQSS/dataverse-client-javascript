import { BasicDatasetInformation } from '../../src/@types/basicDataset'
import { internet, name, random } from 'faker'
import { DatasetSubjects } from '../../src/@types/datasetSubjects'

export const createBasicDatasetInformation = (): BasicDatasetInformation => {
  return {
    title: random.words(),
    subtitle: random.words(),
    descriptions: [{
      text: random.words(),
      date: '2019-10-10'
    }],
    authors: [{
      fullname: `${name.firstName()} ${name.lastName()}`,
      affiliation: name.jobArea()
    }],
    contact: [{
      email: internet.email(),
      fullname: `${name.firstName()} ${name.lastName()}`
    }],
    subject: [DatasetSubjects.OTHER]
  }
}