import { AxiosResponse } from 'axios';
import PolicyHolderApi from '@/api/PolicyHolderApiAxiosPlugin';

export interface ICreateSignalRConnection {
    url: string;
    accessToken: string;
    ttl: number;
}

export default class SignalRController {
    public static async CreateNewSignalRNegotiateRequest(hubName: string): Promise<ICreateSignalRConnection | null> {
        try {
            const res: AxiosResponse = await PolicyHolderApi.post('SignalR/CreateNewSignalRNegotiateRequest',
                {hubName});
            if (res.status !== 200) {
                return null;
            }
            return res.data;
        } catch (err) {
            return null;
        }
    }

    public static async AddUserToNotificationsForJobTracking(): Promise<boolean> {
        try {
            const res: AxiosResponse = await PolicyHolderApi.post('SignalR/AddUserToNotificationsForJobTracking');
            return (res.status >= 200 && res.status < 300);
        } catch (err) {
            return false;
        }
    }
}
