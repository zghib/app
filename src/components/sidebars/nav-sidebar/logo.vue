<template>
  <div class="v-logo">
    <img v-if="customLogoExists" :src="customLogoPath" :alt="projectName" />
    <div
      v-else
      class="logo"
      :class="{ running }"
      @animationiteration="checkRunning"
    />
  </div>
</template>

<script>
export default {
  name: "v-logo",
  data() {
    return {
      customLogoPath: "",
      running: false
    };
  },
  computed: {
    customLogoExists() {
      return Boolean(this.$store.state.settings.logo);
    },
    projectName() {
      return this.$store.state.auth.projectName;
    },
    queueContainsItems() {
      return this.$store.state.queue.length !== 0;
    }
  },
  watch: {
    queueContainsItems(newVal) {
      if (newVal === true) {
        this.running = true;
      }
    }
  },
  created() {
    if (this.customLogoExists) {
      const logoID = this.$store.state.settings.logo;
      // NOTE: The api should return the logo relational from directus_settings. See directus/api#121
      this.$api
        .getItem("directus_files", logoID)
        .then(res => res.data.storage.full_url)
        .then(url => (this.customLogoPath = url))
        .catch(error => {
          this.$events.emit("error", {
            notify: this.$t("something_went_wrong_body"),
            error
          });
        });
    }
  },
  methods: {
    checkRunning() {
      if (this.queueContainsItems === false) {
        this.running = false;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.v-logo {
  height: var(--header-height);
  background-color: var(--brand);
  padding: 12px;
  display: grid;
  position: relative;

  > * {
    width: 100%;
    height: 100%;
    object-fit: contain;
    grid-column: 1;
    grid-row: 1;
  }

  .logo {
    background-image: url("../../../assets/sprite.svg");
    background-size: 882px;
    background-position: 0%;
    width: 59px;
    height: 48px;
    margin: 0 auto;
  }

  .running {
    animation: 560ms run steps(14) infinite;
  }
}

@keyframes run {
  100% {
    background-position: 100%;
  }
}
</style>
