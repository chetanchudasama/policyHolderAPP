<template>
    <section role="region" aria-label="Time slot picker">
    <v-layout wrap>
      <v-flex xs12>
          <v-layout  wrap>
              <v-flex xs12>
                      <v-icon v-bind:style="{ color: environment.Settings.ComplementaryColor}" class=" mr-1 md-icon">date_range</v-icon>
                       <b> {{dateSelection ? "Select Date" : headerText}} </b>
              </v-flex>
               <v-flex xs12>
                  <v-menu
                    v-if="dateSelection"
                    ref="datePickerMenu"
                    :close-on-content-click="false"
                    v-model="showDatePickerSelection"
                    :nudge-right="40"
                    lazy
                    transition="scale-transition"
                    offset-y
                    full-width
                    min-width="290px"
                  >
                <v-text-field
                  slot="activator"
                  v-model="chosenFormattedDate"
                  :placeholder="globalDateFormat"
                  aria-label="Select Date"
                  append-icon="date_range"
                  @keyup.enter.prevent="showDatePickerSelection = true"
                  @keyup="validateDate(chosenFormattedDate)"
                  :data-vv-name="'DatePicker'"
                  :error-messages="validationMessage('DatePicker')"
                  v-validate="'required'"
                  class="required"
                ></v-text-field>
                <v-date-picker v-model="chosenDate"  no-title scrollable :min="setMinDate" :allowed-dates="isDateAllowToSelect">
                  <v-spacer></v-spacer>
                  <v-btn flat color="primary" @click="showDatePickerSelection = false" label="Cancel" aria-label="Cancel">Cancel</v-btn>
                  <v-btn flat color="primary" @click="onSelectDatePicker(chosenDate)" label="Ok" aria-label="Ok">OK</v-btn>
                </v-date-picker>
            </v-menu>

              </v-flex>
          </v-layout>
       </v-flex>
      <v-flex :class="headerText ? 'xs12' : 'xs12'">
         <v-autocomplete
          :items="todayTimeSlot"
          aria-label="Select Time Slot(s)"
          v-model="selectedSlots"
          ref="multipleSelectionTimeSlots"
          placeholder="Select Time Slot(s)"
          item-text="slot"
          item-value="slotId"
          multiple
          chips
          return-object
          persistent-hint
         @change="onSlotChange(selectedSlots, $event)"
        >
          <template slot="selection" slot-scope="data" v-if="data.item.slot !== 'Daytime' && data.item.slot !== '24hrs'">
            <v-chip
              :selected="data.selected"
              :key="JSON.stringify(data.item)"
              close
              small
              class="chip--select-multi"
              @input="removeSelectedSlot(data.item, data)"
              v-bind:style="{ borderColor: environment.Settings.InputTextColor, color: environment.Settings.InputTextColor} "
            >
              {{ data.item.slot }}
            </v-chip>
          </template>
        </v-autocomplete>
      </v-flex>
    </v-layout>
   </section>
</template>

<style scoped>
  .cnt-time-head{display: flex}
  .cnt-time-head b{display: inline-block; width: 100%; margin: auto 0 0;}
  .select-date >>> .input-group__details{display: none;}
  .customer-avaiablity .v-chip{background-color: #fff; border:1px solid;}
</style>

<script lang="ts">
import { Component, Vue, Prop, Watch } from "vue-property-decorator";
import TimeSlot from "@/models/claim/TimeSlot";
import Shared from "@/common/shared";
import moment from 'moment';
import Store from '@/store';
import storeGetters from '@/storeGetters';
import { Environment } from '@/common/environment';

@Component
export default class TimeSlotPicker extends Vue {
  public isValidDate: boolean = true;
  @Prop() private headerText: string;
  @Prop() private slotType: string;
  @Prop({default: false}) private dateSelection: boolean;
  @Prop({default: true}) private filterByDate: boolean;
  @Prop({default: false}) private filterSlotByTime: boolean;
  @Prop() private pickedDates: string[];

  private selectedSlots: TimeSlot[] = [];
  private selectedSlotsTemp: TimeSlot[] = [];
  private todayTimeSlot: TimeSlot[] = [];
  private waitForMoreInputTimeoutHandle: number | null = null;
  private isComponentLoaded: boolean = false;
  private chosenDate: any = null;
  private setMinDate: any = null;
  private chosenFormattedDate: any = Store.state.Environment.DateFormat;
  private showDatePickerSelection: boolean = false;
  private globalDateFormat: string = Store.state.Environment.DateFormat;
  private otherPickedDates: string[] = [];

  @Watch("selectedSlots")
  protected onSlotSelectionChange() {
    this.callWatchUpdate();
  }

  private created() {
    if (!this.slotType) {
      this.slotType = "Today";
    }
    if (this.dateSelection) {
      this.chosenFormattedDate = this.headerText;
      this.setMinDate = new Date().toISOString().slice(0, 10);
    }
  }

  private mounted() {
    this.setTimeSlot();
    this.filterPickedDates();
    setTimeout(() => {
      this.isComponentLoaded = true;
    }, 1000);
  }

  private filterPickedDates() {
    const dateFormat: string = "YYYY-MM-DD";
    if (this.selectedSlots.length > 0) {
      const selectedDate = Shared.getFormatedDate(moment(this.selectedSlots.map((c: any) => c.startTime)[0]), dateFormat);
      this.otherPickedDates = this.pickedDates.filter((date) => date !== selectedDate);
    }
  }

  private get environment(): Environment {
    return storeGetters.getEnvironment();
  }

  private callWatchUpdate() {
    if (!this.isComponentLoaded) {
      return;
    }
    if (this.waitForMoreInputTimeoutHandle) {
      window.clearTimeout(this.waitForMoreInputTimeoutHandle);
    }
    const self = this;
    this.waitForMoreInputTimeoutHandle = window.setTimeout(() => {
      self.$emit('updateSlotItems', self.selectedSlots, self.chosenFormattedDate, self.slotType);
    }, 800);
  }

  private updateTimeSlotsWithPickedDate() {
    const self = this;
    if (this.dateSelection) {
      const defaultDayAfterTomorrow: any = this.chosenFormattedDate ? this.chosenFormattedDate.split('/') : "";
      const formattedDate: Date | null = this.dateSelection && defaultDayAfterTomorrow ? new Date(defaultDayAfterTomorrow[2], defaultDayAfterTomorrow[1] - 1, defaultDayAfterTomorrow[0]) : null;
      const usingDate = formattedDate ? new Date(formattedDate.getFullYear(), formattedDate.getMonth(), formattedDate.getDate(), 0, 0, 0) : null;

      // remove datetime slot, if no slot selected
      if (this.selectedSlots.length === 1 && this.selectedSlots[0].slot === "Daytime") {
        this.selectedSlots = [];
        this.selectedSlotsTemp = [];
      }

      this.selectedSlots.forEach((element, index) => {
        if (usingDate  && element.slotId > 0) {
          element.startTime = usingDate  && element.slotId !== -1 ? new Date(usingDate.setHours(element.slotId - 1)) : element.startTime;
          element.endTime = usingDate && element.slotId !== -1  ? new Date(usingDate.setHours(element.slotId)) : element.endTime;
        }
      });
      if (this.selectedSlots.length > 0) {
        this.callWatchUpdate();
      } else {
        // if no slot selected, reset slots as per selected date
        if (usingDate) {
          const todayDate: Date = new Date();
          let isTodayDateSelected: boolean = false;
          if (todayDate.toDateString() === usingDate.toDateString()) {
            isTodayDateSelected = true;
          }
          this.todayTimeSlot = [];
          this.addCustomSlots(this.todayTimeSlot);

          if (isTodayDateSelected && todayDate.getHours() > 16) {
            this.todayTimeSlot.splice(1, 1);
          }

          for (let i = isTodayDateSelected ? todayDate.getHours() : 0; i < 24; i++) {
            const slot: TimeSlot = new TimeSlot();
            slot.slotId = i + 1;
            slot.slot = i + ' to ' + (i + 1);
            slot.startTime = new Date(todayDate.setHours(i));
            slot.endTime = new Date(todayDate.setHours(i + 1));
            slot.isDayTime = (i > 7 && i < 17) ? true : false;
            slot.availabilityOrder = (this.slotType === "Today" ? 1 : this.slotType === "Tomorrow" ? 2 : 3);
            this.todayTimeSlot.push(slot);
          }
        }
      }
    }
  }

  @Watch("filterSlotByTime")
  private setTimeSlot(): void {
    this.todayTimeSlot = [];
    this.addCustomSlots(this.todayTimeSlot);
    const tempDate: Date = new Date();
    let todayDate: Date = new Date();
    if (this.slotType === "Tomorrow") {
      tempDate.setDate(tempDate.getDate() + 1);
    } else if (this.slotType === "DayAfterTomorrow") {
      tempDate.setDate(tempDate.getDate() + 2);
    }
    const defaultDayAfterTomorrow: any = this.chosenFormattedDate ? this.chosenFormattedDate.split('/') : "";
    const formattedDate: Date | null = this.dateSelection && defaultDayAfterTomorrow ? new Date(defaultDayAfterTomorrow[2], defaultDayAfterTomorrow[1] - 1, defaultDayAfterTomorrow[0]) : null;
    todayDate = this.dateSelection && formattedDate ? new Date(formattedDate.getFullYear(), formattedDate.getMonth(), formattedDate.getDate(), 0, 0, 0) :  new Date(tempDate.getFullYear(), tempDate.getMonth(), tempDate.getDate(), 0, 0, 0);

    for (let i = this.filterSlotByTime ? tempDate.getHours() : 0; i < 24; i++) {
        const slot: TimeSlot = new TimeSlot();
        slot.slotId = i + 1;
        slot.slot = i + ' to ' + (i + 1);
        slot.startTime = new Date(todayDate.setHours(i));
        slot.endTime = new Date(todayDate.setHours(i + 1));
        slot.isDayTime = (i > 7 && i < 17) ? true : false;
        slot.availabilityOrder = (this.slotType === "Today" ? 1 : this.slotType === "Tomorrow" ? 2 : 3);
        this.todayTimeSlot.push(slot);
    }
    // bind selected timeslots
    const slotItems = this.filterSlots(this.selectedSlotsTemp, this.slotType);
    if (slotItems && slotItems.length > 0) {
      if (this.filterByDate) {
        this.selectedSlots = slotItems;
      } else {
        this.selectedSlots = Shared.SortData(slotItems, 'startTime');
      }
    } else {
      this.selectedSlots = slotItems;
    }

    // remove main day time slot if no any slots available for day time slot duration
    if (this.filterSlotByTime && this.todayTimeSlot && tempDate.getHours() > 16) {
      this.todayTimeSlot.splice(1, 1);
    }

    // auto select 24 hours and/or day time as per time slots found on component load
    const todayItem: TimeSlot | undefined = this.selectedSlots.find((e: TimeSlot) => e.slot === '24hrs');
    const dayTimeItem: TimeSlot | undefined = this.selectedSlots.find((e: TimeSlot) => e.slot === 'Daytime');

    // if other slots selected
    // length of slots in dropdown
    const lengthOfAlltimeSlotItems: number = this.todayTimeSlot.filter((x: TimeSlot) => x.slotId !== 0 && x.slotId !== -1).length;
    // length of slots in day time
    const lengthOfAlltimeSlotItemsDayTime: number = this.todayTimeSlot.filter((a: TimeSlot) => a.isDayTime).length;

    // length of selected slots in dropdown
    const lengthOfItems: number = this.selectedSlots.filter((x) => x.slotId !== 0 && x.slotId !== -1).length;
    // length of selected slots in day time
    const lengthOfItemsDayTime: number = this.selectedSlots.filter((a: TimeSlot) => a.isDayTime).length;

    // check/uncheck daytime checkbox
    if (lengthOfAlltimeSlotItemsDayTime === lengthOfItemsDayTime) {
      if (!dayTimeItem) {
        this.addCustomDayTimeDaySlot(this.selectedSlots);
      }
    } else if (lengthOfAlltimeSlotItemsDayTime !== lengthOfItemsDayTime) {
      if (dayTimeItem) {
        this.selectedSlots.splice(this.selectedSlots.indexOf(dayTimeItem), 1);
      }
    }
    // check/uncheck 24 hours checkbox
    if (lengthOfAlltimeSlotItems === lengthOfItems) {
      if (!todayItem) {
        this.addCustomAllDaySlot(this.selectedSlots);
      }
    } else if (lengthOfAlltimeSlotItems !== lengthOfItems) {
      if (todayItem) {
        this.selectedSlots.splice(this.selectedSlots.indexOf(todayItem), 1);
      }
    }
  }

  private addCustomSlots(timeslot: TimeSlot[]) {
    this.addCustomAllDaySlot(timeslot);
    this.addCustomDayTimeDaySlot(timeslot);
  }

  private addCustomAllDaySlot(timeslot: TimeSlot[]) {
    const customslot: TimeSlot = new TimeSlot();
    customslot.slotId = -1;
    customslot.slot = '24hrs';
    customslot.isDayTime = false;
    timeslot.push(customslot);
  }

  private addCustomDayTimeDaySlot(timeslot: TimeSlot[]) {
    const customslot: TimeSlot = new TimeSlot();
    customslot.slotId = 0;
    customslot.slot = 'Daytime';
    customslot.isDayTime = false;
    timeslot.push(customslot);
  }

  private onSlotChange(items: TimeSlot[]) {
    const self = this;
    setTimeout(() => {
      // get non common item between bindItems and Items array\
      const currentChosenItem: TimeSlot | undefined = (this.selectedSlotsTemp.length > items.length ) ?  this.selectedSlotsTemp.find((item) => items.indexOf(item) < 0) : items.find((item) => this.selectedSlotsTemp.indexOf(item) < 0);
      self.selectedSlots = self.bindSlotModel(self.todayTimeSlot, self.selectedSlots, self.selectedSlotsTemp, items, currentChosenItem);
      // check whether currentchosenItem is 24 hours or daytime item
      if (currentChosenItem && currentChosenItem.slotId <= 0) {
        const selectionDrp: any = self.$refs.multipleSelectionTimeSlots as any;
        // Close the dropdown of time slots on selction of 24 hours or daytime
        selectionDrp.menuIsActive = false;
      }
      if (self.dateSelection) {
        self.updateTimeSlotsWithPickedDate();
        // sort selected time slots after updating
        Shared.SortData(self.selectedSlots, 'startTime');
      }
      this.selectedSlotsTemp = self.selectedSlots;
    }, 0);
  }

  private onSelectDatePicker(date: string, isDateAddedManually: boolean = false) {
    const subs: any = this.$refs.datePickerMenu;
    subs.save(this.chosenDate);
    if (date && this.dateSelection) {
      this.chosenFormattedDate = isDateAddedManually ? date : Shared.getFormatedDate(moment(date), this.globalDateFormat);
    }
    this.updateTimeSlotsWithPickedDate();
    Shared.SortData(this.selectedSlots, 'startTime');
    this.selectedSlotsTemp = this.selectedSlots;
    if (!isDateAddedManually) {
      this.isValidDate = true;
    }
  }

  private bindSlotModel(alltimeSlotItems: TimeSlot[], modelItems: TimeSlot[], bindItems: TimeSlot[], items: TimeSlot[], selectedSlot: TimeSlot | undefined): TimeSlot[] {
    const todayItem: TimeSlot | undefined = items.find((e: TimeSlot) => e.slot === '24hrs');
    const dayTimeItem: TimeSlot | undefined = items.find((e: TimeSlot) => e.slot === 'Daytime');

    if (selectedSlot) {
      if (selectedSlot.slotId === -1) {
        // if 24 hours selected
        if (todayItem) {
          // if 24 hours checked
          modelItems = alltimeSlotItems;
        } else {
          // if 24 hours unchecked
          const selectedTodayItem: TimeSlot | undefined = bindItems.find((e: TimeSlot) => e.slot === '24hrs');
          if (selectedTodayItem) {
            modelItems = [];
          }
        }
      } else if (selectedSlot.slotId === 0) {
        // if day time selected
        if (dayTimeItem) {
          // if day time checked
          const selectedItems: TimeSlot[] = alltimeSlotItems.filter((a: TimeSlot) => a.isDayTime || a.slot === 'Daytime');
          selectedItems.forEach((item) => {
            if (modelItems.indexOf(item) === -1) {
              modelItems.push(item);
            }
          });

          // Auto check 24 hours checkbox if all selected
          // length of slots in dropdown
          const lengthOfAlltimeSlotItems: number = alltimeSlotItems.filter((x: TimeSlot) => x.slotId !== 0 && x.slotId !== -1).length;
          // length of selected slots in dropdown
          const lengthOfItems: number = items.filter((x) => x.slotId !== 0 && x.slotId !== -1).length;
          if (lengthOfAlltimeSlotItems === lengthOfItems) {
            if (!todayItem) {
              this.addCustomAllDaySlot(modelItems);
            }
          }
        } else {
          // if day time unchecked
          const selectedDayTimeItem: TimeSlot | undefined = bindItems.find((e: TimeSlot) => e.slot === 'Daytime');
          if (selectedDayTimeItem) {
            const newItems: TimeSlot[] = items.filter((a: TimeSlot) => a.isDayTime === false);
            if (newItems && newItems.length > 0) {
              modelItems = newItems;
            } else {
              modelItems = [];
            }
          }

          // Auto uncheck 24 hours checkbox on deselect daytime
          if (todayItem) {
            modelItems.splice(modelItems.indexOf(todayItem), 1);
          }
        }
      } else {
        // if other slots selected
        // length of slots in dropdown
        const lengthOfAlltimeSlotItems: number = alltimeSlotItems.filter((x: TimeSlot) => x.slotId !== 0 && x.slotId !== -1).length;
        // length of slots in day time
        const lengthOfAlltimeSlotItemsDayTime: number = alltimeSlotItems.filter((a: TimeSlot) => a.isDayTime).length;

        // length of selected slots in dropdown
        const lengthOfItems: number = items.filter((x) => x.slotId !== 0 && x.slotId !== -1).length;
        // length of selected slots in day time
        const lengthOfItemsDayTime: number = items.filter((a: TimeSlot) => a.isDayTime).length;

        // check/uncheck daytime checkbox
        if (lengthOfAlltimeSlotItemsDayTime === lengthOfItemsDayTime) {
          if (!dayTimeItem) {
            this.addCustomDayTimeDaySlot(modelItems);
          }
        } else if (lengthOfAlltimeSlotItemsDayTime !== lengthOfItemsDayTime) {
          if (dayTimeItem) {
            modelItems.splice(modelItems.indexOf(dayTimeItem), 1);
          }
        }
        // check/uncheck 24 hours checkbox
        if (lengthOfAlltimeSlotItems === lengthOfItems) {
          if (!todayItem) {
            this.addCustomAllDaySlot(modelItems);
          }
        } else if (lengthOfAlltimeSlotItems !== lengthOfItems) {
          if (todayItem) {
            modelItems.splice(modelItems.indexOf(todayItem), 1);
          }
        }
      }
    }

    // sort and assign selected items
    return Shared.SortData(modelItems, 'startTime');
  }

  private removeSelectedSlot(item: any, selectedData: any) {
    // uncheck selected item from the selected list
    selectedData.parent.selectedItems.splice(selectedData.parent.selectedItems.indexOf(item), 1);

    // if day time selected and if slot between 9 - 17
    // remove selected slot as well remove day time selection
    const dayTimeSelected = selectedData.parent.selectedItems.find((x: any) => x.slotId === 0);
    if (dayTimeSelected) {
      if (item.slotId >= 9 && item.slotId <= 17) {
        selectedData.parent.selectedItems.splice( selectedData.parent.selectedItems.indexOf(dayTimeSelected), 1);
      }
    }

    // if all day selected and if slot between 1 - 24
    // remove selected slot as well remove day time selection
    const allDayTimeSelected = selectedData.parent.selectedItems.find((x: any) => x.slotId === -1);
    if (allDayTimeSelected) {
      if (item.slotId >= 1 && item.slotId <= 24) {
        selectedData.parent.selectedItems.splice( selectedData.parent.selectedItems.indexOf(allDayTimeSelected), 1);
      }
    }

    // reassign selected slots
    this.selectedSlots = selectedData.parent.selectedItems;
    this.selectedSlotsTemp = this.selectedSlots;
  }

  private isDateAllowToSelect(date: string) {
    if (this.pickedDates && this.pickedDates.length > 0) {
      return this.pickedDates.indexOf(date) === -1;
    }
    return true;
  }

  private filterSlots(slotItems: TimeSlot[], slotType: string): TimeSlot[] {
    if (slotItems.length === 0) {
      return slotItems;
    }
    // check is today date
    let slotItemsTemp: TimeSlot[] = slotItems;
    slotItemsTemp = slotItemsTemp.filter((x) => x.slotId !== -1 && x.slotId !== 0);
    let selectedDate = new Date();
    if (slotItemsTemp.length > 0) {
      selectedDate = new Date(slotItemsTemp[0].startTime);
    }
    const todayDate = new Date();

    // if selected date is not today return with the existing slots
    if (selectedDate && (selectedDate.setHours(0, 0, 0, 0) !== todayDate.setHours(0, 0, 0, 0))) {
      return slotItems;
    }

    // if today's date selected
    const timeSlotsAsPerCurrentTime: TimeSlot[] = [];
    const tempDate: Date = new Date();
    const length = 24;
    for (let i = tempDate.getHours(); i < 24; i++) {
      const slot: TimeSlot = new TimeSlot();
      slot.slotId = i + 1;
      slot.slot = i + ' to ' + (i + 1);
      slot.startTime = new Date(todayDate.setHours(i));
      slot.endTime = new Date(todayDate.setHours(i + 1));
      slot.isDayTime = (i > 7 && i < 17) ? true : false;
      slot.availabilityOrder = (slotType === "Today" ? 1 : slotType === "Tomorrow" ? 2 : 3);
      timeSlotsAsPerCurrentTime.push(slot);
    }

    const slots: TimeSlot[] = [];
    for (const slot of slotItems) {
      if (slot.slotId > 0) {
        const sameSlot: TimeSlot | undefined = timeSlotsAsPerCurrentTime.find((x: TimeSlot) => x.slotId === slot.slotId);
        if (sameSlot) {
          slots.push(sameSlot);
        }
      }
    }

    return slots;
  }

  private validationMessage(label: string) {
    let message: string = this.$validator.errors.collect(label)[0] ? this.$validator.errors.collect(label)[0].msg : '';
    const errorMessage = label.split(/(\d+)/);
    let messageText: string = "";
    if (this.chosenFormattedDate) {
      messageText = this.isValidDate ? "" : (message = "The selected date is invalid.");
    } else {
      messageText = message ? (message = "The date field is required.") : message;
    }
    return messageText;
  }

  private validateDate(chosenFormattedDate: any) {
    this.isValidDate = moment(chosenFormattedDate, this.globalDateFormat, true).isValid();
    if (this.isValidDate) {
      const selectedDate = moment(chosenFormattedDate, this.globalDateFormat);
      const minDateArray = this.setMinDate.split("-");
      const minDate = moment(minDateArray[2] + "/" + minDateArray[1] + "/" + minDateArray[0], this.globalDateFormat);
      const chosenFormattedDateArray = chosenFormattedDate.split("/");
      const chosenDate = chosenFormattedDateArray[2] + "-" + chosenFormattedDateArray[1] + "-" + chosenFormattedDateArray[0];
      const isDateNotSelected = this.otherPickedDates.length > 0 ? this.otherPickedDates.indexOf(chosenDate) === -1 : true;
      if (selectedDate.isSameOrAfter(minDate) && isDateNotSelected) {
        this.chosenFormattedDate = chosenFormattedDate;
        this.chosenDate = chosenDate;
        this.onSelectDatePicker(this.chosenFormattedDate, true);
      } else {
        this.isValidDate = false;
      }
    }
  }

  @Watch("pickedDates")
  private onPickedDatesChange() {
    this.filterPickedDates();
  }
}
</script>