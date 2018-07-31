<template>
  <v-ext-display-fallback
    v-if="interfaceType === null"
    :name="name"
    :value="value"
    :type="type"
    :length="length"
    :readonly="readonly"
    :required="required"
    :loading="loading"
    :options="optionsWithDefaults"
    class="v-ext-display" />
  <component
    v-else
    :is="componentName"
    :name="name"
    :value="value"
    :type="type"
    :length="length"
    :readonly="readonly"
    :required="required"
    :loading="loading"
    :options="optionsWithDefaults"
    class="v-ext-display" />
</template>

<script>
import Vue from "vue";
import loadExtension from "../../../../helpers/load-extension";
import componentExists from "../../../../helpers/component-exists";
import VExtDisplayFallback from "./display-fallback.vue";
import VExtDisplayLoading from "./display-loading.vue";

export default {
  name: "v-ext-display",
  props: {
    interfaceType: {
      type: String,
      default: null
    },
    name: {
      type: String,
      required: true
    },
    value: {
      type: null,
      default: null
    },
    type: {
      type: String,
      required: true
    },
    length: {
      type: [String, Number],
      default: null
    },
    readonly: {
      type: Boolean,
      default: false
    },
    required: {
      type: Boolean,
      default: false
    },
    loading: {
      type: Boolean,
      default: false
    },
    options: {
      type: Object,
      default: () => ({})
    }
  },
  components: {
    VExtDisplayFallback
  },
  computed: {
    interfaces() {
      return this.$store.state.extensions.interfaces;
    },
    interfaceInfo() {
      return this.interfaces && this.interfaces[this.interfaceType];
    },
    componentName() {
      return `display-${this.interfaceType}`;
    },
    optionsWithDefaults() {
      if (!this.interfaceInfo) return {};

      const defaults = this.$lodash.mapValues(
        this.interfaceInfo.options,
        settings => settings.default || null
      );

      return {
        ...defaults,
        ...this.options
      };
    }
  },
  watch: {
    id() {
      this.registerDisplay();
    }
  },
  created() {
    this.registerDisplay();
  },
  methods: {
    /**
     * Register the extension as component (if it hasn't been registered before yet)
     */
    registerDisplay() {
      // If component already exists, do nothing
      if (componentExists(this.componentName)) return;

      // If the extension isn't known by the API (e.g. it's not in the store), register it with the
      //   fallback immediately
      if (!this.interfaceInfo) {
        Vue.component(this.componentName, VExtDisplayFallback);
        return;
      }

      const filePath = `${this.$api.url}/${this.interfaceInfo.path.replace(
        "meta.json",
        "display.js"
      )}`;

      Vue.component(this.componentName, () => ({
        component: loadExtension(filePath),
        error: VExtDisplayFallback,
        loading: VExtDisplayLoading
      }));
    }
  }
};
</script>
