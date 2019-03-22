<template>
  <div
    class="project-switcher"
    :class="{
      'is-active':
        $store.state.auth.projectName !== selectionName ||
        !$store.state.auth.project,
      'has-error': !$store.state.auth.project
    }"
  >
    <div
      :class="{
        slow: $store.getters.signalStrength === 1,
        disconnected: $store.getters.signalStrength === 0
      }"
      v-tooltip.left="{
        content:
          (!!$store.state.auth.url ? $store.state.auth.url : 'No connection') +
          `<br>${$t('latency')}:${
            !!$store.state.auth.url
              ? $n(
                  Math.round(
                    $store.state.latency[$store.state.latency.length - 1]
                      .latency
                  )
                )
              : ' - '
          }ms`,
        boundariesElement: 'body'
      }"
    >
      <v-signal class="icon" />
      <span class="no-wrap">{{
        selectionName ? selectionName : $store.state.auth.projectName
      }}</span>
      <i v-if="Object.keys(urls).length > 1" class="material-icons chevron">
        arrow_drop_down
      </i>
      <select
        v-if="Object.keys(urls).length > 1"
        :value="currentUrl"
        @change.prevent="changeUrl"
      >
        <option
          v-for="(name, url) in urls"
          :key="name + url"
          :name="name"
          :value="url"
          @click="changeUrl"
          :selected="url === currentUrl || url + '/' === currentUrl"
        >
          {{ name }}
        </option>
      </select>
    </div>
  </div>
</template>

<script>
import VSignal from "../../signal.vue";

export default {
  name: "project-switcher",
  components: {
    VSignal
  },
  data() {
    return {
      active: false,
      selectionUrl: null,
      selectionName: ""
    };
  },
  computed: {
    urls() {
      return this.$lodash.mapKeys(window.__DirectusConfig__.api, (val, key) =>
        key.endsWith("/") === false ? key + "/" : key
      );
    },
    currentUrl() {
      return (
        this.$store.state.auth.url + "/" + this.$store.state.auth.project + "/"
      );
    }
  },
  methods: {
    changeUrl(event) {
      const newUrl = event.target.value;
      const newName = window.__DirectusConfig__.api[newUrl]
        ? window.__DirectusConfig__.api[newUrl]
        : this.$store.state.auth.projectName;

      this.selectionUrl = newUrl;
      this.selectionName = newName;

      this.$store
        .dispatch("switchProject", {
          projectName: newName,
          url: newUrl
        })
        .then(() => this.$store.dispatch("changeAPI", newUrl));
    }
  }
};
</script>

<style lang="scss" scoped>
.project-switcher {
  .nav-login {
    max-height: 0;
    opacity: 0;
    transition: max-height var(--fast) var(--transition),
      opacity var(--slow) var(--transition);
    background-color: var(--white);
    z-index: 1;
  }

  > div {
    height: calc(
      var(--header-height) + 1px
    ); /* Force border bottom to be aligned with listing headers */
    width: 100%;
    border-bottom: 1px solid var(--lightest-gray);
    display: flex;
    align-items: center;
    color: var(--accent);
    margin-bottom: 10px;
    position: relative;
    transition: border-bottom-width 0.15s ease-in-out;

    span,
    svg {
      transition: color 0.25s ease-in-out, fill 0.25s ease-in-out;
    }

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

  &.is-active {
    .nav-login {
      opacity: 1;
      max-height: 260px;
      border-bottom: 1px solid var(--lightest-gray);
      margin-bottom: 20px;
      margin-top: 20px;
    }
  }

  &.has-error {
    > div {
      svg {
        fill: var(--red);
      }
    }
    span {
      color: var(--red);
      + i {
        color: var(--red);
      }
    }
  }

  .icon {
    width: 15px;
    height: 18px;
    margin-right: 10px;
  }

  select {
    position: absolute;
    opacity: 0;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 100%;
    height: 100%;
    cursor: pointer;
  }
}
</style>
