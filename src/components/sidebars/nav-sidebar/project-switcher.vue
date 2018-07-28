<template>
  <div class="project-switcher">
    <portal to="modal" v-if="active">
      <v-modal
        :title="$t('change_project')"
        @close="active = false">
        <login-form class="form" />
      </v-modal>
    </portal>
    <button
      :class="{
        slow: $store.getters.signalStrength == 1,
        disconnected: $store.getters.signalStrength == 0
      }"
      v-tooltip.left="{
        content: $store.state.auth.url + `<br>${$t('latency')}: ${$n(Math.round($store.state.latency[$store.state.latency.length - 1].latency))}ms`,
        boundariesElement: 'body'
      }"
      @click="active = true">
      <v-signal class="icon" />
      <span class="no-wrap">{{ $store.state.auth.projectName }}</span>
      <i class="material-icons chevron">arrow_drop_down</i>
    </button>
  </div>
</template>

<script>
import VSignal from "../../signal.vue";
import LoginForm from "../../login-form/login-form.vue";

export default {
  name: "project-switcher",
  components: {
    VSignal,
    LoginForm
  },
  data() {
    return {
      active: false
    };
  }
};
</script>

<style lang="scss" scoped>
.project-switcher button {
  height: calc(
    var(--header-height) + 1px
  ); /* Force border bottom to be aligned with listing headers */
  width: 100%;
  border-bottom: 1px solid var(--lightest-gray);
  display: flex;
  align-items: center;
  color: var(--accent);
  margin-bottom: 10px;

  &.slow {
    color: var(--warning);
    svg {
      fill: var(--warning);
    }
    i {
      color: var(--warning);
    }
  }

  &.disconnected {
    color: var(--danger);
    svg {
      fill: var(--danger);
    }
    i {
      color: var(--danger);
    }
  }

  svg {
    fill: var(--accent);
  }

  i {
    color: var(--accent);
  }

  span {
    flex-grow: 1;
    line-height: 24px;
    text-align: left;
  }
}

.icon {
  width: 15px;
  height: 18px;
  margin-right: 10px;
  color: var(--light-gray);
  fill: var(--light-gray);
}

.form {
  margin: 20px auto;
}
</style>
