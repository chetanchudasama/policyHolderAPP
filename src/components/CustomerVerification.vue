<template>
    <section role="region" aria-label="Customer verification">
        <!-- client details -->
        <ClientDetail :insurerPortal="insurerPortal" ref="clientDetailRef" :preferenceAlreadySelected="true" class="edit-details"></ClientDetail>
        
        <div v-if="showVerificationInputs" role="form" aria-label="verification form">
          <v-container fluid class="px-2 pt-2">
              <h4 class="title mb-1"  v-bind:style="{ color: environment.Settings.PrimaryColor}">Verification Code</h4>
              <v-layout wrap v-bind:style="{ background: environment.Settings.SecondaryColor }" class="pa-3">
                <v-flex xs12>      
                  <v-text-field 
                    label="Verification Code" 
                    aria-required="true"
                    ref="verificationCode" 
                    v-model="verificationCode" 
                    :rules="[rules.counter]"
                    counter="7"
                    maxlength="7"
                    required 
                    class="required"
                    data-vv-name="Verification Code" 
                    :error-messages="errors.collect('Verification Code')" 
                    v-validate="'required'">
                  </v-text-field>
                </v-flex>
                <v-flex class="text-xs-right mt-1">
                  <span :class="(showTimer || disableResendButton) ? 'resend-disable' : ''" v-bind:style="{ color: environment.Settings.ComplementaryColor + '!important' }">
                    You didn't received a code! &nbsp; 
                    <a :disabled="showTimer" href="Javascript:void(0)" @click="resendVerificationCode()" v-bind:style="{ color: environment.Settings.ComplementaryColor + '!important' }">Resend</a>
                  </span>
                  <span v-if="showTimer">&nbsp;
                    <v-icon small v-bind:style="{ color: environment.Settings.ComplementaryColor }">timer</v-icon>
                    <b v-bind:style="{ color: environment.Settings.ComplementaryColor }"> 00:{{getTimeLeft}} </b>
                  </span>
                </v-flex>
              </v-layout>
            </v-container>
            <div class="px-2" v-if="validateUserVerificationErrorTemp">
              <span v-bind:style="{ color: environment.Settings.ComplementaryColor }">
                {{validateUserVerificationErrorTemp}}
              </span>
            </div>
        </div>
    </section>
</template>

<style scoped>
  .client-details.edit-details >>> .radio-inline-custom > div:first-child{ font-size: 14px; position: static; display: inline-block; transform: inherit; max-width: initial; width: auto; font-weight: 600; color: #777; padding-right: 10px;}
  .client-details.edit-details >>> .radio-inline-custom{padding-left: 0px;}
  .client-details.edit-details >>> .radio-inline-custom > div:last-child{font-weight: 600;}
  .timer-text{font-size: 16px; font-weight: 600;}
  .resend-disable{color: #989797 !important;}
  .resend-disable a {cursor: not-allowed; pointer-events: none; color: #989797 !important;}
  @media(max-width: 768px) {
    .client-details.edit-details >>> .input-group__input{ display: inline-block; max-width: 60%;}
  }
</style>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import ClientDetail from "@/components/ClientDetail.vue";
import InsurerPortalModel from '../models/InsurerPortalModel';
import { Environment } from '@/common/environment';
import storeGetters from '@/storeGetters';
import Shared from '../common/shared';
import SessionController from '../api/sessionController';
import Store from "@/store";
import RequestVarificationCodeModel from '../models/RequestVarificationCodeModel';

@Component({
  components: { ClientDetail },
})

export default class CustomerVerification extends Vue {
  @Prop() private insurerPortal: InsurerPortalModel;
  @Prop() private showVerificationInputs: boolean;
  @Prop() private validateUserVerificationError: string;
  @Prop() private showResendButtonForVerification: boolean;
  @Prop() private appInEditMode: boolean;

  private verificationCode: string = '';
  private validateUserVerificationErrorTemp: string = '';
  private rules: object = {counter: (value: any) => value.length <= 7 || 'Max 7 characters'};
  private showTimer: boolean = true;
  private disableResendButton: boolean = false;
  private isResendSuccessful: boolean = false;

  private timer: NodeJS.Timer;
  private timeLimitToEnableResendButton: number = 60;
  private timeLeftToEnableResendButton: number = 60;

  private get environment(): Environment {
    return storeGetters.getEnvironment();
  }

  public resetValidation() {
    if (this.verificationCode) {
      this.verificationCode = '';
    }
  }

  private mounted() {
    this.validateUserVerificationErrorTemp = this.validateUserVerificationError;
    if (this.appInEditMode) {
      this.verificationCode = 'XXXXXXX';
    }
    this.setTimerValue();
  }

  @Watch("verificationCode")
  private getVerificationCode() {
    this.$emit("getVerificationCode", this.verificationCode);
  }

  @Watch("validateUserVerificationError")
  private verificationResponseMessage() {
    this.isResendSuccessful = false;
    this.validateUserVerificationErrorTemp = this.validateUserVerificationError;
  }

  private get getTrackingId() {
    return storeGetters.getTrackingId();
  }

  private resendVerificationCode() {
    const self = this;
    this.disableResendButton = true;
    this.isResendSuccessful = false;
    this.validateUserVerificationErrorTemp = "";
    const requestVarificationCodeModel: RequestVarificationCodeModel = new RequestVarificationCodeModel();
    requestVarificationCodeModel.trackingId = this.getTrackingId;
    SessionController.ReSendVerificationCode(requestVarificationCodeModel).then((res: boolean | null) => {
      if (res) {
        this.disableResendButton = false;
        this.validateUserVerificationErrorTemp = "Verification code resent!";
        this.isResendSuccessful = true;
        this.verificationCode = '';
        this.showTimer = true;
        this.setTimerValue();
      } else {
        this.showTimer = false;
        this.validateUserVerificationErrorTemp = "Something went wrong. Please try again!";
      }
    }).catch((err: any) => {
      this.showTimer = false;
      this.validateUserVerificationErrorTemp = "Something went wrong. Please try again!";
      // TODO: handle error
    });
  }

  @Watch("showResendButtonForVerification")
  private setTimerValue() {
    if (!this.isResendSuccessful && !this.disableResendButton) {
      this.isResendSuccessful = false;
    }
    if (this.showVerificationInputs) {
      // set timer
      this.showTimer = true;
      this.startTimer();
    } else {
      this.showTimer = false;
    }
  }

  private startTimer(): void {
    // reset the timer
    clearInterval(this.timer);
    this.timeLeftToEnableResendButton = this.timeLimitToEnableResendButton;
    if (this.showTimer) {
      this.timer = setInterval(() => {
        if (this.timeLeftToEnableResendButton > 0) {
          this.timeLeftToEnableResendButton--;
        } else {
          this.showTimer = false;
        }
      }, 1000);
    }
  }

  private get getTimeLeft(): string {
    return Shared.getMinutesFromSecond(this.timeLeftToEnableResendButton, "0", 2);
  }
}
</script>
