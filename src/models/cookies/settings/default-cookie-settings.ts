import CookieBannerSettings from "./cookie-banner-settings";
import CookieSelectionOptions from "./cookie-selection-options";

export default class DefaultCookieSettings {
    public cookieBanner: CookieBannerSettings = new CookieBannerSettings();

    public cookieOptions: CookieSelectionOptions[] = [
        {
            label: 'Performance',
            key: 'performanceConsent',
            tooltipText: 'Performance cookies help us to understand how ' +
                        'visitors interact with websites by collecting and reporting information anonymously. ' +
                        'These are vitally important to help improve user experience.',
        },
    ];
}
