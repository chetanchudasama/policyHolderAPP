import { Moment } from "moment";

export default class CosmosAdminDbRecordBase {
    public id: string; // unique id
    public type: string;
    public createdAt: Moment;
}
