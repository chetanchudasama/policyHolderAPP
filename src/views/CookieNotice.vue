<template>
<div role="banner" aria-label="header">
    <v-container>
        <InternalCookiePolicy v-if="useDefaultCookieBanner" />
        <div v-else>
            <div id="ot-sdk-cookie-policy"></div>
            <div id="ot-sdk-btn" class="ot-preference-btn ot-sdk-show-settings" tabindex="0"></div>
        </div>
    </v-container>
</div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import InternalCookiePolicy from '@/components/cookie/InternalCookiePolicy.vue';

@Component({
    components: {
        InternalCookiePolicy,
    },
})
export default class CookieNotice extends Vue {
    private get useDefaultCookieBanner(): boolean {
        return this.$store.getters['cookieModule/useDefaultCookieBanner'];
    }
}
</script>

<style lang="scss" scoped>
    .ot-preference-btn {
        max-width: 140px;
    }
</style>
