<template>
    <section role="region" aria-label="Cookie consent confirmation">
        <div @click="closeModal()" class="consent-overlay"></div>

        <div class="consent-modal">
            <div class="consent-modal__header">
                <h2>Cookie Settings</h2>
                <v-icon @click="closeModal()">close</v-icon>
            </div>
            <div class="consent-modal__text">{{settings.cookieBanner.modalText}}</div>

            <div class="consent-toggle">
                <div class="consent-toggle__description">
                    <h3 class="consent-toggle__text">{{settings.cookieBanner.necessaryLabel}}</h3>
                    <v-tooltip top :max-width="350">
                        <template v-slot:activator="{ on, attrs }">
                            <v-icon v-bind="attrs" v-on="on">info</v-icon>
                        </template>
                        <span>{{settings.cookieBanner.necessaryTooltipText}}</span>
                    </v-tooltip>
                </div>
                <v-switch  input-value="true" disabled></v-switch>
            </div>

            <slot name="cookies"></slot>

            <div class="consent-footer">
                <v-btn @click="$emit('acceptAllConsent')" class="consent-footer__btn" :color="'green'">Accept All</v-btn>
                <v-btn @click="$emit('setTrackingOptions')" class="consent-footer__btn" :color="'blue'">Confirm my choices</v-btn>
                <v-btn @click="closeModal()" class="consent-footer__btn" :color="'red'">Cancel</v-btn>
            </div>
        </div>
    </section>
</template>

<script lang="ts">
import DefaultCookieSettings from "@/models/cookies/settings/default-cookie-settings";
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class CookieOptinModal extends Vue {
    @Prop()
    public settings: DefaultCookieSettings;

    private closeModal() {
        this.$emit('closeModal');
    }
}
</script>

<style lang="scss">
    .consent-overlay {
        position: fixed;
        z-index: 1000;
        display: flex;
        flex-direction: column;
        top: 0px;
        left: 0px;
        width: 100%;
        height: 100%;
        background: #353030;
        opacity: .7;
    }

    .consent-modal {
        position: absolute;
        z-index: 1000;
        display: flex;
        flex-direction: column;
        top: calc(50% - 270px);
        background: white;
        padding: 20px;
        margin: 0 140px;
        overflow: auto;

        @media(max-width:1000px) {
            margin: 0 40px;
        }

        @media(max-width:550px) {
            margin: 0;
            height: 100vh;
            top: 0;
        }

        &__header {
            display: flex;
            justify-content: space-between;
            margin-bottom: 10px;
        }
    }

    .consent-toggle {
        display: flex;
        align-items: center;
        justify-content: space-between;

        &__description {
            display: flex;
        }

        &__text {
            margin-right: 10px;
        }

        .v-input {
            flex: 0;
        }
    }

    .consent-footer {
        display: flex;

        &__btn {
            padding: 10px;
            margin: 5px;
        }

        @media(max-width:550px) {
            flex-direction: column;

            &__btn {
                width: 100%;
            }
        }
    }
</style>
