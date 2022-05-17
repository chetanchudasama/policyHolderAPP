<template>
    <section role="region" aria-label="Cookie banner">
    <div v-show="showCookieBanner" class="cookie-banner">
        <h3 class="cookie-banner__header">Your privacy</h3>
        <div class="cookie-banner__text">{{settings.cookieBanner.privacyPolicyText}} <span><a :href="settings.cookieBanner.cookiePolicyLink">Privacy Policy</a></span></div>
        <div>
            <v-btn
                :color="'green'"
                class="cookie-banner__btn"
                @click="acceptAllConsent()">
                Accept all
            </v-btn>
            <v-btn
                :color="'blue'"
                class="cookie-banner__btn"
                @click="showOptinModal = true">
                Customise Settings
            </v-btn>
        </div>
    </div>
    <CookieOptinModal
        v-if="showOptinModal"
        @setTrackingOptions="setTrackingOptions()"
        @acceptAllConsent="acceptAllConsent()"
        @closeModal="showOptinModal = false"
        :settings="settings">

        <template v-slot:cookies>
            <div class="consent-toggle" v-for="(cookie, index) in settings.cookieOptions" :key="`${cookie.label}-${index}`">
                <div class="consent-toggle__description">
                    <h3 class="consent-toggle__text">{{cookie.label}}</h3>
                    <v-tooltip top :max-width="350">
                        <template v-slot:activator="{ on, attrs }">
                            <v-icon v-bind="attrs" v-on="on">info</v-icon>
                        </template>
                        <span>{{cookie.tooltipText}}</span>
                    </v-tooltip>
                </div>
                <v-switch @change="setCookieConsent(cookie.key, $event)" v-model="cookieConsent[cookie.key]" ></v-switch>
            </div>
        </template>
    </CookieOptinModal>
    </section>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { cookieService } from '@/services/cookie-service';
import storeGetters from "@/storeGetters";
import CookieOptinModal from '@/components/cookie/CookieOptinModal.vue';
import DefaultCookieSettings from "@/models/cookies/settings/default-cookie-settings";

@Component({
    components: {
        CookieOptinModal,
    },
})
export default class CookieBanner extends Vue {
    private cookieName: string = 'CET-Cookie-Optin';

        public get showCookieBanner(): boolean {
        return this.$store.getters['cookieModule/showCookieBanner'];
    }

    public set showCookieBanner(showBanner: boolean) {
        this.$store.dispatch('cookieModule/submitShowCookieBanner', showBanner);
    }

    public get showOptinModal(): boolean {
        return this.$store.getters['cookieModule/showOptinModal'];
    }

    public set showOptinModal(showModal: boolean) {
        this.$store.dispatch('cookieModule/submitShowOptinModal', showModal);
    }

    public get cookieConsent(): {[key: string]: boolean} {
        return this.$store.getters['cookieModule/cookieConsent'];
    }

    public setCookieConsent(key: string, consentValue: boolean) {
        const consent = this.cookieConsent;
        consent[key] = consentValue;
        this.$store.dispatch('cookieModule/submitCookieConsent', consent);
    }

    private acceptAllConsent() {
        Object.keys(this.cookieConsent).forEach((key) => this.setCookieConsent(key, true));
        this.setTrackingOptions();
    }

    private setTrackingOptions() {
        if (this.cookieConsent.performanceConsent) {
            this.setPerformanceTracking();
        }
        this.hideCookieConsent();
        this.setCookie();
    }

    private setPerformanceTracking() {
        const googleAnalyticsScript = document.createElement("script");
        googleAnalyticsScript.type = "text/javascript";
        googleAnalyticsScript.innerHTML =  "(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){" +
        "(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o)," +
        "m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)" +
        "})(window,document,'script','https://www.google-analytics.com/analytics.js','ga'); " +

        `ga('create', '${(window as any).gaCode}', 'auto'); ` +
        "ga('send', 'pageview');";

        document.body.appendChild(googleAnalyticsScript);
    }

    private setCookie() {
        let cookieValue = '';
        Object.keys( this.cookieConsent ).forEach((key) => {
            cookieValue += `${key}=${this.cookieConsent[key]}`;
            // Make sure its not the last value, as we dont want to add the '&' to the final value.
            if (Object.keys(this.cookieConsent)[Object.keys(this.cookieConsent).length - 1] !== key) {
                cookieValue += '&';
            }
        });
        cookieService.setCookie(this.cookieName, cookieValue);
    }

    private retrieveCookie(): string | null {
        const cookies: string[] = document.cookie.split(';');
        const cetCookie = cookies.filter((x) => x.includes(this.cookieName))[0];
        return cetCookie ? cetCookie.substring(cetCookie.indexOf('=') + 1) : null;
    }

    private setInitialCookieConsent(cookie: string) {
        const cookieOptins: string[] = cookie.split('&');

        cookieOptins.forEach((optin) => {
            const optinKey = optin.split(/=(.+)/)[0];
            const optinValue = optin.split(/=(.+)/)[1];
            this.setCookieConsent(optinKey, JSON.parse(optinValue));
        });
        this.setTrackingOptions();
    }

    private hideCookieConsent() {
        this.showCookieBanner = false;
        this.showOptinModal = false;
    }

    private get settings(): DefaultCookieSettings {
        return storeGetters.getDefaultCookieSettings();
    }

    private setupCookieConsentModal() {
        this.settings.cookieOptions.forEach((x) => this.setCookieConsent(x.key, false));
    }

    private created() {
        this.setupCookieConsentModal();
        const cookie: string | null = this.retrieveCookie();

        if (cookie && cookie.length > 0) {
            this.setInitialCookieConsent(cookie);
            this.hideCookieConsent();
        }

        // Hide the banner on cookie policy page
        if (this.$router.currentRoute.path === '/cookienotice') {
            this.showCookieBanner = false;
        }
    }
}
</script>

<style lang="scss">
    .cookie-banner {
        position: fixed;
        z-index: 999;
        display: flex;
        flex-direction: column;
        bottom: 20px;
        left: 20px;
        background: lightgray;
        padding: 20px;
        max-width: 300px;

        @media(max-width:425px) {
            left: calc(50% - 150px);
        }

        &__header {
            text-align: center;
            margin-bottom: 10px;
        }

        &__text {
            text-align: left;
            margin-bottom: 10px;
        }

        &__btn {
            padding: 0;
            margin: 0 0 10px 0;
            width: 100%;
        }
    }
</style>
