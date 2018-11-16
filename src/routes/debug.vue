<template>
  <div class="debug">
    <v-header title="Upload Component" />
    <div class="wrapper"><v-upload /></div>
  </div>
</template>

<script>
export default {
  metaInfo() {
    return {
      title: "Debugger"
    };
  }
};
</script>

<style lang="scss" scoped>
.debug {
  padding: var(--page-padding);
}

.wrapper {
  width: var(--width-x-large);
  height: var(--width-large);
}
</style>
