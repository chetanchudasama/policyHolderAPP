<template>
   <section role="region" aria-label="Map">
       <v-icon v-show="showFullscreenControl && !showFullScreenMap" ref="fullScreenIcon" class="fullScreenIcon" :class="showFullScreenMap ? 'fullScreenIconFixedStyle' : ''" @click="toogleFullScreenMap">fullscreen</v-icon>
       <v-icon v-show="showFullscreenControl && showFullScreenMap" ref="fullScreenIcon" class="fullScreenIcon" :class="showFullScreenMap ? 'fullScreenIconFixedStyle' : ''" @click="toogleFullScreenMap">fullscreen_exit</v-icon>  
       <div class="map-view">
           <div class="google-map" ref="mapView" :id="mapId"></div>
        </div>
   </section>
</template>

<style scoped>
.google-map, .google-map-street-view {height: 100%;width: 100%;max-width: 100%;position: relative;}
.map-view {height: 100%;}
.fullScreenIcon{position: absolute; right: 14px;  top: 11px; z-index: 7; cursor: pointer;background-color: #ffffff}
.fullScreen { position: fixed !important; height: 100% !important; max-height: 100% !important; width: 100% !important; top: 0; left: 0; z-index: 6 !important;}
.fullScreenIconFixedStyle { position: fixed !important; top: 15px !important;}
</style>

<script lang="ts">
import { Component, Vue, Prop, Watch } from "vue-property-decorator";
import PolicyHolderController from "@/api/policyHolderController";
import axios from "axios";
import storeGetters from "@/storeGetters";
import storeMutations from "@/storeMutations";
declare var google: any;

@Component
export default class Map extends Vue {
    @Prop() private mapId: string;
    @Prop() private zoomLevel: number;
    @Prop() private sourceLatitude: number;
    @Prop() private sourceLongitude: number;
    @Prop() private previousLatitude: number;
    @Prop() private previousLongitude: number;
    @Prop() private destinationLatitude: number;
    @Prop() private destinationLongitude: number;
    @Prop() private disableDefaultUIControl: boolean;
    @Prop() private headingMagneticNorth: number;
    @Prop({default: true}) private showFullscreenControl: boolean;

    private resultMap: any = null;
    private sAddress: string = "";
    private sLatLng: any = null;
    private pLatLng: any = null;
    private dLatLng: any = null;
    private marker: any = null;
    private carImage: any = "M17.402,0H5.643C2.526,0,0,3.467,0,6.584v34.804c0,3.116,2.526,5.644,5.643,5.644h11.759c3.116,0,5.644-2.527,5.644-5.644 V6.584C23.044,3.467,20.518,0,17.402,0z M22.057,14.188v11.665l-2.729,0.351v-4.806L22.057,14.188z M20.625,10.773 c-1.016,3.9-2.219,8.51-2.219,8.51H4.638l-2.222-8.51C2.417,10.773,11.3,7.755,20.625,10.773z M3.748,21.713v4.492l-2.73-0.349 V14.502L3.748,21.713z M1.018,37.938V27.579l2.73,0.343v8.196L1.018,37.938z M2.575,40.882l2.218-3.336h13.771l2.219,3.336H2.575z M19.328,35.805v-7.872l2.729-0.355v10.048L19.328,35.805z";
    private showFullScreenMap: boolean = false;

    public toggleFullScreenView(showFullScreenMap: boolean, disableDefaultUIControl: boolean) {
        if (disableDefaultUIControl) {
            this.resultMap.disableDefaultUI = !this.resultMap.disableDefaultUI;
        }
        if (this.resultMap && this.resultMap.streetView.getVisible() === true) {
            this.resultMap.streetView.setVisible(false);
        }
        const mapView: any = this.$refs.mapView;
        if (mapView) {
            if (showFullScreenMap) {
                mapView.classList.add("fullScreen");
                this.toggleFullScreenIcon("hide");
                setTimeout(() => {
                    (this.$refs.fullScreenIcon as any).$el.classList.remove("hide");
                }, 800);
            } else {
                mapView.classList.remove("fullScreen");
                setTimeout(() => {
                    this.toggleFullScreenIcon("show");
                }, 800);
            }

            this.$nextTick();
        }
    }

    public toggleFullScreenIcon(displayStyle: string) {
        const fullScreenIcons: any = document.getElementsByClassName("fullScreenIcon");
        if (fullScreenIcons && fullScreenIcons.length > 0) {
            for (const item of fullScreenIcons) {
                if (displayStyle === "show") {
                    item.classList.remove("hide");
                } else {
                    item.classList.add("hide");
                }
            }
        }
    }

    @Watch('previousLatitude')
    @Watch('previousLongitude')
    @Watch('sourceLatitude')
    @Watch('sourceLongitude')
    private onAddressAndLatLngChange() {
        this.onAddressChange();
    }

    private onAddressChange() {
        this.pLatLng = this.previousLatitude && this.previousLongitude && this.previousLatitude !== null && this.previousLongitude !== null ? new google.maps.LatLng(this.previousLatitude, this.previousLongitude) : null;
        this.sLatLng = this.sourceLatitude && this.sourceLongitude && this.sourceLatitude !== null && this.sourceLongitude !== null ? new google.maps.LatLng(this.sourceLatitude, this.sourceLongitude) : null;
        if (this.marker) {
            this.marker.setMap(null);
        }
        this.renderMapWithMarker(this.resultMap);
    }

    private created() {
        setTimeout(() => {
            this.pLatLng = this.previousLatitude && this.previousLongitude && this.previousLatitude !== null && this.previousLongitude !== null ? new google.maps.LatLng(this.previousLatitude, this.previousLongitude) : null;
            this.sLatLng = this.sourceLatitude && this.sourceLongitude && this.sourceLatitude !== null && this.sourceLongitude !== null ? new google.maps.LatLng(this.sourceLatitude, this.sourceLongitude) : null;
            this.dLatLng = this.destinationLatitude && this.destinationLongitude && this.destinationLongitude !== null && this.destinationLongitude !== null ? new google.maps.LatLng(this.destinationLatitude, this.destinationLongitude) : null;
            this.initMap();
            this.createDestinationPinPoint();
        }, 1000);
    }

    private initMap() {
        this.resultMap = this.initGoogleMap(this.mapId, this.zoomLevel, this.disableDefaultUIControl);
        this.renderMapWithMarker(this.resultMap);
    }

    private initGoogleMap(mapId: string, zoomLevel: number, disableDefaultUIControl: boolean) {
        return new google.maps.Map(document.getElementById(mapId), {
            fullscreenControl: false,
            zoom: zoomLevel,
            disableDefaultUI: disableDefaultUIControl,
            center: new google.maps.LatLng(51.509865, -0.118092),
            mapTypeControlOptions: {
                position: google.maps.ControlPosition.LEFT_BOTTOM,
            },
        });
    }

    private createDestinationPinPoint() {
        // generate marker for destination
        if (this.dLatLng !== null) {
            const marker = new google.maps.Marker({
                map: this.resultMap,
                position: this.dLatLng,
                visible: true,
            });
        }
    }

    private renderMapWithMarker(resultMap: any) {
        const self = this;
        if (this.sLatLng !== null) {
            resultMap.setCenter(this.sLatLng);

            const carIcon: any = {
                path: this.carImage,
                scale: .5,
                strokeColor: 'white',
                strokeWeight: .10,
                fillOpacity: 1,
                fillColor: '#404040',
                offset: '5%',
                rotation: 0,
                anchor: new google.maps.Point(10, 25),
            };

            this.marker = new google.maps.Marker({
                map: resultMap,
                position: this.sLatLng,
                icon: carIcon,
            });
        } else {
            resultMap.setCenter(new google.maps.LatLng(51.509865, -0.118092));
        }

        if (this.marker) {
            this.getRouteToMoveMarker();
        }
    }

    private getRouteToMoveMarker() {
        const frames: any[] = [];
        let curLat: any;
        let curLng: any;
        for (let percent = 0; percent < 1; percent += 0.003) {
          curLat = this.sourceLatitude + percent * (this.previousLatitude - this.sourceLatitude);
          curLng = this.sourceLongitude + percent * (this.previousLongitude - this.sourceLongitude);
          frames.push(new google.maps.LatLng(curLat, curLng));
        }
        // move marker direction
        this.moveMarkerDirection().then((result) => {
            // smoothly move marker by creating break points
            this.moveMarker(this.marker, frames, 0, 20, this.marker.position);
        });
    }

    private async moveMarkerDirection(): Promise<boolean> {
        // TODO:
        // we have configured the angle related changes comming through app but sometimes anlge mismatching on same direction.
        // so, once app team make changes to send signalr while application is running in backbround mode, we need to verify angle of marker again
        // once angle verified, remove marker code previously added to save old latlng to rotate the marker
        if (this.marker) {
            const heading = this.headingMagneticNorth;
            const icon = this.marker.getIcon();
            icon.rotation = Number(heading);
            this.marker.setIcon(icon);
            return true;
        } else {
            return false;
        }
    }

    private moveMarker(marker: any, latlngs: any, index: any, wait: any, newDestination: any) {
        const self = this;
        // set marker position
        marker.setPosition(latlngs[index]);
        // set marker as a center of a map on each transaction
        if (this.resultMap && this.resultMap.getBounds() && ((this.resultMap.getBounds().contains(this.marker.getPosition())) === false)) {
            this.resultMap.setCenter(this.marker.getPosition());
        }
        if (index !== latlngs.length - 1) {
            setTimeout(() => {
                self.moveMarker(marker, latlngs, index + 1, wait, newDestination);
            }, wait);
        } else {
            // assign last reached lat long
            marker.position = newDestination;
        }
    }

    private toogleFullScreenMap() {
        this.showFullScreenMap = !this.showFullScreenMap;
        this.toggleFullScreenView(this.showFullScreenMap, this.disableDefaultUIControl);
    }
}
</script>