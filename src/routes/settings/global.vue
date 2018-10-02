<template>
  <div class="settings-global">
    <v-header :breadcrumb="links">
      <template slot="buttons">
        <v-header-button
          :disabled="!editing"
          :loading="saving"
          :label="$t('save')"
          icon="check"
          color="action"
          @click="save('leave')" />
      </template>
    </v-header>

    <v-form
      :fields="fields"
      :values="settings"
      @stage-value="stageValue" />
  </div>
</template>

<script>
import shortid from "shortid";
import { keyBy, mapValues } from "lodash";
import formatTitle from "@directus/format-title";
import store from "../../store/";
import EventBus from "../../events/";
import { i18n } from "../../lang/";
import api from "../../api";

export default {
  name: "settings-global",
  metaInfo() {
    return {
      title: `${this.$t("settings")} | ${this.$t("settings_global")}`
    };
  },
  data() {
    return {
      saving: false,
      rawSettings: {},
      edits: {},
      fields: {}
    };
  },
  computed: {
    settings() {
      return this.$store.state.settings;
    },
    links() {
      return [
        {
          name: this.$t("settings"),
          path: "/settings",
          color: "warning"
        },
        {
          name: this.$t("settings_global"),
          path: "/settings/global"
        }
      ];
    },
    editing() {
      return Object.keys(this.edits).length > 0;
    }
  },
  methods: {
    stageValue({ field, value }) {
      if (this.$store.state.settings[field] == value) {
        return this.$delete(this.edits, field);
      }

      return this.$set(this.edits, field, value);
    },
    save() {
      const id = shortid.generate();
      store.dispatch("loadingStart", { id });

      this.saving = true;

      const updates = [];

      this.$lodash.forEach(this.edits, (value, key) => {
        updates.push({
          id: this.rawSettings[key].id,
          value
        });
      });

      this.$api
        .updateItems("directus_settings", updates)
        .then(() => {
          this.saving = false;
          this.$store.dispatch("loadingFinished", id);
          this.$router.push("/settings");
        })
        .catch(error => {
          this.saving = false;
          this.$store.dispatch("loadingFinished", id);
          this.$events.emit("error", {
            notify: this.$t("something_went_wrong_body"),
            error
          });
        });
    }
  },
  beforeRouteEnter(to, from, next) {
    const id = shortid.generate();
    store.dispatch("loadingStart", { id });

    Promise.all([
      store.dispatch("getSettings"), // update the store key:val
      api.getItems("directus_settings"), // get the raw rows (with IDs)
      api.getFields("directus_settings")
    ])
      .then(([, rawSettings, fields]) => {
        return {
          fields: fields.data,
          rawSettings: rawSettings.data
        };
      })
      .then(({ rawSettings, fields }) => {
        return {
          rawSettings,
          fields: keyBy(fields, "field")
        };
      })
      .then(({ rawSettings, fields }) => {
        return {
          rawSettings,
          fields: mapValues(fields, field => ({
            ...field,
            name: formatTitle(field.field)
          }))
        };
      })
      .then(({ rawSettings, fields }) => {
        const settings = store.state.settings;
        return {
          rawSettings: keyBy(rawSettings, "key"),
          fields: mapValues(
            settings,
            (value, key) =>
              fields[key] || {
                collection: "directus_settings",
                field: key,
                group: null,
                hidden_detail: false,
                hidden_browse: false,
                id: null,
                interface: "text-input",
                locked: true,
                name: formatTitle(key),
                note: null,
                options: null,
                readonly: false,
                required: false,
                sort: null,
                translation: null,
                type: "VARCHAR",
                validation: null,
                width: 4
              }
          )
        };
      })
      .then(({ rawSettings, fields }) => {
        store.dispatch("loadingFinished", id);
        next(vm => {
          vm.$data.fields = fields;
          vm.$data.rawSettings = rawSettings;
        });
      })
      .catch(error => {
        store.dispatch("loadingFinished", id);
        EventBus.emit("error", {
          notify: i18n.t("something_went_wrong_body"),
          error
        });
      });
  },
  beforeRouteLeave(to, from, next) {
    if (this.editing) {
      this.confirmNavigation = true;
      this.toPath = to.fullPath;
      return next(false);
    }
    return next();
  }
};
</script>

<style lang="scss" scoped>
.settings-global {
  padding: 20px;
}
</style>
