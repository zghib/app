<template>
  <div class="settings-roles">
    <v-header-bar :breadcrumb="breadcrumb">
      <template slot="buttons">
        <v-header-button
          icon="add"
          key="add"
          color="action"
          :label="$t('new')"
          :to="`/settings/roles/+`" />
      </template>
    </v-header-bar>
    <v-table
      :items="items"
      :columns="fields"
      primary-key-field="collection"
      link="__link__" />
  </div>
</template>

<script>
import api from "../../api";

export default {
  name: "settings-roles",
  data() {
    return {
      error: null,
      roles: []
    };
  },
  computed: {
    breadcrumb() {
      return [
        {
          name: this.$t("settings"),
          path: "/settings",
          color: "warning"
        },
        {
          name: this.$t("roles"),
          path: "/settings/roles"
        }
      ];
    },
    items() {
      return this.roles.map(role => ({
        ...role,
        __link__: `/settings/roles/${role.id}`
      }));
    },
    fields() {
      return [
        {
          field: "name",
          name: this.$t("name")
        },
        {
          field: "description",
          name: this.$t("description")
        }
      ];
    }
  },
  beforeRouteEnter(to, from, next) {
    api
      .getRoles()
      .then(res => res.data)
      .then(roles => {
        next(vm => {
          vm.$data.roles = roles;
        });
      })
      .catch(error => {
        console.error(error); // eslint-disable-line no-console
        next(vm => {
          vm.$data.error = error;
        });
      });
  }
};
</script>
