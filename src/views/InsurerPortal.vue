<template>
  <div class="portal-template" v-bind:style="{ backgroundColor: environment.Settings.PrimaryColor}">
    <header role="banner" aria-label="header">
      <v-container class="fluid pa-0">
        <template>
          <v-toolbar fixed class="white">
            <v-toolbar-title>
              <img
                :src="environment.Settings.LogoURL ? environment.Settings.LogoURL : environment.PolicyHolderAppBaseLogoUrl"
                class="img-responsive logo-img"
                :alt="(environment.Settings.DisplayName ? environment.Settings.DisplayName : 'Policy') + ' - Logo'"
              >
            </v-toolbar-title>
            <v-spacer></v-spacer>
          </v-toolbar>
        </template>
      </v-container>
    </header>
    <div class="content-section pa-4" role="main" aria-label="main content">
      <div class="details-content elevation-1">
        <template v-if="!isQuestionModeLinkNotValid">
          <div class="template-tab" >
            <div class="mid-content" v-show="ready">
              <div>
                <div>
                  <v-tabs v-model="active" color="white" slider-color="primary">
                    <v-tabs-items :touchless="true">
                      <!--Start T-->
                      <v-tab>Select</v-tab>
                      <v-tab-item>
                        <v-card flat>
                          <v-card-text class="emergency-selection">
                            <EditableHeader
                              :appInEditMode="appInEditMode"
                              :heading.sync="environment.Settings.HeadingStep1"
                              :description.sync="environment.Settings.DescriptionStep1"
                              :primaryColor="environment.Settings.PrimaryColor"
                              :complementaryColor="environment.Settings.ComplementaryColor"
                            />
                            <EmergencySelection
                              v-if="selectedEmergencies.length > 0"
                              :selectedEmergencies="selectedEmergencies"
                              :emergencies.sync="getEmergenciesWithDetail"
                              :emergencyTypes="emergencyTypes"
                              ref="emergencySelectionRef"
                              v-on:EmergencySelected="onEmergencySelection"
                              :isNextButtonClicked="isNextButtonClicked"
                            ></EmergencySelection>
                          </v-card-text>
                        </v-card>
                      </v-tab-item>

                      <v-tab>Detail</v-tab>
                      <v-tab-item>
                        <v-card flat>
                          <v-card-text>
                            <EditableHeader
                              :appInEditMode="appInEditMode"
                              :heading.sync="environment.Settings.HeadingStep2"
                              :description.sync="environment.Settings.DescriptionStep2"
                              :primaryColor="environment.Settings.PrimaryColor"
                              :complementaryColor="environment.Settings.ComplementaryColor"
                            />
                            <ClientDetail :insurerPortal="insurerPortal" ref="clientDetailRef"></ClientDetail>
                            <!-- Google Captcha Start-->
                             <section role="region" aria-label="Google captcha verification">
                            <div class="px-2 pb-4" v-show="showVerificationInputs">
                              <h2
                                class="title"
                                v-bind:style="{ color: environment.Settings.PrimaryColor}"
                              >Verify yourself</h2>
                              <div
                                v-bind:style="{ background: environment.Settings.SecondaryColor }"
                                class="mt-2 pa-2"
                              >
                                <div>
                                  <v-layout>
                                    <v-flex class="text-xs-center">
                                      <div
                                        id="google-recaptcha-v2"
                                        v-bind:style="validateCaptcha ? { border: '1px solid' + environment.Settings.ErrorColor } : ''"
                                        :class="validateCaptcha ? 'validate-captcha' : ''"
                                      ></div>
                                      <div
                                        v-if="validateCaptcha"
                                        class="mt-2 text-xs-left"
                                        v-bind:style="{ color: environment.Settings.ComplementaryColor }"
                                      >{{captchaError ? captchaError : 'Please verify yourself as a human'}}</div>
                                    </v-flex>
                                  </v-layout>
                                </div>
                              </div>
                            </div>
                            </section>
                            <!-- Google Captcha End-->
                            <section role="region" aria-label="Terms and Conditions">
                            <div class="px-2" v-if="environment.Settings.PrivacyPolicyText">
                              <h2 class="title" v-bind:style="{ color: environment.Settings.PrimaryColor}">Terms & Conditions</h2>
                              <div v-bind:style="{ background: environment.Settings.SecondaryColor }" class="mt-2 pa-2">
                                <span v-bind:style="{ color: environment.Settings.ComplementaryColor}">Please read our terms and conditions carefully.</span>
                                <a href="Javascript:void(0)" @click="showPrivacyPolicyDetailsDialog" v-bind:style="{ color: environment.Settings.ComplementaryColor }">Terms & Conditions</a>
                                <v-checkbox class="terms-checkbox" label="By submitting your claim you agree to be contacted by email and phone." v-bind:style="setTermsAndServicesCheckboxStyle()" v-model="isTermsAndServicesAccepted"></v-checkbox>
                              </div>
                            </div>
                            </section>
                          </v-card-text>
                        </v-card>
                      </v-tab-item>

                      <v-tab value="tempalteTab3">Verification</v-tab>
                      <v-tab-item href="#tempalteTab3">
                        <v-card flat>
                          <v-card-text>
                            <EditableHeader
                              :appInEditMode="appInEditMode"
                              :heading.sync="environment.Settings.HeadingStep3"
                              :description.sync="environment.Settings.DescriptionStep3"
                              :primaryColor="environment.Settings.PrimaryColor"
                              :complementaryColor="environment.Settings.ComplementaryColor"
                            />
                            <CustomerVerification
                              :insurerPortal="insurerPortal"
                              ref="clientVerificationRef"
                              :showVerificationInputs="showVerificationInputs"
                              v-on:getVerificationCode="getVerificationCode"
                              :validateUserVerificationError="validateUserVerificationError"
                              :showResendButtonForVerification="showResendButtonForVerification"
                              :appInEditMode="appInEditMode"
                              v-if="active >= 2"
                            ></CustomerVerification>
                          </v-card-text>
                        </v-card>
                      </v-tab-item>

                      <v-tab value="tempalteTab4">Address</v-tab>
                      <v-tab-item href="#tempalteTab4">
                        <v-card flat>
                          <v-card-text>
                            <EditableHeader
                              :appInEditMode="appInEditMode"
                              :heading.sync="environment.Settings.HeadingStep4"
                              :description.sync="environment.Settings.DescriptionStep4"
                              :primaryColor="environment.Settings.PrimaryColor"
                              :complementaryColor="environment.Settings.ComplementaryColor"
                            />
                            <CustomerAddress
                              :insurerPortal="insurerPortal"
                              ref="clientAddressRef"
                              :allowToGetLoqateApiKey="!showVerificationInputs"
                              :appInEditMode="appInEditMode"
                            ></CustomerAddress>
                          </v-card-text>
                        </v-card>
                      </v-tab-item>

                      <v-tab value="tempalteTab5">Explain</v-tab>
                      <v-tab-item href="#tempalteTab5">
                        <v-card flat>
                          <v-card-text>
                            <EditableHeader
                              :appInEditMode="appInEditMode"
                              :heading.sync="environment.Settings.HeadingStep5"
                              :description.sync="environment.Settings.DescriptionStep5"
                              :primaryColor="environment.Settings.PrimaryColor"
                              :complementaryColor="environment.Settings.ComplementaryColor"
                            />
                            <section role="region" aria-label="Emergency question expansion panel">
                            <v-expansion-panel class="emergency-question-content" v-model="panel" focusable>
                              <EmergencyQuestionGenerator
                                ref="emergencyQuestionGenerator"
                                :emergenciesQAs="getEmergenciesQAs"
                                :emergencies="getEmergencies"
                                v-on:deleteEmergencyQA="onDeleteEmergencyQA"
                                :accessNoteQA="getAccessNoteQA"
                                :healthAndSafetyQAs="getHealthAndSafetyQAs"
                                :vulnerabilityQA="getVulnerabilityQA"
                                :acceptedEmergencies="acceptedEmergencies"
                                v-if="active === 4 || active === 5"
                                :showDeleteEmergencyIcon="jobId ? false : true"
                              ></EmergencyQuestionGenerator>
                            </v-expansion-panel>
                            </section>
                            <div class="pt-2" v-if="!emergencyQuestionIsValid">
                              <span class="pa-2 d-block lighten-4">
                                <a href="javascript:void(0)" class="error-class" v-bind:style="{ color: environment.Settings.ComplementaryColor}">Please provide answers of mandatory questions.</a>
                              </span>
                            </div>
                          </v-card-text>
                        </v-card>
                      </v-tab-item>

                      <v-tab value="tempalteTab6">Customer Availability</v-tab>
                      <v-tab-item href="#tempalteTab6">
                        <v-card flat>
                          <v-card-text>
                            <EditableHeader
                              :appInEditMode="appInEditMode"
                              :heading.sync="environment.Settings.HeadingStep6"
                              :description.sync="environment.Settings.DescriptionStep6"
                              :primaryColor="environment.Settings.PrimaryColor"
                              :complementaryColor="environment.Settings.ComplementaryColor"
                            />
                            <div>
                              <CustomerAvailabilityPreview
                                v-on:updateCustomerAvailability="updateCustomerAvailability"
                                ref="customerAvailabilities"
                              ></CustomerAvailabilityPreview>
                            </div>
                          </v-card-text>
                        </v-card>
                      </v-tab-item>

                      <v-tab value="tempalteTab7">Upload</v-tab>
                      <v-tab-item href="#tempalteTab7">
                        <v-card flat>
                          <v-card-text>
                            <EditableHeader
                              :appInEditMode="appInEditMode"
                              :heading.sync="environment.Settings.HeadingStep7"
                              :description.sync="environment.Settings.DescriptionStep7"
                              :primaryColor="environment.Settings.PrimaryColor"
                              :complementaryColor="environment.Settings.ComplementaryColor"
                            />
                            <PictureUpload
                              :imageListToUpload="imageListToUpload"
                              :isImageUploading.sync="isImageUploading"
                              ref="pictureUploadRef"
                            ></PictureUpload>
                          </v-card-text>
                        </v-card>
                      </v-tab-item>
                    </v-tabs-items>
                  </v-tabs>
                </div>
              </div>
            </div>
            <div v-show="!ready">
              <v-progress-circular
                class="loading-spinner"
                :width="2"
                :size="50"
                indeterminate
                color="primary"
              ></v-progress-circular>
            </div>
            <div class="text-right pr-3 pt-0 pa-2 white insureractions" role="contentinfo" aria-label="Stepper action button">
              <v-btn
                v-if="jobId ? active == 5 : active !== 0 && active !== 6"
                v-bind:style="{ color: environment.Settings.PrimaryColor}"
                flat
                @click="onPreviousButtonClick"
                dark
                label="Previous step"
                aria-label="Previous step"
              >
                <v-icon small>arrow_back_ios</v-icon>&nbsp; Previous
              </v-btn>
              <v-btn
                v-if="jobId ? (!showCustomerAvailabilityStep ? active == 4 : active == 5) : active === 5"
                class="white--text"
                v-bind:style="{ background: environment.Settings.PrimaryColor }"
                :disabled="isLoading || isImageUploading"
                :loading="isLoading || isImageUploading"
                @click="saveClaim"
                label="Submit"
                aria-label="Submit"
              >Submit</v-btn>
              <v-btn
                v-if="active === 6"
                class="white--text"
                v-bind:style="{ background: environment.Settings.PrimaryColor }"
                :disabled="isLoading || isImageUploading"
                :loading="isLoading || isImageUploading"
                @click="AddClaimPictures"
                label="Done"
                aria-label="Done"
              >Done</v-btn>
              <v-btn
                v-if="jobId ? (showCustomerAvailabilityStep ? active == 4 : active == 5) : active !== 5 && active !== 6"
                class="white--text"
                v-bind:style="{ background: environment.Settings.PrimaryColor}"
                :disabled="!ready || isLoading"
                :loading="isLoading"
                @click="onNextButtonClick"
                label="Next step"
                aria-label="Next step"
              >
                Next &nbsp;
                <v-icon small>arrow_forward_ios</v-icon>
              </v-btn>
            </div>
          </div>
        </template>
        <div v-else class="job-complete-notification px-5">
          <MessageCard message="Unknown or expired link!"></MessageCard>
        </div>
      </div>
    </div>
    <!--Cover Dailog meassge-->
    <v-dialog content-class="coverd-modal-dailog" v-model="claimCovered" max-width="600" persistent>
      <v-card>
        <v-card-text>
          <div class="coverd-icon text-center">
            <v-icon v-bind:style="{ color: environment.Settings.PrimaryColor }">check_circle</v-icon>
            <div class="display-1 mt-1">Thank you!</div>
          </div>
          <div class="desc text-center pa-2 mt-3">
            <p class="mb-0">
              A member of our team will be in touch with you shortly.
            </p>
            <v-btn
              v-bind:style="{ backgroundColor: environment.Settings.PrimaryColor }"
              dark
              @click.stop="trackClaim"
              label="Track my claim"
              aria-label="Track my claim"
            >Track my Claim</v-btn>
          </div>
        </v-card-text>
      </v-card>
    </v-dialog>
    <!--Not Cover Dailog meassge-->
    <v-dialog
      content-class="coverd-modal-dailog"
      v-model="claimNotCovered"
      max-width="600"
      persistent
    >
      <v-card>
        <v-card-text>
          <div class="coverd-icon text-center">
            <v-icon
              v-bind:style="{ color: environment.Settings.PrimaryColor }"
            >done</v-icon>
            <div
              class="display-1 mt-1"
              v-bind:style="{ color: environment.Settings.ComplementaryColor }"
            >Thank You!</div>
          </div>
          <div class="desc text-center pa-2 mt-3">
            <p
              class="mb-0"
            >Thanks for contacting us, a member of the team will be in touch.</p>
            <v-btn
              v-bind:style="{ backgroundColor: environment.Settings.PrimaryColor }"
              dark
              @click.stop="trackClaim"
              label="Track my claim"
              aria-label="Track my claim"
            >Track my Claim</v-btn>
          </div>
        </v-card-text>
      </v-card>
    </v-dialog>

    <!--Terms And Conditions Dailog meassge-->
    <v-dialog content-class="coverd-modal-dailog" v-model="showPrivacyPolicyDetails" max-width="900" persistent scrollable>
      <v-card>
        <v-toolbar card dark v-bind:style="{ backgroundColor: environment.Settings.PrimaryColor }">
          <v-toolbar-title>Privacy Policy</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon @click.native="showPrivacyPolicyDetails = false" label="Close privacy policy detail dialog" aria-label="Close privacy policy detail dialog">
            <v-icon>close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-text>
          <span class="privacy-policy" v-html="environment.Settings.PrivacyPolicyText"></span>
        </v-card-text>
        <v-divider/>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn v-bind:style="{ color: environment.Settings.PrimaryColor}" flat="flat" @click.native="showPrivacyPolicyDetails = false" label="Close privacy policy detail dialog" aria-label="Close privacy policy detail dialog">Close</v-btn>
          <v-btn v-bind:style="{ backgroundColor: environment.Settings.PrimaryColor }" class="mr-0 white--text" @click="termsAndServicesAccepted" label="Mark Terms and services as accepted" aria-label="Mark Terms and services as accepted">I Agree</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<style>
#google-recaptcha-v2 .rc-anchor-error-msg-container {
  top: 8px;
  width: 270px;
}
@media screen and (max-width: 359px) {
  #google-recaptcha-v2,
  .g-recaptcha {
    transform: scale(0.77);
    -webkit-transform: scale(0.77);
    transform-origin: 0 0;
    -webkit-transform-origin: 0 0;
  }
}
</style>

<style scoped>
.toolbar {
  z-index: 9;
}
.portal-template {
  height: 100%;
  min-width: 100%;
}
.template-tab .mid-content {
  overflow-y: auto;
  height: calc(100% - 64px);
}
.portal-template >>> .v-toolbar__title {
  max-width: 230px;
}
.logo-img {
  height: 42px;
  object-fit: contain;
}
.template-tab >>> .v-tabs__wrapper {
  display: none;
}
.template-tab >>> .v-tabs__div{ display: none;}
.template-tab > .v-tabs__items {
  width: 100%;
}
.display-1 {
  font-size: 24px !important;
  line-height: 28px !important;
}
.step-heading {
  border-left: 3px solid #000;
  padding-left: 30px;
}
.emergency-question-content >>> .v-expansion-panel__header {
  padding: 12px 12px;
}
.emergency-question-content >>> .v-expansion-panel__header > div {
  position: relative;
  padding-left: 40px;
}
.emergency-question-content >>> .v-expansion-panel__header img {
  position: absolute;
  max-width: 24px;
  max-height: 24px;
  left: 0px;
  top: -2px;
}
.emergency-question-content >>> .v-expansion-panel__header .remove-emegency {
  position: absolute;
  right: -40px;
  top: -10px;
  margin: 0px;
  z-index: 2;
}
.emergency-question-content >>> h5.title {
  font-size: 16px !important;
}
.emergency-question-content >>> .sub-text {
  font-size: 14px;
}
.emergency-question-content >>> .md-icon .v-icon {
  font-size: 19px;
}
.mid-content >>> .emergency-question-content > div {
  width: 100%;
}
.coverd-icon .v-icon {
  font-size: 100px;
}
.show-logo-img img {
  max-width: 200px;
}
.coverd-modal-dailog .desc {
  font-size: 18px;
}
.coverd-modal-dailog .desc p {
  line-height: 1.5;
}
pre {
  font-family: inherit;
  white-space: pre-line;
}
.content-section {
  padding-top: 90px !important;
  padding-bottom: 24px !important;
}
.content-section .details-content {
  max-width: 500px;
  margin: auto;
  background-color: #fff;
}
.content-section,
.content-section .details-content,
.template-tab,
.mid-content .v-tabs {
  height: 100%;
}
.template-tab {
  height:100%;
}
.insureractions {
  position: fixed;
  left: 0;
  right: 0;
  max-width: 500px;
  margin: auto;
  z-index: 2;
  bottom: 24px;
  border-top: 1px solid #e2e2e2 !important;
}
.insureractions >>> .v-btn .v-btn__content {
  padding: 0px 6px !important;
  font-size: 12px;
}
.validate-captcha {
  width: 304px;
}
.red-border-checkbox >>> .v-icon, .red-border-checkbox >>> .v-label {color: rgb(255, 86, 86);}
.error-class {
  text-decoration: none;
  font-weight: bold;
  cursor: none;
  pointer-events: none;
  color: #ff5252 !important;
}
.terms-checkbox >>> .v-label {
  font-size: 14px;
  font-family: inherit;
}
@media (max-width: 768px) {
  .v-container {
    padding: 0px !important;
  }
}
@media (max-width: 548px) {
  .insureractions {
    left: 24px;
    right: 24px;
  }
}
@media (max-width: 420px) {
  .content-section {
    padding: 10px !important;
    padding-top: 70px !important;
  }
  .step-heading {
    padding-left: 25px;
  }
  header .v-toolbar__title {
    max-width: 180px !important;
  }
  .v-expansion-panel__body .v-card__text.pa-3 {
    padding: 8px !important;
  }
  .emergency-question-content .v-expansion-panel__header > div {
    padding-left: 30px;
  }
  .remove-emegency .v-icon {
    font-size: 17px !important;
  }
  .insureractions {
    bottom: 10px !important;
    left: 10px !important;
    right: 10px !important;
  }
}
.insuer-portal {
  height: 100%;
}
.loading-spinner {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%);
  -webkit-transform: translate(-50%);
  -ms-transform: translate(-50%);
  -moz-transform: translate(-50%);
}
@-moz-document url-prefix() {
  .emergency-selection {box-sizing: border-box;}
}
</style>

<script lang="ts">
import { Component, Vue, Prop, Watch } from "vue-property-decorator";
import EmergencyModel from "@/models/EmergencyModel";
import EmergencyDetailModel from "@/models/EmergencyDetailModel";
import storeGetters from "@/storeGetters";
import { Environment } from "@/common/environment";
import store from "@/store";
import PolicyHolderController from "@/api/policyHolderController";
import InsurerPortalModel from "@/models/InsurerPortalModel";
import Shared from "@/common/shared";
import {
  ContactPreference as ContactPreferenceEnum,
  ResponseType,
  ReCaptchaErrorType,
} from "@/common/enums";
import AddEmergency from "@/models/AddEmergency";
import EmergencyQA from "@/models/EmergencyQA";
import EmergencyQuestionGenerator from "@/components/EmergencyQuestionGenerator.vue";
import { ContactPreference } from "@/models/types";
import JobController from "@/api/jobController";
import SearchEmergencyQuestionModel from "@/models/SearchEmergencyQuestionModel";
import ReturnEmergencyQuestionDataModel from "@/models/ReturnEmergencyQuestionDataModel";
import EmergencySelection from "@/components/EmergencySelection.vue";
import ClientDetail from "@/components/ClientDetail.vue";
import PictureUpload from "@/components/PictureUpload.vue";
import PictureUploadModel from "@/models/PictureUploadModel";
import CustomerAvailabilityPreview from "@/components/CustomerAvailabilityPreview.vue";
import TimeSlot from "@/models/claim/TimeSlot";
import CustomerAvailabilityModel from "@/models/claim/CustomerAvailabilityModel";
import { PhoneNumber } from "google-libphonenumber";
import storeMutations from "@/storeMutations";
import DateTimePicker from "@/components/DateTimePicker.vue";
import moment, { Moment, isMoment } from "moment";
import EditableHeader from "@/components/EditableHeader.vue";
import CustomerAddress from "@/components/CustomerAddress.vue";
declare var grecaptcha: any;
import CustomerVerification from "@/components/CustomerVerification.vue";
import VerifyPortalAccessUserModel from "@/models/VerifyPortalAccessUserModel";
import ValidateVerificationCodeModel from "@/models/ValidateVerificationCodeModel";
import SessionController from "@/api/sessionController";
import Store from "@/store";
import ResponseOfValidateVerificationCodeModel from "../models/ResponseOfValidateVerificationCodeModel";
import VerifyPortalUserResponse from "../models/VerifyPortalUserResponse";
import HealthAndSafetyQAModel from '@/models/claim/HealthAndSafetyQAModel';
import VulnerabilityQAModel from '@/models/claim/VulnerabilityQAModel';
import AccessNoteModel from '@/models/claim/AccessNoteModel';
import QuestionModeJobDetailModel from '@/models/claim/QuestionModeJobDetailModel';
import UpdateQuestionModeJobDetailModel from '@/models/claim/UpdateQuestionModeJobDetailModel';
import AddEmergencyAnswerModel from '@/models/claim/AddEmergencyAnswerModel';
import MessageCard from "@/components/MessageCard.vue";
import TimeSlotPicker from '@/components/TimeSlotPicker.vue';

@Component({
  name: "InsurerPortal",
  components: {
    EmergencyQuestionGenerator,
    EmergencySelection,
    ClientDetail,
    PictureUpload,
    DateTimePicker,
    CustomerAvailabilityPreview,
    EditableHeader,
    CustomerAddress,
    CustomerVerification,
    MessageCard,
  },
})
export default class InsurerPortal extends Vue {
  @Prop() private jobId: string;
  private active: any = null;
  private ready: boolean = false;
  private claimCovered: boolean = false;
  private claimNotCovered: boolean = false;
  private emergencyTypes: EmergencyModel[] = [];
  private selectedEmergencies: EmergencyModel[] = [];
  private insurerPortal: InsurerPortalModel = new InsurerPortalModel();
  private stepIndex: number = 1;
  private step1formRef: string = "ph_step1form";
  private step2formRef: string = "ph_step2form";
  private step3formRef: string = "ph_step3form";
  private step4formRef: string = "ph_step4form";
  private step5formRef: string = "ph_step5form";
  private step6formRef: string = "ph_step6form";
  private step7formRef: string = "ph_step7form";
  private step1validated: boolean = false;
  private step2validated: boolean = false;
  private step3validated: boolean = false;
  private step4validated: boolean = false;
  private step5validated: boolean = false;
  private step6validated: boolean = false;
  private step7validated: boolean = false;
  private contactPreference = ContactPreferenceEnum;
  private selectedEmergencyList: EmergencyModel[] = [];
  private imageListToUpload: string[] = [];
  private isNextButtonClicked: boolean = false;
  private isPreviousButtonClicked: boolean = false;
  private emergenciesQAs: EmergencyQA[] = [];
  private isLoading: boolean = false;
  private emergencyQuestionIsValid: boolean = true;
  private customerAvailability = new CustomerAvailabilityModel();
  private isImageUploading: boolean = false;
  private topEmergencyLength: number = 0;
  private isUserHuman: boolean = true;
  private validateCaptcha: boolean = false;
  private backToCaptchaVerificationStep: boolean = false;
  private oldContactPreferenceId: number | null = null;
  private showVerificationInputs: boolean = true;
  private verificationCode: string = "";
  private responseType = ResponseType;
  private validateUserVerificationError: string = "";
  private verifyPortalAccessUserModel: VerifyPortalAccessUserModel | null = null;
  private captchaResponseToken: string = "";
  private captchaError: string = "";
  private reCaptchaErrorType = ReCaptchaErrorType;
  private showResendButtonForVerification: boolean = false;
  private isCaptchaValidated: boolean = false;
  private panel: number = 0;
  private healthAndSafetyQAs: HealthAndSafetyQAModel[] = [];
  private accessNoteQA: AccessNoteModel | null = null;
  private vulnerabilityQA: VulnerabilityQAModel | null = null;
  private localTimer: Date = new Date();
  private localTimerForClaim: Date = new Date();
  private acceptedEmergencies: number[] = [];
  private showCustomerAvailabilityStep: boolean = true;
  private isQuestionModeLinkNotValid: boolean = false;
  private isTermsAndServicesAccepted: boolean = false;
  private showPrivacyPolicyDetails: boolean = false;
  private privacyPolicyError: boolean = false;
  private defaultQuestionSelectionOption = "Select an Option";

  private created() {
    const self = this;
    if (self.jobId) {
      // question only mode
      if (!this.getTrackingId) {
        storeMutations.updateTrackingId(this.jobId);
      }
      // get emergency questions
      PolicyHolderController.GetQuestionModeJobDetails()
        .then((res: QuestionModeJobDetailModel | null) => {
          if (res) {
            if (res.acceptedEmergencyIds.length === res.loggedEmergencies.length) {
              this.$router.push({ name: "claimtracking", params: { jobId: this.jobId }});
              return;
            }
            this.ready = true;
            this.emergenciesQAs = res.returnEmergencyQuestionData.questions;
            this.healthAndSafetyQAs = res.returnEmergencyQuestionData.healthAndSafetyQAs;
            this.accessNoteQA = res.returnEmergencyQuestionData.accessNoteQA;
            this.vulnerabilityQA = res.returnEmergencyQuestionData.vulnerabilityQA;
            this.insurerPortal.policyScheduleId = res.returnEmergencyQuestionData.policyId;
            this.insurerPortal.policyName = res.returnEmergencyQuestionData.policyName;
            this.insurerPortal.policyNumber = res.returnEmergencyQuestionData.policyNumber;
            this.insurerPortal.isPolicyCovered = res.returnEmergencyQuestionData.isPolicyCovered;
            this.insurerPortal.emergencies = res.loggedEmergencies;
            this.acceptedEmergencies = res.acceptedEmergencyIds;
            this.customerAvailability = res.customerAvailability;
            this.showCustomerAvailabilityStep = res.customerAvailability.timeSlot && res.customerAvailability.timeSlot.length > 0 ? false : true;
            this.active = 4;
            this.stepIndex = 5;
          } else {
            this.$router.replace("/");
            this.isQuestionModeLinkNotValid = true;
          }
        })
        .catch((err: any) => {
          // TODO: handle error
          this.$router.replace("/");
          this.isQuestionModeLinkNotValid = true;
        });
    } else {
      PolicyHolderController.GetEmergencies()
        .then((res: EmergencyModel[]) => {
          self.emergencyTypes = res;
          self.selectedEmergencies = [];
          const items = self.environment.Settings.TopEmergencies;
          if (items) {
            items.forEach((item) => {
              const emergency:
                | EmergencyModel
                | undefined = self.getEmergencyTypes.find(
                (e: EmergencyModel) => e.id === item,
              );
              if (emergency) {
                self.selectedEmergencies.push(emergency);
              }
            });
          }
          this.ready = true;
          // load captcha widget
          this.loadCaptcha();
        })
        .catch((err: any) => {
          self.emergencyTypes = [];
          //  TODO: handle error
        });
    }
    this.handleLinkClicksInGA('Client Portal', 'LOADED');
  }

  private get getUpdatedEmergencies(): number[] {
    return this.environment.Settings.TopEmergencies;
  }

  @Watch("getUpdatedEmergencies")
  private updateSelectedEmergencies() {
    const items = this.environment.Settings.TopEmergencies;
    if (items) {
      this.selectedEmergencies = [];
      items.forEach((item) => {
        const emergency:
          | EmergencyModel
          | undefined = this.getEmergencyTypes.find(
          (e: EmergencyModel) => e.id === item,
        );
        if (emergency) {
          this.selectedEmergencies.push(emergency);
        }
      });
    }
  }

  private get environment(): Environment {
    return storeGetters.getEnvironment();
  }

  private get getEmergencyTypes(): EmergencyModel[] {
    return this.emergencyTypes;
  }

  private get getClaimCovered(): boolean {
    return this.insurerPortal.isPolicyCovered
      ? this.insurerPortal.isPolicyCovered
      : false;
  }

  private get getClaimNotCovered(): boolean {
    if (this.insurerPortal.isPolicyCovered !== null) {
      return !this.insurerPortal.isPolicyCovered;
    } else {
      return false;
    }
  }

  private next() {
    this.scrollToTop();
    const active: number = parseInt(this.active, 0);
    this.active = active < 6 ? active + 1 : 0;
    this.isPreviousButtonClicked = false;
    this.isNextButtonClicked = false;
  }

  private previous() {
    this.scrollToTop();
    const active: number = parseInt(this.active, 0);
    this.active = active < 7 ? active - 1 : 0;
    this.isPreviousButtonClicked = false;
    this.isNextButtonClicked = false;
  }

  private async validateStep(step: number): Promise<[number, string, boolean]> {
    const self = this;
    let scope: string = "";
    switch (step) {
      case 1:
        scope = self.step1formRef;
        break;
      case 2:
        scope = self.step2formRef;
        break;
      case 3:
        scope = self.step3formRef;
        break;
      case 4:
        scope = self.step4formRef;
        break;
      case 5:
        scope = self.step5formRef;
        break;
      case 6:
        scope = self.step6formRef;
        break;
      case 7:
        scope = self.step7formRef;
        break;
      default:
        return [step, scope, false];
    }

    let result: boolean = await self.$validator.validateAll(scope);

    // set focus to non validate field
    let emergencyQuestionValidation = true;
    let firstNoticedValidation = true;
    let emergencySelectionValidation = true;
    let clientDetailValidation = true;
    let clientAddressValidation = true;
    let clientVerificationValidation = true;
    let pictureUploadValidation = true;
    this.validateCaptcha = false;
    this.privacyPolicyError = false;
    if (step === 1) {
      // validate select emergency
      const emergencySelectionSub = this.$refs
        .emergencySelectionRef as EmergencySelection;
      emergencySelectionValidation = await emergencySelectionSub.$validator.validateAll();
      // validate the date picker of firstNoticed
      const dateTimePickerSub: DateTimePicker[] = emergencySelectionSub.$refs
        .dateTimePicker as DateTimePicker[];
      for (const sub of dateTimePickerSub) {
        firstNoticedValidation = await sub.$validator.validateAll() && sub.isValidDate;
        if (!firstNoticedValidation) {
          break;
        }
      }
    }
    if (step === 2) {
      const clientDetailSub: any = this.$refs.clientDetailRef as ClientDetail;
      clientDetailValidation = await clientDetailSub.$validator.validateAll();

      let contactSMSValidation = true;
      let contactCallValidation = true;
      // validate the contactPreference SMS
      if (
        this.insurerPortal.contactPreferenceId === self.contactPreference.SMS
      ) {
        const contactSMSValidationSub: any = clientDetailSub.$refs
          .contactPreferenceSMS as any;
        contactSMSValidation = await contactSMSValidationSub.$validator.validateAll() && contactSMSValidationSub.isValid;
      }
      // validate the contactPreference Call
      if (
        this.insurerPortal.contactPreferenceId === self.contactPreference.Call
      ) {
        const contactCallValidationSub: any = clientDetailSub.$refs
          .contactPreferenceCall as any;
        contactCallValidation = await contactCallValidationSub.$validator.validateAll() && contactCallValidationSub.isValid;
      }

      this.privacyPolicyError = this.environment.Settings.PrivacyPolicyText ? !this.isTermsAndServicesAccepted : false;
      if (!contactSMSValidation || !contactCallValidation || this.privacyPolicyError) {
        clientDetailValidation = contactSMSValidation && contactCallValidation && this.isTermsAndServicesAccepted;
      }

      if (!this.isUserHuman) {
        this.validateCaptcha = true;
        // scroll to bottom in a case of captcha error
        clientDetailValidation ? this.scrollToTop(true) : this.scrollToTop();
        clientDetailValidation = false;
      } else {
        this.validateCaptcha = false;
      }

      if (
        clientDetailValidation &&
        this.backToCaptchaVerificationStep &&
        this.oldContactPreferenceId !== this.insurerPortal.contactPreferenceId
      ) {
        this.validateCaptcha = true;
        clientDetailValidation = false;
        this.resetCaptcha();
      }
    }
    if (step === 3) {
      // validate verification code
      const clientVerificationSub: any = this.$refs
        .clientVerificationRef as CustomerVerification;
      clientVerificationValidation = await clientVerificationSub.$validator.validateAll();
      // validate editable client section
      const clientDetailSub: any = clientVerificationSub.$refs.clientDetailRef as ClientDetail;
      clientDetailValidation = await clientDetailSub.$validator.validateAll();
    }
    if (step === 4) {
      // validate address
      const clientAddressSub: any = this.$refs
        .clientAddressRef as CustomerAddress;
      clientAddressValidation = await clientAddressSub.$validator.validateAll();
    }
    if (step === 5) {
      const subs: any = this.$refs
        .emergencyQuestionGenerator as EmergencyQuestionGenerator;
      emergencyQuestionValidation = await subs.$validator.validateAll();

      // On Next button click open related panel expanded when answers of mandatory questions not given
      for (const getEmergenciesQA of subs.getEmergenciesQAs) {
        const element = getEmergenciesQA;
        if (element.mandatory && (!element.answer || element.answer === this.defaultQuestionSelectionOption)) {
          if (!element.forEmergencyDetailId && !element.forEmergencyTypeId) {
            // policy wide question's answer is null, expand first panel
            self.panel = 0;
            Shared.setValidationFocus(this.$el as HTMLElement);
            emergencyQuestionValidation = false;
            break;
          } else {
            const index = self.getEmergencies.findIndex((e) => e.emergencyTypeId === element.forEmergencyTypeId || e.emergencyDetailId === element.forEmergencyDetailId);
            if (index !== -1) {
              self.panel = index + 1;
              Shared.setValidationFocus(this.$el as HTMLElement);
              emergencyQuestionValidation = false;
              break;
            }
          }
        }
      }

      this.emergencyQuestionIsValid = emergencyQuestionValidation;
    }
    if (step === 6) {
      const pictureUploadSubs = this.$refs.pictureUploadRef as PictureUpload;
      pictureUploadValidation = await pictureUploadSubs.$validator.validateAll();
    }
    if (
      !emergencyQuestionValidation ||
      !firstNoticedValidation ||
      !emergencySelectionValidation ||
      !clientDetailValidation ||
      !pictureUploadValidation ||
      !clientAddressValidation ||
      !clientVerificationValidation
    ) {
      Shared.setValidationFocus(this.$el as HTMLElement);
      result =
        emergencyQuestionValidation &&
        firstNoticedValidation &&
        emergencySelectionValidation &&
        clientDetailValidation &&
        pictureUploadValidation &&
        clientAddressValidation &&
        clientVerificationValidation;
    }

    return [step, scope, result];
  }

  private onNextButtonClick() {
    this.isNextButtonClicked = true;
    this.isPreviousButtonClicked = false;
    this.processCurrentPage();
  }

  private onPreviousButtonClick() {
    this.isPreviousButtonClicked = true;
    this.isNextButtonClicked = false;
    this.processCurrentPage();
  }

  private processCurrentPage(): void {
    const self = this;
    this.validateStep(self.stepIndex)
      .then((result: [number, string, boolean]) => {
        const passed: boolean = result[2];
        switch (result[1]) {
          case self.step1formRef:
            self.step1validated = passed;
            if (passed) {
              this.handleLinkClicksInGA('Emergencies Details Filled', 'NEXT');
              self.next();
              self.stepIndex = 2;
            }
            break;
          case self.step2formRef:
            self.step2validated = passed;
            if (self.isPreviousButtonClicked) {
              this.$validator.errors.items = [];
              this.handleLinkClicksInGA('Back To Emergencies Details', 'PREVIOUS');
              self.previous();
              self.stepIndex = 1;
            }
            if (passed && self.isNextButtonClicked) {
              if (
                self.isUserHuman &&
                self.showVerificationInputs &&
                !self.appInEditMode
              ) {
                self.verifyPortalUser();
              } else {
                self.next();
                self.stepIndex = 3;
                self.backToCaptchaVerificationStep = false;
              }
            }
            break;
          case self.step3formRef:
            self.step3validated = passed;
            if (self.isPreviousButtonClicked) {
              this.$validator.errors.items = [];
              this.handleLinkClicksInGA('Back To Contact Preference', 'PREVIOUS');
              self.previous();
              self.stepIndex = 2;
              self.oldContactPreferenceId =
                self.insurerPortal.contactPreferenceId;
              self.backToCaptchaVerificationStep = true;
            }
            if (passed && self.isNextButtonClicked) {
              if (this.showVerificationInputs && !self.appInEditMode) {
                self.validateVerificationCode();
              } else {
                self.next();
                self.stepIndex = 4;
              }
            }
            break;
          case self.step4formRef:
            self.step4validated = passed;
            if (self.isPreviousButtonClicked) {
              this.$validator.errors.items = [];
              this.handleLinkClicksInGA('Back To User Verification', 'PREVIOUS');
              self.previous();
              self.stepIndex = 3;
            }
            if (passed && self.isNextButtonClicked) {
              if (self.appInEditMode) {
                // get dummy question list
                self.getDummyQuestionsForClientTemplate();
              } else {
                // move to next step, if get policy questions have success response
                self.getPolicyQuestions();
              }
            }
            break;
          case self.step5formRef:
            self.step5validated = passed;
            if (self.isPreviousButtonClicked) {
              this.emergencyQuestionIsValid = true;
              this.handleLinkClicksInGA('Back To Address Search', 'PREVIOUS');
              self.previous();
              self.stepIndex = 4;
              return;
            }
            if (passed) {
              if (self.isNextButtonClicked) {
                this.handleLinkClicksInGA('Emergency Question Filled', 'NEXT');
                const customerAvailabilitiesRef = this.$refs.customerAvailabilities as CustomerAvailabilityPreview;
                if (customerAvailabilitiesRef) {
                  customerAvailabilitiesRef.resetValue();
                }
                self.next();
                self.stepIndex = 6;
              } else if (this.jobId) {
                this.updateClaimDetail();
              }
            }
            break;
          case self.step6formRef:
            if (self.isPreviousButtonClicked) {
              this.handleLinkClicksInGA('Back To Emergency Question List', 'PREVIOUS');
              self.previous();
              self.stepIndex = 5;
              return;
            }
            if (passed) {
              if (self.isNextButtonClicked) {
                self.next();
                self.stepIndex = 7;
              } else if (this.jobId) {
                this.updateClaimDetail();
              }
            }
            break;
          case self.step7formRef:
            self.step7validated = passed;
            if (passed) {
              if (self.isPreviousButtonClicked) {
                self.previous();
                self.stepIndex = 6;
              } else {
                self.next();
              }
            }
            break;
        }
      })
      .catch((err: any) => {
        // TODO: handle error
      });
  }

  private onEmergencySelection(): void {
    this.scrollToTop(true);
  }

  private get getEmergenciesWithDetail(): AddEmergency[] {
    return this.insurerPortal.emergencies;
  }

  private set getEmergenciesWithDetail(newValue: AddEmergency[]) {
    this.insurerPortal.emergencies = newValue;
  }

  // get policy and emergencies questions
  // policy decide based on firstname, lastname, postcode, policy schedules, fallback starred policy, selected emergency and details
  private getPolicyQuestions() {
    this.scrollToTop();
    this.isLoading = true;

    // set properties for search emergency question
    const searchEmergencyQuestion: SearchEmergencyQuestionModel = new SearchEmergencyQuestionModel();
    if (this.insurerPortal.emergencies) {
      this.insurerPortal.emergencies.forEach((element: AddEmergency) => {
        if (element && element.emergencyTypeId) {
          searchEmergencyQuestion.emergencyTypeIds.push(
            element.emergencyTypeId,
          );
        }
        if (element && element.emergencyDetailId) {
          searchEmergencyQuestion.emergencyDetailIds.push(
            element.emergencyDetailId,
          );
        }
      });
    } else {
      searchEmergencyQuestion.emergencyTypeIds = [];
      searchEmergencyQuestion.emergencyDetailIds = [];
    }

    if (!searchEmergencyQuestion.policyIds) {
      searchEmergencyQuestion.policyIds = [];
    }
    const items = this.environment.Settings.PolicySchedules;
    if (items) {
      items.forEach((item) => {
        if (item) {
          searchEmergencyQuestion.policyIds.push(item);
        }
      });
      searchEmergencyQuestion.fallBackStarPolicyId = this.environment.Settings.FallBackStarPolicy;
      searchEmergencyQuestion.firstName = this.insurerPortal.clientForename;
      searchEmergencyQuestion.lastName = this.insurerPortal.clientLastName;
      searchEmergencyQuestion.postcode = this.insurerPortal.postcode;
      PolicyHolderController.GetPolicyQuestions(searchEmergencyQuestion)
        .then((res: ReturnEmergencyQuestionDataModel | null) => {
          if (res) {
            this.emergenciesQAs = res.questions;
            this.healthAndSafetyQAs = res.healthAndSafetyQAs;
            this.accessNoteQA = res.accessNoteQA;
            this.vulnerabilityQA = res.vulnerabilityQA;
            this.insurerPortal.policyScheduleId = res.policyId;
            this.insurerPortal.policyName = res.policyName;
            this.insurerPortal.policyNumber = res.policyNumber;
            this.insurerPortal.isPolicyCovered = res.isPolicyCovered;
            // move to next step
            this.handleLinkClicksInGA('User Address Located', 'NEXT');
            this.next();
            this.stepIndex = 5;
            this.isLoading = false;
            this.panel = 0; // required to show emergency wide questions panel expanded whwn questions load first time
          }
        })
        .catch((err: any) => {
          // TODO: handle error
          this.isLoading = false;
        });
    }
  }

  private getDummyQuestionsForClientTemplate() {
    this.scrollToTop();
    this.isLoading = true;
    // fill dummy data
    const healthAndSafetyQAs: any = [
      {
        answerDetail: null,
        createdAt: "2019-06-07T09:19:43.7587364Z",
        forEmergencyDetailId: 4,
        forEmergencyTypeId: 1,
        isHealthAffected: null,
        level: null,
        questionText: "Does the emergency you’re experiencing pose any health and safety concerns?",
        type: "HealthAndSafetyQA",
      },
    ];
    const vulnerabilityQA: any = {
      answerDetail: null,
      isHealthAffected: null,
      level: null,
      questionText: "Does anyone in your household have any health conditions that may be affected by this emergency or would anyone in your household consider themselves to be vulnerable?",
      type: "VulnerabilityQA",
    };
    const accessNoteQA: any = {
      answer: null,
      createdAt: "2019-06-07T09:19:43.7587364Z",
      questionText: "Are there any property access considerations?",
      type: "AccessNote",
    };
    const res: ReturnEmergencyQuestionDataModel = {
      questions: [],
      policyId: 1,
      policyName: "Accord Building Society",
      policyNumber: "",
      isPolicyCovered: false,
      healthAndSafetyQAs: [],
      vulnerabilityQA: null,
      accessNoteQA: null,
    };
    const questions: any = [
      {
        forEmergencyTypeId: null,
        forEmergencyDetailId: null,
        policyQuestionId: 277,
        questionId: 49,
        questionText: "Is this causing internal damage to the property?",
        orderBy: 1,
        answer: null,
        forCommentOperatorId: 1,
        forCommentComparisonValue: "Yes",
        commentLabel: "Please provide more details",
        comment: null,
        answerType: 4,
        additionalValues: null,
        unit: null,
        mandatory: false,
      },
      {
        forEmergencyTypeId: null,
        forEmergencyDetailId: null,
        policyQuestionId: 281,
        questionId: 57,
        questionText: "How many people reside in the property?",
        orderBy: 6,
        answer: null,
        forCommentOperatorId: null,
        forCommentComparisonValue: null,
        commentLabel: null,
        comment: null,
        answerType: 3,
        additionalValues: null,
        unit: null,
        mandatory: false,
      },
      {
        forEmergencyTypeId: null,
        forEmergencyDetailId: null,
        policyQuestionId: 476,
        questionId: 6,
        questionText: "Is the boiler easily accessible?",
        orderBy: 5,
        answer: null,
        forCommentOperatorId: 1,
        forCommentComparisonValue: "No",
        commentLabel: "Please give details here",
        comment: null,
        answerType: 2,
        additionalValues: "Yes\nNo",
        unit: null,
        mandatory: false,
      },
    ];
    res.questions = questions;
    this.vulnerabilityQA = vulnerabilityQA;
    this.accessNoteQA = accessNoteQA;
    this.healthAndSafetyQAs = healthAndSafetyQAs;
    this.emergenciesQAs = res.questions;
    this.insurerPortal.policyScheduleId = res.policyId;
    this.insurerPortal.policyName = res.policyName;
    this.insurerPortal.policyNumber = res.policyNumber;
    this.insurerPortal.isPolicyCovered = res.isPolicyCovered;
    // move to next step
    this.next();
    this.stepIndex = 5;
    this.isLoading = false;
  }

  private get getEmergenciesQAs(): EmergencyQA[] {
    return this.emergenciesQAs;
  }

  private get getEmergencies(): AddEmergency[] {
    return this.getEmergenciesWithDetail;
  }

  private get getAccessNoteQA(): AccessNoteModel | null {
    return this.accessNoteQA;
  }

  private get getHealthAndSafetyQAs(): HealthAndSafetyQAModel[] {
    return this.healthAndSafetyQAs;
  }

  private get getVulnerabilityQA(): VulnerabilityQAModel | null {
    return this.vulnerabilityQA;
  }

  private onDeleteEmergencyQA(emergency: AddEmergency) {
    const emergencySelectionSub = this.$refs
      .emergencySelectionRef as EmergencySelection;
    emergencySelectionSub.removeEmergencyOnDeleteEmergencyQA(emergency);
    this.getEmergenciesWithDetail.splice(
      this.getEmergenciesWithDetail.findIndex(
        (d: any) => d.emergencyTypeId === emergency.emergencyTypeId,
      ),
      1,
    );
    this.emergenciesQAs = this.getEmergenciesQAs.filter(
      (e) =>
        e.forEmergencyTypeId !== emergency.emergencyTypeId &&
        e.forEmergencyDetailId !== emergency.emergencyDetailId,
    );
  }

  private updateClaimDetail() {
    const addEmergencyAnswers: AddEmergencyAnswerModel[] = [];
    const subs: any = this.$refs.emergencyQuestionGenerator;
    subs.getEmergenciesQAs.forEach((question: EmergencyQA) => {
      const addEmergencyAnswer: AddEmergencyAnswerModel = new AddEmergencyAnswerModel();
      addEmergencyAnswer.id = question.id;
      addEmergencyAnswer.answer = question.answer;
      addEmergencyAnswer.comment = question.comment;
      addEmergencyAnswers.push(addEmergencyAnswer);
    });
    subs.healthAndSafetyQAs.forEach((question: any) => {
      delete question.disabled; // delete disabled property
    });
    // this.insurerPortal.emergenciesQAs = subs.getEmergenciesQAs;
    const updateQuestionModeJobDetail: UpdateQuestionModeJobDetailModel = new UpdateQuestionModeJobDetailModel();
    updateQuestionModeJobDetail.emergenciesQAs = addEmergencyAnswers;
    updateQuestionModeJobDetail.healthAndSafetyQAs = subs.getHealthAndSafetyQAsToSave;
    updateQuestionModeJobDetail.vulnerabilityQA = subs.getVulnerabilityQAToSave;
    updateQuestionModeJobDetail.accessNoteQA = subs.getAccessNoteQuestion;
    if (this.customerAvailability.id) {
      updateQuestionModeJobDetail.customerAvailability = this.customerAvailability;
    } else {
      updateQuestionModeJobDetail.customerAvailability = new CustomerAvailabilityModel();
      updateQuestionModeJobDetail.customerAvailability.timeSlot = this.customerAvailability.timeSlot;
    }
    const subDomain = window.location.host;
    // Update Question Mode Job Detail
    this.isLoading = true;
    JobController.UpdateQuestionModeJobDetails(subDomain, updateQuestionModeJobDetail)
      .then((res: boolean) => {
        if (res) {
          this.handleLinkClicksInGA('Customer Availability Filled', 'NEXT');
          this.handleLinkClicksInGA('Claim Logged', 'CLAIM LOGGED', this.localTimerForClaim);
          this.stepIndex = 7;
          this.next();
          this.localTimerForClaim = new Date();
          this.active = 6;
        }
        this.isLoading = false;
      })
      .catch((err: any) => {
        // TODO: handle error
        this.isLoading = false;
      });
  }

  private async validateCustomerAvailability(): Promise<boolean> {
    let customerAvailabilityValidated = true;
    const customerAvailabilitySubs = this.$refs.customerAvailabilities as CustomerAvailabilityPreview;
    const todayDateRef = customerAvailabilitySubs.$refs.todayDateRef as TimeSlotPicker;
    customerAvailabilityValidated = await todayDateRef.$validator.validateAll() && todayDateRef.isValidDate;
    if (customerAvailabilityValidated) {
      const tomorrowDateRef = customerAvailabilitySubs.$refs.tomorrowDateRef as TimeSlotPicker;
      customerAvailabilityValidated = tomorrowDateRef ? await tomorrowDateRef.$validator.validateAll() && tomorrowDateRef.isValidDate : true;
    }
    if (customerAvailabilityValidated) {
      const dayAfterTomorrowDateRef = customerAvailabilitySubs.$refs.dayAfterTomorrowDateRef as TimeSlotPicker;
      customerAvailabilityValidated = dayAfterTomorrowDateRef ? await dayAfterTomorrowDateRef.$validator.validateAll() && dayAfterTomorrowDateRef.isValidDate : true;
    }

    if (!customerAvailabilityValidated) {
      Shared.setValidationFocus(this.$el as HTMLElement);
    }
    return customerAvailabilityValidated;
  }

  private saveClaim() {
    this.validateCustomerAvailability().then((isValid: boolean) => {
      if (isValid)  {
    if (this.jobId) {
      this.processCurrentPage();
    } else {
      if (this.appInEditMode) {
        this.stepIndex = 7;
        this.next();
        return;
      }
      this.isLoading = true;
      this.insurerPortal.emergencies.forEach((element: AddEmergency) => {
        delete element.emergencyDetail;
      });
      const item: any = this.$refs.emergencyQuestionGenerator;
      // find answer with default option value and set null
      item.getEmergenciesQAs.forEach((qa: EmergencyQA) => {
        if (qa.answer === this.defaultQuestionSelectionOption) {
          qa.answer = "";
        }
      });
      this.insurerPortal.emergenciesQAs = item.getEmergenciesQAs;
      this.insurerPortal.healthAndSafetyQAs = item.getHealthAndSafetyQAsToSave;
      this.insurerPortal.vulnerabilityQA = item.getVulnerabilityQAToSave;
      this.insurerPortal.accessNoteQA = item.getAccessNoteQuestion;
      this.insurerPortal.customerAvailability = new CustomerAvailabilityModel();
      this.insurerPortal.customerAvailability.timeSlot = this.customerAvailability.timeSlot;
      // this.insurerPortal.policyScheduleId = 111;
      if (this.insurerPortal.contactPreferenceId) {
        this.insurerPortal.contactPreference = this.contactPreference[
          this.insurerPortal.contactPreferenceId
        ] as ContactPreference;
      }
      const subDomain = window.location.host;
      JobController.AddJob(subDomain, this.insurerPortal)
        .then((res: boolean) => {
          if (res) {
            this.stepIndex = 7;
            this.next();
          }
          this.isLoading = false;
        })
        .catch((err: any) => {
          // TODO: handle error
          this.isLoading = false;
        });
    }
     }
    });
  }

  private AddClaimPictures() {
    if (this.appInEditMode) {
      this.claimCovered = this.getClaimCovered;
      this.claimNotCovered = this.getClaimNotCovered;
      return;
    }
    this.isLoading = true;
    if (this.imageListToUpload.length > 0) {
      const claimPictures: PictureUploadModel[] = [];
      this.imageListToUpload.forEach((item) => {
        const claimPictureModel: PictureUploadModel = new PictureUploadModel();
        claimPictureModel.fileURL = item;
        claimPictureModel.uploadedBy = "Customer";
        claimPictures.push(claimPictureModel);
      });
      JobController.AddClaimPictures(claimPictures)
        .then((res: boolean) => {
          if (res) {
            this.handleLinkClicksInGA('Pictures Uploaded', 'PICTURE UPLOAD');
            this.claimCovered = this.getClaimCovered;
            this.claimNotCovered = this.getClaimNotCovered;
          }
          this.isLoading = false;
        })
        .catch((err: any) => {
          // TODO: handle error
          this.isLoading = false;
        });
    } else {
      this.claimCovered = this.getClaimCovered;
      this.claimNotCovered = this.getClaimNotCovered;
      this.isLoading = false;
    }
  }

  private updateCustomerAvailability(
    customerAvailabilityTimeslots: TimeSlot[],
  ): void {
    // fill timeslots
    this.customerAvailability.timeSlot = customerAvailabilityTimeslots;
  }

  private scrollToTop(isCustom: boolean = false) {
    // scroll page
    setTimeout(() => {
      const container = this.$el.querySelector(".mid-content.vb-content");
      if (container) {
        // if specific to page height, scroll to top or else scroll to bottom
        container.scrollTop = isCustom ? container.scrollHeight : 0;
      }
    }, 0);
  }

  private get appInEditMode(): boolean {
    return this.environment.AppMode === "edit";
  }

  private loadCaptcha() {
    this.resetCaptchaInputs();
    grecaptcha.render("google-recaptcha-v2", {
      'sitekey': this.environment.GoogleCaptchaVerificationSiteKey,
      'callback': this.verifyCallback,
      'expired-callback': this.handleExpiredCaptcha,
    });
  }

  private handleExpiredCaptcha() {
    this.resetCaptchaInputs();
    this.validateCaptcha = true;
    this.captchaError = "Verfication expired. Check the checkbox again.";
    setTimeout(() => {
      grecaptcha.reset();
    }, 0);
  }

  private resetCaptcha() {
    // if it's not first time and contact preference change more than one, reset the captcha
    if (
      this.backToCaptchaVerificationStep &&
      this.oldContactPreferenceId !== this.insurerPortal.contactPreferenceId
    ) {
      if (document && document.head) {
        // reset input values
        this.resetCaptchaInputs();
        // show verification inputs on next step to reverify
        this.showVerificationInputs = true;
        // reset captcha
        grecaptcha.reset();
      }
    }
  }

  private verifyCallback(response: string) {
    if (response) {
      // verify as a human
      this.captchaResponseToken = response;
      this.isUserHuman = true;
      this.validateCaptcha = false;
      this.oldContactPreferenceId = this.insurerPortal.contactPreferenceId;
    } else {
      // not human, reset input values
      this.resetCaptchaInputs();
    }
  }

  private resetCaptchaInputs() {
    // show verification box on next step to verify again
    this.isUserHuman = false;
    this.captchaResponseToken = "";
  }

  private verifyPortalUser() {
    const self = this;

    if (!self.captchaResponseToken) {
      // TODO: show error to validate captcha
      return;
    }

    // restrict api calls if, user come back do changes in contactpreference/value and select same as previous
    if (self.verifyPortalAccessUserModel && self.isCaptchaValidated) {
      const isSameRequest: boolean = self.checkIsVerificationRequestAlreadySent();
      if (isSameRequest) {
        self.next();
        self.stepIndex = 3;
        self.backToCaptchaVerificationStep = false;
        return;
      }
    }

    self.VerifyPortalUserForTracking();
  }

  private VerifyPortalUserForTracking() {
    const self = this;
    self.isLoading = true;
    self.isCaptchaValidated = false;

    // reset values
    self.showResendButtonForVerification = false;

    // set properties to verify user portal access
    self.verifyPortalAccessUserModel = new VerifyPortalAccessUserModel();
    self.verifyPortalAccessUserModel.clientTitle =
      self.insurerPortal.clientTitle;
    self.verifyPortalAccessUserModel.clientForename =
      self.insurerPortal.clientForename;
    self.verifyPortalAccessUserModel.clientLastName =
      self.insurerPortal.clientLastName;
    self.verifyPortalAccessUserModel.mobilePhone =
      self.insurerPortal.mobilePhone;
    self.verifyPortalAccessUserModel.email = self.insurerPortal.email;
    self.verifyPortalAccessUserModel.contactPreferenceId =
      self.insurerPortal.contactPreferenceId;
    if (self.insurerPortal.contactPreferenceId) {
      self.verifyPortalAccessUserModel.contactPreference = self
        .contactPreference[
        self.insurerPortal.contactPreferenceId
      ] as ContactPreference;
    }
    self.verifyPortalAccessUserModel.captchaResponse =
      self.captchaResponseToken;

    if (!this.environment.Settings.PrivacyPolicyText) {
      self.verifyPortalAccessUserModel.termsAndConditionsAccepted = true;
    } else {
      self.verifyPortalAccessUserModel.termsAndConditionsAccepted = this.isTermsAndServicesAccepted;
    }

    SessionController.VerifyPortalUser(self.verifyPortalAccessUserModel)
      .then((res: VerifyPortalUserResponse | null) => {
        if (res && res.trackingId) {
          // verify user for tracking
          storeMutations.updateTrackingId(res.trackingId);
          const clientVerificationRef = self.$refs
            .clientVerificationRef as CustomerVerification;
          if (clientVerificationRef) {
            clientVerificationRef.resetValidation();
          }
          // move to next step
          this.handleLinkClicksInGA('Contact Preference Filled', 'NEXT');
          self.next();
          self.stepIndex = 3;
          // clear local variables
          self.backToCaptchaVerificationStep = false;
          self.captchaError = "";
          self.showResendButtonForVerification = true;
          self.isCaptchaValidated = true;
        } else if (res && res.message) {
          // show error
          self.handleReCaptchaError(res.message);
          // reset captcha to validate again
          grecaptcha.reset();
          // reset captcha parameters
          self.resetCaptchaInputs();
        }
        self.isLoading = false;
      })
      .catch((err: any) => {
        // TODO: handle error
        self.isLoading = false;
      });
  }

  private handleReCaptchaError(responseErrorMessage: string) {
    const self = this;
    let errorMessage: string = "";
    switch (responseErrorMessage) {
      case self.reCaptchaErrorType.MissingInputResponse:
        errorMessage = "The response parameter is missing.";
        break;
      case self.reCaptchaErrorType.InvalidInputResponse:
        errorMessage = "The response parameter is invalid or malformed.";
        break;
      case self.reCaptchaErrorType.BadRequest:
        errorMessage = "The request is invalid or malformed.";
        break;
      default:
        errorMessage = responseErrorMessage;
        break;
    }
    // show error message
    self.validateCaptcha = true;
    self.captchaError = errorMessage;
  }

  private checkIsVerificationRequestAlreadySent(): boolean {
    let isSame: boolean = false;
    // check is request sent before and is contact preference change
    if (
      this.verifyPortalAccessUserModel &&
      this.insurerPortal.contactPreferenceId ===
        this.verifyPortalAccessUserModel.contactPreferenceId
    ) {
      // if contact preference id same, check if it's changed
      if (
        (this.insurerPortal.contactPreferenceId ===
          this.contactPreference.SMS ||
          this.insurerPortal.contactPreferenceId ===
            this.contactPreference.Call) &&
        this.insurerPortal.mobilePhone.toLowerCase() ===
          this.verifyPortalAccessUserModel.mobilePhone.toLowerCase()
      ) {
        isSame = true;
      } else if (
        this.insurerPortal.contactPreferenceId ===
          this.contactPreference.Email &&
        this.insurerPortal.email.toLowerCase() ===
          this.verifyPortalAccessUserModel.email.toLowerCase()
      ) {
        isSame = true;
      }
    }
    return isSame;
  }

  private getVerificationCode(verificationCode: string) {
    this.verificationCode = verificationCode;
  }

  private get getTrackingId() {
    return storeGetters.getTrackingId();
  }

  private validateVerificationCode() {
    const self = this;
    self.isLoading = true;
    self.showVerificationInputs = true;
    this.validateUserVerificationError = "";
    // self.isUserVarified = false;

    if (!this.getTrackingId) {
      // TODO: show error, session expired
    }

    // set properties to verify user portal access
    const validateVerificationCodeModel: ValidateVerificationCodeModel = new ValidateVerificationCodeModel();
    validateVerificationCodeModel.trackingId = this.getTrackingId;
    validateVerificationCodeModel.clientTitle = this.insurerPortal.clientTitle;
    validateVerificationCodeModel.clientForename = this.insurerPortal.clientForename;
    validateVerificationCodeModel.clientLastName = this.insurerPortal.clientLastName;
    validateVerificationCodeModel.code = this.verificationCode;

    SessionController.ValidateVerificationCode(validateVerificationCodeModel)
      .then((res: ResponseOfValidateVerificationCodeModel | null) => {
        if (res) {
          if (
            res.response.toString() ===
            self.responseType[self.responseType.Verified]
          ) {
            /// success, go to next step
            this.validateUserVerificationError = "";
            this.handleLinkClicksInGA('User Verification Done', 'NEXT');
            self.next();
            self.stepIndex = 4;
            self.showVerificationInputs = false;
          } else if (
            res.response.toString() ===
            self.responseType[self.responseType.NotMatch]
          ) {
            // show error message
            this.validateUserVerificationError = res.message;
          } else if (
            res.response.toString() ===
            self.responseType[self.responseType.Expired]
          ) {
            // show resend button
            this.validateUserVerificationError = res.message;
          }
          self.isLoading = false;
        }
      })
      .catch((err: any) => {
        // TODO: handle error
        this.isLoading = false;
      });
  }

  private trackClaim() {
    this.$router.replace("/claimtracking/" + storeGetters.getTrackingId());
  }

  private handleLinkClicksInGA(categoryName: string, actionName: string, time: Date | null = null) {
    if (this.appInEditMode) {
      // return if app is in edit mode
      return;
    }
    // send event updates to google analytics
    Shared.sendEventsInGoogleAnalytics(categoryName, actionName, time ? time : this.localTimer);
    // reset timer for second button click
    this.localTimer = new Date();
  }

  private termsAndServicesAccepted() {
    this.isTermsAndServicesAccepted = true;
    this.showPrivacyPolicyDetails = false;
  }

  private showPrivacyPolicyDetailsDialog() {
    this.showPrivacyPolicyDetails = true;
    const privacyPolicyElement = document.querySelector(".privacy-policy") as any;
    if (privacyPolicyElement) {
      const linkElements = privacyPolicyElement.querySelectorAll("a") as HTMLElement[];
      if (linkElements && linkElements.length > 0) {
        linkElements.forEach((link) => {
          link.style.color = this.environment.Settings.ComplementaryColor;
        });
      }
    }
  }

  // set configured error color for terms and conditions checkbox
  private setTermsAndServicesCheckboxStyle() {
    // apply css using class is not working, so need to find label and icon and then apply color
    const element = this.$el ? this.$el.querySelector('.terms-checkbox') : undefined;
    if (element) {
      const labelElement = element.getElementsByClassName('v-label').length > 0 ? element.getElementsByClassName('v-label')[0] : undefined;
      if (labelElement) {
        (labelElement as any).style.color = this.privacyPolicyError && !this.isTermsAndServicesAccepted ? this.environment.Settings.ErrorColor : this.environment.Settings.ComplementaryColor;
      }
      const iconElement = element.getElementsByClassName('v-icon').length > 0 ? element.getElementsByClassName('v-icon')[0] : undefined;
      if (iconElement) {
        (iconElement as any).style.color = this.privacyPolicyError && !this.isTermsAndServicesAccepted ? this.environment.Settings.ErrorColor : this.environment.Settings.ComplementaryColor;
      }
    }
  }
}
</script>
