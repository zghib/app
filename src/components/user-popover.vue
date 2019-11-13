<template>
  <v-popover
    class="user-popover"
    trigger="hover"
    :delay="{ show: 300, hide: 0 }"
    :placement="placement"
    :boundaries-element="boundariesElement"
    @show="fetchUser"
  >
    <slot />

    <div slot="popover">
      <v-spinner v-if="loading" />
      <template v-else>
        <v-avatar
          v-if="data.avatar"
          :src="data.avatar"
          :alt="`${data.first_name} ${data.last_name}`"
        />
        <div v-else class="avatar-fallback">
          <v-icon name="person" />
        </div>

        <p class="name">{{ data.first_name }} {{ data.last_name }} ({{ data.role }})</p>
      </template>
    </div>
  </v-popover>
</template>

<script>
export default {
  name: "UserPopover",
  props: {
    id: {
      type: Number,
      required: true
    },
    placement: {
      type: String,
      validator(value) {
        return [
          "auto",
          "auto-start",
          "auto-end",
          "top",
          "top-start",
          "top-end",
          "right",
          "right-start",
          "right-end",
          "bottom",
          "bottom-start",
          "bottom-end",
          "left",
          "left-start",
          "left-end"
        ].includes(value);
      },
      default: "auto"
    }
  },
  data() {
    return {
      loading: true,
      error: null,
      data: null
    };
  },
  computed: {
    boundariesElement() {
      return document.body;
    }
  },
  methods: {
    async fetchUser() {
      // Only fetch once
      if (this.data !== null) return;

      try {
        let { data } = await this.$api.getUser(this.id, {
          fields: ["avatar.data.thumbnails", "first_name", "last_name", "roles.role.name"]
        });
        data.role = data.roles[0]?.role?.name;
        data.avatar = data.avatar.data.thumbnails[0].url;
        delete data.roles;
        this.data = data;
      } catch (error) {
        this.error = error;
      } finally {
        this.loading = false;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.user-popover {
  width: max-content;
}
</style>
