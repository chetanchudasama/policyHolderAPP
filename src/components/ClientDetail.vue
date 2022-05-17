<template>
  <div class="client-details" role="region" aria-label="Customer details">
    <div role="form" aria-label="Customer detail form">
      <v-container fluid class="px-2">
        <h2 class="title" v-bind:style="{ color: environment.Settings.PrimaryColor}">About You</h2>
        <v-layout wrap class="mb-0 px-3 " v-bind:style="{ background: environment.Settings.SecondaryColor }">
          <v-flex xs12>
            <v-autocomplete
              label="Title"
              aria-required="true"
              maxlength="20"
              return-object
              :items="clientTitleList"
              v-model.trim="insurerPortal.clientTitle"
              required
              data-vv-name="Title"
              :error-messages="errors.collect('Title')"
              v-validate="'required'"
              class="required"
              />
          </v-flex>
          <v-flex xs12>
            <v-text-field
              label="First Name"
              aria-required="true"
              ref="clientForenameField"
              v-model.trim="insurerPortal.clientForename"
              maxlength="50"
              required
              data-vv-name="First Name"
              :error-messages="errors.collect('First Name')"
              v-validate="'required'"
              class="required">
            </v-text-field>
          </v-flex>
          <v-flex xs12>
            <v-text-field
              label="Last Name"
              aria-required="true"
              v-model.trim="insurerPortal.clientLastName"
              maxlength="50"
              required
              data-vv-name="Last Name"
              :error-messages="errors.collect('Last Name')"
              v-validate="'required'"
              class="required">
            </v-text-field>
          </v-flex>
          <v-flex xs12 class="radio-group-custom">
            <v-radio-group @change="insurerPortal.contactPreferenceId = localContactPreferenceId" v-model="localContactPreferenceId" :value="insurerPortal.contactPreferenceId" class="radio-group-input  pt-0" :mandatory="false"
              data-vv-name="Contact Preference"
              :error-messages="errors.collect('Contact Preference')"
              v-validate ="'required'"
              name="contactPreferenceRadioGroup"
              >
              <v-layout wrap>
                <v-flex xs12>
                  <div v-if="!preferenceAlreadySelected">
                    <v-layout class="radio-inline-custom" :class="insurerPortal.contactPreferenceId !== contactPreference.SMS ? 'custom-value' : 'show-number'">
                      <v-radio color="primary" :value="contactPreference.SMS" label="SMS" name="contactPreferenceRadioSMS"></v-radio>
                      <PhoneNumber
                        :passedPhoneNumber="insurerPortal.mobilePhone"
                        v-on:phoneNumberUpdated="phoneNumberUpdated"
                        :isDisabled="insurerPortal.contactPreferenceId !== contactPreference.SMS"
                        :isValidationRequired="true"
                        class="internal-phone-number"
                        ref="contactPreferenceSMS"
                      />
                    </v-layout>
                    <v-layout wrap class="radio-inline-custom" :class="insurerPortal.contactPreferenceId !== contactPreference.Email ? 'custom-value' : ''">
                      <v-radio color="primary" :value="contactPreference.Email" label="Email" name="contactPreferenceRadioEmail"></v-radio>
                      <v-text-field
                        v-model.trim="insurerPortal.email"
                        aria-label="Contact Email"
                        aria-required="true"
                        maxlength="50"
                        :disabled="insurerPortal.contactPreferenceId !== contactPreference.Email"
                        required
                        data-vv-name="Contact Email"
                         class="internal-phone-number required"
                        :error-messages="errors.collect('Contact Email')"
                        v-validate="emailValidation">
                      </v-text-field>
                    </v-layout>
                    <v-layout wrap class="radio-inline-custom" :class="insurerPortal.contactPreferenceId !== contactPreference.Call ? 'custom-value' : 'show-number'">
                      <v-radio color="primary" :value="contactPreference.Call" label="Call" name="contactPreferenceRadioCall"></v-radio>
                      <PhoneNumber
                        :passedPhoneNumber="insurerPortal.mobilePhone"
                        v-on:phoneNumberUpdated="phoneNumberUpdated"
                        :isDisabled="insurerPortal.contactPreferenceId !== contactPreference.Call"
                        :isValidationRequired="true"
                        class="internal-phone-number"
                        ref="contactPreferenceCall"
                      />
                    </v-layout>
                  </div>
                  <div v-else>
                    <!-- show selected preference as a disable text -->
                    <v-layout class="radio-inline-custom">
                      <div>
                        {{insurerPortal.contactPreferenceId === contactPreference.SMS
                        ? 'SMS: '
                        : insurerPortal.contactPreferenceId === contactPreference.Call
                        ? 'CALL: '
                        : 'Email: '}}
                      </div>
                      <div class="break-text" v-bind:style="{ color: environment.Settings.InputTextColor}">
                        {{insurerPortal.contactPreferenceId === contactPreference.Email
                        ? insurerPortal.email
                        : insurerPortal.mobilePhone}}
                      </div>
                    </v-layout>
                  </div>
                </v-flex>
              </v-layout>
            </v-radio-group>
          </v-flex>
        </v-layout>
      </v-container>
    </div>
  </div>
</template>

<style scoped>
  .client-details .title {margin-bottom: 15px;}
  .bold-select {font-weight: 600;}
  .radio-group-input>>>.v-input--radio-group--column {display: inherit;}
  .radio-group-input>>>.input-group__details:after, .radio-group-input>>>.input-group__details:before {content: "" !important;display: block !important;}
  .radio-group-input>>>.v-input--radio-group .v-input--selection-controls{padding: inherit;}
  .radio-inline-custom {position: relative;padding-left: 33px;}
  .radio-inline-custom>>>.v-radio {position: absolute;left: 0px;  top:10px; }
  .radio-inline-custom>>>.v-input--radio-group .input-group {padding-top: 0px;  }
  .radio-inline-custom>>>label {width: auto;  }
  .radio-group-custom>>>.v-input--radio-group:hover .input-group__details:before {background-color: rgba(0, 0, 0, 0.42) !important;  }
  .radio-group-custom>>>.v-input--radio-group>.input-group__input .input-group:hover .input-group__details:before {background-color: rgba(0, 0, 0, 0.87) !important;  }
  .radio-group-input:hover>>>.input-group--disabled .input-group__details:before {background-color: transparent !important;  }
  .radio-inline-custom>>>.v-text-field__slot input {font-weight: 600; }
  .radio-group-custom>>>.v-input--radio-group>.input-group__details:before, .radio-group-custom>>>.v-input--radio-group>.input-group__details:after {display: none !important;  }
  .radio-group-custom>>>.v-input--radio-group>.input-group__details{position: relative;top:-15px;  }
  .radio-inline-custom>>>.v-input-group:not(.radio) {padding-left: 50px;}
  .radio-group-custom>>>.v-input--radio-group .error--text .input-group__messages {color: #ff5252 !important;}
  .radio-group-custom>>>.v-input--radio-group .input-group--error .input-group__details:before {background-color: #ff5252 !important;}
  .header .toolbar__title {display: flex;}
  .custom-value>>>.v-input input {opacity: 0;}
  .radio-group-custom>>>.v-input--radio-group .v-input__slot{margin-bottom: 5px;}
  .radio-group-custom{padding-bottom: 20px;}


  .hide {display: none;}
  .btn--floating .v-icon {height: auto !important;width: auto !important;}
  .internal-phone-number {padding-left: 50px !important; padding-top: 0;}
  .internal-phone-number >>> .contact-number {position: relative;border-bottom: 0px;padding-bottom: 0px;padding-right: 0px;padding-left: 0px;}
  .internal-phone-number >>> .contact-number .input-group .input-group__details {opacity: 1;padding-right: 0px;}
  .internal-phone-number >>> .call-number-txt {width: calc(100% - 50px);display: inline-block;padding-left: 0 !important;}
  .internal-phone-number >>> .selectedCountry {width: 50px;display: inline-block;position: static;padding-left: 0 !important;vertical-align: top;}
  .internal-phone-number >>> .selectedCountry .input-group__selections {display: inline-block;position: relative;top: 5px;}
.show-number  .internal-phone-number >>> .contact-number .v-text-field label,
  .show-number .internal-phone-number >>> .v-text-field label,
  .show-number .internal-phone-number >>> .selectedCountry .v-select__slot,
  .show-number .internal-phone-number >>> .validation,
  .show-number .internal-phone-number >>> .contact-number .v-text-field__slot input {opacity: 1;}
  .internal-phone-number >>> .backspace-icon {display: none;}
  .internal-phone-number >>> .validation {position: absolute;right: 2px;top: 4px;z-index: 3;}
  .internal-phone-number >>> .tooltip {z-index: 999;}
  .internal-phone-number >>> .contact-number .v-text-field label {top: 5px !important;left: 2px;font-size: 15px;}
  .radio-group-custom>>> .v-input__control{width: 100%;}
   .internal-phone-number >>> .contact-number .v-text-field label,
  .internal-phone-number >>> .contact-number .v-text-field__slot input,
  .internal-phone-number .v-text-field label,
  .internal-phone-number >>> .selectedCountry .v-select__slot,
  .internal-phone-number >>> .validation{opacity: 0;}
  .maping-alert {padding-bottom: 5px;}
  .maping-alert >>> .v-messages__message{padding-bottom: 2px;}
  /* .internal-phone-number >>> .contact-number .input-group--text-field label {top: 0px !important;left: 2px;font-size: 15px;} */
  .captch-action{ align-self:flex-end; }
   @media(max-width: 768px) {
    .client-details .container > .layout,
    .client-details .title{margin:auto 0px !important;}
    .client-details .container > .layout{margin-bottom: 10px !important;}
    .client-details .title{margin-top: 20px !important; margin-bottom: 10px !important;}
  }
  @media(max-width: 420px) {
    .client-details .layout.px-3{padding:8px !important;}
  }
</style>
<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import { Environment } from '@/common/environment';
import storeGetters from '@/storeGetters';
import InsurerPortalModel from '@/models/InsurerPortalModel';
import { ContactPreference as ContactPreferenceEnum} from '@/common/enums';
import { ContactPreference } from '@/models/types';
import PolicyHolderController from '@/api/policyHolderController';
import storeMutations from '@/storeMutations';
import PhoneNumber from "@/components/PhoneNumber.vue";
declare var grecaptcha: any;

@Component({
  components: { PhoneNumber },
})

export default class ClientDetail extends Vue {
    @Prop() private insurerPortal: InsurerPortalModel;
    @Prop() private preferenceAlreadySelected: boolean;
    private clientTitleList: string[] = ['Mr', 'Mrs', 'Miss', 'Dr' , 'Ms'];
    private contactPreference = ContactPreferenceEnum;
    private localContactPreferenceId: number | null = null;

    private get environment(): Environment {
        return storeGetters.getEnvironment();
    }

    // Needs fixed - Temporary fix until we sort Vee Validate out properly.
    // This should be using a custom extension rule.
    private get emailValidation(): string {
      const validationString: string = 'required|max:50|email';
      const phoneNumber: string = this.insurerPortal.mobilePhone;
      return !phoneNumber && !phoneNumber.length ? validationString : '';
    }

    private phoneNumberUpdated(phoneNumber: string): void {
      this.insurerPortal.mobilePhone = phoneNumber;
    }

    private mounted() {
      this.localContactPreferenceId = this.insurerPortal.contactPreferenceId;
    }
}
</script>
