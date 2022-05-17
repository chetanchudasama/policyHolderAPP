import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import Vuetify from 'vuetify';
import 'vuetify/dist/vuetify.min.css';
import '../public/assets/css/style.css';
import 'babel-polyfill';
import VeeValidate from 'vee-validate';
import Loader from '@/Loader';
import storeMutations from '@/storeMutations';

Vue.use(Vuetify);
Vue.use(VeeValidate);

Vue.config.productionTip = false;

Loader.InitialiseEnvironment()
  .then((env) => {
    if (env) {
      storeMutations.setEnvironment(env);
      new Vue({
        router,
        store,
        render: (h) => h(App),
        $_veeValidate: {
          validator: 'new',
        },
      }).$mount('#app');
    }
  })
  .catch((err) => {
    Loader.SetAppLoadingMessage("Error: unhandled exeception when attempting to load environment.", true);
    // tslint:disable-next-line:no-console
    console.error(err);
  });
