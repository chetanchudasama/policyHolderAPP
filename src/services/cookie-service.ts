import CookieBannerSettings from "@/models/cookies/settings/cookie-banner-settings";
import CookieSelectionOptions from "@/models/cookies/settings/cookie-selection-options";
import DefaultCookieSettings from "@/models/cookies/settings/default-cookie-settings";
import TemplateCookieSettings from "@/models/cookies/settings/template-cookie-settings";
import storeGetters from "@/storeGetters";

class CookieService {
    private static serviceInstance: CookieService;

    public static get instance() {
      return this.serviceInstance || (this.serviceInstance = new this());
    }

    public setCookie(cookieName: string, cookieValue: any): void {
        const d = new Date();
        d.setTime(d.getTime() + (365 * 24 * 60 * 60 * 1000));
        const expires = "expires=" + d.toUTCString();
        document.cookie = cookieName + "=" + cookieValue + ";" + expires + ";path=/";
    }

    public retrieveDefaultSettings(): DefaultCookieSettings {
      const defaultCookiesettings: DefaultCookieSettings = new DefaultCookieSettings();
      const templateCookieRecord = storeGetters.getEnvironment().Settings.TemplateCookieRecord;

      if (!templateCookieRecord.cookieId.length) { return defaultCookiesettings; }
      Object.keys( defaultCookiesettings.cookieBanner ).forEach((key) => {
        const setting = templateCookieRecord.settings.filter((x) => x.id === key)[0];
        if (setting) {
          defaultCookiesettings.cookieBanner[key as keyof CookieBannerSettings] = setting.value;
        }
      });

      defaultCookiesettings.cookieOptions = this.mapCookieOptions(templateCookieRecord.settings);

      return defaultCookiesettings;
    }

    private mapCookieOptions(templateSettings: TemplateCookieSettings[]): CookieSelectionOptions[] {
      const cookieOptions: CookieSelectionOptions[] = [];
      const key = 'Key';
      const cookieSettingIds = templateSettings.filter((x) => x.id.includes(key))
                                      .map((p) => p.id.split(key)[0]);

      cookieSettingIds.forEach((cookieSettingId) => {
        const cookieOption = new CookieSelectionOptions();
        const cookieLabel = templateSettings.filter((x) => x.id === `${cookieSettingId}Label`)[0];
        const cookieTooltipText = templateSettings.filter((x) => x.id === `${cookieSettingId}TooltipText`)[0];
        const cookieKey = templateSettings.filter((x) => x.id === `${cookieSettingId}Key`)[0];

        if (cookieLabel) {
          cookieOption.label = cookieLabel.value;
        }

        if (cookieTooltipText) {
          cookieOption.tooltipText = cookieTooltipText.value;
        }

        if (cookieKey) {
          cookieOption.key = cookieKey.value;
        }

        cookieOptions.push(cookieOption);
      });

      return cookieOptions;
    }
  }

  // export an instance in the global namespace
  export const cookieService = CookieService.instance;
