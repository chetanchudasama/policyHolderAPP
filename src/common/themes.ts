import { Vue } from "vue-property-decorator";
import store from '@/store';

// TODO: add other colours once known and update SetTheme funtion
export abstract class Theme {
    public abstract primary: string;
    public abstract secondary: string;
}

export class InsurerPortalTheme implements Theme {
    public primary: string;
    public secondary: string;

    public constructor() {
        this.primary = store.state.Environment.Settings.PrimaryColor;
        this.secondary = store.state.Environment.Settings.SecondaryColor;
    }
}

export function GetCurrentTheme(componentInstance: Vue): Theme {
    return componentInstance.$vuetify.theme as Theme;
}

export function SetTheme(componentInstance: Vue, theme: Theme) {
    // set values
    componentInstance.$vuetify.theme.primary = theme.primary;
    componentInstance.$vuetify.theme.secondary = theme.secondary;
}
