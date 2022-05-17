import Axios from 'axios';
import { Environment, AppMode } from '@/common/environment';
import { Settings } from './models/client/PortalSettings';

export default class Loader {
    public static SetAppLoadingMessage(message: string, hideSpinner: boolean = false) {
        const textElem = document.getElementById("appLoadingMsg");
        if (textElem !== null) {
            textElem.innerText = message;
        }

        const spinnerElem = document.getElementById("appLoadingSpinner");
        if (spinnerElem !== null) {
            spinnerElem.style.display = hideSpinner ? "none" : "block";
        }
    }

    public static async InitialiseEnvironment(): Promise<Environment | null> {
        Loader.SetAppLoadingMessage("Loading Environment Settings ...", false);
        try {
            const envRes = await Axios.get<Environment>('/environment.json', {
                validateStatus: (s) => true,
                headers: { 'Cache-Control': 'no-cache, no-store' },
            });
            if (envRes.status === 200 || envRes.status === 304) {
                const settingsRes = await Axios.get<Settings>('/settings.json');
                if (settingsRes.status === 200 || settingsRes.status === 304) {
                    // loop over properties returned by request,
                    // only set those that are non null (use default values for others)
                    const settings = new Settings();
                    for (const prop in settingsRes.data) {
                        if (settingsRes.data.hasOwnProperty(prop) && settings.hasOwnProperty(prop)) {
                            settings[prop] = settingsRes.data[prop] || settings[prop];
                        }
                    }

                    let mode: AppMode = 'live';
                    if (window.location.hostname.toLowerCase().split('.')[0].endsWith('-staging')) {
                        mode = 'edit';
                    }
                    const env = new Environment(mode);
                    for (const prop in envRes.data) {
                        if (envRes.data.hasOwnProperty(prop)) {
                            env[prop] = envRes.data[prop] || env[prop];
                        }
                    }
                    if (settings.TopEmergencies.length === 0) {
                        settings.TopEmergencies.push(1);
                    }
                    env.Settings = settings;
                    return env;
                } else {
                    Loader.SetAppLoadingMessage("Error: Failed to load settings.json", true);
                    return null;
                }
            } else {
                Loader.SetAppLoadingMessage("Error: Failed to load environment.json", true);
                return null;
            }
        } catch (error) {
            Loader.SetAppLoadingMessage("Error: Failed to initialise environment", true);
            return null;
        }
    }
}
