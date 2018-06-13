<template>
  <not-found v-if="notFound" />

  <div v-else-if="error">
    <v-header-bar />
    <v-error
      v-if="error"
      icon="error_outline"
      color="warning"
      :title="$t('server_trouble')"
      :body="$t('server_trouble_copy')" />
  </div>

  <div v-else-if="fields === null || preferences === null">
    <v-header-bar />
    <v-loader area="content" />
  </div>

  <div v-else class="item-listing">
    <v-header-bar info-toggle>
      <template slot="title">
        <button
          :class="currentBookmark ? 'active' : null"
          :disabled="currentBookmark"
          class="bookmark"
          @click="bookmarkModal = true">
          <i class="material-icons">
            {{ currentBookmark ? 'bookmark' : 'bookmark_border' }}
          </i>
        </button>
        <div
          v-if="currentBookmark"
          class="bookmark-name no-wrap">({{ currentBookmark.title }})</div>
      </template>
      <v-search-filter
        v-if="selection.length === 0"
        v-show="!emptyCollection"
        :filters="preferences.filters || []"
        :search-query="preferences.search_query || ''"
        :fields="fieldNames"
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

    <v-info-sidebar>
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
          :primary-key-field="primaryKeyField"
          :fields="fields"
          :items="items"
          :view-options="viewOptions"
          :view-query="viewQuery"
          :selection="selection"
          link="__link__"
          @query="setViewQuery"
          @options="setViewOptions" />
      </template>
    </v-info-sidebar>

    <v-item-listing
      :collection="collection"
      :filters="preferences.filters || []"
      :search-query="preferences.search_query || ''"
      :view-query="viewQuery"
      :view-type="viewType"
      :view-options="viewOptions"
      :selection="selection"
      links
      @fetch="meta = $event"
      @options="setViewOptions"
      @select="selection = $event"
      @query="setViewQuery" />

    <portal to="modal" v-if="confirmRemove">
      <v-confirm
        :message="$tc('batch_delete_confirm', selection.length, { count: selection.length })"
        @cancel="confirmRemove = false"
        @confirm="remove" />
    </portal>

    <portal to="modal" v-if="bookmarkModal">
      <v-prompt
        :message="$t('name_bookmark')"
        v-model="bookmarkTitle"
        @cancel="bookmarkModal = false"
        @confirm="saveBookmark" />
    </portal>
  </div>
</template>

<script>
import { keyBy, mapValues, find, isEqual } from "lodash";
import NProgress from "nprogress";
import formatTitle from "@directus/format-title";
import NotFound from "./not-found.vue";
import formatFilters from "../helpers/format-filters";
import VError from "../components/error.vue";
import VLoader from "../components/loader.vue";
import VSearchFilter from "../components/search-filter/search-filter.vue";
import store from "../store";
import api from "../api";

/**
 * NOTE: Unfortunately, the API for beforeRouteUpdate and beforeRouteEnteris slightly different
 * The functions used are the exact same, but beforeRouteUpdate doesn't support a callback function yet
 *
 * This needs to be optimized in the future, as soon as vue-router is updated to support this.
 *
 * Keep an eye on https://github.com/vuejs/vue-router/pull/2054
 */

function getCollectionInfo(collection) {
  if (
    collection === "directus_files" ||
    collection === "directus_users" ||
    collection === "directus_activity"
  ) {
    return true;
  }

  const { collections } = store.state;
  const collectionNames = Object.keys(collections);

  return collectionNames.includes(collection) ? collections[collection] : null;
}

function hydrate(collection) {
  return new Promise((resolve, reject) => {
    let fields, preferences;

    NProgress.inc();

    Promise.all([
      api.getFields(collection),
      api.getMyListingPreferences(collection)
    ])
      .then(([fieldsRes, preferencesRes]) => {
        NProgress.inc();

        fields = mapValues(keyBy(fieldsRes.data, "field"), info => ({
          ...info,
          name: formatTitle(info.field) // TODO: Map translation key to name field to support translatable field names #421 & #422
        }));

        preferences = preferencesRes;

        return getItems(collection, preferences, fields);
      })
      .then(({ meta, items }) => {
        NProgress.inc();

        resolve({
          fields,
          preferences,
          items,
          meta
        });
      })
      .catch(reject);
  });
}

function getLink(collection, primaryKey) {
  if (collection.startsWith("directus")) {
    return `/${collection.substring(9, collection.length)}/${primaryKey}`;
  }

  return `/collections/${collection}/${primaryKey}`;
}

function getItems(collection, preferences, fields) {
  const primaryKeyField = find(fields, {
    interface: "primary-key"
  }).field;

  const params = getParams(preferences, primaryKeyField);

  return api
    .getItems(collection, params)
    .then(({ data, meta }) => ({
      items: data.map(item => ({
        ...item,
        __link__: getLink(collection, item[primaryKeyField])
      })),
      meta
    }));
}

function getParams(preferences, primaryKeyField) {
  let params = {
    fields: "*.*",
    meta: "total_count",
    limit: 50
  };

  Object.assign(
    params,
    (preferences.view_query && preferences.view_query[preferences.view_type]) ||
      {}
  );

  if (preferences.search_query) {
    params.q = preferences.search_query;
  }

  if (preferences.filters && preferences.filters.length > 0) {
    params = {
      ...params,
      ...formatFilters(preferences.filters)
    };
  }

  if (params.fields) {
    const fields = params.fields
      .split(",")
      .map(field => (field.endsWith(".*") ? field : `${field}.*`))
      .filter(field => field.length !== 0)

    fields.push(primaryKeyField);

    params.fields = fields.join(",");
  }

  return params;
}

export default {
  name: "item-listing",
  components: {
    NotFound,
    VError,
    VLoader,
    VSearchFilter
  },
  props: {
    collection: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      notFound: false,
      error: false,

      fields: null,
      preferences: null,

      items: [],
      meta: {},
      loading: false,

      currentPage: 1,
      lazyLoading: false,

      selection: [],
      confirmRemove: false,

      bookmarkModal: false,
      bookmarkTitle: ""
    };
  },
  computed: {
    resultCopy() {
      if (this.loading) return this.$t("loading");
      if (!this.meta) return "";

      const count = this.items && this.items.length;

      const isFiltering =
        !this.$lodash.isEmpty(this.preferences.filters) ||
        (!this.$lodash.isNil(this.preferences.search_query) &&
          this.preferences.search_query.length > 0);

      return isFiltering
        ? this.$tc("item_count_filter", count, { count })
        : this.$tc("item_count", count, { count });
    },
    fieldNames() {
      if (!this.fields) return {};
      const translatedNames = {};
      Object.keys(this.fields).forEach(name => {
        // translatedNames[name] = this.$t(`fields-${this.collection}-${name}`);
        translatedNames[name] = this.$helpers.formatTitle(name); // #422
      });
      return translatedNames;
    },
    currentBookmark() {
      const bookmarks = this.$store.state.bookmarks;

      const preferences = {
        collection: this.preferences.collection,
        search_query: this.preferences.search_query,
        filters: this.preferences.filters,
        view_options: this.preferences.view_options,
        view_type: this.preferences.view_type,
        view_query: this.preferences.view_query
      };

      const currentBookmark = bookmarks.filter(bookmark => {
        const bookmarkPreferences = {
          collection: bookmark.collection,
          search_query: bookmark.search_query,
          filters: bookmark.filters,
          view_options: bookmark.view_options,
          view_type: bookmark.view_type,
          view_query: bookmark.view_query
        };
        return this.$lodash.isEqual(bookmarkPreferences, preferences);
      })[0];

      return currentBookmark || null;
    },
    noResults() {
      if (this.hydrating || this.loading) return false;

      // Don't show no-results if there aren't any items in the db to begin with
      if (this.emptyCollection) return false;

      return (this.items && this.items.length === 0) || false;
    },
    emptyCollection() {
      if (this.hydrating || this.loading) return false;

      return (this.meta && this.meta.total_count === 0) || false;
    },
    viewType() {
      return (this.preferences && this.preferences.view_type) || "tabular";
    },
    viewOptions() {
      return (
        (this.preferences &&
          this.preferences.view_options &&
          this.preferences.view_options[this.viewType]) ||
        {}
      );
    },
    viewQuery() {
      return (
        (this.preferences &&
          this.preferences.view_query &&
          this.preferences.view_query[this.viewType]) ||
        {}
      );
    },
    primaryKeyField() {
      if (!this.fields) return null;
      return this.$lodash.find(this.fields, { interface: "primary-key" }).field;
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
  watch: {
    $route() {
      if (this.$route.query.b) {
        this.$router.replace({
          path: this.$route.path
        });
      }
    }
  },
  beforeRouteEnter(to, from, next) {
    const collection = to.params.collection;

    const collectionInfo = getCollectionInfo(collection);

    if (collectionInfo === null) {
      return next(vm => (vm.$data.notFound = true));
    }

    if (collectionInfo.single === true) {
      return next(`/collections/${collection}/1`);
    }

    return hydrate(collection)
      .then(({ fields, preferences, items, meta }) => {
        return next(vm => {
          Object.assign(vm.$data, {
            fields,
            preferences,
            items,
            meta,
            notFound: false,
            error: null
          });
        });
      })
      .catch(error => {
        console.error(error); // eslint-disable-line no-console
        return next(vm => (vm.$data.error = true));
      });
  },
  beforeRouteUpdate(to, from, next) {
    const collection = to.params.collection;

    const collectionInfo = getCollectionInfo(collection);

    if (collectionInfo === null) {
      this.notFound = true;
      return next();
    } else {
      this.notFound = false;
    }

    if (collectionInfo.single === true) {
      next(`/collections/${collection}/1`);
    }

    return hydrate(collection)
      .then(({ fields, preferences, items, meta }) => {
        this.fields = fields;
        this.preferences = preferences;
        this.items = items;
        this.meta = meta;
        this.error = null;

        return next();
      })
      .catch(error => {
        console.error(error); // eslint-disable-line no-console
        this.error = true;
        return next();
      });
  },
  methods: {
    fetchNextPage() {
      if (this.lazyLoading) return;

      this.lazyLoading = true;
      const params = getParams(this.preferences, this.primaryKeyField);

      params.offset = params.limit * this.currentPage;

      this.$api
        .getItems(this.collection, params)
        .then(res => res.data)
        .then(items =>
          items.map(item => ({
            ...item,
            __link__: getLink(this.collection, item[this.primaryKeyField])
          }))
        )
        .then(newItems => {
          this.lazyLoading = false;
          this.currentPage = this.currentPage + 1;
          this.items = [...this.items, ...newItems];
        })
        .catch(console.error); // eslint-disable-line no-console
    },
    remove() {
      this.items = this.items.filter(
        item => !this.selection.includes(item[this.primaryKeyField])
      );

      this.$api
        .deleteItems(this.collection, this.selection)
        .catch(console.error); // eslint-disable-line no-console

      this.confirmRemove = false;
    },
    clearFilters() {
      this.updatePreferences("filters", null);
      this.updatePreferences("search_query", null);
    },
    getItems() {
      this.loading = true;

      getItems(this.collection, this.preferences, this.fields)
        .then(({ items, meta }) => {
          this.items = items;
          this.meta = meta;
          this.loading = false;
        })
        .catch(error => {
          this.error = true;
          this.loading = false;
          console.error(error); // eslint-disable-line no-console
        });
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

      this.getItems();

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
    saveBookmark() {
      const preferences = { ...this.preferences };

      preferences.user = this.$store.state.currentUser.id;
      preferences.title = this.bookmarkTitle;

      delete preferences.id;
      delete preferences.group;

      if (!preferences.collection) {
        preferences.collection = this.collection;
      }

      this.$store
        .dispatch("saveBookmark", preferences)
        .then(() => {
          this.bookmarkModal = false;
        })
        .catch(console.error); // eslint-disable-line no-console
    }
  }
};
</script>

<style lang="scss" scoped>
.bookmark {
  margin-left: 10px;
  opacity: 0.4;
  transition: opacity var(--fast) var(--transition);
  position: relative;

  &:hover {
    opacity: 1;
  }

  i {
    font-size: 24px;
    height: 20px;
    transform: translateY(-3px); // Vertical alignment of icon
  }
}

.bookmark.active {
  opacity: 1;

  i {
    color: var(--accent);
  }
}

.bookmark-name {
  color: var(--accent);
  margin-left: 5px;
  margin-top: 3px;
  font-size: 0.77em;
  line-height: 1.1;
  font-weight: 700;
  text-transform: uppercase;
}
</style>
