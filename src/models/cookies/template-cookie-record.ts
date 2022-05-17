import ScriptTagSettings from "./settings/script-tag-settings";
import TemplateCookieSettings from "./settings/template-cookie-settings";

export default class TemplateCookieRecord {
    public cookieId: string = '';
    public settings: TemplateCookieSettings[] = [];
    public scripts: ScriptTagSettings[] = [];
}
