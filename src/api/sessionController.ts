import Axios, { AxiosResponse } from 'axios';
import { getBaseApiUrl, handleUnexpectedStatusResponse } from './default';
import VerifyPortalAccessUserModel from '@/models/VerifyPortalAccessUserModel';
import ValidateVerificationCodeModel from '@/models/ValidateVerificationCodeModel';
import ResponseOfValidateVerificationCodeModel from '@/models/ResponseOfValidateVerificationCodeModel';
import RequestVarificationCodeModel from '@/models/RequestVarificationCodeModel';
import VerifyPortalUserResponse from '@/models/VerifyPortalUserResponse';

export default class SessionController {

    public static async VerifyPortalUser(verifyPortalAccessUserModel: VerifyPortalAccessUserModel): Promise<VerifyPortalUserResponse | null> {
        const res: AxiosResponse = await Axios.post(
            getBaseApiUrl() + 'Session/VerifyPortalUserAccess', verifyPortalAccessUserModel);
        if (res.status === 200) {
            // handle captcha error
            const result = res.data as VerifyPortalUserResponse;
            if (!result) {
                return null;
            }
            result.trackingId = '';
            return result;
        } else if (res.status === 202) {
            // success
            const result = res.data as VerifyPortalUserResponse;
            if (!result) {
                return null;
            }
            result.message = '';
            return result;
        } else {
            handleUnexpectedStatusResponse(res);
            return null;
        }
    }

    public static async ValidateVerificationCode(validateVerificationCodeModel: ValidateVerificationCodeModel): Promise<ResponseOfValidateVerificationCodeModel | null> {
        const res: AxiosResponse = await Axios.post(
            getBaseApiUrl() + 'Session/ValidateVerificationCode', validateVerificationCodeModel);
        if (res.status >= 200 && res.status <= 300) {
            const result = res.data as ResponseOfValidateVerificationCodeModel;
            if (!result) {
                return null;
            }
            return result;
        } else {
            handleUnexpectedStatusResponse(res);
            return null;
        }
    }

    public static async ReSendVerificationCode(requestVarificationCodeModel: RequestVarificationCodeModel): Promise<boolean | null> {
        const res: AxiosResponse = await Axios.post(
            getBaseApiUrl() + 'Session/ReSendVerificationCode', requestVarificationCodeModel);
        if (res.status === 202) {
            return true;
        } else {
            handleUnexpectedStatusResponse(res);
            return false;
        }
    }
}
