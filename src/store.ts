import Vue from 'vue';
import Vuex, { ActionTree } from 'vuex';
import { Environment } from '@/common/environment';
import { mutationTree as mutations } from '@/storeMutations';
import { getterTree as getters } from '@/storeGetters';
import DefaultCookieSettings from './models/cookies/settings/default-cookie-settings';
import { cookieModule } from '@/vuex/modules/cookie-module';

Vue.use(Vuex);

// interface that models the vuex state for the application
export interface State {
  Environment: Environment;
  LoqateApiKey: string;
  trackingId: string;
  defaultCookieSettings: DefaultCookieSettings;
}

const state: State = {
  Environment: new Environment('live'),
  LoqateApiKey: "",
  trackingId: "",
  defaultCookieSettings: new DefaultCookieSettings(),
};

const actions: ActionTree<State, any> = {
};

export default new Vuex.Store<State>({
  modules: {
    cookieModule,
  },
  state,
  mutations,
  actions,
  getters,
});
