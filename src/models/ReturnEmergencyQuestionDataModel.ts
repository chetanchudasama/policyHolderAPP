import EmergencyQA from './EmergencyQA';
import HealthAndSafetyQAModel from './claim/HealthAndSafetyQAModel';
import VulnerabilityQAModel from './claim/VulnerabilityQAModel';
import AccessNoteModel from './claim/AccessNoteModel';

export default class ReturnEmergencyQuestionDataModel {
    public questions: EmergencyQA[];
    public policyId: number;
    public policyName: string;
    public policyNumber: string;
    public isPolicyCovered: boolean | null;
    public healthAndSafetyQAs: HealthAndSafetyQAModel[];
    public vulnerabilityQA: VulnerabilityQAModel | null;
    public accessNoteQA: AccessNoteModel | null;

    public constructor() {
        this.questions = [];
        this.isPolicyCovered = null;
    }
}
