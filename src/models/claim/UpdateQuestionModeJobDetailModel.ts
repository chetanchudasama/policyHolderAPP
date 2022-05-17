import CustomerAvailabilityModel from '@/models/claim/CustomerAvailabilityModel';
import AccessNoteModel from '@/models/claim/AccessNoteModel';
import VulnerabilityQAModel from '@/models/claim/VulnerabilityQAModel';
import HealthAndSafetyQAModel from '@/models/claim/HealthAndSafetyQAModel';
import AddEmergencyAnswerModel from '@/models/claim/AddEmergencyAnswerModel';

export default class UpdateQuestionModeJobDetailModel {
    public emergenciesQAs: AddEmergencyAnswerModel[];
    public healthAndSafetyQAs: HealthAndSafetyQAModel[];
    public vulnerabilityQA: VulnerabilityQAModel | null;
    public accessNoteQA: AccessNoteModel | null;
    public customerAvailability: CustomerAvailabilityModel;

    public constructor() {
        this.emergenciesQAs = [];
        this.healthAndSafetyQAs = [];
    }
}
