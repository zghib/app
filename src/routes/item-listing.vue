<template>
  <div class="route-item-listing">
    <v-header-bar info-toggle>
      <v-search-filter
        v-show="selection.length === 0 && !emptyCollection"
        :filters="filters"
        :search-query="searchQuery"
        :field-names="fieldNames"
        :placeholder="resultCopy"
        @filter="updatePreferences('filters', $event)"
        @search="updatePreferences('search_query', $event)"
        @clearFilters="clearFilters" />
      <template slot="buttons">
        <v-header-button
          v-if="selection.length > 1"
          key="edit"
          icon="mode_edit"
          color="warning"
          :label="$t('batch_edit')"
          :to="`/collections/${collection}/${selection.join(',')}`" />
        <v-header-button
          v-if="selection.length"
          key="delete"
          icon="close"
          color="danger"
          :label="$t('delete')"
          @click="confirmRemove = true" />
        <v-header-button
          icon="add"
          key="add"
          color="action"
          :label="$t('new')"
          :to="`/collections/${collection}/+`" />
      </template>
    </v-header-bar>

    <v-item-listing
      v-if="preferences"
      ref="listing"
      :collection="collection"
      :filters="filters"
      :search-query="searchQuery"
      :view-query="viewQuery"
      :view-type="viewType"
      :view-options="viewOptions"
      :selection="selection"
      links
      @fetch="meta = $event"
      @options="setViewOptions"
      @select="selection = $event"
      @query="setViewQuery" />

    <v-info-sidebar v-if="preferences">
      <template slot="system">
        <label for="listing">{{ $t('view_type') }}</label>
        <v-select
          id="listing"
          :options="listingNames"
          :value="viewType"
          name="listing"
          @input="updatePreferences('view_type', $event)" />
        <v-listing-options
          :key="`${collection}-${viewType}`"
          :type="viewType"
          :collection="collection"
          :fields="$lodash.keyBy(fields, 'field')"
          :view-options="viewOptions"
          :view-query="viewQuery"
          :selection="selection"
          link="__link__"
          @query="setViewQuery"
          @options="setViewOptions" />
      </template>
    </v-info-sidebar>

    <portal to="modal" v-if="confirmRemove">
      <v-confirm
        :message="$tc('batch_delete_confirm', selection.length, { count: selection.length })"
        color="danger"
        :confirm-text="$t('delete')"
        @cancel="confirmRemove = false"
        @confirm="remove" />
    </portal>
  </div>
</template>

<script>
import formatTitle from "@directus/format-title";
import VItemListing from "../components/item-listing/item-listing.vue";
import VSearchFilter from "../components/search-filter/search-filter.vue";

import api from "../api";

export default {
  name: "route-item-listing",
  components: {
    VItemListing,
    VSearchFilter
  },
  data() {
    return {
      selection: [],
      meta: null,
      preferences: null,
      fields: [],
      confirmRemove: false
    };
  },
  computed: {
    collection() {
      return this.$route.params.collection;
    },
    emptyCollection() {
      return (this.meta && this.meta.total_count === 0) || false;
    },
    filters() {
      if (!this.preferences) return [];
      return this.preferences.filters || [];
    },
    searchQuery() {
      if (!this.preferences) return "";
      return this.preferences.search_query || "";
    },
    viewType() {
      if (!this.preferences) return "tabular";
      return this.preferences.view_type || "tabular";
    },
    viewQuery() {
      if (!this.preferences) return {};
      return (
        (this.preferences.view_query &&
          this.preferences.view_query[this.viewType]) ||
        {}
      );
    },
    viewOptions() {
      if (!this.preferences) return {};
      return (
        (this.preferences.view_options &&
          this.preferences.view_options[this.viewType]) ||
        {}
      );
    },
    resultCopy() {
      if (!this.meta || !this.preferences) return this.$t("loading");

      const isFiltering =
        !this.$lodash.isEmpty(this.preferences.filters) ||
        (!this.$lodash.isNil(this.preferences.search_query) &&
          this.preferences.search_query.length > 0);

      return isFiltering
        ? this.$tc("item_count_filter", this.meta.result_count, {
            count: this.$n(this.meta.result_count)
          })
        : this.$tc("item_count", this.meta.total_count, {
            count: this.$n(this.meta.total_count)
          });
    },
    fieldNames() {
      return this.fields.map(field => field.field);
    },
    listingNames() {
      if (!this.$store.state.extensions.listings) return {};
      const translatedNames = {};
      Object.keys(this.$store.state.extensions.listings).forEach(id => {
        translatedNames[id] = this.$store.state.extensions.listings[id].name;
      });
      return translatedNames;
    }
  },
  methods: {
    setViewQuery(query) {
      const newViewQuery = {
        ...this.preferences.view_query,
        [this.viewType]: {
          ...this.viewQuery,
          ...query
        }
      };
      this.updatePreferences("view_query", newViewQuery);
    },
    setViewOptions(options) {
      const newViewOptions = {
        ...this.preferences.view_options,
        [this.viewType]: {
          ...this.viewOptions,
          ...options
        }
      };
      this.updatePreferences("view_options", newViewOptions);
    },
    updatePreferences(key, value, combine = false) {
      if (combine) {
        value = {
          ...this.preferences[key],
          ...value
        };
      }
      this.$set(this.preferences, key, value);

      // user vs group vs collection level preferences, == checks both null and undefined
      const isPreferenceFallback = this.preferences.user == null;
      if (isPreferenceFallback) {
        return this.createCollectionPreset();
      }
      return this.$api
        .updateCollectionPreset(this.preferences.id, {
          [key]: value
        })
        .catch(console.error); // eslint-disable-line no-console
    },
    createCollectionPreset() {
      return this.$api
        .createCollectionPreset({
          ...this.preferences,
          collection: this.collection,
          user: this.$store.state.currentUser.id
        })
        .then(({ data }) => {
          this.$set(this.preferences, "id", data.id);
        })
        .catch(console.error); // eslint-disable-line no-console
    },
    clearFilters() {
      this.updatePreferences("filters", null);
      this.updatePreferences("search_query", null);
    },
    remove() {
      this.$api
        .deleteItems(this.collection, this.selection)
        .then(() => {
          this.$refs.listing.getItems();
        })
        .catch(console.error); // eslint-disable-line no-console
      this.confirmRemove = false;
    }
  },
  beforeRouteEnter(to, from, next) {
    const { collection } = to.params;

    return Promise.all([
      api.getMyListingPreferences(collection),
      api.getFields(collection)
    ])
      .then(([preferences, fieldsRes]) => ({
        preferences,
        fields: fieldsRes.data.map(field => ({
          ...field,
          name: formatTitle(field.field)
        }))
      }))
      .then(({ preferences, fields }) => {
        next(vm => {
          vm.$data.preferences = preferences;
          vm.$data.fields = fields;
        });
      })
      .catch(console.error); // eslint-disable-line no-console
  },
  beforeRouteUpdate(to, from, next) {
    const { collection } = to.params;

    this.preferences = null;
    this.fields = [];
    this.selection = [];
    this.meta = {};

    return Promise.all([
      api.getMyListingPreferences(collection),
      api.getFields(collection)
    ])
      .then(([preferences, fieldsRes]) => ({
        preferences,
        fields: fieldsRes.data.map(field => ({
          ...field,
          name: formatTitle(field.field)
        }))
      }))
      .then(({ preferences, fields }) => {
        this.preferences = preferences;
        this.fields = fields;
        next();
      })
      .catch(console.error); // eslint-disable-line no-console
  }
};
</script>
