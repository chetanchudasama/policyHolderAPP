import CustomerAvailabilityModel from '@/models/claim/CustomerAvailabilityModel';
import AddEmergency from '@/models/AddEmergency';
import ReturnEmergencyQuestionDataModel from '@/models/ReturnEmergencyQuestionDataModel';

export default class QuestionModeJobDetailModel {
    public customerAvailability: CustomerAvailabilityModel;
    public acceptedEmergencyIds: number[];
    public loggedEmergencies: AddEmergency[];
    public returnEmergencyQuestionData: ReturnEmergencyQuestionDataModel;

    public constructor() {
        this.acceptedEmergencyIds = [];
        this.loggedEmergencies = [];
    }
}
