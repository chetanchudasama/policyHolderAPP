import EmergencyDetailModel from '@/models/EmergencyDetailModel';

export default class EmergencyModel {
    public id: number;
    public emergencyId: number;
    public description: string;
    public orderBy: number;
    public emergencyDetails: EmergencyDetailModel[] | null;
    public isLocal: boolean;
    public fileURL: string | null;
    public file: string | null;
}

