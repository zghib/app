<template>
  <div class="v-ext-display-fallback">{{ value }}</div>
</template>

<script>
export default {
  name: "v-ext-display-fallback",
  props: {
    value: {
      type: null,
      default: ""
    }
  }
};
</script>
