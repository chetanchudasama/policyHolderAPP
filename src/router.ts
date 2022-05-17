import Vue from 'vue';
import Router from 'vue-router';
import NotFound from "@/views/NotFound.vue";
import InsurerPortal from '@/views/InsurerPortal.vue';
import ClaimTracking from '@/views/ClaimTracking.vue';
import UploadInvoiceCAT from '@/components/UploadInvoiceCAT.vue';
import CookieNotice from '@/views/CookieNotice.vue';

Vue.use(Router);

export default new Router({
  mode: 'history',

  routes: [
    {
      path: '/',
      name: 'insurerportal',
      component: InsurerPortal,
    },
    {
      path: '/claimtracking/:jobId',
      name: 'claimtracking',
      component: ClaimTracking,
      props: true,
    },
    {
      path: '/questionmode/:jobId',
      name: 'insurerportalWithQuestionMode',
      component: InsurerPortal,
      props: true,
    },
    {
      path: '/uploadInvoice/:jobId/:recordId',
      name: 'uploadInvoiceCAT',
      component: UploadInvoiceCAT,
      props: true,
    },
    {
      path: '/cookienotice',
      name: 'cookienotice',
      component: CookieNotice,
      props: true,
    },
    {
      path: '*',
      name: 'notFound',
      component: NotFound,
    },
  ],
});
