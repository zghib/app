<template>
  <div class="interfaces">
    <v-header :breadcrumb="links" />
    <v-table
      :columns="columns"
      :items="items"
      link="__link"
      primary-key-field="id"
    />
  </div>
</template>

<script>
export default {
  metaInfo() {
    return {
      title: "Interfaces"
    };
  },
  computed: {
    links() {
      return [
        {
          name: this.$t("settings"),
          path: "/settings",
          color: "warning"
        },
        {
          name: this.$t("interfaces"),
          path: "/settings/interfaces"
        }
      ];
    },
    items() {
      return Object.keys(this.$store.state.extensions.interfaces).map(id => ({
        ...this.$store.state.extensions.interfaces[id],
        __link: `/settings/interfaces/${id}`
      }));
    },
    columns() {
      return [
        {
          field: "name",
          name: "Name"
        },
        {
          field: "id",
          name: "id"
        },
        {
          field: "version",
          name: "Version"
        }
      ];
    }
  }
};
</script>
