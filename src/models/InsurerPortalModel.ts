import EmergencyQA from '@/models/EmergencyQA';
import { ContactPreference } from './types';
import AddEmergency from './AddEmergency';
import CustomerAvailabilityModel from '@/models/claim/CustomerAvailabilityModel';
import HealthAndSafetyQAModel from './claim/HealthAndSafetyQAModel';
import VulnerabilityQAModel from './claim/VulnerabilityQAModel';
import AccessNoteModel from './claim/AccessNoteModel';

export default class InsurerPortalModel {
    public clientTitle: string;
    public clientForename: string;
    public clientLastName: string;
    public addressLine1: string;
    public addressLine2: string;
    public addressLine3: string;
    public addressLine4: string;
    public postcode: string;
    public mobilePhone: string;
    public email: string;
    public contactPreference: ContactPreference;
    public contactPreferenceId: number | null;
    public policyNumber: string;
    public policyScheduleId: number;
    public policyName: string;
    public isPolicyCovered: boolean | null;
    public emergencies: AddEmergency[];
    public emergenciesQAs: EmergencyQA[];
    public claimPictures: [string, string];
    public customerAvailability: CustomerAvailabilityModel;
    public healthAndSafetyQAs: HealthAndSafetyQAModel[];
    public vulnerabilityQA: VulnerabilityQAModel | null;
    public accessNoteQA: AccessNoteModel | null;

    public constructor() {
        this.emergencies = [];
        this.emergenciesQAs = [];
        this.contactPreference = null;
        this.contactPreferenceId = null;
        this.isPolicyCovered = null;
        this.mobilePhone = "";
    }
}
