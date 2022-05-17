<template>
    <div role="banner" aria-label="header">
        <v-container>
            <v-layout>
                <v-flex class="cookie-notice">
                    <h2 class="mb-2">Cookie List</h2>
                    <v-flex class="mb-3">
                        <span class="caption">{{cookiePolicy.description}}</span>
                    </v-flex>
                    <v-flex>
                        <div class="mb-4" v-for="(cookie, index) in cookiePolicy.cookies" :key="`${cookie.title}-${index}`">
                            <h5>{{cookie.title}}</h5>
                            <h6 class="mb-3">{{cookie.description}}</h6>
                            <v-layout class="cookie-notice__header" row wraps>
                                <v-flex v-for="(header, index) in tableHeaders" :key="`${header}-${index}`" md4>
                                    <h4>{{header}}</h4>
                                </v-flex>
                            </v-layout>
                            <v-layout class="cookie-notice__setting mb-2" row wraps v-for="(cookie, index) in cookie.settings" :key="`${cookie.title}-${index}`">
                                <v-flex md4 xs12>
                                    <span class="hidden-sm-and-up font-weight-bold">Cookie Subgroup: </span>
                                    {{cookie.cookieSubGroup}}
                                </v-flex>
                                <v-flex md4 xs12>
                                    <span class="hidden-sm-and-up font-weight-bold">Cookies (Click for details): </span>
                                    <span class="ma-1 cookie-notice__tooltip" v-for="(cookie, index) in cookie.cookieDetails" :key="`${cookie.name}-${index}`">
                                        <v-tooltip top max-width="750">
                                            <template v-slot:activator="{ on }">
                                            <span
                                                v-on="on"
                                            >{{cookie.name}}</span>
                                            </template>
                                            <span>{{cookie.tooltipText}}</span>
                                        </v-tooltip>
                                    </span>
                                </v-flex>
                                <v-flex md4 xs12>
                                    <span class="hidden-sm-and-up font-weight-bold">Cookie Type: </span>
                                    {{cookie.cookieType}}
                                </v-flex>
                            </v-layout>
                        </div>
                    </v-flex>
                    <v-btn color="primary" @click="showModal()">Customise Consent</v-btn>
                </v-flex>
            </v-layout>
        </v-container>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import CookieBanner from '@/components/cookie/CookieBanner.vue';

@Component({
    components: {
        CookieBanner,
    },
})
export default class InternalCookiePolicy extends Vue {
    private tableHeaders = [
        'Cookie Subgroup',
        'Cookies (Hover for details)',
        'Cookie Type',
    ];

    private cookiePolicy = {
        description: 'A cookie is a small piece of data (text file) that a website – when visited by a user – asks your browser to store on your device in order ' +
                     'to remember information about you, such as your language preference or login information. Those cookies are set by us and called first-party cookies. ' +
                     'We also use third-party cookies – which are cookies from a domain different than the domain of the website you are visiting – for our advertising and marketing ' +
                     'efforts. More specifically, we use cookies and other tracking technologies for the following purposes:',
        cookies: [
            {
                title: 'Strictly Necessary Cookies',
                description: 'These cookies are necessary for the website to function and cannot be switched off in our systems. ' +
                             'They are usually only set in response to actions made by you which amount to a request for services, such ' +
                             'as setting your privacy preferences, logging in or filling in forms. You can set your browser to block or alert ' +
                             'you about these cookies, but some parts of the site will not then work. These cookies do not store any personally identifiable information.',
                settings: [
                    {
                        cookieSubGroup: 'homeemergency.co.uk',
                        cookieDetails: [
                            {
                                name: 'CET-Cookie-Optin',
                                tooltipText: 'Cookie used to gather the consumers consent for further cookie use.',
                            },
                        ],
                        cookieType: 'First Party',
                    },
                ],
            },
            {
                title: 'Performance Cookies',
                description: 'These cookies allow us to count visits and traffic sources so we can measure and improve the ' +
                             'performance of our site. They help us to know which pages are the most and least popular and see ' +
                             'how visitors move around the site. All information these cookies collect is aggregated and therefore anonymous. ' +
                             'If you do not allow these cookies we will not know when you have visited our site, and will not be able to monitor its performance.',
                settings: [
                    {
                        cookieSubGroup: 'co.uk',
                        cookieDetails: [
                            {
                                name: '_ga',
                                tooltipText: 'This cookie name is associated with Google Universal Analytics - which is a significant update to Googles more commonly used ' +
                                              'analytics service. This cookie is used to distinguish unique users by assigning a randomly generated number as a client identifier',
                            },
                        ],
                        cookieType: 'First Party',
                    },
                    {
                        cookieSubGroup: 'homeemergency.co.uk',
                        cookieDetails: [
                            {
                                name: '_gid',
                                tooltipText: 'This cookie name is associated with Google Universal Analytics. This appears to be a new cookie and as of Spring 2017 no information is ' +
                                             'available from Google. It appears to store and update a unique value for each page visited.',
                            },
                            {
                                name: '_gat',
                                tooltipText: 'This cookie name is associated with Google Universal Analytics, according to documentation it is used to throttle the request rate' +
                                              '- limiting the collection of data on high traffic sites.',
                            },
                        ],
                        cookieType: 'First Party',
                    },
                ],
            },
        ],
    };

    private showModal() {
        this.$store.dispatch('cookieModule/submitShowOptinModal', true);
    }
}
</script>

<style lang="scss" scoped>
    .cookie-notice {
        height: 90vh;
        overflow: auto;

        &__tooltip {
            cursor: pointer;
        }

        &__setting {
            @media (max-width: 600px) {
                flex-direction: column !important;
            }
        }

        &__header {
            @media (min-width: 600px) {
                display: flex;
            }

            @media (max-width: 600px) {
                display: none;
            }
        }
    }
</style>
