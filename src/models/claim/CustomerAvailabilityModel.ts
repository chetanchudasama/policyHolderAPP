import TimeSlot from '@/models/claim/TimeSlot';
import CosmosJobsDbRecordBase from '@/models/CosmosJobsDbRecordBase';

export default class CustomerAvailabilityModel extends CosmosJobsDbRecordBase {
    public timeSlot: TimeSlot[];

    public constructor() {
        super();
        this.timeSlot = [];
    }
}
