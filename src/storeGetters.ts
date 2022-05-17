import { GetterTree } from 'vuex';
import store, { State } from '@/store';
import { Environment } from '@/common/environment';
import { Settings, SettingName } from './models/client/PortalSettings';
import { JsonHubProtocol } from '@aspnet/signalr';
import DefaultCookieSettings from './models/cookies/settings/default-cookie-settings';

export const getterTree: GetterTree<State, State> = {
    getEnvironment: (state) => () => {
        return store.state.Environment;
    },
    getLoqateApiKey: (state) => () => {
        if (store.state.LoqateApiKey) {
            return store.state.LoqateApiKey;
        } else {
            return '';
        }
    },
    getSettings: (state: State) => () => {
        if (state.Environment) {
            return JSON.stringify(state.Environment.Settings);
        }
        return undefined;
    },
    getTrackingId: () => () => {
        if (store.state.trackingId) {
            return store.state.trackingId;
        } else {
            return '';
        }
    },
    defaultCookieSettings: (state) => () => state.defaultCookieSettings,
};

class StoreGetters {
    public getEnvironment(): Environment {
        return store.getters.getEnvironment();
    }

    public getLoqateApiKey(): string {
        return store.getters.getLoqateApiKey();
    }

    public getSettings(): Settings {
        return store.getters.getSettings();
    }

    public getTrackingId(): string {
        return store.getters.getTrackingId();
    }

    public getDefaultCookieSettings(): DefaultCookieSettings {
        return store.getters.defaultCookieSettings();
    }
}

export default new StoreGetters();
