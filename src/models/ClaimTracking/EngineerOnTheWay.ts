import CosmosJobsDbRecordBase from '@/models/CosmosJobsDbRecordBase';

export default class EngineerOnTheWay extends CosmosJobsDbRecordBase {
    public latitude: number;
    public longitude: number;
    public description: string;
    public forEmergencyTypeId: number;
    public forEmergencyDetailId: number;
    public headingMagneticNorth: number;
    public proxyNumber: string;
    public customerProxyNumber: string;
}
