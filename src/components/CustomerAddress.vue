<template>
 <section role="region" aria-label="Customer address">
  <div class="client-details">
    <div role="form" aria-label="Customer address form">
      <v-container fluid class="px-2">
        <h2 class="title" v-bind:style="{ color: environment.Settings.PrimaryColor}">Your Property</h2>
        <v-layout wrap class="pa-3 " v-bind:style="{ background: environment.Settings.SecondaryColor }">
          <v-flex xs12 text-xs-right pa-0 class="change-address-btn" v-if="isManualAddressSelected">
            <v-btn flat color="primary" small class="mr-0 pa-0" @click="toggleActiveAddressSearch" label="Pick address" aria-label="Pick address">
              <span>
                <v-icon small>place</v-icon>
                <span class="v-align">Pick Address</span>
              </span>
            </v-btn>
          </v-flex>
          <v-flex xs12 maping-alert v-if="activeAddressSearch && !isManualAddressSelected">
            <v-autocomplete
              v-if="!appInEditMode"
              tabindex="0"
              label="Search address"
              aria-required="true"
              :loading="searchAddressRunning"
              :items="findAddress"
              browser-autocomplete="off"
              :search-input.sync="searchAddress"
              item-text="Description"
              item-value="item"
              ref="searchAddressField"
              :filter="customAddressFilter"
              v-model="selectedAddressSearch"
              return-object
              data-vv-name="Address" 
              :error-messages="errors.collect('Address')" 
              v-validate="'required'"
              :menu-props="{maxHeight:'250'}"
              class="required">
              <template slot="item" slot-scope="data">
                <v-list-tile-content>
                  <v-list-tile-title :class="data.item.Description === 'Add Adress Manually' ? 'bold-select' : ''" v-html="data.item.Description">
                  </v-list-tile-title>
                </v-list-tile-content>
              </template>
            </v-autocomplete>
          </v-flex>
          <v-flex xs12 v-if="showAddressDetails">
            <v-text-field 
              label="Address Line1" 
              aria-required="true"
              v-model.trim="insurerPortal.addressLine1" 
              maxlength="100" 
              required 
              data-vv-name="Address Line1" 
              :error-messages="errors.collect('Address Line1')" 
              v-validate="'required'"
              class="required">
            </v-text-field>
          </v-flex>
          <v-flex xs12 v-if="showAddressDetails">
            <v-text-field 
              label="Address Line2" 
              v-model.trim="insurerPortal.addressLine2" 
              maxlength="100">
            </v-text-field>
          </v-flex>
          <v-flex xs12 v-if="showAddressDetails">
            <v-text-field 
              label="Address Line3" 
              v-model.trim="insurerPortal.addressLine3" 
              maxlength="100">
            </v-text-field>
          </v-flex>
          <v-flex xs12 v-if="showAddressDetails">
            <v-text-field 
              label="Address Line4" 
              v-model.trim="insurerPortal.addressLine4" 
              maxlength="100">
            </v-text-field>
          </v-flex>
          <v-flex xs12 v-if="showAddressDetails">
            <v-text-field 
              label="Postcode" 
              aria-required="true"
              v-model.trim="insurerPortal.postcode" 
              required 
              class="required"
              maxlength="20" 
              data-vv-name="Postcode" 
              :error-messages="errors.collect('Postcode')" 
              v-validate="'required'">
            </v-text-field>
          </v-flex>
        </v-layout>
      </v-container>
    </div>
  </div>
 </section>
</template>

<style scoped>
  .client-details .title {margin-bottom: 15px;}
  .bold-select {font-weight: 600;}
  .header .toolbar__title {display: flex;}
  .custom-value>>>.input-group input {opacity: 0;}
  .hide {display: none;}
  .btn--floating .v-icon {height: auto !important;width: auto !important;}
     @media(max-width: 768px) {
    .client-details .container > .layout,
    .client-details .title{margin:auto 0px !important;}     
    .client-details .container > .layout{margin-bottom: 10px !important;}
    .client-details .title{margin-top: 20px !important; margin-bottom: 10px !important;}
  }
  @media(max-width: 420px) {
    .client-details .layout.px-3{padding:8px !important;}
  }
  .client-details .title {margin-bottom: 15px;}
  .bold-select {font-weight: 600;}
  .header .toolbar__title {display: flex;}
  .custom-value>>>.input-group input {opacity: 0;}
  .hide {display: none;}
  .btn--floating .v-icon {height: auto !important;width: auto !important;}
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
import storeMutations from '@/storeMutations';
import InsurerPortalModel from '@/models/InsurerPortalModel';
import PolicyHolderController from '@/api/policyHolderController';
import Store from "@/store";

@Component({
})

export default class CustomerAddress extends Vue {
    @Prop() private insurerPortal: InsurerPortalModel;
    @Prop() private allowToGetLoqateApiKey: boolean;
    @Prop() private appInEditMode: boolean;

    private isManualAddressSelected: boolean = false;
    private showAddressDetails: boolean = false;
    private searchAddressRunning: boolean = false;
    private findAddress: any = [];
    private searchAddress: string = "";
    private waitForMoreInputTimeoutHandle: number | null = null;
    private activeAddressSearch: boolean = true;
    private selectedAddressSearch: any = "";

    private get getTrackingId() {
      return storeGetters.getTrackingId();
    }

    @Watch("getTrackingId")
    @Watch("allowToGetLoqateApiKey")
    private getLoqateApiKeyForAddress() {
      if (this.getTrackingId && this.allowToGetLoqateApiKey && !this.getLoqateApiKey && !this.appInEditMode) {
        PolicyHolderController.GetLoqateApiKey().then((res: string) => {
          storeMutations.updateLoqateApiKey(res);
        });
      }
    }

    private mounted() {
      if (this.appInEditMode) {
        this.showAddressDetails = true;
        this.searchAddress = "Test";
        this.insurerPortal.addressLine1 = "392, St. Georges Crescent";
        this.insurerPortal.addressLine2 = "Old Marske";
        this.insurerPortal.addressLine3 = "Redcar";
        this.insurerPortal.addressLine4 = "Cleveland";
        this.insurerPortal.postcode = "TS11 8BU";
        this.findAddress = [];
      }
    }

    private get getLoqateApiKey() {
        return storeGetters.getLoqateApiKey();
    }

    private get environment(): Environment {
        return storeGetters.getEnvironment();
    }

    @Watch("selectedAddressSearch")
    private selectedAddressSearchChange(item: any) {
        const self = this;
        self.showAddressDetails = false;
        if (item && item.Type === 'Manual Address') {
            // add address maually
            self.showAddressDetails = true;
            self.isManualAddressSelected = true;
            self.searchAddressRunning = false;
            self.clearAddressFields();
            (self.$refs.searchAddressField as any).blur();
            return;
        }
        if (item && item.Type !== 'Address') {
            this.addressVerification(item.Text, item.Id, true);
            return;
        }
        if (item && self.getLoqateApiKey) {
            PolicyHolderController.RetrieveAddressLoqateApi(item.Id, self.getLoqateApiKey).then((res: any) => {
                if (res && res.data.Items && res.data.Items.length > 0) {
                    self.showAddressDetails = true;
                    const address = res.data.Items[0];
                    if (!address.Error) {
                        self.insurerPortal.addressLine1 = (address.SubBuilding + ' ' + address.BuildingName).trim()
                        + ((address.SubBuilding || address.BuildingName) && (address.BuildingNumber || address.Street) ? ', ' : '')
                        + (address.BuildingNumber + ' ' + address.Street).trim();
                        self.insurerPortal.addressLine2 = address.District;
                        self.insurerPortal.addressLine3 = address.City;
                        self.insurerPortal.addressLine4 = address.AdminAreaName;
                        self.insurerPortal.postcode = address.PostalCode;
                        (self.$refs.searchAddressField as any).blur();
                    }
                }
            });
        }
    }

    @Watch("searchAddress")
    private addressVerification(text: string, id: string, isReSearch: boolean) {
        const self = this;
        const item = this.findAddress.find((i: any) => i.Description === this.searchAddress);
        if (!isReSearch && (!this.searchAddress || item)) {
            return;
        }
        if (this.waitForMoreInputTimeoutHandle) {
            window.clearTimeout(this.waitForMoreInputTimeoutHandle);
        }
        this.waitForMoreInputTimeoutHandle = window.setTimeout(() => {
        if (this.getLoqateApiKey) {
            this.searchAddressRunning = true;
            const reSearchId = isReSearch ? id : '';
            PolicyHolderController.FindAddressFromLoqateApi(text, this.getLoqateApiKey, reSearchId).then((res: any) => {
                if (res && res.data.Items && res.data.Items.length > 0) {
                    this.findAddress = res.data.Items;
                    this.findAddress.forEach((ele: any) => {
                        ele.Description = ele.Type === 'Address' ? ele.Text + ', ' + ele.Description : ele.Description + ', ' + ele.Text;
                    });
                    const isManualAddressExists: number = this.findAddress.filter((x: any) => x.Type === "Manual Address").length;
                    if (isManualAddressExists < 1) {
                        const manualAddress: any = {};
                        manualAddress.Type = "Manual Address";
                        manualAddress.Description = "Add Adress Manually";
                        this.findAddress.push(manualAddress);
                    }
                    this.searchAddressRunning = false;
                    if (isReSearch) {
                        (self.$refs.searchAddressField as any).focus();
                        (self.$refs.searchAddressField as any).isMenuActive = true;
                    }
                }
            });
        }
        }, 300);
    }

    private customAddressFilter(item: any, queryText: string, itemText: string) {
        return true;
    }

    private toggleActiveAddressSearch() {
        this.showAddressDetails = false;
        this.isManualAddressSelected = false;
        this.activeAddressSearch = true;
        this.selectedAddressSearch = "";
        this.clearAddressFields();
    }

    private clearAddressFields() {
        this.insurerPortal.addressLine1 = "";
        this.insurerPortal.addressLine2 = "";
        this.insurerPortal.addressLine3 = "";
        this.insurerPortal.addressLine4 = "";
        this.insurerPortal.postcode = "";
        this.findAddress = [];
    }

    private phoneNumberUpdated(phoneNumber: string): void {
      this.insurerPortal.mobilePhone = phoneNumber;
    }
}
</script>
