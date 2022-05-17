import CosmosJobsDbRecordBase from '@/models/CosmosJobsDbRecordBase';

export default class EngineerAssigned extends CosmosJobsDbRecordBase {
    public name: string;
    public contactNumber: string;
    public fileURL: string;
    public description: string;
    public forEmergencyTypeId: number;
    public forEmergencyDetailId: number;
    public engineerVisitDetailId: string;
}
