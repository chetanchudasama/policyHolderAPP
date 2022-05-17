<template>
   <div class="step-heading  mb-4 edit-text-control" :class="editContent ? 'edit-head-content' : ''" v-bind:style="{ borderColor: complementaryColor}" role="region" aria-label="Step header"> 
        <span class="edit-icons" v-if="appInEditMode">
            <span class="edit"> 
            <v-btn icon class="ma-0" @click="editContentHeader" label="Edit header content" aria-label="Edit header content"><v-icon>edit</v-icon></v-btn>
            </span>
            <span class="save" >
            <v-btn icon class="ma-0" @click="saveChanges" label="Save changes" aria-label="Save changes"><v-icon>save</v-icon></v-btn>
            </span>
            <span class="cancel">
            <v-btn icon class="ma-0"  @click="cancelChanges" label="Cancel changes" aria-label="Cancel changes"><v-icon>close</v-icon></v-btn>
            </span>
        </span>
        <h1 class="display-1">
            <span v-bind:style="{ color: primaryColor }">{{currentHeading}}</span>
            <span class="edit-text" v-if="appInEditMode">
                    <v-text-field
                        label="Header"
                        aria-required="true"
                        name="input-1"
                        v-model="currentHeading"
                        data-vv-scope="frmEditableHeader"
                        :data-vv-name="'Header'"
                        :error-messages="errors.collect('Header')" 
                        v-validate="'required'"
                        class="required"
                    ></v-text-field>
            </span>
        </h1>
        <p class="mt-2 mb-2">
            <pre class="heading-text">{{currentDescription}}</pre>
            <span class="edit-text" v-if="appInEditMode">
            <v-textarea 
                name="input-2"
                label="Description"
                aria-required="true" 
                v-model="currentDescription"
                data-vv-scope="frmEditableHeader"
                :data-vv-name="'Description'"
                :error-messages="errors.collect('Description')" 
                v-validate="'required'"
                class="required"
            ></v-textarea>
            </span>
         </p> 
    </div>
</template>

<style scoped>
    .edit-text-control{position: relative;}
    .edit-text-control .edit-text,
    .edit-text-control .edit-icons span,
    .edit-text-control.edit-head-content h4 span:first-child,
    .edit-text-control.edit-head-content p .heading-text,
    .edit-text-control.edit-head-content:hover .edit-icons span.edit,
    .edit-text-control.edit-head-content .edit-icons span.edit {display: none;}
    .edit-text-control .edit-icons{position: absolute;top: 0px;right: 0px;line-height: 0;z-index: 3;}
    .edit-text-control .edit-text >>> input{padding-right: 80px;}  
    .edit-text-control:hover .edit-icons span.edit,
    .edit-text-control.edit-head-content .edit-text,
    .edit-text-control.edit-head-content .edit-icons{ display: block;}
    .edit-text-control.edit-head-content .edit-icons span {display:inline-block }
    .edit-text-control pre{font-family: inherit;  white-space: pre-line;}
    .sub-text{font-size:14px;}
    .display-1{font-size:24px !important; line-height: 28px !important;}
</style>

<script lang="ts">
import { Component, Vue, Prop, Watch } from "vue-property-decorator";
import EmergencyModel from "@/models/EmergencyModel";
import Shared from "@/common/shared";
import Store from "@/store";

@Component
export default class EditableHeader extends Vue {
    @Prop() private heading: string;
    @Prop() private description: string;
    @Prop() private primaryColor: string;
    @Prop() private complementaryColor: string;
    @Prop() private appInEditMode: boolean;
    private editContent: boolean = false;
    private previousHeading: string = "";
    private previousDescription: string = "";
    private currentHeading: string = "";
    private currentDescription: string = "";

    private mounted() {
        this.currentHeading = this.heading;
        this.currentDescription = this.description;
    }

    @Watch("heading")
    private onHeadingChange() {
        this.currentHeading = this.heading;
    }

    @Watch("description")
    private onDescriptionChange() {
        this.currentDescription = this.description;
    }

    private editContentHeader() {
        this.previousHeading = this.heading;
        this.previousDescription = this.description;
        this.editContent = true;
    }
    private saveChanges() {
        this.validate().then((result: boolean) => {
        if (result) {
            this.editContent = false;
            this.updateChangesToParent();
        }
        }).catch((err: any) => {
            // TODO: handle error
        });
    }

    private cancelChanges() {
        this.editContent = false;
        this.currentHeading = this.previousHeading;
        this.currentDescription = this.previousDescription;
        this.updateChangesToParent();
    }

    private updateChangesToParent() {
        this.$emit("update:heading", this.currentHeading);
        this.$emit("update:description", this.currentDescription);
    }

    private async validate(): Promise<boolean> {
        const result: boolean = await this.$validator.validateAll("frmEditableHeader");

        // set focus to non validate field
        if (!result) {
            Shared.setValidationFocus(this.$el as HTMLElement);
        }

        return result;
    }
}
</script>
