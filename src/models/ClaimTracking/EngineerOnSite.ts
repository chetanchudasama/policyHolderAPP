import CosmosJobsDbRecordBase from '@/models/CosmosJobsDbRecordBase';

export default class EngineerOnSite extends CosmosJobsDbRecordBase {
    public description: string;
    public forEmergencyTypeId: number;
    public forEmergencyDetailId: number;
}
