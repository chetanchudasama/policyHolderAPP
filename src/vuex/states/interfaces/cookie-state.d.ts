export interface ICookieState {
    showCookieBanner: boolean;
    showOptinModal: boolean;
    cookieConsent: {[key: string]: boolean};
    useDefaultCookieBanner: boolean;
}