export default class SearchEmergencyQuestionModel {
    public emergencyTypeIds: number[];
    public emergencyDetailIds: number[];
    public policyIds: number[];
    public fallBackStarPolicyId: number;
    public firstName: string;
    public lastName: string;
    public postcode: string;

    public constructor() {
        this.emergencyTypeIds = [];
        this.emergencyDetailIds = [];
        this.policyIds = [];
    }
}
