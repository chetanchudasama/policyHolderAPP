import CosmosJobsDbRecordBase from '@/models/CosmosJobsDbRecordBase';

export default class HealthAndSafetyQAModel extends CosmosJobsDbRecordBase {
    public forEmergencyTypeId: number | null;
    public forEmergencyDetailId: number | null;

    public questionText: string;
    public isHealthAffected: boolean | null;
    public level: string | null;
    public answerDetail: string | null;

    public constructor() {
        super();
        // set defaults
        this.forEmergencyTypeId = null;
        this.forEmergencyDetailId = null;
        this.isHealthAffected = null;
        this.level = null;
        this.answerDetail = null;
    }
}
