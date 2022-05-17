import moment from "moment";
import Confirmation from "@/components/Confirmation.vue";
declare var ga: any;

export default class Shared {
    // globally defined confirmation popup
    public static confirmationPopup: Confirmation;

    // set focus to first element which has validation error
    public static setValidationFocus(el: HTMLElement): void {
        const errorItem: any = el.querySelector(".error--text");
        errorItem.focus();
        errorItem.getElementsByTagName("input")[0].focus();
    }

    public static getFormatedDate(dateValue: moment.Moment, format: string): string {
        if (dateValue) {
            if (moment.isMoment(dateValue) && dateValue.isValid()) {
                return dateValue.format(format);
            } else {
                return "--/--/----";
            }
        }
        return "--/--/----";
    }

    public static SortData(data: any, columnName: string): any {
        if (data != null) {
            data.sort((a: any, b: any) => {
                let nameA = String(a[columnName]).toLowerCase();
                let nameB = String(b[columnName]).toLowerCase();

                if (nameA === "undefined") {
                    nameA = '';
                }
                if (nameB === "undefined") {
                    nameB = '';
                }
                // sort string ascending
                if (nameA < nameB) {
                    return -1;
                }
                if (nameA > nameB) {
                    return 1;
                }

                return -1; // default return value (no sorting)
            });
        }

        return data;
    }

    public static getMinutesFromSecond(duration: number, defaultValue: string, length: number): string {
        return (new Array(length + 1).join(defaultValue) + duration).slice(-length);
    }

    public static sendEventsInGoogleAnalytics(categoryName: string, actionName: string, localTimer: Date) {
        if ((window as any).ga) {
            // get the time difference of two buttom click in milliseconds
            let actionTime = (new Date().getTime()) - localTimer.getTime();
            actionTime = actionTime < 0 ? 0 : actionTime;
            // send notification to google analytics
            ga('send', 'event', {
                eventCategory: categoryName,
                eventAction: actionName,
                eventLabel: window.location.host,
                eventValue: actionTime,
            });
        }
    }
}
