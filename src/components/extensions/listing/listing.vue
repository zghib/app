<template>
  <component
    :is="componentName"
    :primary-key-field="primaryKeyField"
    :fields="fields"
    :items="items"
    :options="options"
    :loading="loading"
    :lazy-loading="lazyLoading"
    :query="query"
    :selection="selection"
    :link="link"
    class="v-listing"
    @query="$emit('query', $event)"
    @select="$emit('select', $event)"
    @options="$emit('options', $event)"
    @next-page="$emit('next-page', $event)" />
</template>

<script>
import Vue from "vue";
import loadExtension from "../../../helpers/load-extension";
import componentExists from "../../../helpers/component-exists";
import VListingFallback from "./listing-fallback.vue";
import VListingLoading from "./listing-loading.vue";

export default {
  name: "v-listing",
  props: {
    type: {
      type: String,
      required: true
    },
    fields: {
      type: Object,
      required: true
    },
    items: {
      type: Array,
      required: true
    },
    options: {
      type: Object,
      default: () => ({})
    },
    loading: {
      type: Boolean,
      default: false
    },
    lazyLoading: {
      type: Boolean,
      default: false
    },
    query: {
      type: Object,
      default: () => ({})
    },
    selection: {
      type: Array,
      default: () => []
    },
    link: {
      type: String,
      default: null
    }
  },
  computed: {
    listings() {
      return this.$store.state.extensions.listings;
    },
    listing() {
      return this.listings && this.listings[this.type];
    },
    componentName() {
      return `listing-${this.type}`;
    },
    primaryKeyField() {
      const fieldInfo = this.$lodash.filter(
        this.fields,
        info => info.interface === "primary-key"
      )[0];

      return fieldInfo && fieldInfo.field;
    }
  },
  watch: {
    type() {
      this.registerListing();
    }
  },
  created() {
    this.registerListing();
  },
  methods: {
    /**
     * Register the extension as component (if it hasn't been registered before yet)
     */
    registerListing() {
      // If component already exists, do nothing
      if (componentExists(this.componentName)) return;

      // If the extension isn't known by the API (e.g. it's not in the store), register it with the
      //   fallback immediately
      if (!this.listing) {
        Vue.component(this.componentName, VListingFallback);
        return;
      }

      const filePath = `${this.$api.url}/${this.listing.path.replace(
        "meta.json",
        "Listing.js"
      )}`;

      Vue.component(this.componentName, () => ({
        component: loadExtension(filePath),
        error: VListingFallback,
        loading: VListingLoading
      }));
    }
  }
};
</script>
