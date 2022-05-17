<template>
 <section role="region" aria-label="Message card">
  <div class="text-xs-center successfull-msg center-content pa-3">
    <v-icon color="error" class="mb-3">
      cancel
    </v-icon>
    <h3 class="pb-4">{{message}}</h3>
  </div>
 </section>
</template>
<style>
.job-complete-notification {display: flex;height: 100%;}
</style>
<style scoped>
.job-complete-notification .successfull-msg {width: 100%;margin: auto;background-color: white;color: black;}
.job-complete-notification .successfull-msg .v-icon{font-size: 80px;}
.job-complete-notification .successfull-msg .center-content h1{font-size: 36px; font-weight: normal;}
.job-complete-notification .successfull-msg .center-content h3{font-size: 22px; font-weight: normal;}
.job-complete-notification .successfull-msg h3{font-size: 22px; font-weight: normal;}
@media (max-width: 530px) {
  .job-complete-notification .successfull-msg h3 {font-size: 18px;}
}
@media (max-width: 420px) {
  .job-complete-notification {padding-left: 10px!important;padding-right: 10px!important;}
  .job-complete-notification .successfull-msg h3 {font-size: 16px;}
}
</style>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

@Component
export default class MessageCard extends Vue {
  @Prop({default: 'Something Went Wrong!'}) private message: string;
}
</script>
