<template>
  <v-input
    :value="value"
    class="v-ext-input-fallback"
    @input="$emit('input', $event)" />
</template>

<script>
export default {
  name: "v-ext-input-fallback",
  props: {
    value: {
      type: null,
      default: ""
    },
    interfaceName: {
      type: String,
      default: ""
    }
  },
  created() {
    this.$notify.alert(this.$t("extension_error", { ext: this.inputName }));
  }
};
</script>

<style lang="scss" scoped>
.v-ext-input-fallback {
  max-width: var(--width-normal);
}
</style>
