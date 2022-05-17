export default class TimeSlot {
    public slotId: number;
    public slot: string;
    public isDayTime: boolean;
    public startTime: Date;
    public endTime: Date;
    public availabilityOrder?: number;
}
