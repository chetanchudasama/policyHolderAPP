import ClaimRequest from '@/models/ClaimTracking/ClaimRequest';
import CoverIncluded from '@/models/ClaimTracking/CoverIncluded';
import EngineerAssigned from '@/models/ClaimTracking/EngineerAssigned';
import EngineerOnTheWay from '@/models/ClaimTracking/EngineerOnTheWay';
import EngineerOnSite from '@/models/ClaimTracking/EngineerOnSite';
import ClaimVisitComplete from '@/models/ClaimTracking/ClaimVisitComplete';
import ClaimEmergencyDetail from '@/models/ClaimTracking/ClaimEmergencyDetail';

export default class ClaimTrackingModel {
    public claimEmergencyDetail: ClaimEmergencyDetail;
    public claimRequest: ClaimRequest;
    public coverIncluded: CoverIncluded;
    public engineerAssigned: EngineerAssigned | null;
    public engineerOnTheWay: EngineerOnTheWay | null;
    public engineerOnSite: EngineerOnSite | null;
    public claimVisitComplete: ClaimVisitComplete;
}
