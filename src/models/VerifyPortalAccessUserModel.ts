import { ContactPreference } from './types';

export default class VerifyPortalAccessUserModel {
    public clientTitle: string;
    public clientForename: string;
    public clientLastName: string;
    public mobilePhone: string;
    public email: string;
    public contactPreference: ContactPreference;
    public contactPreferenceId: number | null;
    public captchaResponse: string;
    public termsAndConditionsAccepted: boolean;

    public constructor() {
        this.contactPreference = null;
        this.contactPreferenceId = null;
        this.mobilePhone = "";
        this.captchaResponse = "";
    }
}
