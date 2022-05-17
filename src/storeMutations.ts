import { Environment } from "@/common/environment";
import store, { State } from '@/store';
import { MutationTree } from 'vuex';
import { IUpdateSetting } from './models/client/PortalSettings';
import DefaultCookieSettings from "./models/cookies/settings/default-cookie-settings";

export const mutationTree: MutationTree<State> = {
    init: (s: State, e: Environment) => { s.Environment = e; },
    updateLoqateApiKey: (s: State, loqateApiKey: string) => {
        s.LoqateApiKey = loqateApiKey;
    },
    updateSetting: (state: State, model: IUpdateSetting) => {
        if (state.Environment) {
            (state.Environment.Settings[model.name] as any) = model.value;
        }
    },
    updateTrackingId: (s: State, sd: string) => {
        s.trackingId = sd;
    },
    setDefaultCookieSettings: (s: State, settings: DefaultCookieSettings) => {
        s.defaultCookieSettings = settings;
    },
};

class StoreMutations {
    public setEnvironment(env: Environment) {
        store.commit('init', env);
    }
    public updateLoqateApiKey(loqateApiKey: string) {
        store.commit('updateLoqateApiKey', loqateApiKey);
    }
    public updateSetting(model: IUpdateSetting) {
        store.commit('updateSetting', model);
    }
    public updateTrackingId(sd: string) {
        store.commit('updateTrackingId', sd);
    }
    public setDefaultCookieSettings(settings: DefaultCookieSettings) {
        store.commit('setDefaultCookieSettings', settings);
    }
}

export default new StoreMutations();
