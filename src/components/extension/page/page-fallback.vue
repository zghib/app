<template>
  <div />
</template>

<script>
export default {
  name: "v-ext-page-fallback",
  created() {
    this.$notify.alert(this.$t("extension_error", { ext: this.interfaceName }));
  }
};
</script>
