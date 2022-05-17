<template>
    <section role="region" aria-label="Confirmation dialog">
        <v-layout row justify-center>
            <v-dialog v-model="dialog" persistent max-width="400">
                <v-btn color="primary" label="Open Dialog" aria-label="Open Dialog" dark style="display: none;">Open Dialog</v-btn>
                <v-card>
                <v-card-title class="pa-3" v-if="message"><h3>{{message}}</h3></v-card-title>
                <v-card-actions class="pt-2 px-3 pb-3">
                    <v-spacer></v-spacer>
                    <v-btn small flat @click="onCancel" :label="negativeActionText" :aria-label="negativeActionText">{{negativeActionText}}</v-btn>
                    <v-btn color="primary" small @click="onConfirm" :label="positiveActionText" :aria-label="positiveActionText">{{positiveActionText}}</v-btn>
                </v-card-actions>
                </v-card>
            </v-dialog>
        </v-layout>
    </section>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import Shared from "@/common/shared";
@Component
export default class Confirmation extends Vue {
  public positiveActionText: string = "Delete";
  public negativeActionText: string = "Cancel";
  private dialog: boolean = false;
  private item: any;
  private message: string = "";
  private parentComponent: any;
  private callbackMethodName: string;
  private callbackMethodNameCancel: string;

  public open(message: string, name: string, type: string, negativeActionText: string, positiveActionText: string, parentComponent: any, callbackMethodName: string, item: any, callbackMethodNameCancel: string = "") {
    this.item = item;
    this.positiveActionText = positiveActionText ? positiveActionText : this.positiveActionText;
    this.negativeActionText = negativeActionText ? negativeActionText : this.negativeActionText;
    this.message = message ? message : "Do you really want to delete " + type + (name ? " : " + name + "?" : "?");
    this.parentComponent = parentComponent;
    this.callbackMethodName = callbackMethodName;
    this.dialog = true;
    this.callbackMethodNameCancel = callbackMethodNameCancel;
  }

  private created() {
    Shared.confirmationPopup = this;
  }

  private onConfirm() {
    try {
      this.dialog = false;
      if (this.parentComponent != null) {
        this.parentComponent[this.callbackMethodName](this.item);
      } else {
        this.$emit("DialogConfirm", this.item);
      }
    } catch (e) {
      // TODO: handle error
    }
  }

  private onCancel() {
    try {
      this.dialog = false;
      if (this.parentComponent != null && this.callbackMethodNameCancel) {
        this.parentComponent[this.callbackMethodNameCancel](this.item);
      } else {
        this.$emit("DialogCancel", this.item);
      }
    } catch (e) {
      // TODO: handle error
    }
  }
}
</script>
