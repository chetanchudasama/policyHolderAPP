import CosmosJobsDbRecordBase from '@/models/CosmosJobsDbRecordBase';

export default class PictureUploadModel extends CosmosJobsDbRecordBase {
    public fileURL: string;
    public uploadedBy: "Customer" | "EngineerBeforeJob" | "EngineerAfterJob";
}
