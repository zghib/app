<template>
  <div />
</template>

<script>
export default {
  name: "v-ext-page-fallback",
  created() {
    this.$notify({
      title: this.$t("extension_error", { ext: this.interfaceName }),
      color: "red",
      iconMain: "error"
    });
  }
};
</script>
