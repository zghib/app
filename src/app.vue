<template>
  <router-view
    v-if="publicRoute"
    class="directus" />

  <div v-else-if="hydratingError">
    <v-error
      icon="warning"
      :title="$t('server_error')"
      :body="$t('server_error_copy')"
      color="danger" />
  </div>

  <div
    v-else
    class="directus">

    <loader
      v-if="!hydrated"
      area="full-page" />

    <div v-else>
      <v-nav-sidebar />
      <router-view class="page-root" />
    </div>

    <portal-target name="modal" />
  </div>
</template>

<script>
import VBlocker from "./components/blocker.vue";
import VError from "./components/error.vue";
import { TOGGLE_NAV } from "./store/mutation-types";
import VNavSidebar from "./components/sidebars/nav-sidebar/nav-sidebar.vue";

export default {
  name: "directus",
  components: {
    VBlocker,
    VError,
    VNavSidebar
  },
  computed: {
    publicRoute() {
      return this.$route.meta.publicRoute || false;
    },
    hydrated() {
      return this.$store.state.hydrated;
    },
    hydratingError() {
      return this.$store.state.hydratingError;
    }
  },
  watch: {
    $route() {
      this.bodyClass();
      this.$store.commit(TOGGLE_NAV, false);
      this.infoActive = false;
    },
    infoActive(visible) {
      const className =
        this.$route.meta && this.$route.meta.infoSidebarWidth === "wide"
          ? "info-wide-active"
          : "info-active";

      if (visible) {
        document.body.classList.add(className);
      } else {
        document.body.classList.remove("info-wide-active");
        document.body.classList.remove("info-active");
      }
    },
    hydratingError(newVal) {
      if (newVal) {
        document.body.classList.add("no-padding");
      }
    }
  },
  created() {
    this.bodyClass();
  },
  methods: {
    bodyClass() {
      if (this.publicRoute) {
        document.body.classList.add("no-padding");
      } else {
        document.body.classList.remove("no-padding");
      }
    },
    keepEditing() {
      this.$router.push(
        `/collections/${this.$store.state.edits.collection}/${
          this.$store.state.edits.primaryKey
        }`
      );
    },
    discardChanges() {
      this.$store.dispatch("discardChanges");
    }
  }
};
</script>

<style>
body.no-padding {
  padding: 0 !important;
}
</style>
