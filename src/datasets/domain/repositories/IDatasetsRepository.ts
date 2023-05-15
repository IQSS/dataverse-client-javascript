export interface IDatasetsRepository {
  getDatasetSummaryFieldNames(): Promise<string[]>;
}
