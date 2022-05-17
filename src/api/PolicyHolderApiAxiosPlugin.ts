import _Vue from "vue";
import Axios, { AxiosRequestConfig, AxiosInstance } from "axios";
import Store from "@/store";

export function getBaseUrl(): string {
    return Store.state.Environment.PolicyHolderApiBaseUrl + '/api/';
}

function generatePolicyHolderApiAxiosInstance(): AxiosInstance {
    const axios = Axios.create({
        validateStatus: (status: number) => (status >= 200 && status < 300) || status === 404,
    });

    axios.interceptors.request.use((config: AxiosRequestConfig) => {
        if (!config.headers.Authorization) {
            // set auth header from store value if not already set (auth.ts)
            config.headers.Authorization = "bearer " + Store.state.trackingId;
        }
        // make sure base URL is set
        config.baseURL = getBaseUrl();
        return config;
    });

    // return instance
    return axios;
}

const axiosInstance = generatePolicyHolderApiAxiosInstance();
export default axiosInstance;
