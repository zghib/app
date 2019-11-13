<template>
  <div v-if="value" class="gray type-label">
    <v-timeago
      v-if="options.showRelative"
      v-tooltip="displayValue"
      :datetime="date"
      :auto-update="60"
      :locale="$i18n.locale"
      class="no-wrap"
    ></v-timeago>
    <div v-else>{{ displayValue }}</div>
  </div>
  <div v-else-if="newItem" class="gray type-label">
    {{ $t("interfaces-datetime-updated-now") }}
  </div>
  <div v-else class="gray type-label">
    {{ $t("interfaces-datetime-updated-unknown") }}
  </div>
</template>

<script>
import mixin from "@directus/extension-toolkit/mixins/interface";

export default {
  mixins: [mixin],
  computed: {
    date() {
      if (!this.value) return null;
      return new Date(this.value.replace(" ", "T") + "Z");
    },
    displayValue() {
      if (!this.date) return;
      return this.$d(this.date, "long") + " GMT";
    }
  }
};
</script>

<style lang="scss" scoped>
.gray {
  color: var(--blue-grey-300);
  text-transform: capitalize;
}
</style>
