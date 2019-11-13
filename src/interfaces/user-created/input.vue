<template>
  <div v-if="userInfo" class="user-created" :class="{ 'icon-right': iconRight }">
    <v-avatar
      v-if="options.display !== 'name'"
      v-tooltip="options.display === 'avatar' ? displayValue : null"
      class="display-user"
      :size="32"
      :src="src"
      :alt="displayValue"
    ></v-avatar>
    <span v-if="options.display !== 'avatar'" class="label">
      {{ displayValue }}
    </span>
    <v-icon v-if="iconRight" :name="iconRight" />
  </div>
  <div v-else-if="newItem" class="user-created placeholder" :class="{ 'icon-right': iconRight }">
    {{ $t("interfaces-user-created-you") }}
    <v-icon v-if="iconRight" :name="iconRight" />
  </div>
  <div v-else class="user-created placeholder" :class="{ 'icon-right': iconRight }">
    {{ $t("interfaces-user-created-unknown") }}
    <v-icon v-if="iconRight" :name="iconRight" />
  </div>
</template>

<script>
import mixin from "@directus/extension-toolkit/mixins/interface";

export default {
  mixins: [mixin],
  props: {
    iconRight: {
      type: String,
      default: "account_box"
    }
  },
  computed: {
    userInfo() {
      if (!this.value) return null;
      if (typeof this.value === "object") {
        if (this.value.first_name) {
          return this.value;
        } else {
          return this.$store.state.users[this.value.id];
        }
      }
      return this.$store.state.users[this.value];
    },
    displayValue() {
      return this.$helpers.micromustache.render(this.options.template, this.userInfo);
    },
    src() {
      if (!this.userInfo.avatar) return null;
      return this.userInfo.avatar.data.thumbnails[0].url;
    }
  }
};
</script>

<style lang="scss" scoped>
.user-created {
  position: relative;
  border: var(--input-border-width) solid var(--input-border-color);
  border-radius: var(--border-radius);
  height: 44px;
  padding: 4px 10px;
  display: flex;
  align-items: center;
  background-color: var(--input-background-color-disabled);
}
.display-user {
  width: max-content;
  display: inline-block;
}
.label {
  display: inline-block;
  margin-left: 12px;
}
.placeholder {
  color: var(--input-placeholder-color);
}
.icon-right i {
  position: absolute;
  top: 50%;
  color: var(--input-icon-color);
  transform: translateY(-50%);
  font-size: 24px;
  right: 10px;
}
</style>
