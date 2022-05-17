<template>
    <v-container class="pa-0" role="region" aria-label="Phone number">
        <v-layout row>
          <v-flex xs12 class="contact-number">
              <v-select :items="countries" class="selectedCountry pt-0" append-icon="" hide-details label="Code" single-line v-model="selectedCountry" @change="changedCountryValue" :disabled="isDisabled">
                    <template slot="selection" slot-scope="data">
                        {{ data.item.cc || 'INT' }}
                    </template>
                    <template slot="item" slot-scope="data">
                        <v-list-tile-avatar>
                            <div :class="'flag flag-' + data.item.code"></div>
                        </v-list-tile-avatar>
                        <v-list-tile-content>
                            <v-list-tile-sub-title v-text="data.item.name + (data.item.cc ?' (' + data.item.cc + ')' : '')"></v-list-tile-sub-title>
                        </v-list-tile-content>
                    </template>
                </v-select>
            <v-text-field
                v-if="isValidationRequired"
                ref="txtNumber"
                single-line
                class="call-number-txt pt-0"
                label="Enter Number"
                aria-required="true"
                v-model="phoneNumber"
                @input="phoneNumberUpdated"
                :disabled="isDisabled"
                required
                data-vv-name="Contact Number"
                :error-messages="NumberValidationMessage('Contact Number')"
                v-validate="'required'"
            ></v-text-field>
            </v-flex>
        </v-layout>
        <v-layout class="hide">
            <v-flex class="conuntry-list">
                 <v-list tow-line v-for="(item,index) in countries" :key="index">
                    <v-list-tile>
                        <v-list-tile-avatar>
                             <div :class="'flag flag-' + item.code"></div>
                        </v-list-tile-avatar>
                        <v-list-tile-content>
                            <v-list-tile-sub-title v-text="item.name + ' (' + item.cc + ')'"></v-list-tile-sub-title>
                        </v-list-tile-content>
                    </v-list-tile>
                    <v-divider></v-divider>
                </v-list>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<style scoped>

.selectedCountry {
	font-size: 16px;
}

.selectedCountry>>>.input-group--select__autocomplete {
	max-width: 40px;
}

i.v-icon.material-icons.input-group__append-icon.input-group__icon-cb {
	width: 5px;
	padding-left: 10px;
	padding-right: 10px;
}

.flag {
	display: inline-block;
	width: 16px;
	height: 11px;
	background: url(/img/flags.png) no-repeat
}

.flag.flag-gb {
	background-position: -144px -44px
}

.flag.flag-ie {
	background-position: -48px -66px
}

.flag.flag-eu {
    background-position: -16px -44px;
}

.contact-number {
	padding-left: 50px;
	padding-bottom: 5px;
	padding-right: 55px;
}

.contact-number>>>.input-group .input-group__details {
	opacity: 0;
}

.selectedCountry {
	font-size: 15px;
	position: absolute;
	left: 0px;
	padding-left: 8px;
}

.call-number-txt>>>label {
	top: 0px;
}

.contact-number .backspace-icon {
	position: absolute;
	right: 0px;
	top: 10px;
}

.selectedCountry>>>.v-select__selections {
	color: #b9b9b9!important;
}

.contact-number>>>.input-group--text-field label {
	top: 0px !important;
	left: 8px;
	font-size: 14px;
}
</style>

<script lang="ts">
import { Component, Vue, Prop, Watch } from "vue-property-decorator";
import { PhoneNumberFormat, PhoneNumberUtil } from "google-libphonenumber";
import { PhoneNumberType } from "@/common/enums.ts";

@Component
export default class PhoneNumber extends Vue {
    @Prop() public passedPhoneNumber: string;
    @Prop() public isDisabled: boolean;
    @Prop() public isValidationRequired: boolean;

    private phoneNumber: string = "";

    // list of available countries (when adding to this list, make sure to add them to the style section)
    private countries: any[] = [
        { name: 'Great Britain', cc: '+44', code: 'gb' },
        { name: 'Ireland', cc: '+353', code: 'ie' },
        { name: 'International', code: 'eu' },
    ];

    private selectedCountry: any = this.countries[0];

    private util: any = PhoneNumberUtil.getInstance();

    private isValid: boolean = false;
    private validationMessage: string = "";

    @Watch("passedPhoneNumber")
    private passedPhoneNumberUpdated(): void {
        let removePrefix = false;
        if (this.passedPhoneNumber) {
            if (this.passedPhoneNumber !== this.formattedPhoneNumber) {
                this.phoneNumber = this.passedPhoneNumber.trim();
                removePrefix = true;
                this.emitPhoneNumberUpdated(this.phoneNumber);
            }
        } else {
            this.phoneNumber = "";
            this.emitPhoneNumberUpdated(this.phoneNumber);
        }
        this.setDefaultCountry(removePrefix);
        this.validateNumber();
    }

    private changedCountryValue(value: any): void {
        this.selectedCountry = value;
        this.validateNumber();
        this.emitPhoneNumberUpdated(this.phoneNumber);
    }

    private phoneNumberUpdated(): void {
        this.validateNumber();
    }

    @Watch("formattedPhoneNumber")
    private formattedPhoneNumberChanged() {
        this.emitPhoneNumberUpdated(this.formattedPhoneNumber);
    }

    public get formattedPhoneNumber() {
        try {
            const phoneNumberObject: any = this.util.parseAndKeepRawInput(this.phoneNumber, this.selectedCountry.code);
            return this.util.format(phoneNumberObject, PhoneNumberFormat.INTERNATIONAL).replace(/[ \(-\)]/g, '');
        } catch (error) {
            // ignore this error
        }
        return this.phoneNumber;
    }

    private validateNumber(): void {
        this.isValid = false;
        this.validationMessage = "";

        // get the number in national format and display it
        if (this.selectedCountry) {
            if (this.selectedCountry.cc) {
                // try validating the full number and recalculating the national format
                try {
                    const phoneNumberObject: any = this.util.parseAndKeepRawInput(this.phoneNumber, this.selectedCountry.code);
                    this.phoneNumber = this.util.format(phoneNumberObject, this.phoneNumber.startsWith("+") ? PhoneNumberFormat.INTERNATIONAL : PhoneNumberFormat.NATIONAL).replace(/( |\(|\))/g, '');
                    if (this.util.isPossibleNumber(phoneNumberObject)) {
                        // see if it's valid
                        if (this.util.isValidNumber(phoneNumberObject)) {
                            this.isValid = true;
                            this.validationMessage = PhoneNumberType[this.util.getNumberType(phoneNumberObject)];  // TODO: format the phone number type nicely
                        } else {
                            this.isValid = false;
                            this.validationMessage = "Invalid number";
                        }
                    } else {
                        this.isValid = false;
                        this.validationMessage = "Invalid length";
                    }
                } catch (error) {
                    if (!error.toString().endsWith("to be a phone number")) {
                        throw error;
                    }
                }
            }
        } else {
            this.isValid = false;
            this.validationMessage = "Invalid country";
        }
    }

    private setDefaultCountry(trimPhoneNumber: boolean = false): void {
        // check if we can get a country code out of it
        if (!this.phoneNumber) {
            this.selectedCountry = this.countries[0];
        } else if (this.phoneNumber.startsWith("+")) {
            const matchCountryCodes: string = this.countries.filter((x) => x.cc).map((x) => x.cc.replace('+', "\\+")).join('|');
            const matchPhoneNumber = matchCountryCodes + '\\d+';
            if (RegExp(matchPhoneNumber).test(this.phoneNumber)) {
                const matches = this.phoneNumber.match(matchCountryCodes);
                if (matches && matches.length > 0) {
                    const index = this.countries.map((e) => e.cc).indexOf(matches[0]);
                    if (index >= 0) {
                        this.selectedCountry = this.countries[index];
                    } else {
                        this.selectedCountry = this.countries[0];
                    }
                    if (trimPhoneNumber) {
                        this.phoneNumber = this.phoneNumber.substr(this.selectedCountry.cc.length);
                    }
                } else {
                    this.selectedCountry = this.countries[0];
                }
            } else {
                this.selectedCountry = this.countries[this.countries.length - 1];
            }
        }
    }

    private mounted() {
        if (this.passedPhoneNumber) {
            this.phoneNumber = this.passedPhoneNumber.trim().replace(/[^0-9]/g, '');
            this.setDefaultCountry();
            this.validateNumber();
        }
    }

    private NumberValidationMessage(label: string) {
        if (!this.isDisabled) {
            let message: string = this.$validator.errors.collect(label)[0] ? this.$validator.errors.collect(label)[0].msg : '';
            if (message) {
                const errorMessage = label.split(/(\d+)/);
                return message
                ? (message = "The " + errorMessage[0] + " is required.")
                : message;
            } else {
                if ((this.validationMessage === "Invalid length" || this.validationMessage === "Invalid number")) {
                    return message = "The Contact Number is not valid.";
                }
                if (this.validationMessage === "Invalid country") {
                    return message = "The Country Code is required.";
                }
            }
        }
    }

    private emitPhoneNumberUpdated(phoneNumber: string) {
        this.$emit('phoneNumberUpdated', phoneNumber);
    }
}
</script>
