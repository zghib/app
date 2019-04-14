<template>
  <div class="v-header-button">
    <div v-if="Object.keys(options).length > 0" class="options">
      <select v-model="choice" @change="emitChange">
        <option disabled selected value=""> {{ $t("more_options") }} </option>
        <option v-for="(display, value) in options" :value="value" :key="value">
          {{ display }}
        </option>
      </select>
      <i class="material-icons">more_vert</i>
    </div>
    <component
      :is="disabled ? 'button' : to ? 'router-link' : 'button'"
      :style="{
        backgroundColor: noBackground || disabled ? null : `var(--${color})`,
        color: `var(--${color})`,
        '--hover-color': hoverColor ? `var(--${hoverColor})` : null
      }"
      :class="{ attention: alert, 'no-bg': noBackground, 'has-bg': hoverColor }"
      class="button"
      :disabled="disabled"
      :to="to || null"
      @click="!to ? $emit('click', $event) : null"
    >
      <v-spinner
        v-if="loading"
        :size="24"
        line-fg-color="white"
        line-bg-color="transparent"
      />
      <svg
        v-else-if="icon === 'box'"
        class="icon"
        viewBox="0 0 17 18"
        :style="{ fill: `var(--${iconColor})` }"
      >
        <path
          d="M.4783 14.2777l7.676 3.5292a.7888.7888 0 0 0 .6913 0l7.6738-3.5292a.7661.7661 0 0 0 .4805-.748V4.3566a.8228.8228 0 0 0-.0147-.1474V4.165a.824.824 0 0 0-.0329-.1054l-.0113-.034a.8228.8228 0 0 0-.0669-.1246l-.0181-.0261a.824.824 0 0 0-.0726-.0873l-.0396-.026a.8228.8228 0 0 0-.0907-.0748l-.0227-.0159a.824.824 0 0 0-.111-.0623L8.8434.0794a.7888.7888 0 0 0-.6914 0L.4794 3.6086a.8228.8228 0 0 0-.111.0623l-.0227.0159a.824.824 0 0 0-.0907.0748l-.0283.0283a.824.824 0 0 0-.0726.0873l-.0181.026a.8228.8228 0 0 0-.0657.1247l-.0227.0317a.824.824 0 0 0-.034.1054v.043A.8228.8228 0 0 0 0 4.3567v9.1731c0 .3513.1587.6007.4783.748zm1.1684-8.6325L7.675 8.4218v7.3587l-6.0282-2.7778V5.644v.0012zM9.324 15.7794V8.4207l6.027-2.7767v7.3587l-6.027 2.7755v.0012zm-.825-14.051l5.7062 2.6293-5.7063 2.627-5.7052-2.6281 5.7052-2.6282z"
          fill-rule="nonzero"
        />
      </svg>
      <i
        v-else
        class="material-icons"
        :style="{ color: `var(--${iconColor})` }"
        >{{ icon }}</i
      >
    </component>
  </div>
</template>

<script>
export default {
  name: "v-header-button",
  props: {
    icon: {
      type: String,
      required: true
    },
    color: {
      type: String,
      default: "gray"
    },
    hoverColor: {
      type: String,
      default: null
    },
    iconColor: {
      type: String,
      default: "white"
    },
    disabled: {
      type: Boolean,
      default: false
    },
    loading: {
      type: Boolean,
      default: false
    },
    options: {
      type: Object,
      default: () => ({})
    },
    alert: {
      type: Boolean,
      default: false
    },
    noBackground: {
      type: Boolean,
      default: false
    },
    to: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      choice: null
    };
  },
  methods: {
    emitChange(event) {
      this.$emit("input", event.target.value);
      this.choice = null;
    }
  }
};
</script>

<style scoped lang="scss">
.v-header-button {
  position: relative;
  height: calc(var(--header-height) - 20px);
  width: calc(var(--header-height) - 20px);
  display: inline-block;
  margin-left: 20px;
}

.button {
  transition: background-color var(--fast) var(--transition);
}

.button.has-bg:hover {
  background-color: var(--hover-color) !important;
}

.icon {
  width: 18px;
}

button,
a {
  position: relative;
  background-color: transparent;
  border: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;
  border-radius: 100%;
  overflow: hidden;
  cursor: pointer;
  text-decoration: none;

  i {
    transition: 100ms var(--transition);
    color: var(--white);
  }

  span {
    position: absolute;
    bottom: 2px;
    opacity: 0;
    transform: translateY(5px);
    transition: 100ms var(--transition-out);
    font-size: 10px;
  }

  &:hover:not([disabled]) span,
  .user-is-tabbing &:focus span {
    opacity: 0.6;
    transform: translateY(0);
    transition: 100ms var(--transition-in);
  }

  &:not([disabled]):active i {
    transform: scale(0.9);
    opacity: 0.8;
  }

  &::after {
    content: "";
    display: block;
    width: 10px;
    height: 10px;
    background-color: var(--warning);
    border-radius: 50%;
    position: absolute;
    top: 27%;
    right: 27%;
    border: 2px solid currentColor;
    transform: scale(0);
    transition: transform var(--fast) var(--transition-out);
  }

  &.attention::after {
    transform: scale(1);
    transition: transform var(--fast) var(--transition-in);
  }
}

button.no-bg {
  border: 2px solid var(--lighter-gray);
  background-color: transparent;
  i {
    color: var(--lighter-gray);
  }
}

button[disabled] {
  background-color: var(--lighter-gray) !important;
  cursor: not-allowed;
  i {
    color: var(--lightest-gray) !important;
  }
}

.options {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  position: absolute;
  overflow: hidden;
  right: -20px;
  z-index: +1;

  i {
    transition: color var(--fast) var(--transition);
  }

  select {
    position: absolute;
    width: 100%;
    height: 100%;
    opacity: 0;
    top: 0;
    left: 0;
    cursor: pointer;
    z-index: +2;
    color: var(--black);

    & + i {
      color: var(--darker-gray);
    }

    &:hover + i {
      color: var(--darkest-gray);
    }
  }
}
</style>
