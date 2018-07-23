<template>
  <div class="collections">
    <v-header-bar :breadcrumb="[{
      name: $t('collections'),
      path: '/collections'
    }]" />
    <v-error
      v-if="items.length === 0"
      :title="$t('no_collections')"
      :body="$t('no_collections_body')"
      icon="error_outline" />
    <v-table
      v-else
      :items="items"
      :columns="fields"
      primary-key-field="collection"
      link="__link__"
      @select="select" />
  </div>
</template>

<script>
import VError from "../components/error.vue";

export default {
  name: "collections",
  metaInfo() {
    return {
      title: this.$t("collections")
    };
  },
  components: {
    VError
  },
  computed: {
    items() {
      const collections = this.$store.state.collections || {};

      return Object.values(collections)
        .filter(collection => collection.hidden === false)
        .filter(collection => collection.collection.startsWith("directus_") === false)
        .map(collection => ({
          ...collection,
          collection: this.$t(`collections-${collection.collection}`),
          __link__: `/collections/${collection.collection}`
        }));
    },
    fields() {
      return [
        {
          field: "collection",
          name: this.$t("collection")
        },
        {
          field: "note",
          name: this.$t("note")
        }
      ];
    }
  },
  methods: {
    select(selection) {
      this.selection = selection;
    }
  }
};
</script>

<style lang="scss" scoped>
.collections {
  padding-bottom: var(--page-padding-bottom);
}
</style>
