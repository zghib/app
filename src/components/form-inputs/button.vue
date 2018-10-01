<template>
  <button
    :class="[bg || 'no-bg', { fullwidth, loading }, color]"
    :type="type"
    :disabled="disabled || loading"
    class="form-button style-btn"
    @click="$emit('click')">
    <i
      v-if="icon && !loading"
      class="material-icons">{{ icon }}</i>
    <v-spinner
      v-if="loading"
      :line-size="2"
      size="13"
      line-foreground-color="#fff"
      line-background-color="var(--darkest-gray)"
      class="spinner" />
    <slot />
  </button>
</template>

<script>
export default {
  name: "v-button",
  props: {
    fullwidth: {
      type: Boolean,
      default: false
    },
    icon: {
      type: String,
      default: ""
    },
    type: {
      type: String,
      default: ""
    },
    disabled: {
      type: Boolean,
      default: false
    },
    loading: {
      type: Boolean,
      default: false
    },
    color: {
      type: String,
      default: "white",
      validator: value => ["white", "black"].includes(value)
    },
    bg: {
      type: String,
      default: "action",
      validator: value =>
        ["action", "secondary", "warning", "danger"].includes(value)
    }
  }
};
</script>

<style lang="scss" scoped>
button.action {
  background-color: var(--darker-gray);
  border-color: var(--darker-gray);

  &:hover:not(:disabled) {
    background-color: var(--darkest-gray);
    border-color: var(--darkest-gray);
  }
}

button.secondary {
  background-color: var(--secondary);
  border-color: var(--secondary);

  &:hover:not(:disabled) {
    background-color: var(--secondary-dark);
    border-color: var(--secondary-dark);
  }
}

button.warning {
  background-color: var(--warning);
  border-color: var(--warning);

  &:hover:not(:disabled) {
    background-color: var(--warning-dark);
    border-color: var(--warning-dark);
  }
}

button.danger {
  background-color: var(--danger);
  border-color: var(--danger);

  &:hover:not(:disabled) {
    background-color: var(--danger-dark);
    border-color: var(--danger-dark);
  }
}

button.black {
  color: var(--black);
}

button.white {
  color: var(--white);
}

button {
  border: none;
  border-radius: var(--border-radius);
  cursor: pointer;
  transition: var(--fast) var(--transition);
  transition-property: border-color, background-color, color;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 20px;
  height: 40px;
  min-width: var(--width-small);
  border: var(--input-border-width) solid var(--action);

  &:disabled:not(.loading) {
    background-color: var(--lightest-gray);
    border: var(--input-border-width) solid var(--lightest-gray);
    color: var(--light-gray);
    cursor: not-allowed;
  }

  &.loading {
    cursor: progress;
  }

  &.fullwidth {
    width: 100%;
  }

  i {
    vertical-align: -30%;
    margin-right: 3px;
  }
}

.spinner {
  margin-right: 10px;
}
</style>
