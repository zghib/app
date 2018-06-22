<template>
  <component
    :is="componentName"
    :primary-key-field="primaryKeyField"
    :fields="fields"
    :view-options="viewOptions"
    :loading="loading"
    :view-query="viewQuery"
    :selection="selection"
    class="listing-options-extension"
    @query="$emit('query', $event)"
    @select="$emit('select', $event)"
    @options="$emit('options', $event)" />
</template>

<script>
import Vue from "vue";
import loadExtension from "../../../helpers/load-extension";
import componentExists from "../../../helpers/component-exists";
import ListingOptionsFallback from "./listing-options-fallback.vue";
import ListingOptionsLoading from "./listing-options-loading.vue";

export default {
  name: "listing-options-extension",
  props: {
    type: {
      type: String,
      required: true
    },
    fields: {
      type: Object,
      required: true
    },
    viewOptions: {
      type: Object,
      default: () => ({})
    },
    loading: {
      type: Boolean,
      default: false
    },
    viewQuery: {
      type: Object,
      default: () => ({})
    },
    selection: {
      type: Array,
      default: () => []
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
      return `listing-options-${this.type}`;
    },
    primaryKeyField() {
      if (!this.fields) return null;

      const primaryKeyArray = Object.values(this.fields).filter(
        field => field.primary_key === true
      );

      return (
        primaryKeyArray.length > 0 &&
        primaryKeyArray[0] &&
        primaryKeyArray[0].field
      );
    }
  },
  watch: {
    type() {
      this.registerListingOptions();
    }
  },
  created() {
    this.registerListingOptions();
  },
  methods: {
    /**
     * Register the extension as component (if it hasn't been registered before yet)
     */
    registerListingOptions() {
      // If component already exists, do nothing
      if (componentExists(this.componentName)) return;

      // If the extension isn't known by the API (e.g. it's not in the store), register it with the
      //   fallback immediately
      if (!this.listing) {
        Vue.component(this.componentName, ListingOptionsFallback);
        return;
      }

      const filePath = `${this.$api.url}/${this.listing.path.replace(
        "meta.json",
        "options.js"
      )}`;

      Vue.component(this.componentName, () => ({
        component: loadExtension(filePath),
        error: ListingOptionsFallback,
        loading: ListingOptionsLoading
      }));
    }
  }
};
</script>
