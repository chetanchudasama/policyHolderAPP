<template>
  <div class="portal-template" v-bind:style="{ backgroundColor: environment.Settings.PrimaryColor}">
    <header role="banner" aria-label="Upload Invoice Receipt for Customer Appointed Tradespeople header">
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
    <div class="content-section pa-4" role="main" aria-label="Upload Invoice Receipt for Customer Appointed Tradespeople content">
      <div class="details-content elevation-1">
        <template v-if="!isLinkNotValid">
          <div class="template-tab">
            <div class="mid-content" v-show="ready">
              <div v-bar="{ useScrollbarPseudo: true}">
                <div>
                    <v-card flat>
                        <v-card-text>
                            <PictureUpload
                                :imageListToUpload="imageListToUpload"
                                :isImageUploading.sync="isImageUploading"
                                headerText="Upload Invoice Receipt for Customer Appointed Tradespeople"
                                :isUploadInvoiceLink="true"
                                :uploadedInvoiceUrl="uploadedInvoiceUrl"
                                ref="pictureUploadRef"
                            ></PictureUpload>
                        </v-card-text>
                    </v-card>
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
            <div class="text-right pr-3 pt-0 pa-2 white insureractions">
              <v-btn
                class="white--text"
                v-bind:style="{ background: environment.Settings.PrimaryColor }"
                :disabled="isLoading || isImageUploading || imageListToUpload.length === 0"
                :loading="isLoading || isImageUploading"
                @click="uploadCATInvoice"
                label="Upload invoice" 
                aria-label="Upload invoice"
              >Upload</v-btn>
            </div>
          </div>
        </template>
        <div v-else class="job-complete-notification px-5">
          <MessageCard message="Unknown or expired link!"></MessageCard>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.toolbar {z-index: 9;}
.portal-template {height: 100%;min-width: 100%;}
.template-tab .mid-content {overflow-y: auto;height: calc(100% - 64px);}
.portal-template >>> .v-toolbar__title {max-width: 230px;}
.logo-img {height: 42px;object-fit: contain;}
.mid-content >>> .emergency-question-content > div {width: 100%;}
.content-section {padding-top: 90px !important;padding-bottom: 24px !important;}
.content-section .details-content {max-width: 500px;margin: auto;background-color: #fff;}
.content-section, .content-section .details-content {height: 100%;}
.template-tab {height:100%;}
.insureractions {position: fixed;left: 0;right: 0;max-width: 500px;margin: auto;z-index: 2;bottom: 24px;border-top: 1px solid #e2e2e2 !important;}
.insureractions >>> .v-btn .v-btn__content {padding: 0px 6px !important;font-size: 12px;}
.loading-spinner {position: absolute;top: 50%;left: 50%;transform: translate(-50%);-webkit-transform: translate(-50%);-ms-transform: translate(-50%);-moz-transform: translate(-50%);}
@media (max-width: 768px) {
  .v-container {padding: 0px !important;}
}
@media (max-width: 548px) {
  .insureractions {left: 24px;right: 24px;}
}
@media (max-width: 420px) {
  .content-section {padding: 10px !important;padding-top: 70px !important;}
  header .v-toolbar__title {max-width: 180px !important;}
  .insureractions {bottom: 10px !important;left: 10px !important;right: 10px !important;}
}
</style>

<script lang="ts">
import { Component, Vue, Prop, Watch } from "vue-property-decorator";
import PictureUpload from "@/components/PictureUpload.vue";
import PictureUploadModel from "@/models/PictureUploadModel";
import MessageCard from "@/components/MessageCard.vue";
import storeMutations from '@/storeMutations';
import storeGetters from '@/storeGetters';
import { Environment } from '@/common/environment';
import JobController from '@/api/jobController';
import Shared from '@/common/shared';
import AddCATInvoiceImageModel from '../models/claim/AddCATInvoiceImageModel';

@Component({
  name: "uploadInvoiceCAT",
  components: {
    PictureUpload,
    MessageCard,
   },
})
export default class UploadInvoiceCAT extends Vue {
    @Prop() private jobId: string;
    private ready: boolean = false;
    private isLinkNotValid: boolean = false;
    private imageListToUpload: string[] = [];
    private isLoading: boolean = false;
    private isImageUploading: boolean = false;
    private recordId: string = "";
    private uploadedInvoiceUrl: string = "";

    private created() {
        this.recordId = this.$route.params.recordId;
        if (this.$route.params.jobId && this.recordId) {
            if (!this.getTrackingId) {
                storeMutations.updateTrackingId(this.$route.params.jobId);
            }
            JobController.AuthoriseCustomerToUploadReceipt(this.recordId)
              .then((res: string | boolean) => {
                  this.ready = true;
                  if (typeof res === "string") {
                      if (res !== "") {
                        this.uploadedInvoiceUrl = res;
                      }
                  } else {
                    this.isLinkNotValid = true;
                  }
              })
              .catch((err: any) => {
                // TODO: handle error
                this.ready = true;
                this.isLinkNotValid = true;
              });
        }
    }

    private get getTrackingId() {
        return storeGetters.getTrackingId();
    }

    private get getUpdatedEmergencies(): number[] {
        return this.environment.Settings.TopEmergencies;
    }

    private get environment(): Environment {
        return storeGetters.getEnvironment();
    }

    private async validate(): Promise<boolean> {
        const pictureUploadSubs = this.$refs.pictureUploadRef as PictureUpload;
        const result: boolean = await pictureUploadSubs.$validator.validateAll();
        // set focus to non validate field
        if (!result) {
            Shared.setValidationFocus(this.$el as HTMLElement);
        }
        return result;
    }

    private uploadCATInvoice() {
        this.validate().then((result: boolean) => {
            if (result) {
              this.isLoading = true;
              const addCustomerReceiptImageModel: AddCATInvoiceImageModel = new AddCATInvoiceImageModel();
              addCustomerReceiptImageModel.blobUrl = this.imageListToUpload[0];
              addCustomerReceiptImageModel.id = this.recordId;
              JobController.SaveCATInvoiceImage(addCustomerReceiptImageModel)
                .then((res: boolean) => {
                    this.isLoading = false;
                })
                .catch((err: any) => {
                    // TODO: handle error
                    this.isLoading = false;
                });
            }
        }).catch((err: any) => {
            // TODO: handle error
        });
    }
}
</script>
