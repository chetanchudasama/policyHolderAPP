import CosmosJobsDbRecordBase from '@/models/CosmosJobsDbRecordBase';

export default class ClaimEmergencyDetail extends CosmosJobsDbRecordBase {
    public typeId: number;
    public typeDescription: string;
    public detailId: number;
    public detailDescription: string;
}
