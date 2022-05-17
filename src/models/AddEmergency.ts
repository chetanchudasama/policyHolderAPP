import EmergencyDetailModel from '@/models/EmergencyDetailModel';
import { Moment } from "moment";

export default class AddEmergency {
    public emergencyTypeId: number;
    public emergencyTypeDesc: string;
    public emergencyDetailId: number;
    public emergencyDetailDesc: string;
    public emergencyDetail: EmergencyDetailModel; // should be deleted while submit
    public fileURL: string | null;
    public tradeId: number | null;
    public firstNoticedAt: Moment | null;

    public constructor() {
        this.firstNoticedAt = null;
    }
}
