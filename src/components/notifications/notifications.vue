<template>
  <div class="notifications">
    <transition-group name="slide-fade" tag="div">
      <v-item
        v-for="notification in notifications"
        :key="notification.id"
        :item="notification"
      />
    </transition-group>
  </div>
</template>
<script>
import VItem from "./item.vue";
export default {
  name: "VNotifications",
  components: {
    VItem
  },
  computed: {
    notifications() {
      return this.$store.state.notifications.queue;
    }
  }
};
</script>
<style scoped>
.notifications {
  position: fixed;
  right: 10px;
  bottom: 0;
  width: 300px;
  z-index: 999;
}
.slide-fade-enter-active,
.slide-fade-move {
  transition: all var(--medium) ease-out;
}
.slide-fade-leave-active {
  transition: all var(--slow) cubic-bezier(1, 0.5, 0.8, 1);
  /* position: absolute; */
}
.slide-fade-enter,
.slide-fade-leave-to {
  transform: translateX(60px);
  max-height: 0;
  opacity: 0;
}
</style>
