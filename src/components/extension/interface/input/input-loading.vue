<template>
  <v-spinner
    class="v-ext-input-loading"
    size="20"
    line-fg-color="var(--lighter-gray)"
    line-bg-color="var(--lightest-gray)"
  />
</template>

<script>
export default {
  name: "v-ext-input-loading"
};
</script>

<style lang="scss" scoped>
.v-ext-input-loading {
  width: max-content;
}
</style>
