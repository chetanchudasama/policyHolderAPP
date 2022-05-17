import CosmosAdminDbRecordBase from "@/models/cosmos-admin-base";
import CookieRecordSettings from "./settings/cookie-record-settings";
import ScriptTagSettings from "./settings/script-tag-settings";

export default class CookieRecord extends CosmosAdminDbRecordBase {
    public name: string = '';
    public description: string = '';
    public settings: CookieRecordSettings[] = [];
    public scripts: ScriptTagSettings = new ScriptTagSettings();
    public isDefault: boolean = false;
}
