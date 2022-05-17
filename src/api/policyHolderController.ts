import Axios, { AxiosResponse } from 'axios';
import { getBaseApiUrl, handleUnexpectedStatusResponse, getLoqateApiRetrieveUrl, getLoqateApiFindUrl } from './default';
import EmergencyModel from '@/models/EmergencyModel';
import SearchEmergencyQuestionModel from '@/models/SearchEmergencyQuestionModel';
import ReturnEmergencyQuestionDataModel from '@/models/ReturnEmergencyQuestionDataModel';
import PolicyHolderApi from '@/api/PolicyHolderApiAxiosPlugin';
import QuestionModeJobDetailModel from '@/models/claim/QuestionModeJobDetailModel';

export default class PolicyHolderController {
    public static async GetEmergencies(): Promise<EmergencyModel[]> {
        const res: AxiosResponse = await Axios.get(
            getBaseApiUrl() + 'PolicyHolder/GetEmergencies');
        if (res.status === 200) {
            const result = res.data as EmergencyModel[];
            if (!result) {
                return [];
            }
            return result;
        } else {
            handleUnexpectedStatusResponse(res);
            return [];
        }
    }

    public static async GetLoqateApiKey(): Promise<string> {
        const res: AxiosResponse = await PolicyHolderApi.get<string>('PolicyHolder/GetLoqateApiKey');
        if (res.status === 200) {
            return res.data;
        } else {
            handleUnexpectedStatusResponse(res);
            return '';
        }
    }

    public static async RetrieveAddressLoqateApi(id: string, apiKey: string): Promise<any> {
        const res: AxiosResponse = await Axios.get(
            getLoqateApiRetrieveUrl() + '?Key=' + apiKey + '&Id=' + id);
        if (res.status === 200) {
            return res;
        } else {
            handleUnexpectedStatusResponse(res);
            return false;
        }
    }

    public static async FindAddressFromLoqateApi(text: string, apiKey: string, id: string): Promise<any> {
        const res: AxiosResponse = await Axios.get(
            getLoqateApiFindUrl() + '?Key=' + apiKey + '&Text=' + text + (id ? '&Container=' + id : ''));
        if (res.status === 200) {
            return res;
        } else {
            handleUnexpectedStatusResponse(res);
            return false;
        }
    }

    public static async GetPolicyQuestions(searchEmergencyQuestion: SearchEmergencyQuestionModel): Promise<ReturnEmergencyQuestionDataModel | null> {
        const res: AxiosResponse = await PolicyHolderApi.post<SearchEmergencyQuestionModel>('PolicyHolder/GetPolicyQuestions', searchEmergencyQuestion);
        if (res.status === 200) {
            const result = res.data as ReturnEmergencyQuestionDataModel;
            if (!result) {
                return null;
            }
            return result;
        } else {
            handleUnexpectedStatusResponse(res);
            return null;
        }
    }

    public static async GetQuestionModeJobDetails(): Promise<QuestionModeJobDetailModel | null> {
        const res: AxiosResponse = await PolicyHolderApi.get<QuestionModeJobDetailModel | null>('PolicyHolder/GetQuestionModeJobDetails');
        if (res.status === 200) {
            const result = res.data as QuestionModeJobDetailModel;
            if (!result) {
                return null;
            }
            return result;
        } else {
            handleUnexpectedStatusResponse(res);
            return null;
        }
    }
}
