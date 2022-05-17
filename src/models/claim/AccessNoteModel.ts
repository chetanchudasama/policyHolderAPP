import CosmosJobsDbRecordBase from '@/models/CosmosJobsDbRecordBase';

export default class AccessNoteModel extends CosmosJobsDbRecordBase {
    public questionText: string;
    public answer: string | null;

    public constructor() {
        super();
        this.answer = null;
    }
}
