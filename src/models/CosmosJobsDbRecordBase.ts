import { Moment } from "moment";
import { ClaimTrackingType } from '@/models/types';

export default class CosmosJobsDbRecordBase {
    public id: string; // unique id
    public jobId: string;
    public type: ClaimTrackingType;
    public createdAt: Moment;
}
