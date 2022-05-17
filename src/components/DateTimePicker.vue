<template>
    <section role="region" aria-label="Date time picker">
    <div :class="isCurrentTime ? 'time-access-content' : ''">

    <div class="dateTimeControl">
        <v-menu v-if="!isStaticLocation"
        v-model="showControl"
        lazy
        :close-on-content-click="false"
        transition="scale-transition"
        offset-y
        :disabled="disabled"
        full-width
        nudge-left="50"
        min-width="300px"
        >
        <v-text-field
        slot="activator"
        :label="placeHolderText"
        aria-required="true"
        append-icon="event"
        required
        :value="selectedValueForDisplay"
        :data-vv-name="'DateTimePicker'"
        :error-messages="validationMessage('DateTimePicker', placeHolderText)"
        v-validate="'required'"
        class="required"
        :placeholder="globalDateTimeFormat"
        v-model="newDate"
        @keyup="validateDate(newDate, timeModel)"
        @keyup.enter.prevent="showControl = true"
        ></v-text-field>
        <v-card class="date-time-picker">
          <v-container>
            <v-layout wrap>
              <v-flex xs12>
                <v-date-picker
                v-model="dateModel"
                no-title
                @input="clickAnyDate"
                scrollable
                :min="minDate"
                :max="maxDate"
                v-if="selectedTab == DateTab"
                color="primary"
                >
              </v-date-picker>
              <v-time-picker
              v-model="timeModel"
              scrollable
              v-if="selectedTab == TimeTab"
              format="24hr"
              :min="minTime"
              :max="maxTime"
              color="primary"
              no-title
              >
            </v-time-picker>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn flat color="primary" @click="onClickCancel" label="Cancel" aria-label="Cancel">Cancel</v-btn>
              <v-btn flat color="primary" @click="onClickOk" label="Ok" aria-label="Ok">OK</v-btn>
            </v-card-actions>
          </v-flex>
        </v-layout>
      </v-container>
    </v-card>
    </v-menu>
    <v-card class="date-time-picker" v-if="isStaticLocation">
          <v-container>
            <v-layout wrap>
              <v-flex xs4 class="left-part primary" >
                <div class="c-datepicker__header">
                  <div class="c-datepicker__header-day">
                    <span class="js-day">{{dayName}}</span>
                  </div>
                  <div class="c-datepicker__header-date">
                    <span class="c-datepicker__header-date__month js-date-month">{{yearName}}</span>
                    <span class="c-datepicker__header-date__day js-date-day">{{dayValue}}</span>
                    <span class="c-datepicker__header-date__time js-date-time">
                      <span class="c-datepicker__header-date__hours js-date-hours active">{{timeValue}}</span>
                    </span>
                  </div>
                </div>
                <div class="activators">
                  <div>
                    <v-icon @click.prevent="onClickDate">event</v-icon>
                  </div>
                  <div>
                    <v-icon @click.prevent="onClickTime">access_time</v-icon>
                  </div>
                </div>
              </v-flex>
              <v-flex xs8>
                <v-date-picker
                v-model="dateModel"
                @input="clickAnyDate"
                no-title
                scrollable
                :min="minDate"
                :max="maxDate"
                v-if="selectedTab == DateTab"
                color="primary"
                >
              </v-date-picker>
              <v-time-picker
              v-model="timeModel"
              scrollable
              v-if="selectedTab == TimeTab"
              format="24hr"
              :min="minTime"
              :max="maxTime"
              color="primary"
              no-title
              >
            </v-time-picker>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn flat color="primary" @click="onClickCancel">Cancel</v-btn>
              <v-btn flat color="primary" @click="onClickOk">OK</v-btn>
            </v-card-actions>
          </v-flex>
        </v-layout>
      </v-container>
    </v-card>
    </div>
     <v-tooltip bottom class="present-time" v-if="showPresentTimeIcon">
        <v-btn icon slot="activator" @click="OnClickPresentTime" aria-label="Current time" @keyup.enter.prevent="OnClickPresentTime">
          <v-icon class="mr-0 text--darken-2" color="grey" >access_time</v-icon>
        </v-btn>
        <span>Current Time</span>
      </v-tooltip>
</div>
</section>
</template>

<style scoped>
  .date-time-picker .v-card {box-shadow: none;}
  .date-time-picker .v-picker--date.v-card {width: 100%;}
  .date-time-picker .container {margin: 0;padding: 0;}
  .date-time-picker >>> .v-picker__body {flex: none;margin-top: 10px;}
  .date-time-picker >>> .v-date-picker-years {max-height: 274px;}
  .date-time-picker >>> .v-picker--time {min-height: 296px;}
  .date-time-picker .v-container, .v-date-time-picker .flex {padding: 0;}
  .date-time-picker >>> .v-time-picker-clock {background: rgba(0, 0, 0, 0.05); height: 270px; width: 270px; padding: 0px;}
  .date-time-picker >>> .v-time-picker-clock__container {align-items: flex-start;padding: 0;height: 270px !important;}
  .date-time-picker >>> .v-time-picker-clock  > span {font-size: 14px;line-height: 18px;}
  .date-time-picker >>> .v-picker__body {display: flex;justify-content: center;}
  .date-time-picker .left-part {position: relative;color: #ffffff;}
  .date-time-picker .left-part .activators {position: absolute;bottom: 10px;left: 10px;right: 10px;display: flex;flex-grow: 1;justify-content: space-between;}
  .date-time-picker .left-part .activators div {cursor: pointer;}
  .date-time-picker .left-part i {color: #ffffff;}
  .c-datepicker__header {text-align: center;}
  .c-datepicker__header-day {padding: 10px;font-size: 17px;line-height: 21px;background: rgba(0, 0, 0, 0.2);}
  .c-datepicker__header-date {padding: 30px 10px;}
  .c-datepicker__header-date > span {display: block;font-size: 16px;line-height: 19px;margin-bottom: 10px;}
  .c-datepicker__header-date > span.js-date-day {line-height: 64px;font-size: 60px;}
  .time-access-content{position: relative !important; }
  .time-access-content .dateTimeControl + .present-time{position: absolute;right: 0px;top: 9px;height: 36px;width: 36px;text-align: right;margin-right: 3px;z-index: 1;}
  .time-access-content >>> .v-input {padding-right: 30px;}
  .time-access-content .present-time >>> .v-icon{cursor: pointer;}
</style>

<script lang="ts" >
import { Component, Vue, Prop, Watch } from "vue-property-decorator";
import moment, { isMoment } from "moment";
import Shared from "@/common/shared";
import storeGetters from '@/storeGetters';

enum Tab {
  Date,
  Time,
}

@Component
export default class DateTimePicker extends Vue {
   public static DATE_FORMAT: string = "YYYY-MM-DD";
  public static TIME_FORMAT: string = "HH:mm";
  public static DATE_TIME_FORMAT: string = DateTimePicker.DATE_FORMAT +
    " " +
    DateTimePicker.TIME_FORMAT;
  public isValidDate: boolean = false;

  private DateTab: Tab = Tab.Date;
  private TimeTab: Tab = Tab.Time;
  private controlDate: moment.Moment | null | undefined = null;
  private initialValue: moment.Moment | null | undefined = null;

  @Prop() private dateTime: moment.Moment;
  @Prop() private placeHolderText: string;
  @Prop() private minDate: string;
  @Prop() private maxDate: string;
  @Prop() private minTime: string;
  @Prop() private maxTime: string;
  @Prop() private displayFormat: string;
  @Prop() private isStaticLocation: boolean;
  @Prop() private isValidationRequired: boolean;
  @Prop() private disabled: boolean;
  @Prop({default: false}) private showPresentTimeIcon: boolean;
  @Prop() private isCurrentTime: boolean;
  @Prop({ default: -1}) private index: number;
  private globalDateTimeFormat: string = storeGetters.getEnvironment().DateTimeFormat;
  private newDate: any = "";

  private showControl = false;
  private dateModel: string = "";
  private timeModel: string = "00:00";
  private selectedTab: Tab = Tab.Date;

  private pauseEmit: boolean = true;

  private mounted() {
    this.pauseEmit = true;
    this.setDateTimeModelsFromValue(this.dateTime);
    this.setControlDate();
    this.pauseEmit = false;
  }

  @Watch("dateTime")
  private valueChanged(newValue: moment.Moment | null | undefined) {
    this.$validator.errors.items = [];
    this.pauseEmit = true;
    this.setDateTimeModelsFromValue(newValue);
    this.setControlDate();
    this.pauseEmit = false;
  }

  @Watch("dateModel")
  private dateChanged(newValue: string) {
    this.setControlDate();
    this.selectedTab = Tab.Time;
  }

  @Watch("timeModel")
  private timeChanged(newValue: string) {
    this.setControlDate();
  }

  @Watch("showControl")
  private controlVisiblityChanged(showingControl: boolean) {
    if (showingControl) {
      this.selectedTab = Tab.Date;
      this.initialValue = this.dateTime;
    }
  }

  private setControlDate(): void {
    if (this.dateModel && this.timeModel) {
      const val = this.dateModel + " " + this.timeModel;
      this.controlDate = moment(val, DateTimePicker.DATE_TIME_FORMAT);
      this.newDate = moment(val, DateTimePicker.DATE_TIME_FORMAT);
      this.newDate = Shared.getFormatedDate(moment(this.newDate), this.globalDateTimeFormat);
    } else {
      this.controlDate = undefined;
    }
    if (!this.pauseEmit) {
      this.emitValueEvent(this.controlDate);
    }
  }

  private emitValueEvent(value: moment.Moment | null | undefined) {
    this.$emit("update:dateTime", value);
  }

  private setDateTimeModelsFromValue(
    newValue: moment.Moment | null | undefined,
  ): void {
    if (!moment.isMoment(newValue) || !newValue.isValid()) {
      this.dateModel = "";
      this.timeModel = "00:00";
      return;
    }

    const newDate: moment.Moment = moment(
      newValue.format(DateTimePicker.DATE_FORMAT),
      DateTimePicker.DATE_FORMAT,
    );
    const newTime: moment.Moment = moment(
      newValue.format(DateTimePicker.TIME_FORMAT),
      DateTimePicker.TIME_FORMAT,
    );

    if (this.minDate) {
      if (moment(this.minDate, DateTimePicker.DATE_FORMAT).isAfter(newDate)) {
        return;
      }
    }
    if (this.maxDate) {
      if (moment(this.maxDate, DateTimePicker.DATE_FORMAT).isBefore(newDate)) {
        return;
      }
    }
    if (this.minTime) {
      if (moment(this.minTime, DateTimePicker.TIME_FORMAT).isAfter(newTime)) {
        return;
      }
    }
    if (this.maxTime) {
      if (moment(this.maxTime, DateTimePicker.TIME_FORMAT).isBefore(newTime)) {
        return;
      }
    }

    const ndm: string = newValue.format(DateTimePicker.DATE_FORMAT);
    if (ndm !== this.dateModel) {
      this.dateModel = ndm;
    }

    const ntm: string = newValue.format(DateTimePicker.TIME_FORMAT);
    if (ntm !== this.timeModel) {
      this.timeModel = ntm;
    }
  }

  private get selectedValueForDisplay(): string {
    if (moment.isMoment(this.dateTime) && this.dateTime.isValid()) {
      // return formatted date as per set in Environment json
      const formattedDate: string = this.displayFormat ?  Shared.getFormatedDate(moment(this.dateTime), this.displayFormat) : Shared.getFormatedDate(moment(this.dateTime), this.globalDateTimeFormat);
      return  formattedDate;
    } else {
      if (this.isValidationRequired !== true) {
        return "---- -- -- --:--";
      } else {
        return "";
      }
    }
  }

  private get yearName(): string {
    if (moment.isMoment(this.controlDate) && this.controlDate.isValid()) {
      return this.controlDate.format("MMMM YYYY");
    }
    return "-- ----";
  }

  private get dayName(): string {
    if (moment.isMoment(this.controlDate) && this.controlDate.isValid()) {
      return this.controlDate.format("dddd");
    }
    return "--";
  }

  private get dayValue(): string {
    if (moment.isMoment(this.controlDate) && this.controlDate.isValid()) {
      return this.controlDate.format("DD");
    }
    return "--";
  }

  private get timeValue(): string {
    if (moment.isMoment(this.controlDate) && this.controlDate.isValid()) {
      return this.controlDate.format("HH:mm");
    }
    return "--:--";
  }

  private onClickDate() {
    this.selectedTab = Tab.Date;
  }

  private onClickTime() {
    this.selectedTab = Tab.Time;
  }

  private onClickOk() {
    this.isValidDate = true;
    this.showControl = false;
  }

  private onClickCancel() {
    // user cancelled, reset dateTime back to value given on display
    this.emitValueEvent(this.initialValue);
    this.showControl = false;
  }

  // Click present time icon to set current value
  private OnClickPresentTime() {
    this.$validator.errors.items = [];
    // close current date picker control
    this.showControl = false;
    this.emitValueEvent(moment(new Date()));
    this.isValidDate = true;
  }

  private clickAnyDate() {
    this.dateChanged(this.dateModel);
  }

  private validationMessage(label: string, errorText: string) {
    let message: string = this.$validator.errors.collect(label)[0] ? this.$validator.errors.collect(label)[0].msg : '';
    const errorMessage = label.split(/(\d+)/);
    let messageText: string = "";
    if (this.newDate) {
      messageText = this.isValidDate ? "" : (message = "The " + errorText + " date is invalid.");
    } else {
      messageText = message ? (message = "The " + errorText + " date is required.") : message;
    }
    return messageText;
  }

  private validateDate(dateString: any, time: any) {
    this.isValidDate = moment(dateString, this.globalDateTimeFormat, true).isValid();
    if (this.isValidDate && (
          moment(dateString, this.globalDateTimeFormat).isAfter(this.dateTime)
      ||  moment(this.maxDate, DateTimePicker.DATE_FORMAT).isBefore(this.dateTime))
      ) {
      this.controlDate = moment(dateString, this.globalDateTimeFormat);
      this.setDateTimeModelsFromValue(this.controlDate);
    } else {
      this.controlDate = undefined;
    }
  }
}
</script>
