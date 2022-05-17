import KeyValuePair from "../../key-value-pair";
export default class ScriptTagSettings {
    public source: string = '';
    public attributes: Array<KeyValuePair<string, string>> = [];
    public body: string = '';
}


