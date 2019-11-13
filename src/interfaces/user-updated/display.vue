<template>
  <div v-if="userInfo">
    <span class="label">
      <div>{{ displayValue }}</div>
    </span>
  </div>
</template>

<script>
import mixin from "@directus/extension-toolkit/mixins/interface";

export default {
  mixins: [mixin],
  computed: {
    userInfo() {
      if (!this.value) return null;

      if (typeof this.value === "object") return this.value;
      return this.$store.state.users[this.value];
    },
    displayValue() {
      return this.$helpers.micromustache.render(this.options.template, this.userInfo);
    }
  }
};
</script>

<style lang="scss" scoped>
.label {
  display: inline-block;
  height: 28px;
  div {
    margin-top: 6px;
  }
}
</style>
