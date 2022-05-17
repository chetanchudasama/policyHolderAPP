import { ICookieState } from "./interfaces/cookie-state";

export default class CookieState implements ICookieState {
    public showCookieBanner: boolean = true;
    public showOptinModal: boolean = false;
    public cookieConsent: {[key: string]: boolean} = {};
    public useDefaultCookieBanner: boolean = false;
}
