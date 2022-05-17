import Store from "@/store";
import { AxiosResponse } from 'axios';

export function getBaseApiUrl(): string {
    return Store.state.Environment.PolicyHolderApiBaseUrl + '/api/';
}

export function getLoqateApiRetrieveUrl(): string {
    return Store.state.Environment.LocateRetrieveApi;
}

export function getLoqateApiFindUrl(): string {
    return Store.state.Environment.LocateFindApi;
}

export function handleUnexpectedStatusResponse(res: AxiosResponse) {
    switch (res.status) {
        case 401:
        // TODO: show logged out overlay
        case 403:
        // TODO: show forbidden overlay
        case 500:
        default:
        // TODO: show sorry something went wrong overlay
    }
}
