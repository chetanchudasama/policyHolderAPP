import { Settings } from '@/models/client/PortalSettings';

export type AppMode = 'edit' | 'live';
// models the values from environment.json
export class Environment {
    [key: string]: any;
    public EditHostUri: string;
    public PolicyHolderApiBaseUrl: string;
    public LocateFindApi: string;
    public LocateRetrieveApi: string;
    public LogoSize: number;
    public DateTimeFormat: string;
    public DateFormat: string;
    public PolicyHolderAppBaseLogoUrl: string;
    public GoogleMapsJavascriptAPIKey: string;
    public GoogleCaptchaVerificationSiteKey: string;
    public GoogleAnalyticsKey: string;
    public Settings: Settings = new Settings();
    public AppMode: AppMode;

    public constructor(appMode: AppMode) {
        this.EditHostUri = "";
        this.PolicyHolderApiBaseUrl = "";
        this.LocateFindApi = "https://api.addressy.com/Capture/Interactive/Find/v1.00/json3.ws";
        this.LocateRetrieveApi = "https://api.addressy.com/Capture/Interactive/Retrieve/v1.00/json3.ws";
        this.LogoSize = 5120;
        this.DateTimeFormat = "DD/MM/YYYY HH:mm";
        this.DateFormat = "DD/MM/YYYY";
        this.PolicyHolderAppBaseLogoUrl = "";
        this.GoogleMapsJavascriptAPIKey = "";
        this.GoogleCaptchaVerificationSiteKey = "";
        this.GoogleAnalyticsKey = '';
        this.Settings = new Settings();
        this.AppMode = appMode;
    }
}
