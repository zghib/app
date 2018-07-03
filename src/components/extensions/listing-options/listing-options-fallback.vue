<template>
  <div class="options-fallback" />
</template>

<script>
export default {
  name: "options-fallback",
  props: {
    listingName: {
      type: String,
      default: ""
    }
  },
  created() {
    this.$notify.alert(this.$t("extension_error", { ext: this.listingName }));
  }
};
</script>
