<template>
   <section role="region" aria-label="Customer availability">
      <v-layout wrap class="clt-avb-card customer-avaiablity mt-3 pa-3" v-bind:style="{ backgroundColor: environment.Settings.SecondaryColor}">
          <section role="region" aria-label="First slot availability">
            <v-flex xs12 class="mb-2">
              <TimeSlotPicker :headerText="getTodayDate" :dateSelection="true" :filterByDate="true" :filterSlotByTime="getIsFirstFilterSlotByTime" slotType="Today" :model="customerAvailability" :slotItems.sync="today" :pickedDates="pickedDates" v-on:updateSlotItems="onSlotSelectionChange" ref="todayDateRef"></TimeSlotPicker>
            </v-flex>
            <v-flex xs12 class="text-xs-right py-0" v-if="!hasSecondSlotAvailabilities && tomorrow.length === 0 && dayAfterTomorrow.length === 0 && today.length > 0">
              <v-tooltip top>
                <template v-slot:activator="{ on }">
                  <v-btn v-on="on" icon flat color="primary"  @click="showSecondSlotAvailabilities" label="Add second slot availabilty" aria-label="Add second slot availability" class="primary--text grey lighten-3 ma-0 elevation-0">
                    <v-icon>add</v-icon>
                  </v-btn>
                </template>
                <span>More Availbility Slots</span>
              </v-tooltip>
            </v-flex>
          </section>
          <section role="region" aria-label="Second slot availability">
            <v-flex xs12 class="mb-2" v-if="hasSecondSlotAvailabilities || (tomorrow.length > 0) || (dayAfterTomorrow.length > 0)">
              <TimeSlotPicker :headerText="getTomorrowDate" :dateSelection="true" :filterByDate="true" :filterSlotByTime="getIsSecondFilterSlotByTime" slotType="Tomorrow" :model="customerAvailability" :slotItems.sync="tomorrow" :pickedDates="pickedDates" v-on:updateSlotItems="onSlotSelectionChange" ref="tomorrowDateRef"></TimeSlotPicker>
            </v-flex>
            <v-flex xs12 v-if="!hasThirdSlotAvailabilities && (dayAfterTomorrow.length === 0) && (tomorrow.length > 0)" class="text-xs-right py-0">
              <v-tooltip top>
                <template v-slot:activator="{ on }">
                  <v-btn v-on="on" icon flat color="primary"  @click="showThirdSlotAvailabilities" label="Add third slot availabilty" aria-label="Add third slot availability" class="primary--text grey lighten-3 ma-0 elevation-0">
                    <v-icon>add</v-icon>
                  </v-btn>
                </template>
                <span>More Availbility Slots</span>
              </v-tooltip>
            </v-flex>
          </section>
          <section role="region" aria-label="Third slot availability">
            <v-flex xs12 v-if="hasThirdSlotAvailabilities || (dayAfterTomorrow.length > 0)">
              <TimeSlotPicker :headerText="getDayAfterTomorrowDate" :dateSelection="true" :filterByDate="true" :filterSlotByTime="getIsThirdFilterSlotByTime" slotType="DayAfterTomorrow" :model="customerAvailability" :slotItems.sync="dayAfterTomorrow" :pickedDates="pickedDates" v-on:updateSlotItems="onSlotSelectionChange" ref="dayAfterTomorrowDateRef"></TimeSlotPicker>                        
            </v-flex>
          </section>
      </v-layout>                  
   </section>
</template>

<style scoped>
  .clt-avb-card >>> .v-card{background-color: #f5f5f6;}
  .v-card__title .v-icon, .v-card__title .date-title {margin-top: 25px;}
  .customer-avaiablity >>> .v-card .v-icon{vertical-align: middle;}

</style>

<script lang="ts">
import { Component, Vue, Prop, Watch } from "vue-property-decorator";
import TimeSlot from "@/models/claim/TimeSlot";
import moment from 'moment';
import JobController from "@/api/jobController";
import Shared from "@/common/shared";
import CustomerAvailabilityModel from "@/models/claim/CustomerAvailabilityModel";
import Store from '@/store';
import storeGetters from "@/storeGetters";
import TimeSlotPicker from "@/components/TimeSlotPicker.vue";
import { Environment } from '@/common/environment';

@Component({
  components: {
      TimeSlotPicker,
    },
})

export default class CustomerAvailabilityPreview extends Vue {
  private today: TimeSlot[] = [];
  private tomorrow: TimeSlot[] = [];
  private dayAfterTomorrow: TimeSlot[] = [];
  private dayAfterTomorrowDate: Date = new Date();
  private firstPickedDate: string = "";
  private secondPickedDate: string = "";
  private thirdPickedDate: string = "";
  private hasSecondSlotAvailabilities: boolean = false;
  private hasThirdSlotAvailabilities: boolean = false;
  private pickedDates: string[] = [];

  public resetValue() {
    this.hasSecondSlotAvailabilities = this.tomorrow.length === 0 ? false : true;
    this.hasThirdSlotAvailabilities = this.dayAfterTomorrow.length === 0 ? false : true;
    const todayDateRef = this.$refs.todayDateRef as TimeSlotPicker;
    if (todayDateRef) {
      todayDateRef.$validator.errors.items = [];
    }
    const tomorrowDateRef = this.$refs.tomorrowDateRef as TimeSlotPicker;
    if (tomorrowDateRef) {
      tomorrowDateRef.$validator.errors.items = [];
    }
    const dayAfterTomorrowDateRef = this.$refs.dayAfterTomorrowDateRef as TimeSlotPicker;
    if (dayAfterTomorrowDateRef) {
      dayAfterTomorrowDateRef.$validator.errors.items = [];
    }
  }

  private created() {
    if (!this.customerAvailability.timeSlot) {
      this.customerAvailability.timeSlot = [];
    }

    const tempDate: Date = new Date();
    this.today = Shared.SortData(this.customerAvailability.timeSlot.filter((a: TimeSlot) => new Date(a.startTime.toString()).getDate() === tempDate.getDate() && new Date(a.startTime.toString()).getHours() >= tempDate.getHours()), 'startTime');
    this.getTodayDate = Shared.getFormatedDate(moment(tempDate), Store.state.Environment.DateFormat);

    tempDate.setDate(tempDate.getDate() + 1);
    this.tomorrow = Shared.SortData(this.customerAvailability.timeSlot.filter((a: TimeSlot) => new Date(a.startTime.toString()).getDate() === tempDate.getDate()), 'startTime');
    this.getTomorrowDate = Shared.getFormatedDate(moment(tempDate), Store.state.Environment.DateFormat);

    tempDate.setDate(tempDate.getDate() + 1);
    this.dayAfterTomorrowDate = new Date(tempDate);
    this.getDayAfterTomorrowDate = Shared.getFormatedDate(moment(this.dayAfterTomorrowDate), Store.state.Environment.DateFormat);

    const tomorrowDate: Date = new Date();
    tomorrowDate.setDate(tomorrowDate.getDate() + 1);
    // Get custom selected date slots items if user had picked manually from date picker
    const getSlotsForCustomDate = this.customerAvailability.timeSlot.filter((a: TimeSlot) => new Date(a.startTime.toString()) > tomorrowDate);
    if (getSlotsForCustomDate.length > 0) {
      this.getDayAfterTomorrowDate = Shared.getFormatedDate(moment(getSlotsForCustomDate.map((c) => c.startTime)[0]), Store.state.Environment.DateFormat);
    }
    this.dayAfterTomorrow = Shared.SortData(getSlotsForCustomDate, 'startTime');
  }

  private get environment(): Environment {
    return storeGetters.getEnvironment();
  }

  private get customerAvailability(): CustomerAvailabilityModel {
      return new CustomerAvailabilityModel();
  }

  private get getDayAfterTomorrowDate(): string {
    return this.thirdPickedDate;
  }

  private set getDayAfterTomorrowDate(newValue: string) {
    this.thirdPickedDate = newValue;
  }

  private get getTodayDate(): string {
    return this.firstPickedDate;
  }

  private set getTodayDate(newValue: string) {
    this.firstPickedDate = newValue;
  }

  private get getTomorrowDate(): string {
    return this.secondPickedDate;
  }

  private set getTomorrowDate(newValue: string) {
    this.secondPickedDate = newValue;
  }

  private onSlotSelectionChange(slotItems: TimeSlot[], pickedDate: any, slotType: string) {
    if (slotType === "Today") {
      this.today = slotItems;
      this.getTodayDate = pickedDate;
    } else if (slotType === "Tomorrow") {
      this.tomorrow = slotItems;
      this.getTomorrowDate = pickedDate;
    } else if (slotType === "DayAfterTomorrow") {
      this.dayAfterTomorrow = slotItems;
      this.getDayAfterTomorrowDate = pickedDate;
    }

    this.save();
    this.pickedDates = this.getPickedDates();
  }

  private save() {
    const self = this;
    let availableTimeSlots: TimeSlot[] = this.today.concat(this.tomorrow).concat(this.dayAfterTomorrow);
    // remove All and Daytime slots
    availableTimeSlots = availableTimeSlots.filter((a: TimeSlot) => a.slotId > 0);
    this.customerAvailability.timeSlot = availableTimeSlots;
    self.$emit('updateCustomerAvailability', this.customerAvailability.timeSlot);
  }

  private showSecondSlotAvailabilities() {
    this.getTomorrowDate = Shared.getFormatedDate(moment(this.getTodaySlotsItems().map((c: any) => c.startTime)[0]).add(1, 'days'), Store.state.Environment.DateFormat);
    this.hasSecondSlotAvailabilities = !this.hasSecondSlotAvailabilities;
  }

  private showThirdSlotAvailabilities() {
    const dateFormat: string = "YYYY-MM-DD";
    const firstPickedDate = moment(this.getTodaySlotsItems().map((c: any) => c.startTime)[0]).format(dateFormat);
    const secondPickedDate = moment(this.getTomorrowSlotsItems().map((c: any) => c.startTime)[0]).format(dateFormat);
    if (secondPickedDate > firstPickedDate) {
      this.getDayAfterTomorrowDate = Shared.getFormatedDate(moment(this.getTomorrowSlotsItems().map((c: any) => c.startTime)[0]).add(1, 'days'), Store.state.Environment.DateFormat);
    } else {
      const tempDate = moment(this.getTomorrowSlotsItems().map((c: any) => c.startTime)[0]).add(1, 'days').format(dateFormat);
      if (tempDate === firstPickedDate) {
        this.getDayAfterTomorrowDate = Shared.getFormatedDate(moment(this.getTodaySlotsItems().map((c: any) => c.startTime)[0]).add(1, 'days'), Store.state.Environment.DateFormat);
      } else {
        this.getDayAfterTomorrowDate = Shared.getFormatedDate(moment(this.getTomorrowSlotsItems().map((c: any) => c.startTime)[0]).add(1, 'days'), Store.state.Environment.DateFormat);
      }
    }
    this.hasThirdSlotAvailabilities = !this.hasThirdSlotAvailabilities;
  }

  private getTodaySlotsItems() {
    const firstDateTimeSlots = this.customerAvailability.timeSlot.filter((a: TimeSlot) => a.slotId !== -1 && a.slotId !== 0 && a.availabilityOrder === 1);
    if (firstDateTimeSlots.length > 0) {
      return Shared.SortData(firstDateTimeSlots, "startTime");
    }
    return [];
  }

  private getTomorrowSlotsItems() {
    const secondDateTimeSlots = this.customerAvailability.timeSlot.filter((a: TimeSlot) => a.slotId !== -1 && a.slotId !== 0 && a.availabilityOrder === 2);
    if (secondDateTimeSlots.length > 0) {
      return Shared.SortData(secondDateTimeSlots, "startTime");
    }
    return [];
  }

  private getDayAfterTomorrowSlotsItems() {
    const thirdDateTimeSlots = this.customerAvailability.timeSlot.filter((a: TimeSlot) => a.slotId !== -1 && a.slotId !== 0 && a.availabilityOrder === 3);
    if (thirdDateTimeSlots.length > 0) {
      return Shared.SortData(thirdDateTimeSlots, "startTime");
    }
    return [];
  }

  private getPickedDates(): string[] {
    const dateFormat: string = "YYYY-MM-DD";
    const pickedDates: string[] = [];
    if (this.getTodaySlotsItems().length > 0) {
      pickedDates.push(Shared.getFormatedDate(moment(this.getTodaySlotsItems().map((c: any) => c.startTime)[0]), dateFormat));
    }
    if (this.getTomorrowSlotsItems().length > 0) {
      pickedDates.push(Shared.getFormatedDate(moment(this.getTomorrowSlotsItems().map((c: any) => c.startTime)[0]), dateFormat));
    }
    if (this.getDayAfterTomorrowSlotsItems().length > 0) {
      pickedDates.push(Shared.getFormatedDate(moment(this.getDayAfterTomorrowSlotsItems().map((c: any) => c.startTime)[0]), dateFormat));
    }
    return pickedDates;
  }

  private get getIsFirstFilterSlotByTime(): boolean {
    return this.isTodayDate(this.getTodayDate);
  }

  private get getIsSecondFilterSlotByTime(): boolean {
    return this.isTodayDate(this.getTomorrowDate);
  }

  private get getIsThirdFilterSlotByTime(): boolean {
    return this.isTodayDate(this.getDayAfterTomorrowDate);
  }

  private isTodayDate(date: string): boolean {
    if (date === (Shared.getFormatedDate(moment(new Date()), Store.state.Environment.DateFormat))) {
      return true;
    }
    return false;
  }
}
</script>
