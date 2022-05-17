<template>
    <div rode="region" aria-label="Emergency question expansion panel content">
        <v-expansion-panel-content v-if="getPolicyWideQuestions.length > 0">
            <div slot="header" role="region" aria-label="Emergency Wide Questions">
                <img src="/img/emergency.svg" alt="" />
                <h5 class="title" v-bind:style="{ color: environment.Settings.PrimaryColor}">Emergency Wide Questions</h5>
                <v-spacer></v-spacer>
            </div>
            <div role="form" aria-label="Emergency Wide Questions">
            <v-container fluid class="pa-0">
                <v-layout  wrap class="pa-3" v-for="(emergenciesQA, index) in getPolicyWideQuestions" :key="index"  v-bind:style="{ background: environment.Settings.SecondaryColor }">
                    <v-flex xs12>
                        <h3>{{emergenciesQA.questionText}} {{emergenciesQA.unit ?  '(' + emergenciesQA.unit + ')': ''}}</h3>
                    </v-flex>
                    <v-flex xs12>
                        <v-text-field v-if="emergenciesQA.answerType === answerType.Text"
                            :ref="'answer' + emergenciesQA.orderBy"
                            :aria-label="`Enter answer for ${emergenciesQA.questionText} ${emergenciesQA.unit ?  '(' + emergenciesQA.unit + ')': ''}`"
                            v-model="emergenciesQA.answer"
                            :data-vv-name="'Question' + emergenciesQA.policyQuestionId"
                            :error-messages="validationMessage('Question' + emergenciesQA.policyQuestionId)"
                            v-validate ="{ rules: { required: emergenciesQA.mandatory } }"
                            placeholder="enter a value"
                            class="answer" />
                            <v-select v-else-if="emergenciesQA.answerType === answerType.Dropdown"
                            :ref="'answer' + emergenciesQA.orderBy"
                            :aria-label="`Select value for ${emergenciesQA.questionText} ${emergenciesQA.unit ?  '(' + emergenciesQA.unit + ')': ''}`"
                            v-model="emergenciesQA.answer"
                            :items="dropdownOptions(emergenciesQA.answerType, emergenciesQA.additionalValues)"
                            :data-vv-name="'Question' + emergenciesQA.policyQuestionId"
                            :error-messages="validationMessage('Question' + emergenciesQA.policyQuestionId, emergenciesQA.answer, emergenciesQA.mandatory)"
                            v-validate ="{ rules: { required: emergenciesQA.mandatory } }"
                            :placeholder="defaultSelectionOption"
                            class="answer" />
                            <v-text-field v-else-if="emergenciesQA.answerType === answerType.Number"
                            :ref="'answer' + emergenciesQA.orderBy"
                            :aria-label="`Enter answer for ${emergenciesQA.questionText} ${emergenciesQA.unit ?  '(' + emergenciesQA.unit + ')': ''}`"
                            v-model="emergenciesQA.answer"
                            :data-vv-name="'Question' + emergenciesQA.policyQuestionId"
                            :error-messages="validationMessage('Question' + emergenciesQA.policyQuestionId)"
                            v-validate ="{ rules: { required: emergenciesQA.mandatory,decimal: true } }"
                            placeholder="enter a value"
                            class="answer" />
                            <v-radio-group v-else-if="emergenciesQA.answerType === answerType.Checkbox"
                            :ref="'answer' + emergenciesQA.orderBy"
                            v-model="emergenciesQA.answer"
                            :data-vv-name="'Question' + emergenciesQA.policyQuestionId"
                            :error-messages="validationMessage('Question' + emergenciesQA.policyQuestionId, emergenciesQA.answer)"
                            v-validate ="{ rules: { required: emergenciesQA.mandatory } }"
                            class="answer">
                                <v-radio label="Yes" color="primary" value="Yes"/>
                                <v-radio label="No" color="primary" value="No"/>
                            </v-radio-group>
                            <div v-else>
                                Unsupported answer type, please contact support for assistance.
                            </div>
                            <div v-if="emergenciesQA.forCommentOperatorId">
                                <template v-if="validationForAdditionalInfoStatus(emergenciesQA)">
                                    <v-textarea
                                        v-model="emergenciesQA.comment"
                                        :label="!emergenciesQA.commentLabel ? 'Additional Information': emergenciesQA.commentLabel"
                                        :data-vv-name="'Comment'"
                                        :error-messages="errors.collect('Comment')"
                                        v-validate ="{ rules: { required: emergenciesQA.mandatory && (emergenciesQA.comment === '' || emergenciesQA.comment === null) } }"
                                        class="answer" />
                                </template>
                            </div>
                        </v-flex>
                    </v-layout>
                </v-container>
                </div>
        </v-expansion-panel-content>

        <v-expansion-panel-content v-for="(emergency, index) in getEmergencies" :key="index">
            <div slot="header" role="region" :aria-label="`${emergency.emergencyTypeDesc} Emergency Questions`">
                <img :src="emergency.fileURL" v-if="emergency.fileURL !== null && emergency.fileURL !== ''" alt=""/>
                <img src="/img/emergency.svg" alt="" v-else />
                <h5 class="title " v-bind:style="{ color: environment.Settings.PrimaryColor}"> {{emergency.emergencyTypeDesc}} <span class="grey--text sub-text">({{emergency.emergencyDetailDesc}})</span></h5>
                <v-spacer></v-spacer>
                <!-- <v-btn icon flat class="remove-emegency md-icon" v-if="getEmergencies.length > 1 && !getTrackingId" @click="deleteEmergency(emergency)"><v-icon v-bind:style="{ color: environment.Settings.ComplementaryColor}">delete </v-icon></v-btn> -->
                <v-btn icon flat class="remove-emegency md-icon" v-if="!showDeleteEmergencyIcon ? false : getEmergencies.length > 1" @click="deleteEmergency(emergency)" :label="`Remove ${emergency.emergencyTypeDesc} emergency`" :aria-label="`Remove ${emergency.emergencyTypeDesc} emergency`"><v-icon v-bind:style="{ color: environment.Settings.ComplementaryColor}">delete </v-icon></v-btn>
            </div>
            <div role="form" :aria-label="`${emergency.emergencyTypeDesc} Emergency Question form`">
            <v-container fluid class="pa-0">
                <v-layout  wrap v-bind:style="{ background: environment.Settings.SecondaryColor }">
                    <v-flex xs12 class="text-center grey--text text--lighten-1" v-if="getEmergencyQAs(emergency).length === 0 && !getHealthAndSafetyQAs(emergency)" :key="index">
                        <p class="pa-2">
                            <h3>No questions found.</h3>
                        </p>
                    </v-flex>
                    <v-flex xs12 class="pa-3" v-for="(emergenciesQA, index) in getEmergencyQAs(emergency)" :key="index" v-else>
                        <v-layout wrap>
                                <v-flex xs12>
                                    <h3>{{emergenciesQA.questionText}} {{emergenciesQA.unit ?  '(' + emergenciesQA.unit + ')': ''}}</h3>
                                </v-flex>
                            <v-flex xs12>
                            <v-text-field v-if="emergenciesQA.answerType === answerType.Text"
                            :ref="'answer' + emergenciesQA.orderBy"
                            :aria-label="`Enter answer for ${emergenciesQA.questionText} ${emergenciesQA.unit ?  '(' + emergenciesQA.unit + ')': ''}`"
                            v-model="emergenciesQA.answer"
                            :data-vv-name="'Question' + emergenciesQA.policyQuestionId"
                            :error-messages="validationMessage('Question' + emergenciesQA.policyQuestionId)"
                            v-validate ="{ rules: { required: emergenciesQA.mandatory } }"
                            placeholder="enter a value"
                            class="answer"
                            :disabled="emergenciesQA.disabled"/>
                            <v-select v-else-if="emergenciesQA.answerType === answerType.Dropdown"
                            :aria-label="`Select value for ${emergenciesQA.questionText} ${emergenciesQA.unit ?  '(' + emergenciesQA.unit + ')': ''}`"
                            :ref="'answer' + emergenciesQA.orderBy"
                            v-model="emergenciesQA.answer"
                            :items="dropdownOptions(emergenciesQA.answerType, emergenciesQA.additionalValues)"
                            :data-vv-name="'Question' + emergenciesQA.policyQuestionId"
                            :error-messages="validationMessage('Question' + emergenciesQA.policyQuestionId, emergenciesQA.answer, emergenciesQA.mandatory)"
                            v-validate ="{ rules: { required: emergenciesQA.mandatory } }"
                            :placeholder="defaultSelectionOption"
                            class="answer"
                            :disabled="emergenciesQA.disabled"/>
                            <v-text-field v-else-if="emergenciesQA.answerType === answerType.Number"
                            :ref="'answer' + emergenciesQA.orderBy"
                            :aria-label="`Enter answer for ${emergenciesQA.questionText} ${emergenciesQA.unit ?  '(' + emergenciesQA.unit + ')': ''}`"
                            v-model="emergenciesQA.answer"
                            :data-vv-name="'Question' + emergenciesQA.policyQuestionId"
                            :error-messages="validationMessage('Question' + emergenciesQA.policyQuestionId)"
                            v-validate ="{ rules: { required: emergenciesQA.mandatory } }"
                            placeholder="enter a value"
                            class="answer"
                            :disabled="emergenciesQA.disabled"/>
                            <v-radio-group v-else-if="emergenciesQA.answerType === answerType.Checkbox"
                            :ref="'answer' + emergenciesQA.orderBy"
                            v-model="emergenciesQA.answer"
                            :data-vv-name="'Question' + emergenciesQA.policyQuestionId"
                            :error-messages="validationMessage('Question' + emergenciesQA.policyQuestionId, emergenciesQA.answer)"
                            v-validate ="{ rules: { required: emergenciesQA.mandatory } }"
                            class="answer">
                                <v-radio label="Yes" color="primary" value="Yes" :disabled="emergenciesQA.disabled"/>
                                <v-radio label="No" color="primary" value="No" :disabled="emergenciesQA.disabled"/>
                            </v-radio-group>
                            <div v-else>
                                Unsupported answer type, please contact support for assistance.
                            </div>
                            <div v-if="emergenciesQA.forCommentOperatorId">
                                <template v-if="validationForAdditionalInfoStatus(emergenciesQA)">
                                    <v-textarea
                                        v-model="emergenciesQA.comment"
                                        :label="!emergenciesQA.commentLabel ? 'Additional Information': emergenciesQA.commentLabel"
                                        :data-vv-name="'Comment'"
                                        :error-messages="errors.collect('Comment')"
                                        v-validate ="{ rules: { required: emergenciesQA.mandatory && (emergenciesQA.comment === '' || emergenciesQA.comment === null) } }"
                                        class="answer"
                                        :disabled="emergenciesQA.disabled"/>
                                </template>
                            </div>
                        </v-flex>
                        </v-layout>
                    </v-flex>
                    <v-flex xs12 pa-3>
                    <!-- bind health and safety questions -->
                    <HealthSafetyAndVulnerabilityQA v-if="getHealthAndSafetyQAs(emergency)" ref="healthAndSafetyQA" :questionAnswer="getHealthAndSafetyQAs(emergency)" :isDisabled="getHealthAndSafetyQAs(emergency).disabled"></HealthSafetyAndVulnerabilityQA>
                    </v-flex>
                </v-layout>
            </v-container>
            </div>
        </v-expansion-panel-content>

        <v-expansion-panel-content v-if="getVulnerabilityQuestion !== null">
            <div slot="header" role="region" aria-label="Vulnerability question">
                <img src="/img/vulnerability.svg" alt="" />
                <h5 class="title" v-bind:style="{ color: environment.Settings.PrimaryColor}">Vulnerability Question</h5>
                <v-spacer></v-spacer>
            </div>

            <v-container fluid class="pa-0">
                <v-layout  wrap class="pa-3"  v-bind:style="{ background: environment.Settings.SecondaryColor }">
                    <v-flex xs12>
                         <HealthSafetyAndVulnerabilityQA ref="refVulnerabilityQA" :questionAnswer="getVulnerabilityQuestion"></HealthSafetyAndVulnerabilityQA>
                    </v-flex>
                </v-layout>
            </v-container>
        </v-expansion-panel-content>

        <v-expansion-panel-content v-if="getAccessNoteQuestion !== null">
            <div slot="header" role="region" aria-label="Access note question">
                <img src="/img/accessNote.svg" alt="" />
                <h5 class="title" v-bind:style="{ color: environment.Settings.PrimaryColor}">Property Access Question</h5>
                <v-spacer></v-spacer>
            </div>
            <div role="form" aria-label="Access note question form">
            <v-container fluid class="pa-0">
                <v-layout  wrap class="pa-3"  v-bind:style="{ background: environment.Settings.SecondaryColor }">
                    <v-flex xs12>
                        <h3> {{getAccessNoteQuestion.questionText}} </h3>
                    </v-flex>
                    <v-flex xs12>
                         <v-textarea label="Details" v-model="getAccessNoteQuestion.answer"></v-textarea>
                    </v-flex>
                </v-layout>
            </v-container>
            </div>
        </v-expansion-panel-content>
    </div>
</template>

<style scoped>

</style>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import store from '@/store';
import { Environment } from '@/common/environment';
import EmergencyQA from '@/models/EmergencyQA';
import { AnswerType, OperatorType } from '@/common/enums';
import AddEmergency from '@/models/AddEmergency';
import storeGetters from '@/storeGetters';
import HealthAndSafetyQAModel from '@/models/claim/HealthAndSafetyQAModel';
import VulnerabilityQAModel from '@/models/claim/VulnerabilityQAModel';
import AccessNoteModel from '@/models/claim/AccessNoteModel';
import HealthSafetyAndVulnerabilityQA from "@/components/HealthSafetyAndVulnerabilityQA.vue";

@Component({
  components: {
    HealthSafetyAndVulnerabilityQA,
  },
})
export default class EmergencyQuestionGenerator extends Vue {
    @Prop() private emergenciesQAs: EmergencyQA[];
    @Prop() private emergencies: AddEmergency[];
    @Prop() private healthAndSafetyQAs: HealthAndSafetyQAModel[];
    @Prop() private vulnerabilityQA: VulnerabilityQAModel | null;
    @Prop() private accessNoteQA: AccessNoteModel | null;
    @Prop() private acceptedEmergencies: number[];
    @Prop() private showDeleteEmergencyIcon: boolean;
    private radios: boolean = false;
    private answerType = AnswerType;
    private defaultSelectionOption = "Select an Option";

    public dropdownOptions(answerType: AnswerType, additionalValues: string | null): string[] {
        if (answerType === AnswerType.Dropdown && additionalValues) {
            const items = additionalValues.split('\n');
            if (items && items.length > 0) {
                for (let i = 0, l = items.length; i < l; i++) {
                    items[i] = items[i].trim();
                }
                items.unshift(this.defaultSelectionOption);
                return items;
            }
        }
        return [];
    }

    private get getPolicyWideQuestions() {
        return this.getEmergenciesQAs.filter((e) => {
            if (e.forEmergencyTypeId === null && e.forEmergencyDetailId === null) {
                if (e.answerType === this.answerType.Dropdown && e.answer == null) {
                    e.answer = this.defaultSelectionOption;
                }
                return e;
            }
        });
    }

    private get environment(): Environment {
        return storeGetters.getEnvironment();
    }

    private get getEmergenciesQAs(): EmergencyQA[] {
        return this.emergenciesQAs;
    }

    private getEmergencyQAs(emergency: AddEmergency) {
        const emergencyQAs = this.getEmergenciesQAs.filter((e) => e.forEmergencyTypeId === emergency.emergencyTypeId || e.forEmergencyDetailId === emergency.emergencyDetailId);
        // question mode - if emergency is accepted, disable answers
        if (this.acceptedEmergencies.length > 0) {
            emergencyQAs.forEach((question) => {
                const isAcceptedEmergency = this.acceptedEmergencies.find((i) => i === question.forEmergencyTypeId);
                (question as any).disabled = isAcceptedEmergency ? true : false;
            });
        }
        return emergencyQAs.map((qa) => {
            if (qa.answerType === this.answerType.Dropdown && qa.answer == null) {
                qa.answer = this.defaultSelectionOption;
            }
            return qa;
        });
    }

    private getHealthAndSafetyQAs(emergency: AddEmergency) {
        const healthAndSafetyQAs = this.healthAndSafetyQAs.find((e) => e.forEmergencyTypeId === emergency.emergencyTypeId || e.forEmergencyDetailId === emergency.emergencyDetailId);
        // question mode - if emergency is accepted, disable answers
        if (healthAndSafetyQAs) {
            (healthAndSafetyQAs as any).disabled = this.acceptedEmergencies.length > 0 ? this.acceptedEmergencies.findIndex((i) => i === healthAndSafetyQAs.forEmergencyTypeId) !== -1 ? true : false : false;
        }
        return healthAndSafetyQAs;
    }

    private get getHealthAndSafetyQAsToSave(): HealthAndSafetyQAModel[] {
        const item: any = this.$refs.healthAndSafetyQA;
        const healthAndSafetyQAsList: HealthAndSafetyQAModel[] = [];
        item.forEach((element: any) => {
            healthAndSafetyQAsList.push(element.localQA);
        });
        return healthAndSafetyQAsList;
    }

    private get getVulnerabilityQAToSave() {
        const item: any = this.$refs.refVulnerabilityQA;
        return item.localQA;
    }

    private get getVulnerabilityQuestion(): VulnerabilityQAModel | null {
        return this.vulnerabilityQA;
    }

    private get getAccessNoteQuestion(): AccessNoteModel | null {
        return this.accessNoteQA;
    }

    private get getEmergencies(): AddEmergency[] {
        return this.emergencies;
    }

    private deleteEmergency(emergency: AddEmergency) {
      this.$emit('deleteEmergencyQA', emergency);
    }

    private validationForAdditionalInfoStatus(emergencyQA: EmergencyQA): boolean {
        // validate based on comparison method and mandatory flag
        switch (emergencyQA.answerType) {
            case AnswerType.Text:
                return this.validateDropDownAndTextBox(emergencyQA);
            case AnswerType.Dropdown:
                return this.validateDropDownAndTextBox(emergencyQA);
            case AnswerType.Number:
                return this.validateNumber(emergencyQA);
            case AnswerType.Checkbox:
                return this.validateBoolean(emergencyQA);
            default:
                // unexpected type, dont know how to validate
                return false;
        }
    }


    private validateDropDownAndTextBox(emergencyQA: EmergencyQA): boolean {
        let comparingValue: string = "";
        if (emergencyQA.forCommentComparisonValue) {
            comparingValue = emergencyQA.forCommentComparisonValue.trim();
        }
        let res: boolean;
        switch (emergencyQA.forCommentOperatorId) {
            case null:
                res = true;
                break;
            case OperatorType.EqualTo:
                res = emergencyQA.answer ? emergencyQA.answer.trim() === comparingValue : false;
                break;
            case OperatorType.NotEqualTo:
                res = emergencyQA.answer ? emergencyQA.answer.trim() !== comparingValue : false;
                break;
            case OperatorType.In:
                const items = comparingValue ?  comparingValue.split(',') : null;
                let validResult: boolean = false;
                if (items) {
                    items.forEach((item) => {
                        if (emergencyQA.answer) {
                            if (emergencyQA.answer.trim()  === item.trim()) {
                                validResult = true;
                            }
                        }
                    });
                }
                res = validResult;
                break;
            default:
                // bad choice for dropdown
                return false;
        }
        if (res) {
            return true;
        } else {
            return false;
        }
    }


    private validateNumber(emergencyQA: EmergencyQA): boolean {
        let num: number;
        let cNum: number = 0;
        const cNums: number[] = [];

        num = parseFloat(emergencyQA.answer);
        if (emergencyQA.forCommentOperatorId === OperatorType.In && emergencyQA.forCommentComparisonValue) {
            emergencyQA.forCommentComparisonValue.split(',').forEach((ans) => {
                cNums.push(parseFloat(ans.trim()));
            });
        } else {
            cNum = emergencyQA.forCommentComparisonValue ? parseFloat(emergencyQA.forCommentComparisonValue) : 0;
        }

        let res: boolean;
        switch (emergencyQA.forCommentOperatorId) {
            case null:
                res = true;
                break;
            case OperatorType.GreaterThan:
                res = num > cNum;
                break;
            case OperatorType.LessThan:
                res = num < cNum;
                break;
            case OperatorType.GreaterThanOrEqualTo:
                res = num >= cNum;
                break;
            case OperatorType.LessThanOrEqualTo:
                res = num <= cNum;
                break;
            case OperatorType.EqualTo:
                res = num === cNum;
                break;
            case OperatorType.NotEqualTo:
                res = num !== cNum;
                break;
            case OperatorType.In:
                res = cNums.indexOf(num) > -1;
                break;
            default:
                // unexpected conparision type for number
                return false;
        }
        if (res) {
            return true;
        } else {
            return false;
        }
    }

    private validateBoolean(emergencyQA: EmergencyQA) {
        // note: comparision value should be either 'true' or 'false';
        let res: boolean;
        switch (emergencyQA.forCommentOperatorId) {
            case null:
                res = true;
                break;
            case OperatorType.EqualTo:
                res = emergencyQA.answer === emergencyQA.forCommentComparisonValue;
                break;
            case OperatorType.NotEqualTo:
                res = emergencyQA.answer !== emergencyQA.forCommentComparisonValue;
                break;
            default:
                return false;
        }
        if (res) {
            return true;
        } else {
            return false;
        }
    }

    private validationMessage(label: string, answer?: string, isRequired?: boolean) {
        let message: string = this.$validator.errors.collect(label)[0] ? this.$validator.errors.collect(label)[0].msg : '';
        if (isRequired && answer === this.defaultSelectionOption) {
            return "An answer to this question is mandatory.";
        }
        if (answer) {
            message = "";
        }
        const errorMessage = label.split(/(\d+)/);
        if (message) {
            if (message.includes('decimal')) {
                message = "An answer must be numeric and may contain decimal points.";
            } else {
                message = "An answer to this question is mandatory.";
            }
        }
        return message;
    }

    private get getTrackingId() {
        return storeGetters.getTrackingId();
    }
}
</script>

