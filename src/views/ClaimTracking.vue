<template>
  <div
    class="portal-template primary"
    v-bind:style="{ background: environment.Settings.PrimaryColor + '!important'}"
  >
    <header role="banner" aria-label="Claim traking header">
      <v-container class="fluid pa-0">
        <template>
          <v-toolbar class="white">
            <v-toolbar-title>
              <img
                :src="environment.Settings.LogoURL ? environment.Settings.LogoURL : 'img/temp-logo.png'"
                class="img-responsive logo-img"
                :alt="(environment.Settings.DisplayName ? environment.Settings.DisplayName : 'Policy') + ' - Logo'"
              >
            </v-toolbar-title>
            <v-spacer></v-spacer>
          </v-toolbar>
        </template>
      </v-container>
    </header>
    <div class="content-section" role="main" aria-label="Claim tracking content">
      <div class="details-content elevation-1" v-bar="{ useScrollbarPseudo: true}">
        <div
          class="scroll-content"
          v-bind:style="{ height: (windowHeight - 110) + 'px !important' }"
        >
        <div v-if="!isJobCompleted">
          <v-tabs
            v-model="activeTab"
            color="grey lighten-4"
            dark
            :slider-color="environment.Settings.ComplementaryColor"
          >
            <v-tab
              v-for="(claimTrackingModel, index) in claimTrackingModels"
              :key="index"
              :href="`#tab-${index}`"
              ripple
              class="grey--text"
              @click.native="setSlideArrows(index)"
            >
              <span>
                {{claimTrackingModel.claimEmergencyDetail ? claimTrackingModel.claimEmergencyDetail.typeDescription : ''}}
                <span
                  v-if="claimTrackingModel && claimTrackingModel.claimEmergencyDetail"
                  class="tab-sub-text"
                >({{claimTrackingModel.claimEmergencyDetail.detailDescription}})</span>
              </span>
            </v-tab>
          </v-tabs>
          <v-tabs-items v-model="activeTab">
            <v-tab-item
              v-for="(claimTrackingModel, index) in claimTrackingModels"
              :key="index"
              :value="`tab-${index}`"
            >
              <ClaimTrackingDetails
                :claimTrackingDetailsModel="claimTrackingModel"
                ref="claimTrackingDetail"
                :selectedClaimIndex="selectedClaimIndex"
                :totalClaimsCount="totalEmergencyCount"
                :previousLatitude="engineerLocationPreviousLatitude"
                :previousLongitude="engineerLocationPreviousLongitude"
                :headingMagneticNorth="headingMagneticNorth"
                :showProgressBar="showProgressBar(claimTrackingModel.claimVisitComplete !== undefined)"
              ></ClaimTrackingDetails>
            </v-tab-item>
          </v-tabs-items>
          <v-btn
            icon
            class="previous-tab-icon"
            v-if="totalEmergencyCount > 1 && showLeftSliderIcon"
            v-bind:style="{ color: environment.Settings.ComplementaryColor}"
            flat
            @click="previous"
            label="Move to Previous emergency" 
            aria-label="Move to Previous emergency"
          >
            <v-icon small>arrow_back_ios</v-icon>
          </v-btn>
          <v-btn
            flat
            icon
            v-if="totalEmergencyCount > 1 && showRightSliderIcon"
            v-bind:style="{ color: environment.Settings.ComplementaryColor}"
            class="next-tab-icon"
            dark
            @click="next"
            label="Move to Next emergency" 
            aria-label="Move to Next emergency"
          >
            <v-icon small>arrow_forward_ios</v-icon>
          </v-btn>
        </div>
        <div v-else class="job-complete-notification px-5">
          <MessageCard message="Your tracking link is expired!"></MessageCard>
        </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.content-section >>> .previous-tab-icon,
.content-section >>> .next-tab-icon {
  position: absolute;
  top: 50%;
  font-weight: 600;
}
.content-section >>> .previous-tab-icon i,
.content-section >>> .next-tab-icon i {
  font-size: 24px !important;
}
.content-section >>> .previous-tab-icon {
  left: 0px;
}
.content-section >>> .previous-tab-icon i {
  padding-left: 9px;
}
.content-section >>> .next-tab-icon {
  right: 0px;
}
.portal-template {
  height: 100%;
}
header .v-toolbar__title {
  max-width: 230px;
}
.logo-img {
  height: 42px;
  object-fit: contain;
}
.content-section >>> .details-content {
  width: 500px;
  max-width: 100%;
  margin: auto;
  background-color: #fff;
}
.header .v-toolbar__title {
  display: flex;
}
.details-content >>> .v-card {
  padding-left: 80px !important;
  padding-right: 40px !important;
}
.details-content >>> .v-tabs__bar .v-tabs__slider-wrapper {
  z-index: 3;
}
.content-section >>> .v-tabs__bar .v-tabs__item {
  flex-wrap: wrap;
  text-align: center;
}
.content-section >>> .v-tabs__bar .v-tabs__item .tab-sub-text {
  font-size: 11px;
  width: 100%;
  display: block;
}
.content-section >>> .v-tabs__bar .v-tabs__item > span {
  display: block;
  width: 100%;
}
.content-section >>> .v-tabs__bar .v-tabs__item--active {
  background-color: #ffffff;
  color: #ca054f;
  font-weight: 600;
  box-shadow: 0px 0px 3px 0px #c5c5c5;
}
.content-section >>> .v-tabs__bar > i {
  color: #909090;
  display: inline-flex;
}
.content-section >>> .v-tabs__bar {
  position: fixed;
  bottom: 24px;
  z-index: 6;
  width: 500px;
  box-shadow: 0px -1px 1px 0px #f1f1f1;
}
.content-section >>> .v-tabs__content {
  padding-bottom: 25px;
}
.content-section >>> .v-tabs__container .v-tabs__div {
  max-width: inherit !important;
}
.content-section{
  padding-top: 24px !important;
  padding-bottom: 24px !important;
      height: calc(100% - 64px);
}
.details-content {
  height: 100%;
}
.template-tab .mid-content {
    overflow-y: auto;
    height: calc(100% - 64px);
}

@media (max-width: 768px) {
  .content-section {
    padding: 15px !important;
  }
  .container {
    padding: 0px !important;
  }
  .content-section >>> .v-tabs__bar {
    bottom: 15px;
  }
  .content-section{
    height: calc(100% - 56px);
  }
}
@media (max-width: 530px) {
  .content-section >>> .v-tabs__bar {
    width: 93.8%;
  }
}
@media (max-width: 420px) {
  .details-content >>> .v-card {
    padding-left: 50px !important;
    padding-right: 0px !important;
  }
  .details-content >>> .carousel__right {
    right: -12px;
  }
  .details-content >>> .carousel__left {
    left: -12px;
  }
  .content-section >>> .v-tabs__bar {
    width: 90.5%;
  }
  .content-section >>> .v-tabs__bar .tabs__item {
    font-size: 12px;
  }
  .content-section >>> .previous-tab-icon {
    left: -13px;
  }
  .content-section >>> .next-tab-icon {
    right: -11px;
  }
}
</style>

<script lang="ts">
import { Component, Vue, Watch, Prop } from "vue-property-decorator";
import moment, { Moment, isMoment } from "moment";
import ClaimTrackingDetails from "@/components/ClaimTrackingDetails.vue";
import { Environment } from "@/common/environment";
import storeGetters from "@/storeGetters";
import JobController from "@/api/jobController";
import ClaimTrackingModel from "@/models/ClaimTracking/ClaimTrackingModel";
import ClaimEmergencyDetail from "@/models/ClaimTracking/ClaimEmergencyDetail";
import SignalRHubConnection, {
  ConnectionState,
} from "@/signalr/SignalRHubConnection";
import EngineerAssigned from "@/models/ClaimTracking/EngineerAssigned";
import CoverIncluded from "@/models/ClaimTracking/CoverIncluded";
import EngineerOnTheWay from "@/models/ClaimTracking/EngineerOnTheWay";
import EngineerOnSite from "@/models/ClaimTracking/EngineerOnSite";
import ClaimVisitComplete from "@/models/ClaimTracking/ClaimVisitComplete";
import ClaimRequest from "@/models/ClaimTracking/ClaimRequest";
import SignalRController from "@/api/signalrController";
import { ClaimTrackingType } from "@/common/enums";
import storeMutations from "../storeMutations";
import Shared from '../common/shared';
import MessageCard from "@/components/MessageCard.vue";

@Component({
  name: "ClaimTracking",
  components: {
    ClaimTrackingDetails, MessageCard,
  },
})
export default class ClaimTracking extends Vue {
  @Prop() private jobId: string;
  private ready: boolean = false;
  private active: any = null;
  private windowHeight: number = 0;
  private selectedItem = 0;
  private claimTrackingModelList: ClaimTrackingModel[] = [];
  private claimTrackingModelDetail: ClaimTrackingModel = new ClaimTrackingModel();
  private claimEmergencyDetail: ClaimEmergencyDetail[] = [];
  private isResponseFound: boolean = false;
  private tabId: string = "tab-";
  private tabNumber: string = "0";
  private activeTab: string = this.tabId + this.tabNumber;
  private totalEmergencyCount: number = 0;
  private showLeftSliderIcon: boolean = true;
  private showRightSliderIcon: boolean = true;
  private selectedClaimIndex: number = 1;
  private signalRHub: SignalRHubConnection = new SignalRHubConnection(
    "jobTracking",
  );
  private engineerLocationPreviousLatitude: number = 0;
  private engineerLocationPreviousLongitude: number = 0;
  private headingMagneticNorth: number = 0;
  private isJobCompleted: boolean = false;
  private isCurrentTabIsActive: boolean = true;
  private localTimer: Date = new Date();

  private destroyed() {
    if (this.signalRHub != null) {
      this.signalRHub.disconnect();
    }
  }

  private get environment(): Environment {
    return storeGetters.getEnvironment();
  }

  private get claimTrackingModels(): ClaimTrackingModel[] {
    return this.claimTrackingModelList;
  }

  private set claimTrackingModels(value: ClaimTrackingModel[]) {
    this.claimTrackingModelList = value;
  }

  private created() {
    storeMutations.updateTrackingId(this.jobId);
    setTimeout(() => {
      this.GetJobTrackingDocuments();
      this.signalRJobTrackingRequest();
    }, 1000);
    document.addEventListener('visibilitychange', () => {
      this.isCurrentTabIsActive = document.hidden ? false : true;
    });
  }

  private GetJobTrackingDocuments() {
    const self = this;
    this.isJobCompleted = false;
    JobController.GetJobTrackingDocuments()
      .then((res: ClaimTrackingModel[]) => {
        self.claimTrackingModels = res;
        self.claimTrackingModels.forEach((element) => {
          self.claimEmergencyDetail.push(element.claimEmergencyDetail);
        });
        self.totalEmergencyCount = res.length;
        self.activeTab = "tab-0";
        self.showLeftSliderIcon = false;
        self.showRightSliderIcon = false;
        self.selectedClaimIndex = 1;
        if (self.totalEmergencyCount > 1) {
          self.showRightSliderIcon = true;
        }
      })
      .catch((err: any) => {
        self.claimTrackingModels = [];
        if (err.response.status === 401) {
          this.isJobCompleted = true;
        } else {
          this.$router.replace("/");
        }
        //  TODO: handle error
      });
  }

  private signalRJobTrackingRequest() {
    const self = this;
    self.signalRHub.addHandler(
      "jobTrackingRequest",
      (documentId: string, type: ClaimTrackingType) => {
        JobController.GetJobDocument(documentId).then((res) => {
          let claimTrackingModel: ClaimTrackingModel | undefined;
          let typeCheckBool = false;
          switch (type) {
            case ClaimTrackingType.TrackClaimEmergencyDetail:
              const claimEmergencyDetail: ClaimEmergencyDetail = Object.assign(
                new ClaimEmergencyDetail(),
                res,
              );
              claimTrackingModel = self.claimTrackingModelList.find(
                (c) =>
                  c.claimEmergencyDetail &&
                  c.claimEmergencyDetail.detailId ===
                    claimEmergencyDetail.detailId,
              );
              if (!claimTrackingModel) {
                // some time it is possible claim request comes before claim emergency detail request
                claimTrackingModel = self.claimTrackingModelList.find(
                  (c) =>
                    c.claimRequest.forEmergencyDetailId ===
                    claimEmergencyDetail.detailId,
                );
              }
              if (claimTrackingModel) {
                claimTrackingModel.claimEmergencyDetail = claimEmergencyDetail;
              } else {
                claimTrackingModel = new ClaimTrackingModel();
                claimTrackingModel.claimEmergencyDetail = claimEmergencyDetail;
                self.claimTrackingModels.push(claimTrackingModel);
              }
              this.totalEmergencyCount += 1;
              break;
            case ClaimTrackingType.TrackClaimRequest:
              const claimRequest: ClaimRequest = Object.assign(
                new ClaimRequest(),
                res,
              );
              claimTrackingModel = self.claimTrackingModelList.find(
                (c) =>
                  c.claimEmergencyDetail &&
                  c.claimEmergencyDetail.detailId ===
                    claimRequest.forEmergencyDetailId,
              );
              if (claimTrackingModel) {
                claimTrackingModel.claimRequest = claimRequest;
              } else {
                claimTrackingModel = new ClaimTrackingModel();
                claimTrackingModel.claimRequest = claimRequest;
                self.claimTrackingModels.push(claimTrackingModel);
              }
              typeCheckBool = true;
              break;
            case ClaimTrackingType.TrackCoverIncluded:
              const coverIncluded: CoverIncluded = Object.assign(
                new CoverIncluded(),
                res,
              );
              claimTrackingModel = self.claimTrackingModelList.find(
                (c) =>
                  c.claimEmergencyDetail.detailId ===
                  coverIncluded.forEmergencyDetailId,
              );
              if (claimTrackingModel) {
                claimTrackingModel.coverIncluded = coverIncluded;
                typeCheckBool = true;
              }
              break;
            case ClaimTrackingType.TrackEngineerAssigned:
              const engineerAssigned: EngineerAssigned = Object.assign(
                new EngineerAssigned(),
                res,
              );
              claimTrackingModel = self.claimTrackingModelList.find(
                (c) =>
                  c.claimEmergencyDetail.detailId ===
                  engineerAssigned.forEmergencyDetailId,
              );
              if (claimTrackingModel) {
                claimTrackingModel.engineerAssigned = engineerAssigned;
                typeCheckBool = true;
              }
              break;
            case ClaimTrackingType.TrackEngineerOnTheWay:
              if (!this.isCurrentTabIsActive) {
                return;
              }
              const engineerOnTheWay: EngineerOnTheWay = Object.assign(
                new EngineerOnTheWay(),
                res,
              );
              claimTrackingModel = self.claimTrackingModelList.find(
                (c) =>
                  c.claimEmergencyDetail.detailId ===
                  engineerOnTheWay.forEmergencyDetailId,
              );
              if (claimTrackingModel) {
                if (!claimTrackingModel.engineerOnTheWay) {
                  this.engineerLocationPreviousLatitude =
                    engineerOnTheWay.latitude;
                  this.engineerLocationPreviousLongitude =
                    engineerOnTheWay.longitude;
                } else {
                  // take past lat long to show transaction
                  this.engineerLocationPreviousLatitude =
                    claimTrackingModel.engineerOnTheWay.latitude;
                  this.engineerLocationPreviousLongitude =
                    claimTrackingModel.engineerOnTheWay.longitude;
                }
                this.headingMagneticNorth =
                  engineerOnTheWay.headingMagneticNorth;
                claimTrackingModel.engineerOnTheWay = engineerOnTheWay;
                typeCheckBool = true;
              }
              break;
            case ClaimTrackingType.TrackEngineerOnSite:
              const engineerOnSite: EngineerOnSite = Object.assign(
                new EngineerOnSite(),
                res,
              );
              claimTrackingModel = self.claimTrackingModelList.find(
                (c) =>
                  c.claimEmergencyDetail.detailId ===
                  engineerOnSite.forEmergencyDetailId,
              );
              if (claimTrackingModel) {
                claimTrackingModel.engineerOnSite = engineerOnSite;
                typeCheckBool = true;
              }
              break;
            case ClaimTrackingType.TrackClaimVisitComplete:
              const claimVisitComplete: ClaimVisitComplete = Object.assign(
                new ClaimVisitComplete(),
                res,
              );
              claimTrackingModel = self.claimTrackingModelList.find(
                (c) =>
                  c.claimEmergencyDetail.detailId ===
                  claimVisitComplete.forEmergencyDetailId,
              );
              if (claimTrackingModel) {
                claimTrackingModel.claimVisitComplete = claimVisitComplete;
                typeCheckBool = true;
              }
              break;
          }

          if (claimTrackingModel && typeCheckBool) {
            const trackingDetail = self.$refs
              .claimTrackingDetail as ClaimTrackingDetails[];
            const index: number = self.claimTrackingModelList.indexOf(
              claimTrackingModel,
            );
            if (index && trackingDetail[index]) {
              trackingDetail[index].updatedClaimTrackingModel(
                claimTrackingModel,
                true,
              );
            }
          }
        });
      },
    );

    // assign empty model on job abandoned
    this.signalRHub.addHandler("deleteTrackingDocuments", (visitId: string) => {
      const trackingModelIndex: number = self.claimTrackingModelList.findIndex(
        (model) =>
          model.engineerAssigned
            ? model.engineerAssigned.engineerVisitDetailId === visitId
            : false,
      );
      if (trackingModelIndex !== -1) {
        const trackingModel = self.claimTrackingModelList[trackingModelIndex];
        // revert emergency tracking on abandoned
        trackingModel.engineerAssigned = null;
        trackingModel.engineerOnTheWay = null;
        trackingModel.engineerOnSite = null;
        self.claimTrackingModelList.splice(
          trackingModelIndex,
          1,
          trackingModel,
        );
        // revert the progress bar and header text
        const trackingDetail = self.$refs
          .claimTrackingDetail as ClaimTrackingDetails[];
        const index: number = self.claimTrackingModelList.indexOf(
          trackingModel,
        );
        trackingDetail[index].updatedClaimTrackingModel(trackingModel, true);
      }
    });

    // later on we will pass tracking ID over here
    this.signalRHub.connect(this.jobId);
    SignalRController.AddUserToNotificationsForJobTracking();
  }

  private mounted() {
    const self = this;
    window.addEventListener("resize", () => {
      this.windowHeight = window.innerHeight;
    });
    window.addEventListener('beforeunload', () => {
      // send event updates to google analytics
      Shared.sendEventsInGoogleAnalytics('Tracking Page', 'TIME SPENT', this.localTimer);
    }, false);
    this.windowHeight = window.innerHeight;
  }

  private next() {
    const self = this;
    const getTabModel = this.activeTab.split("-");
    const nextIndexAsNumber = parseInt(getTabModel[1], 10);
    const nextIndex = nextIndexAsNumber + 1;
    if (self.totalEmergencyCount !== nextIndex) {
      this.activeTab = this.tabId + nextIndex;
      this.showLeftSliderIcon = true;
    }

    const currentIndex: number = nextIndex + 1;
    if (currentIndex === self.totalEmergencyCount) {
      this.showRightSliderIcon = false;
    }

    if (self.selectedClaimIndex > 0) {
      self.selectedClaimIndex = self.selectedClaimIndex + 1;
    } else {
      self.selectedClaimIndex = 1;
    }
  }

  private previous() {
    const self = this;
    const getTabModel = this.activeTab.split("-");
    const previousIndexAsNumber = parseInt(getTabModel[1], 10);
    const previousIndex = previousIndexAsNumber - 1;
    if (previousIndex > -1) {
      this.activeTab = this.tabId + previousIndex;
      this.showRightSliderIcon = true;
    }
    const currentIndex: number = previousIndex - 1;
    if (currentIndex === -1) {
      this.showLeftSliderIcon = false;
    }

    if (self.selectedClaimIndex > 1) {
      self.selectedClaimIndex = self.selectedClaimIndex - 1;
    } else {
      self.selectedClaimIndex = 1;
    }
  }

  private setSlideArrows(index: number) {
    const getTabModel = this.activeTab.split("-");
    const currentIndex = parseInt(getTabModel[1], 10);
    const totalEmergencyCountAsIndex = this.totalEmergencyCount - 1;
    this.showRightSliderIcon = true;
    this.showLeftSliderIcon = true;
    if (currentIndex === totalEmergencyCountAsIndex) {
      this.showRightSliderIcon = false;
      this.showLeftSliderIcon = true;
    }
    if (currentIndex === 0) {
      this.showRightSliderIcon = true;
      this.showLeftSliderIcon = false;
    }
    this.selectedClaimIndex = index + 1;
  }

  private showProgressBar(isEmergencyCompleted: boolean) {
    if (isEmergencyCompleted) {
      return false;
    } else {
      return true;
    }
  }
}
</script>
