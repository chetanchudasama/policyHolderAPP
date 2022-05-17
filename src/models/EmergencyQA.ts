import { AnswerType, OperatorType } from '@/common/enums';

export default class EmergencyQA {
    public id: string;
    public forEmergencyTypeId: number | null;
    public forEmergencyDetailId: number | null;
    public policyQuestionId: number;
    public questionId: number;
    public questionText: string;
    public orderBy: number;
    public answer: string;
    public answerType: AnswerType;
    public additionalValues: string | null;
    public unit: string | null;
    public mandatory: boolean;
    public forCommentOperatorId: OperatorType | null;
    public forCommentComparisonValue: string | null;
    public commentLabel: string | null;
    public comment: string | null;

    public constructor() {
        // set defaults
        this.forEmergencyTypeId = null;
        this.forEmergencyDetailId = null;
        this.additionalValues = null;
        this.orderBy = 0;
        this.answerType = AnswerType.Text;
        this.mandatory = false;
    }
}
