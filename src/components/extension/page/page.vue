<template>
  <component :is="componentName"> <slot /> </component>
</template>

<script>
import Vue from "vue";
import loadExtension from "../../../helpers/load-extension";
import componentExists from "../../../helpers/component-exists";
import pageFallback from "./page-fallback.vue";
import pageLoading from "./page-loading.vue";

export default {
  name: "v-ext-page",
  props: {
    id: {
      type: String,
      required: true
    }
  },
  computed: {
    pages() {
      return this.$store.state.extensions.pages;
    },
    page() {
      return this.pages && this.pages[this.id];
    },
    componentName() {
      return `page-${this.id}`;
    }
  },
  watch: {
    id() {
      this.registerPage();
    }
  },
  created() {
    this.registerPage();
  },
  methods: {
    /**
     * Register the extension as component (if it hasn't been registered before yet)
     */
    registerPage() {
      // If component already exists, do nothing
      if (componentExists(this.componentName)) return;

      // If the extension isn't known by the API (e.g. it's not in the store), register it with the
      //   fallback immediately
      if (!this.page) {
        Vue.component(this.componentName, pageFallback);
        return;
      }

      const filePath = `${this.$api.url}/${this.page.path.replace(
        "meta.json",
        "page.js"
      )}`;

      Vue.component(this.componentName, () => ({
        component: loadExtension(filePath),
        error: pageFallback,
        loading: pageLoading
      }));
    }
  }
};
</script>
