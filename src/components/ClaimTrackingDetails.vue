<template>
 <section role="region" aria-label="Claim tracking details">
   <div class="multipule-tracking">
      <v-layout wrap pa-3 v-if="claimTrackingDetailModel">
         <v-flex xs12 text-xs-center mb-4>
            <h1 class="title">YOUR CLAIM STATUS</h1>
         </v-flex>

         <!-- progress bar indication -->
         <div v-if="showProgressBar && isProgressBarLoaderVisible" class="refresh-progressbar">
            <v-card v-bind:style="{ color: environment.Settings.PrimaryColor}" flat>
               <v-card-text>
                  checking for updates
                  <v-progress-linear v-if="showProgressBar && isProgressBarLoaderVisible" indeterminate v-bind:style="{ color: environment.Settings.SecondaryColor}" class="mb-0"></v-progress-linear>
               </v-card-text>
            </v-card>
         </div>

         <v-flex xs12>
            <v-layout wrap>
               <v-flex xs12 text-xs-center v-if="currentClaimDetails">
                  <div class="claim-progress-bar">
                     <v-progress-circular :value="trackingCompletionRatio" :size="180" :rotate="-90" :width="10" v-bind:style="{ color: environment.Settings.PrimaryColor}" ></v-progress-circular>
                     <div class="claim-info-process-bar">
                        <span class="text-xs-center  px-4">
                        <span class="body-2" >{{currentClaimDetails.description}}:</span><br/>
                        <span class="time display-2" v-bind:style="{ color: environment.Settings.ComplementaryColor}">{{currentClaimDetails.createdAtTime}}</span><br/>
                        <span class="subheading">{{currentClaimDetails.createdAtDate}}</span>
                        </span>
                     </div>
                  </div>
               </v-flex>
               <v-flex xs12 text-xs-center slider-count-text>
                  <p v-if="claimTrackingDetailsModel && claimTrackingDetailsModel.claimRequest" v-bind:style="{ color: environment.Settings.ComplementaryColor}" class="pt-2">Job ID: {{claimTrackingDetailsModel.claimRequest.jobId}}</p>
                  <p v-bind:style="{ color: environment.Settings.ComplementaryColor}" class="pt-2" >Emergency {{selectedClaimIndex}} of {{totalClaimsCount}}</p>
               </v-flex>
               <v-flex xs12>
                  <v-card class="px-4 pt-3 pb-4 elevation-0 process-cycle">
                     <div class="step-process" v-if="claimTrackingDetailModel.claimRequest">
                        <div class="innter-content elevation-1 white px-2 py-3">
                           <h3 class="subheading font-weight-bold" v-bind:style="{ color: environment.Settings.PrimaryColor + '!important'}" >{{claimTrackingDetailModel.claimRequest.description}}</h3>
                           <span class="show-date grey--text"><v-icon small>calendar_today</v-icon> <span> {{getETADate(claimTrackingDetailModel.claimRequest.createdAt)}}</span> </span>
                        </div>
                        <span class="bar" v-bind:style="{ background: environment.Settings.PrimaryColor + '!important'}"></span>
                        <span class="bar-circle text-xs-center" v-bind:style="{ background: environment.Settings.PrimaryColor + '!important'}">
                           <v-icon class="mb-2" color="white">get_app</v-icon>
                        </span>
                     </div>
                     <div class="step-process" v-else>
                        <span  class="innter-content grey lighten-3 px-2 py-3 ">
                           <span class="grey--text">CLAIM REQUEST RECEIVED"</span>
                        </span>
                        <span class="bar"></span>
                        <span class="bar-circle text-xs-center grey lighten-3">
                           <v-icon class="mb-2 grey--text">get_app</v-icon>
                           <br/>
                        </span>
                     </div>

                     <div class="step-process" v-if="claimTrackingDetailModel.coverIncluded">
                        <span  class="innter-content  elevation-1 px-2 py-3">
                           <h3 class="subheading font-weight-bold" v-bind:style="{ color: environment.Settings.PrimaryColor + '!important'}" >{{claimTrackingDetailModel.coverIncluded.description}}</h3>
                           <span class="show-date grey--text"><v-icon small>calendar_today</v-icon> <span> {{getETADate(claimTrackingDetailModel.coverIncluded.createdAt)}}</span> </span>
                        </span>
                        <span class="bar" v-bind:style="{ background: environment.Settings.PrimaryColor + '!important'}"></span>
                        <span class="bar-circle text-xs-center  " v-bind:style="{ background: environment.Settings.PrimaryColor + '!important'}">
                           <v-icon class="mb-2" color="white">check</v-icon>
                        </span>
                     </div>
                     <div class="step-process" v-else>
                        <span  class="innter-content grey lighten-3 px-2 py-3 ">
                        <span class="grey--text">COVER INCLUDED</span>
                        </span>
                        <span class="bar"></span>
                        <span class="bar-circle text-xs-center grey lighten-3">
                           <v-icon class="mb-2 grey--text">check</v-icon>
                           <br/>
                        </span>
                     </div>

                     <div class="step-process" v-if="claimTrackingDetailModel.engineerAssigned">
                        <span  class="innter-content  elevation-1 px-2 py-3">
                           <h3 class="subheading font-weight-bold" v-bind:style="{ color: environment.Settings.PrimaryColor + '!important'}" >{{claimTrackingDetailModel.engineerAssigned.description}}</h3>
                           <span class="profile-details">
                              <v-avatar slot="activator" size="40px">
                                <img :src="claimTrackingDetailModel.engineerAssigned.fileURL"
                                 v-if="claimTrackingDetailModel.engineerAssigned.fileURL !== null
                                  && claimTrackingDetailModel.engineerAssigned.fileURL !== ''" alt="">
                                <img src="/img/user.png" alt="" v-else />
                              </v-avatar>
                              <span class="details">
                                 <h4>{{claimTrackingDetailModel.engineerAssigned.name}}</h4>
                              </span>
                              <span class="show-date grey--text"><v-icon small>calendar_today</v-icon> <span> {{getETADate(claimTrackingDetailModel.engineerAssigned.createdAt)}}</span> </span>
                           </span>
                        </span>
                        <span class="bar"  v-bind:style="{ background: environment.Settings.PrimaryColor + '!important'}"></span>
                        <span class="bar-circle text-xs-center grey lighten-3 svg-icon"  v-bind:style="{ background: environment.Settings.PrimaryColor + '!important'}">
                           <svg x="0px" y="0px" width="18px" height="18px" viewBox="0 0 535.806 535.807">
                              <g>
                                 <path d="M440.956,373.932c-11.934-13.158-26.315-19.584-44.676-19.584h-38.686l-25.398-24.479   c-18.666,15.3-41.31,24.174-65.791,24.174c-22.95,0-44.676-7.956-62.424-21.726l-22.645,21.726h-40.262   c-20.502,0-36.414,7.038-48.96,21.421c-36.414,42.227-30.294,132.498-27.54,160.344h407.592   C474.31,507.654,477.982,415.242,440.956,373.932z"  fill="#fff"/>
                                 <path d="M160.343,182.376c-7.344,6.12-12.24,15.912-12.24,27.234c0,16.83,11.016,30.6,25.092,33.048   c3.06,25.398,13.464,47.736,29.07,64.26c3.365,3.366,6.731,6.732,10.403,9.486c4.591,3.672,9.486,6.732,14.688,9.486   c11.628,6.119,24.479,9.485,38.25,9.485c13.77,0,26.623-3.366,38.25-9.485c5.202-2.754,10.098-5.814,14.688-9.486   c3.673-2.754,7.038-6.12,10.404-9.486c15.3-16.523,26.01-38.556,28.764-63.954c0.307,0,0.612,0,0.918,0   c16.219,0,29.07-14.994,29.07-33.354c0-11.322-4.896-21.114-12.24-27.234H160.343L160.343,182.376z" fill="#fff"/>
                                 <path d="M377.409,118.116c-9.486-31.518-34.578-63.648-66.402-80.172v71.91v9.792c0,0.612,0,0.918,0,1.224   c-0.306,3.366-0.918,6.426-2.447,9.486c-3.979,7.65-11.935,13.158-21.114,13.158h-4.896h-33.66c-8.568,0-16.219-4.59-20.196-11.322   c-1.836-2.754-2.754-5.813-3.366-9.18c-0.306-1.224-0.306-2.142-0.306-3.366v-8.568v-73.44   c-31.824,16.83-56.916,48.96-66.402,80.478l-2.142,6.732h-17.442v38.25h19.278h26.928h11.322h147.493h11.016h41.7v-1.836v-36.414   h-17.22L377.409,118.116z" fill="#fff"/>
                                 <path d="M248.777,134.028h38.25c5.508,0,10.098-3.06,12.546-7.65c1.224-2.142,1.836-4.284,1.836-6.732v-2.754V105.57V33.354V22.95   v-3.978c0-2.448-0.612-4.59-1.224-6.732C297.432,5.202,290.394,0,282.438,0h-33.661c-7.344,0-13.464,5.508-14.076,12.546   c0,0.612-0.306,1.224-0.306,1.836v8.568v10.404v73.44v11.628v1.224c0,3.06,0.918,5.814,2.448,8.262   C239.598,131.58,243.881,134.028,248.777,134.028z" fill="#fff"/>
                              </g>
                              <g></g>
                              <g></g>
                              <g></g>
                              <g></g>
                              <g></g>
                              <g></g>
                              <g></g>
                              <g></g>
                              <g></g>
                              <g></g>
                              <g></g>
                              <g></g>
                              <g></g>
                              <g></g>
                              <g></g>
                           </svg>
                        </span>
                     </div>
                     <div class="step-process" v-else>
                        <span  class="innter-content grey lighten-3 px-2 py-3 ">
                        <span class="grey--text">ENGINEER ASSIGNED</span>
                        </span>
                        <span class="bar"></span>
                        <span class="bar-circle text-xs-center grey lighten-3 svg-icon">
                           <svg x="0px" y="0px" width="18px" height="18px" viewBox="0 0 535.806 535.807">
                              <g>
                                 <path d="M440.956,373.932c-11.934-13.158-26.315-19.584-44.676-19.584h-38.686l-25.398-24.479   c-18.666,15.3-41.31,24.174-65.791,24.174c-22.95,0-44.676-7.956-62.424-21.726l-22.645,21.726h-40.262   c-20.502,0-36.414,7.038-48.96,21.421c-36.414,42.227-30.294,132.498-27.54,160.344h407.592   C474.31,507.654,477.982,415.242,440.956,373.932z"  fill="#9e9e9e"/>
                                 <path d="M160.343,182.376c-7.344,6.12-12.24,15.912-12.24,27.234c0,16.83,11.016,30.6,25.092,33.048   c3.06,25.398,13.464,47.736,29.07,64.26c3.365,3.366,6.731,6.732,10.403,9.486c4.591,3.672,9.486,6.732,14.688,9.486   c11.628,6.119,24.479,9.485,38.25,9.485c13.77,0,26.623-3.366,38.25-9.485c5.202-2.754,10.098-5.814,14.688-9.486   c3.673-2.754,7.038-6.12,10.404-9.486c15.3-16.523,26.01-38.556,28.764-63.954c0.307,0,0.612,0,0.918,0   c16.219,0,29.07-14.994,29.07-33.354c0-11.322-4.896-21.114-12.24-27.234H160.343L160.343,182.376z" fill="#9e9e9e"/>
                                 <path d="M377.409,118.116c-9.486-31.518-34.578-63.648-66.402-80.172v71.91v9.792c0,0.612,0,0.918,0,1.224   c-0.306,3.366-0.918,6.426-2.447,9.486c-3.979,7.65-11.935,13.158-21.114,13.158h-4.896h-33.66c-8.568,0-16.219-4.59-20.196-11.322   c-1.836-2.754-2.754-5.813-3.366-9.18c-0.306-1.224-0.306-2.142-0.306-3.366v-8.568v-73.44   c-31.824,16.83-56.916,48.96-66.402,80.478l-2.142,6.732h-17.442v38.25h19.278h26.928h11.322h147.493h11.016h41.7v-1.836v-36.414   h-17.22L377.409,118.116z" fill="#9e9e9e"/>
                                 <path d="M248.777,134.028h38.25c5.508,0,10.098-3.06,12.546-7.65c1.224-2.142,1.836-4.284,1.836-6.732v-2.754V105.57V33.354V22.95   v-3.978c0-2.448-0.612-4.59-1.224-6.732C297.432,5.202,290.394,0,282.438,0h-33.661c-7.344,0-13.464,5.508-14.076,12.546   c0,0.612-0.306,1.224-0.306,1.836v8.568v10.404v73.44v11.628v1.224c0,3.06,0.918,5.814,2.448,8.262   C239.598,131.58,243.881,134.028,248.777,134.028z" fill="#9e9e9e"/>
                              </g>
                              <g></g>
                              <g></g>
                              <g></g>
                              <g></g>
                              <g></g>
                              <g></g>
                              <g></g>
                              <g></g>
                              <g></g>
                              <g></g>
                              <g></g>
                              <g></g>
                              <g></g>
                              <g></g>
                              <g></g>
                           </svg>
                        </span>
                     </div>

                     <div class="step-process" v-if="claimTrackingDetailModel.engineerOnTheWay">
                        <span  class="innter-content elevation-1 px-2 py-3">
                           <h3 class="subheading font-weight-bold" v-bind:style="{ color: environment.Settings.PrimaryColor + '!important'}" >{{claimTrackingDetailModel.engineerOnTheWay.description}}</h3>
                           <div class="details" v-if="claimTrackingDetailModel.engineerOnTheWay.customerProxyNumber && !claimTrackingDetailModel.claimVisitComplete">
                              <span class="d-inline-block pt-2">
                                 <v-icon class="mt-0" >call</v-icon>
                                 <b class="pt-2"> {{claimTrackingDetailModel.engineerOnTheWay.customerProxyNumber}}</b>
                              </span>
                           </div>
                           <div v-if="claimTrackingDetailModel.engineerOnTheWay.customerProxyNumber && !claimTrackingDetailModel.claimVisitComplete">
                              <span class="d-inline-block mt-1 pb-1 caption"><v-icon class="mt-0">info</v-icon> Calls will be Recorded</span>
                           </div>
                           <span class="show-date grey--text"><v-icon small>calendar_today</v-icon> <span> {{getETADate(claimTrackingDetailModel.engineerOnTheWay.createdAt)}}</span> </span>
                           <div class="mt-2 map" v-if="isMapCoordinatesExists">
                               <Map
                                 :mapId="new Date().getTime().toString()"
                                 :sourceLatitude="previousLatitude ? previousLatitude : claimTrackingDetailsModel.engineerOnTheWay.latitude"
                                 :sourceLongitude="previousLongitude ? previousLongitude : claimTrackingDetailsModel.engineerOnTheWay.longitude"
                                 :previousLatitude="claimTrackingDetailsModel.engineerOnTheWay.latitude"
                                 :previousLongitude="claimTrackingDetailsModel.engineerOnTheWay.longitude"
                                 :destinationLatitude="customerAddressLatitude"
                                 :destinationLongitude="customerAddressLongitude"
                                 :headingMagneticNorth="headingMagneticNorth"
                                 :showFullscreenControl="true"
                                 :disableDefaultUIControl="true"
                                 style="height:200px"
                                 :zoomLevel="15"
                              ></Map>
                           </div>
                        </span>
                        <span class="bar" v-bind:style="{ background: environment.Settings.PrimaryColor + '!important'}"></span>
                        <span class="bar-circle text-xs-center grey lighten-4" v-bind:style="{ background: environment.Settings.PrimaryColor + '!important'}">
                           <v-icon class="mb-2 white--text ">local_shipping</v-icon>
                        </span>
                     </div>
                     <div class="step-process" v-else>
                        <span  class="innter-content grey lighten-3 px-2 py-3 ">
                           <span class="grey--text">ENGINEER ON THE WAY</span>
                        </span>
                        <span class="bar"></span>
                        <span class="bar-circle text-xs-center grey lighten-3">
                           <v-icon class="mb-2 grey--text">local_shipping</v-icon>
                           <br/>
                        </span>
                     </div>

                     <div class="step-process" v-if="claimTrackingDetailModel.engineerOnSite">
                        <span  class="innter-content elevation-1 px-2 py-3 ">
                           <h3 class="subheading font-weight-bold" v-bind:style="{ color: environment.Settings.PrimaryColor + '!important'}" >{{claimTrackingDetailModel.engineerOnSite.description}}</h3>
                           <span class="show-date grey--text"><v-icon small>calendar_today</v-icon> <span> {{getETADate(claimTrackingDetailModel.engineerOnSite.createdAt)}}</span> </span>
                        </span>
                        <span class="bar"  v-bind:style="{ background: environment.Settings.PrimaryColor + '!important'}"></span>
                        <span class="bar-circle text-xs-center grey lighten-3" v-bind:style="{ background: environment.Settings.PrimaryColor + '!important'}">
                           <v-icon class="mb-2 white--text ">build</v-icon>
                        </span>
                     </div>
                     <div class="step-process" v-else>
                        <span  class="innter-content grey lighten-3 px-2 py-3 ">
                        <span class="grey--text">ENGINEER ON JOB SITE</span>
                        </span>
                        <span class="bar"></span>
                        <span class="bar-circle text-xs-center grey lighten-3">
                           <v-icon class="mb-2 grey--text">build</v-icon>
                           <br/>
                        </span>
                     </div>

                     <div class="step-process" v-if="claimTrackingDetailModel.claimVisitComplete">
                        <span  class="innter-content elevation-1 px-2 py-3">
                           <h3 class="subheading font-weight-bold" v-bind:style="{ color: environment.Settings.PrimaryColor + '!important'}" >{{claimTrackingDetailModel.claimVisitComplete.description}}</h3>
                           <span class="show-date grey--text"><v-icon small>calendar_today</v-icon> <span> {{getETADate(claimTrackingDetailModel.claimVisitComplete.createdAt)}}</span> </span>
                        </span>
                        <span class="bar"  v-bind:style="{ background: environment.Settings.PrimaryColor + '!important'}"></span>
                        <span class="bar-circle text-xs-center grey lighten-3" v-bind:style="{ background: environment.Settings.PrimaryColor + '!important'}">
                           <v-icon class="mb-2 white--text ">home</v-icon>
                        </span>
                     </div>
                     <div class="step-process" v-else>
                        <span  class="innter-content grey lighten-3 px-2 py-3 ">
                        <span class="grey--text">Visit completed</span>
                        </span>
                        <span class="bar"></span>
                        <span class="bar-circle text-xs-center grey lighten-3">
                           <v-icon class="mb-2 grey--text">home</v-icon>
                           <br/>
                        </span>
                     </div>
                  </v-card>
               </v-flex>
            </v-layout>
         </v-flex>
         <v-flex xs12 v-show="!ready">
            <v-progress-circular class="loading-spinner" :width="2" :size="50" indeterminate color="primary"></v-progress-circular>
         </v-flex>
      </v-layout>

   </div>
 </section>
</template>

<style>
.progress-circular svg{transform: rotate(-90deg) !important;}
.svg-icon svg{margin-top: 3px;}
.liveLocationmapDailog .fullScreenIcon{right: 20px; top: 48px;}
</style>

<style scoped>
  .claim-progress-bar{position: relative;}
  .claim-info-process-bar{position: absolute;left: 0px; right: 0px; top:0px;bottom: 0px;height: 200px;width: 200px;margin: auto;display: flex;flex-wrap:wrap;  }
  .claim-info-process-bar > span{margin: auto; width: 100%; height: auto !important;}
  .step-process{text-transform: uppercase;display: block; position: relative;}
  .step-process .v-icon{font-size: 18px;display: inline-block;margin-top: 5px; vertical-align: middle;}
  .step-process .innter-content{display: inline-block;width:400px;max-width:100%;margin-bottom:30px; cursor: pointer;}
  .step-process .bar{left: -38px;position: absolute;width: 6px;background-color: #eee;bottom: 0px;margin: auto;TOP: 0px;}
  .step-process .bar-circle {position: absolute;left: -50px;top: 0px;height: 30px;width: 30px;border-radius: 50%;  }
  .step-process:last-child .innter-content{margin-bottom: 0px;}
  .step-process:last-child .bar{display: none;}
  .step-process.active, .step-process.active .v-icon{color:#fff;}
  .step-process.active .innter-content, .step-process.active .bar{background:#03587f !important; }
  .step-process .innter-content{position:relative;}
  .step-process .innter-content img{width: 40px; margin-bottom: 5px;}
  .step-process .show-date span{position: relative; top:4px}
  .map-btn{position: absolute;top: 12px;right: 5px;}
  .profile-details{width: 100%;vertical-align: middle;display: flex;align-items: center;flex-wrap: wrap;}
  .profile-details img{width:100% !important;}
  .profile-details .details{width: calc( 100% - 65px );display: inline-block;margin-left: 10px;padding-top:2px;}
  .profile-details .details i{margin-top:0px;}
  .profile-details .v-avatar{vertical-align:top; margin-top:5px;}
  .loading-spinner {position: absolute;top: 50%;left: 50%;  }
  .slider-count-text p{ margin-bottom:0px; font-weight:600;}
  .scroll-content{overflow-y:auto;}
  .map-close-btn{position: absolute; right: 20px; top: 20px; z-index: 1; background-color: #fff;}
  .map-close-btn >>> .v-btn{margin:0px; height: auto; width:auto;}
  .map-close-btn >>> .v-btn:hover .v-btn__content:before{content:''; background-color:transparent;}
  .liveLocationmapDailog{position: relative;}
  .no-map-found{height: 100px;text-align: center;padding-top: 40px;}
  .multipule-tracking .process-cycle{padding-bottom: 65px!important;}
  .details-content .refresh-progressbar{position: fixed; left: 0; right: 0; z-index: 6; top: 0; bottom: 0; background-color: rgba(0,0,0,0.1);display: flex;}
  .details-content .refresh-progressbar >>> .v-card {margin: auto;padding: 0 !important;width: 300px;text-align: center; margin-top: 400px;}
  .map { padding-bottom: 188px; position: relative; height: 0; margin-bottom: 10px;}
  @media(max-width: 420px){
    .process-cycle{padding-right:0px !important;}
    .step-process .bar{left: -25px;}
    .step-process .bar-circle{ left:-37px;}
    .subheading{font-size:13px !important;}
    .profile-details .details{font-size:12px !important;}
    .step-process .innter-content.py-3{padding-top:10px !important; padding-bottom:10px !important;}
    .display-2{font-size: 28px !important;}
    .map-btn i{ margin-top:0px;}
    .step-process .innter-content{max-width:93%;}
  }
</style>

<script lang="ts">
import { Component, Vue, Watch, Prop } from "vue-property-decorator";
import moment, { Moment, isMoment } from "moment";
import { Environment } from '@/common/environment';
import storeGetters from '@/storeGetters';
import ClaimRequest from '@/models/ClaimTracking/ClaimRequest';
import CoverIncluded from '@/models/ClaimTracking/CoverIncluded';
import EngineerAssigned from '@/models/ClaimTracking/EngineerAssigned';
import EngineerOnTheWay from '@/models/ClaimTracking/EngineerOnTheWay';
import EngineerOnSite from '@/models/ClaimTracking/EngineerOnSite';
import ClaimVisitComplete from '@/models/ClaimTracking/ClaimVisitComplete';
import ClaimTrackingModel from '@/models/ClaimTracking/ClaimTrackingModel';
import Shared from '@/common/shared';
import store from '@/store';
import Map from "@/components/Map.vue";
import JobController from '@/api/jobController';

@Component({
    name: "ClaimTrackingDetails",
    components: { Map },
})
export default class ClaimTrackingDetails extends Vue {
   @Prop() private claimTrackingDetailsModel: ClaimTrackingModel;
   @Prop() private totalClaimsCount: number;
   @Prop() private selectedClaimIndex: number;
   @Prop() private previousLatitude: number;
   @Prop() private previousLongitude: number;
   @Prop() private headingMagneticNorth: number;
   @Prop() private showProgressBar: boolean;
   private ready: boolean = false;
   private currentClaimDetails: any = {};
   private trackingCompletionRatio: number = 100;
   private numberOfSteps: number = 6;
   private trackingCompletionRatioGap: number = (100 / this.numberOfSteps);
   private claimTrackingDetailModel: ClaimTrackingModel = new ClaimTrackingModel();
   private showMap: boolean = false;
   private customerAddressLatitude: number = 0;
   private customerAddressLongitude: number = 0;

   private isJobAbandoned: boolean = false;
   private timerProgressBarHandle: NodeJS.Timer | null = null;
   private isProgressBarLoaderVisible: boolean = false;
   private intervalToShowLoader: number = 1000 * 30;
   private intervalToHideLoader: number = 1000 * 3;

   private get environment(): Environment {
      return storeGetters.getEnvironment();
   }

   private get claimTrackingModel(): ClaimTrackingModel {
      return this.claimTrackingDetailModel;
   }

   private set claimTrackingModel(value: ClaimTrackingModel) {
      this.claimTrackingDetailModel = value;
   }

   public updatedClaimTrackingModel(value: ClaimTrackingModel, isJobAbandoned: boolean) {
      this.isJobAbandoned = false;
      if (isJobAbandoned) {
         this.isJobAbandoned = isJobAbandoned;
      }
      this.claimTrackingDetailModel = new ClaimTrackingModel();
      this.claimTrackingModel = value;
   }

   @Watch("selectedClaimIndex")
   private getSelectedClaimIndex() {
      // start timer to show update notification
      this.startTimerToShowProgressbar();
      return this.selectedClaimIndex;
   }

   @Watch("totalClaimsCount")
   private getTotalClaimsCount() {
     return this.totalClaimsCount;
   }

   @Watch("claimTrackingDetailModel")
   private claimTrackingDetailsModelBindings(newValue: ClaimTrackingModel) {
     this.claimTrackingModel = newValue;
     this.updateProgressBarStatus(this.claimTrackingModel, true);
   }

   private created() {
      this.claimTrackingDetailModel = this.claimTrackingDetailsModel;
   }

   private mounted() {
      this.ready = true;
      this.updateProgressBarStatus(this.claimTrackingDetailModel, false);
      // start timer to show update notification
      if (this.showProgressBar) {
         this.resetInactivityTimer();
      }
   }

   private updateProgressBarStatus(claimTrackingModel: ClaimTrackingModel, isFromSignalR: boolean) {
      const self = this;
      let response;
      // bind default value of loader
      if (claimTrackingModel) {
         if (claimTrackingModel.claimVisitComplete) {
            if (!isFromSignalR || this.isJobAbandoned) {
               response = self.claimTrackingDetailModel.claimVisitComplete;
            }
            self.setProgressRatio(self.trackingCompletionRatioGap * 6);
            // stop timer if emergency is completed
            this.stopProgressBarTimer();
         } else if (claimTrackingModel.engineerOnSite) {
            if (!isFromSignalR || this.isJobAbandoned) {
               response = self.claimTrackingDetailModel.engineerOnSite;
            }
            self.setProgressRatio(self.trackingCompletionRatioGap * 5);
         } else if (claimTrackingModel.engineerOnTheWay) {
            if (!isFromSignalR || this.isJobAbandoned) {
               response = self.claimTrackingDetailModel.engineerOnTheWay;
            }
            self.setProgressRatio(self.trackingCompletionRatioGap * 4);
         } else if (claimTrackingModel.engineerAssigned) {
            if (!isFromSignalR || this.isJobAbandoned) {
               response = self.claimTrackingDetailModel.engineerAssigned;
            }
            self.setProgressRatio(self.trackingCompletionRatioGap * 3);
         } else if (claimTrackingModel.coverIncluded) {
            if (!isFromSignalR || this.isJobAbandoned) {
               response = self.claimTrackingDetailModel.coverIncluded;
            }
            self.setProgressRatio(self.trackingCompletionRatioGap * 2);
         } else if (claimTrackingModel.claimRequest ) {
            if (!isFromSignalR || this.isJobAbandoned) {
               response = self.claimTrackingDetailModel.claimRequest;
            }
            self.setProgressRatio(self.trackingCompletionRatioGap * 1);
         } else {
            self.setProgressRatio(0);
         }
      }

      if (response && (!isFromSignalR || this.isJobAbandoned)) {
        self.showClaimDetails(response);
      }
   }

   private getETADate(date: Moment): string {
     if (date) {
       return Shared.getFormatedDate(
         moment(date),
         store.state.Environment.DateTimeFormat,
       );
     }
     return "";
   }

   private setProgressRatio(remainingSteps: number) {
      this.trackingCompletionRatio = remainingSteps;
   }

   private showClaimDetails(claimDetails: any) {
     const self = this;
     if (claimDetails) {
       self.currentClaimDetails = claimDetails;
       const date = self.getETADate(claimDetails.createdAt).split(' ');
       self.currentClaimDetails.createdAtDate = date[0];
       self.currentClaimDetails.createdAtTime = date[1];
     }
   }

   private get isMapCoordinatesExists(): boolean {
      const self = this;
      if (self.claimTrackingDetailModel &&
         self.claimTrackingDetailModel.engineerOnTheWay &&
         self.claimTrackingDetailModel.engineerOnTheWay.latitude &&
         self.claimTrackingDetailModel.engineerOnTheWay.latitude !== 0 &&
         self.claimTrackingDetailModel.engineerOnTheWay.longitude &&
         self.claimTrackingDetailModel.engineerOnTheWay.longitude !== 0 &&
         (!self.claimTrackingDetailModel.engineerOnSite && !self.claimTrackingDetailModel.claimVisitComplete)) {
            this.openEngineerLocationMap();
            return true;
         }
      return false;
   }

   private async openEngineerLocationMap() {
      if (this.customerAddressLatitude !== 0 && this.customerAddressLongitude !== 0) {
         this.showMap = true;
         return;
      }
      await JobController.GetJobLocation().then((res: any | null) => {
         if (res) {
            this.customerAddressLatitude = res.latitude;
            this.customerAddressLongitude = res.longitude;
            this.showMap = true;
            return;
         }
      }).catch((err: any) => {
         // TODO: handle error
      });
   }

   private startTimerToShowProgressbar() {
      if (this.showProgressBar) {
         this.resetInactivityTimer();
      } else {
         this.stopProgressBarTimer();
      }
   }

   private resetInactivityTimer(): void {
      this.stopProgressBarTimer();
      this.timerProgressBarHandle = setInterval(this.showProgressBarLoader, this.intervalToShowLoader);
   }

   private showProgressBarLoader() {
      this.isProgressBarLoaderVisible = true;
      setTimeout(() => {
         this.isProgressBarLoaderVisible = false;
      }, this.intervalToHideLoader);
   }

   private stopProgressBarTimer() {
      if (this.timerProgressBarHandle) {
         clearTimeout(this.timerProgressBarHandle);
         this.timerProgressBarHandle = null;
      }
   }
}
</script>
