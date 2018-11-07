<template>
  <div class="v-ext-layout-options-fallback" />
</template>

<script>
export default {
  name: "v-ext-layout-options-fallback",
  props: {
    layoutName: {
      type: String,
      default: ""
    }
  },
  created() {
    this.$notify({
      title: this.$t("extension_error", { ext: this.layoutName }),
      color: "red",
      iconMain: "error"
    });
  }
};
</script>
