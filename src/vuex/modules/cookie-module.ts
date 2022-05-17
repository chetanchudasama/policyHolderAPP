import {
    ActionTree, Module, MutationTree, GetterTree,
  } from 'vuex';
import { ICookieState } from '@/vuex/states/interfaces/cookie-state.d';
import CookieState from '../states/cookie-state';
import CookieController from '@/api/cookie-controller';
import CookieRecord from '@/models/cookies/cookie-record';

  export const cookieState: ICookieState = new CookieState();

  export const getters: GetterTree<ICookieState, any> = {
    cookieConsent: (state) => state.cookieConsent,
    showCookieBanner: (state) => state.showCookieBanner,
    showOptinModal: (state) => state.showOptinModal,
    useDefaultCookieBanner: (state) => state.useDefaultCookieBanner,
  };

  export const mutations: MutationTree<ICookieState> = {
    setCookieConsent: (state, cookieConsent: {[key: string]: boolean}) => {
      state.cookieConsent = JSON.parse(JSON.stringify(cookieConsent));
    },
    setShowCookieBanner: (state, showCookieBanner: boolean) => {
      state.showCookieBanner = showCookieBanner;
    },
    setShowOptinModal: (state, showOptinModal: boolean) => {
      state.showOptinModal = showOptinModal;
    },
    setUseDefaultCookieBanner: (state, useDefaultCookieBanner: boolean) => {
      state.useDefaultCookieBanner = useDefaultCookieBanner;
    },
  };

  export const actions: ActionTree<ICookieState, any> = {
    async submitCookieConsent({ commit }, cookieConsent: {[key: string]: boolean}) {
      commit('setCookieConsent', cookieConsent);
    },
    async submitShowCookieBanner({ commit }, showCookieBanner: boolean) {
      commit('setShowCookieBanner', showCookieBanner);
    },
    async submitShowOptinModal({ commit }, setShowOptinModal: boolean) {
      commit('setShowOptinModal', setShowOptinModal);
    },
    async retrieveCookieRecord({ commit, rootState }) {
      const { cookieId } = rootState.Environment.Settings.TemplateCookieRecord;
      await CookieController.RetrieveCookieRecord(cookieId)
      .then((cookieRecord: CookieRecord | null) => {
        const useDefaultCookieBanner = (cookieRecord && cookieRecord.isDefault) || !cookieRecord;
        commit('setUseDefaultCookieBanner', useDefaultCookieBanner);
      });
    },
  };

  export const cookieModule: Module<ICookieState, any> = {
    state: cookieState,
    actions,
    mutations,
    getters,
    namespaced: true,
  };
