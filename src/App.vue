<template>
  <div id="app" class="insuer-portal application theme--light" role="region" aria-label="Insurer portal application">
    <v-app id="inspire">
      <v-content>
        <v-container fluid fill-height pa-0>
          <v-layout>
            <v-flex xs12>
              <v-fade-transition mode="out-in" v-bar>
                <router-view/>
              </v-fade-transition>
            </v-flex>
          </v-layout>
        </v-container>
      </v-content>
      <Confirmation></Confirmation>
      <CookieBanner v-if="showDefaultCookieBanner" />
    </v-app>
  </div>
</template>
<style scoped>
.insuer-portal {
  min-height: 100%;
  position: relative;
}
.application {
  width: 100%;
}
.application >>> .v-content,
.application >>> .v-content--wrap {
  height: 100%;
}
#app >>> .application--wrap{min-height: auto;}
@media only screen and (max-width: 768px) {
  .container.fill-height {
    display: block;
  }
}
</style>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import { SetTheme, InsurerPortalTheme } from "@/common/themes";
import { Environment } from "@/common/environment";
import storeGetters from "@/storeGetters";
import {
  ICommandMessage,
  IUpdateSetting,
} from "@/models/client/PortalSettings";
import storeMutations from "@/storeMutations";
import Store from "@/store";
import Confirmation from "@/components/Confirmation.vue";
import CookieBanner from "@/components/cookie/CookieBanner.vue";
import CookieController from "@/api/cookie-controller";
import { cookieService } from "./services/cookie-service";

@Component({
  components: {
    Confirmation,
    CookieBanner,
  },
})
export default class App extends Vue {
  public Vuebar = require("vuebar");
  private showDefaultCookieBanner: boolean = false;

  public mounted() {
    SetTheme(this, new InsurerPortalTheme());
    this.setErrorColor();
    this.setInputTextColor();
  }

  private async created() {
    await this.setCookieBanner();

    Vue.use(this.Vuebar);
    const faviconUrl: string =
      this.environment.Settings.FavIconURL !== ""
        ? this.environment.Settings.FavIconURL
        : "/img/favicon.png";
    const link: any = document.createElement("link");
    link.type = "image/x-icon";
    link.rel = "shortcut icon";
    link.href = faviconUrl;
    document.getElementsByTagName("head")[0].appendChild(link);
    document.title = this.environment.Settings.DisplayName;
    window.addEventListener("message", this.messageHandler, false);

    // if in app edit mode,
    // on app creation post inital values back to parent (as have now loaded)
    if (this.environment.AppMode === "edit") {
      const msg: ICommandMessage = {
        command: "SendConfig",
        data: storeGetters.getSettings(),
      };
      window.parent.postMessage(msg, this.environment.EditHostUri);
    }

    // set map attribute
    const mapScript = document.createElement("script");
    mapScript.setAttribute(
      "src",
      "https://maps.googleapis.com/maps/api/js?key=" +
        Store.state.Environment.GoogleMapsJavascriptAPIKey +
        "&libraries=places,drawing,geometry",
    );
    if (document && document.head) {
      document.head.appendChild(mapScript);
    }
  }

  private destroyed() {
    window.removeEventListener("message", this.messageHandler, false);
  }

  private get environment(): Environment {
    return storeGetters.getEnvironment();
  }

  private messageHandler(e: MessageEvent): void {
    if (
      e.origin
        .toLowerCase()
        .startsWith(this.environment.EditHostUri.toLowerCase())
    ) {
      const message = e.data as ICommandMessage;
      if (message) {
        switch (message.command) {
          case "UpdateSetting":
            const data = message.data as IUpdateSetting;
            if (data) {
              storeMutations.updateSetting(data);
            }
            break;
          case "SendConfig":
            if (e.source) {
              const msg: ICommandMessage = {
                command: "SendConfig",
                data: storeGetters.getSettings(),
              };
              (e as any).source.postMessage(msg, this.environment.EditHostUri);
            }
            break;
        }
      }
    }
  }

  private get getErrorColor(): string {
    return this.environment.Settings.ErrorColor;
  }

  @Watch("getErrorColor")
  private onErrorColorChange() {
    this.setErrorColor();
  }

  private setErrorColor() {
    // set configured error color for error-messages
    const styleElement = document.getElementById("errorColor");
    if (styleElement) {
      document.getElementsByTagName('head')[0].removeChild(styleElement);
    }
    const style = document.createElement('style');
    style.id = "errorColor";
    style.type = 'text/css';
    const errorColor = this.environment.Settings.ErrorColor;
    style.innerHTML = '.v-input__control .error--text, .v-input.error--text{color:' + errorColor + '!important;' + 'caret-color:' + errorColor + '!important;}';
    document.getElementsByTagName('head')[0].appendChild(style);
  }

  private get getInputTextColor(): string {
    return this.environment.Settings.InputTextColor;
  }

  @Watch("getInputTextColor")
  private onInputTextColorChange() {
    this.setInputTextColor();
  }

  private setInputTextColor() {
    // set configured input text color
    const inputStyleElement = document.getElementById("inputTextColor");
    if (inputStyleElement) {
      document.getElementsByTagName('head')[0].removeChild(inputStyleElement);
    }
    const style = document.createElement('style');
    style.id = "inputTextColor";
    style.type = 'text/css';
    const inputTextColor = this.getInputTextColor;
    style.innerHTML = '.v-input__control .v-input__slot .v-text-field__slot, .v-input input{color:' + inputTextColor + '!important;} .v-input__control .v-input__slot .v-select__slot .v-select__selections, .v-select__selection--comma{color:' + inputTextColor + '!important;} .v-input__control .v-input__slot .v-text-field__slot, textarea {color:' + inputTextColor + '!important;}';
    document.getElementsByTagName('head')[0].appendChild(style);
  }

  private addCookieScripts() {
      const cookieScripts  = this.environment.Settings.TemplateCookieRecord.scripts;
      cookieScripts.forEach((settings) => {
      const script = document.createElement("script");
      script.type = "text/javascript";
      script.async = false;
      script.defer = true;

      if (settings.source) {
        script.src = settings.source;
      }

      if (settings.body) {
        script.innerHTML = settings.body;
      }

      if (settings.attributes) {
        settings.attributes.forEach((att) => {
          script.setAttribute(att.Key, att.Value);
        });
      }
      document.head.appendChild(script);
    });
  }

  private get useDefaultCookieBanner(): boolean {
    return this.$store.getters['cookieModule/useDefaultCookieBanner'];
  }

  private async setCookieBanner() {
    await this.$store.dispatch('cookieModule/retrieveCookieRecord');

    if (this.useDefaultCookieBanner) {
      storeMutations.setDefaultCookieSettings(cookieService.retrieveDefaultSettings());
      this.showDefaultCookieBanner = true;
    } else {
      this.addCookieScripts();
    }
  }
}
</script>

