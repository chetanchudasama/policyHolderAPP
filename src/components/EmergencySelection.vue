<template>
 <section role="region" aria-label="Emergency selection">
  <div class="emergency">
    <div
      class="add-emergency pa-2"
      v-bind:style="{ background: environment.Settings.SecondaryColor }"
    >
      <v-layout wrap>
        <v-flex xs12 mb-2 pl-2>
          <h2 class="emergency-description">What best describes your situation?</h2>
        </v-flex>
        <v-flex xs12>
          <div class="Emergency-type" role="navigation" aria-label="emergency selection navigation">
            <v-list>
              <v-list-tile
                v-for="(emergency, index) in localSelectedEmergencies"
                :key="index"
                v-if="hasMoreEmergency || index < topEmergencyLength"
                v-model="selectedEmergencyModel"
                role="button"
              >
                <v-list-tile-content
                  class="pa-2 elevation-1"
                  @click="onEmergencySelection(emergency)"
                  @keyup.enter.prevent="onEmergencySelection(emergency)"
                  :class="emergency.isLocal ? 'select-emergency' : ''"
                  v-bind:style="{ borderColor: environment.Settings.ComplementaryColor }"
                  :tabindex="1"
                >
                  <v-avatar>
                    <img
                      :src="emergency.fileURL ? emergency.fileURL : 'img/emergency.svg'"
                      alt=""
                    >
                  </v-avatar>
                  <v-list-tile-title>{{emergency.description}}</v-list-tile-title>
                </v-list-tile-content>
              </v-list-tile>
              <v-list-tile v-if="localSelectedEmergencies.length > 0 && !hasMoreEmergency" role="button">
                <v-list-tile-content
                  class="pa-2 elevation-1 add-other-emergecny"
                  @click="clickMoreEmergencies"
                  @keyup.enter.prevent="clickMoreEmergencies"
                  v-bind:style="{ borderColor: environment.Settings.ComplementaryColor}"
                  :tabindex="2"
                >
                  <v-avatar>
                    <v-icon
                      v-bind:style="{ color: environment.Settings.PrimaryColor}"
                    >add_circle_outline</v-icon>
                  </v-avatar>
                  <v-list-tile-title
                    v-bind:style="{ color: environment.Settings.PrimaryColor +'!important' }"
                  >More Emergencies</v-list-tile-title>
                </v-list-tile-content>
              </v-list-tile>
            </v-list>
          </div>
        </v-flex>
      </v-layout>
      <div
        class="pb-2 mb-2 error-msg"
        v-if="getIsNextButtonClicked && selectedEmergencyModel.length === 0"
      >
        <div class="pa-2 lighten-4">
          <a href="javascript:void(0)" v-bind:style="{ color: environment.Settings.ComplementaryColor }" class="error-class">Please select an Emergency.</a>
        </div>
      </div>
    </div>
    <div
      class="emergency-details pa-3 mt-3"
      v-for="(selectedEmergency, index) in this.getEmergenciesWithDetail"
      :key="index"
      v-bind:style="{ background: environment.Settings.SecondaryColor }"
    >
      <div role="form" :aria-label="`${selectedEmergency.emergencyTypeDesc} form`">
      <v-container fluid class="pa-0">
        <v-layout wrap>
          <v-flex xs12>
          <h2 class="type-description float-left pt-2">{{selectedEmergency.emergencyTypeDesc}}</h2>
          <v-spacer></v-spacer>
          <v-btn
            icon
            flat
            class="ma-0 float-right"
            v-bind:style="{ color: environment.Settings.ComplementaryColor }"
            @click="removeSelectedEmergency(selectedEmergency)"
            :label="`Remove ${selectedEmergency.emergencyTypeDesc} emergency`"
            :aria-label="`Remove ${selectedEmergency.emergencyTypeDesc} emergency`"
          >
            <v-icon small>delete</v-icon>
          </v-btn>
        </v-flex>
        <v-flex xs12>
          <v-select
            :items="getselectedEmergencyDetail(selectedEmergency)"
            item-value="id"
            item-text="description"
            label="Emergency Detail"
            @change="onChangeEmergencyDetail(selectedEmergency)"
            return-object
            v-model="selectedEmergency.emergencyDetail"
            required
            :ref="'emergency' + index"
            :data-vv-name="'Emergency Detail' + index"
            :error-messages="validationMessage('Emergency Detail' + index, selectedEmergency.emergencyDetail)"
            v-validate="'required'"
            class="required"
          ></v-select>
          </v-flex>
            <v-flex xs12>
              <DateTimePicker
                ref="dateTimePicker"
                :dateTime.sync="selectedEmergency.firstNoticedAt"
                :isStaticLocation="false"
                placeHolderText="First Noticed"
                :maxDate="maxFirstNoticedAtDate"
                :isCurrentTime="true"
                :isValidationRequired="true"
                :showPresentTimeIcon="true"
              />
          </v-flex>
      </v-layout>
    </v-container>
    </div>
  </div>
 </div>
 </section>
</template>

<style scoped>
.Emergency-type .v-avatar,
.Emergency-type .v-avatar img {
  border-radius: 0%;
  object-fit: contain;
  margin: auto;
}
.Emergency-type >>> .v-list__tile__title {
  text-align: center;
  white-space: inherit;
  height: auto !important;
  margin-top: 5px;
  color: #212121 !important;
}
.Emergency-type >>> .v-list .v-list__tile {
  height: auto !important;
  width: 100%;
}
.Emergency-type .v-list {
  flex-wrap: wrap;
  display: flex;
  background-color: transparent;
}
.Emergency-type .v-list__tile__content {
  background-color: #fff;
  cursor: pointer;
  transition: 0.3s all linear;
}
.Emergency-type .v-list__tile__content:hover {
  box-shadow: 0px 7px 8px -4px rgba(0, 0, 0, 0.2),
    0px 12px 17px 2px rgba(0, 0, 0, 0.14), 0px 5px 22px 4px rgba(0, 0, 0, 0.12) !important;
}
.Emergency-type .v-list > div {
  width: 50%;
  margin-bottom: 16px;
  display: flex;
}
.select-emergency {
  border-bottom: 3px solid #000;
  background-color: #f5f5f5 !important;
}
.add-other-emergecny >>> .v-icon {
  font-size: 50px;
}
.error-msg {
  padding: 0px 15px !important;
}
.error-msg > div {
  padding: 10px 15px !important;
  border-radius: 4px;
}
.type-description {
  font-size: 1.15em;
}
.error-class {
  text-decoration: none;
  font-weight: bold;
  cursor: none;
  pointer-events: none;
}
.emergency-description {
  font-size: 1.17em;
}
@media (max-width: 420px) {
  .add-emergency label.pl-3 {
    padding-left: 0px !important;
  }
  .Emergency-type >>> .v-list .v-list__tile,
  .v-expansion-panel__header {
    padding: 0px 4px !important;
  }
  .add-emergency.pa-3,
  .emergency-details.pa-3,
  .Emergency-type .v-list > div {
    margin-bottom: 8px;
  }
}
</style>

<script lang="ts">
import { Component, Vue, Prop, Watch } from "vue-property-decorator";
import { Environment } from "@/common/environment";
import storeGetters from "@/storeGetters";
import PolicyHolderController from "@/api/policyHolderController";
import EmergencyModel from "@/models/EmergencyModel";
import AddEmergency from "@/models/AddEmergency";
import DateTimePicker from "@/components/DateTimePicker.vue";
import moment, { Moment, isMoment } from "moment";
import EmergencyDetailModel from '@/models/EmergencyDetailModel';

@Component({
  components: {
    DateTimePicker,
  },
})
export default class EmergencySelection extends Vue {
  @Prop() private emergencyTypes: EmergencyModel[];
  @Prop() private selectedEmergencies: EmergencyModel[];
  @Prop() private emergencies: AddEmergency[];
  @Prop() private isNextButtonClicked: boolean;

  private hasMoreEmergency: boolean = false;
  private selectedEmergencyModel: number[] = [];
  private selectedEmergencyList: EmergencyModel[] = [];
  private maxFirstNoticedAtDate: string = "";
  private localSelectedEmergencies: EmergencyModel[] = [];
  private topEmergencyLength: number = 0;

  public removeEmergencyOnDeleteEmergencyQA(emergency: AddEmergency) {
    this.removeEmergency(emergency);
  }

  @Watch("selectedEmergencies")
  private updateEmergency(newValue: EmergencyModel[]) {
    this.localSelectedEmergencies = newValue;
    this.topEmergencyLength = this.localSelectedEmergencies.length;
    if (this.localSelectedEmergencies.length === this.emergencyTypes.length) {
      this.hasMoreEmergency = true;
    } else {
      this.hasMoreEmergency = false;
    }
  }

  private removeEmergency(emergency: AddEmergency) {
    const emergencyToRemove:
      | EmergencyModel
      | undefined = this.selectedEmergencyList.find(
      (d) => d.id === emergency.emergencyTypeId,
    );
    if (emergencyToRemove !== undefined) {
      this.selectedEmergencyList.splice(
        this.selectedEmergencyList.indexOf(emergencyToRemove),
        1,
      );
      Vue.set(emergencyToRemove, "isLocal", !emergencyToRemove.isLocal);
      this.selectedEmergencyModel.splice(
        this.selectedEmergencyModel.indexOf(emergencyToRemove.id),
        1,
      );
    }
  }

  private removeSelectedEmergency(emergency: AddEmergency) {
    this.removeEmergency(emergency);
    this.getEmergenciesWithDetail.splice(
      this.getEmergenciesWithDetail.findIndex(
        (d: any) => d.emergencyTypeId === emergency.emergencyTypeId,
      ),
      1,
    );
  }

  private mounted() {
    this.maxFirstNoticedAtDate = moment().format(DateTimePicker.DATE_FORMAT);
    this.localSelectedEmergencies = this.selectedEmergencies;
    this.topEmergencyLength = this.localSelectedEmergencies.length;
    if (this.localSelectedEmergencies.length === this.emergencyTypes.length) {
      this.hasMoreEmergency = true;
    } else {
      this.hasMoreEmergency = false;
    }
  }

  private get environment(): Environment {
    return storeGetters.getEnvironment();
  }

  private get getIsNextButtonClicked(): boolean {
    return this.isNextButtonClicked;
  }

  private clickMoreEmergencies() {
    this.hasMoreEmergency = true;
    this.localSelectedEmergencies = this.localSelectedEmergencies.concat(
      this.emergencyTypes.filter((m) => {
        return !this.localSelectedEmergencies.some((s) => {
          return m.id === s.id;
        });
      }),
    );
  }

  private get getEmergenciesWithDetail(): AddEmergency[] {
    return this.emergencies;
  }

  private onEmergencySelection(emergency: EmergencyModel): void {
    const selectedEmergency: AddEmergency = new AddEmergency();
    if (emergency.isLocal) {
      this.selectedEmergencyList.splice(
        this.selectedEmergencyList.findIndex((d) => d.id === emergency.id),
        1,
      );
      this.getEmergenciesWithDetail.splice(
        this.getEmergenciesWithDetail.findIndex(
          (d: any) => d.emergencyTypeId === emergency.id,
        ),
        1,
      );
      this.selectedEmergencyModel.splice(
        this.selectedEmergencyModel.indexOf(emergency.id),
        1,
      );
    } else {
      this.selectedEmergencyModel.push(emergency.id);
      // add default emergency detail option to emergency detail list
      const defaultEmergencyDetail = new EmergencyDetailModel();
      defaultEmergencyDetail.description = "Select Emergency Detail";
      (defaultEmergencyDetail as any).id = null;
      defaultEmergencyDetail.tradeId  = -1;
      defaultEmergencyDetail.typeId = -1;
      if (emergency && emergency.emergencyDetails && emergency.emergencyDetails.length > 0 ) {
        emergency.emergencyDetails.unshift(defaultEmergencyDetail);
      } else {
        emergency.emergencyDetails = [];
        emergency.emergencyDetails.push(defaultEmergencyDetail);
      }
      this.selectedEmergencyList.push(emergency);
      // Maintain list of emergencies in InsurerPortalModel
      selectedEmergency.emergencyTypeId = emergency.id;
      selectedEmergency.emergencyTypeDesc = emergency.description;
      selectedEmergency.fileURL = emergency.fileURL;
      selectedEmergency.emergencyDetailDesc = defaultEmergencyDetail.description;
      selectedEmergency.emergencyDetailId = defaultEmergencyDetail.id;
      (selectedEmergency.emergencyDetail as any) = null;
      this.getEmergenciesWithDetail.push(selectedEmergency);
    }
    Vue.set(emergency, "isLocal", !emergency.isLocal);
    this.$emit("EmergencySelected");
    setTimeout(() => {
      const currentEmergencyIndex = this.getEmergenciesWithDetail.indexOf(
        selectedEmergency,
      );
      if (currentEmergencyIndex >= 0) {
        const commentRef: any = this.$refs["emergency" + currentEmergencyIndex];
        commentRef[0].blur();
      }
    }, 0);
  }

  private getselectedEmergencyDetail(item: any) {
    const emergency:
      | EmergencyModel
      | undefined = this.selectedEmergencyList.find(
      (e) => e.id === item.emergencyTypeId,
    );
    if (emergency !== undefined) {
      return emergency.emergencyDetails;
    }
  }

  private onChangeEmergencyDetail(item: any) {
    // Maintain list of emergencies in InsurerPortalModel
    setTimeout(() => {
      const emergency:
        | AddEmergency
        | undefined = this.getEmergenciesWithDetail.find(
        (e: any) => e.emergencyTypeId === item.emergencyTypeId,
      );
      if (emergency !== undefined) {
        item.emergencyDetail = emergency.emergencyDetail.id === null ? null : emergency.emergencyDetail;
        if (item.emergencyDetail) {
          const detailItem: any = emergency.emergencyDetail;
          emergency.emergencyDetailId = detailItem.id;
          emergency.emergencyDetailDesc = detailItem.description;
          emergency.tradeId = detailItem.tradeId;
        }
      }
    }, 0);
  }

  private validationMessage(label: string, selectedEmergencyDetail: EmergencyDetailModel) {
    let message: string = this.$validator.errors.collect(label)[0] ? this.$validator.errors.collect(label)[0].msg : '';
    const errorMessage = label.split(/(\d+)/);
    if (selectedEmergencyDetail && selectedEmergencyDetail.id === null) {
      return "The Emergency Detail field is required.";
    }
    return message
      ? (message = "The " + errorMessage[0] + " is required.")
      : message;
  }
}
</script>