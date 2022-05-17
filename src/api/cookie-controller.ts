import CookieRecord from "@/models/cookies/cookie-record";
import { AxiosResponse } from "axios";
import PolicyHolderApi from '@/api/PolicyHolderApiAxiosPlugin';

export default class CookieController {

    public static async RetrieveCookieRecord(cookieId: string): Promise<CookieRecord | null> {
        try {
            const res: AxiosResponse<CookieRecord> = await PolicyHolderApi.get(`Cookie/RetrieveCookieRecord?cookieId=${cookieId}`);
            return res && res.data && res.status === 200 ? res.data : null;
        } catch (err) {
            return null;
        }
    }
}
