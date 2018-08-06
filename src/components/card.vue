<template>
  <component
    :is="element"
    :class="{ link, selected, selectable, 'selection-mode': selectionMode }"
    class="v-card">
    <component
      :is="wrapperTag"
      :to="to"
      :href="href">
      <div
        v-if="src || icon || $slots.icon"
        :style="{ backgroundColor: `var(--${color})` }"
        class="header">

        <button
          v-if="selectable"
          type="button"
          class="select"
          @click.stop="$emit('select')">
          <i class="material-icons">{{ selectionIcon }}</i>
        </button>

        <img
          v-if="src && !error"
          :alt="title"
          :src="src"
          @error="onImageError">

        <i
          v-if="error"
          class="material-icons error icon">broken_image</i>

        <i
          v-if="icon"
          :class="{ 'half-opacity': opacity === 'half' }"
          class="material-icons icon">{{ icon }}</i>

        <div
          v-if="$slots.icon"
          class="custom-icon"><slot name="icon"/></div>

        <span
          v-if="label"
          class="label">{{ label }}</span>
      </div>
      <div class="body">
        <component
          :is="titleElement"
          class="title "
        >{{ title }}</component>
        <p
          v-if="subtitle"
          class="subtitle style-4">{{ subtitle }}</p>
        <p
          v-if="body"
          class="content">{{ body }}</p>
      </div>
    </component>
  </component>
</template>

<script>
export default {
  name: "v-card",
  props: {
    element: {
      type: String,
      default: "article"
    },
    titleElement: {
      type: String,
      default: "h2"
    },
    icon: {
      type: String,
      default: null
    },
    color: {
      type: String,
      default: "accent"
    },
    src: {
      type: String,
      default: null
    },
    title: {
      type: String,
      required: true
    },
    subtitle: {
      type: String,
      default: null
    },
    body: {
      type: String,
      default: null
    },
    to: {
      type: String,
      default: null
    },
    href: {
      type: String,
      default: null
    },
    label: {
      type: String,
      default: null
    },
    opacity: {
      type: String,
      default: "full",
      validator(val) {
        return ["full", "half"].includes(val);
      }
    },
    selected: {
      type: Boolean,
      default: null
    },
    selectionMode: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      error: null
    };
  },
  computed: {
    wrapperTag() {
      if (this.to) {
        return "router-link";
      }

      if (this.href) {
        return "a";
      }

      return "div";
    },
    link() {
      if (this.to || this.href) {
        return true;
      }

      return false;
    },
    selectable() {
      return this.selected !== null;
    },
    selectionIcon() {
      if (this.selected) return "check_circle";
      if (this.selectionMode && !this.selected) return "radio_button_unchecked";
      return "check_circle";
    }
  },
  methods: {
    onImageError(error) {
      this.error = error;
    }
  }
};
</script>

<style lang="scss" scoped>
.v-card {
  width: var(--width-small);
  border-radius: 3px;
  box-shadow: var(--box-shadow);
  overflow: hidden;
  transition: box-shadow var(--fast) var(--transition);
  background-color: var(--white);

  a {
    text-decoration: none;
    cursor: pointer;
    user-select: none;
  }

  &.link:hover,
  &.selected {
    box-shadow: var(--box-shadow-accent);
    transform: translateY(-1px);
  }

  .header {
    height: var(--width-small);
    display: grid;
    grid-template-columns: 1;
    grid-template-rows: 1;
    align-items: center;
    justify-content: center;
    position: relative;

    .select {
      position: absolute;
      top: 10px;
      left: 10px;
      font-size: 12px;
      color: var(--white);
      opacity: 0;
      transition: opacity var(--fast) var(--transition);

      &:hover,
      .user-is-tabbing &:focus,
      &.selected {
        transition: none;
        opacity: 1;
      }
    }

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .icon {
      font-size: 64px;
      color: var(--white);
      text-align: center;
    }

    .custom-icon {
      width: 64px;
      height: 64px;
    }

    img,
    .icon {
      grid-row: 1;
      grid-column: 1;
    }

    .label {
      position: absolute;
      bottom: 10px;
      right: 10px;
      padding: 2px 5px;
      border-radius: var(--border-radius);
      opacity: 0.5;
      background-color: var(--white);
      color: var(--darker-gray);
      backdrop-filter: blur(5px);
      font-size: 10px;
      text-transform: uppercase;
    }
  }

  .body {
    padding: 10px;
  }

  .title,
  .subtitle {
    width: 100%;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }

  .title {
    margin-bottom: 2px;
  }

  .content {
    font-size: 11px;
    color: var(--gray);
    max-height: 114px; // 8 lines of text
    overflow: hidden;
    margin-top: 10px;
  }

  .error {
    opacity: 0.5;
  }

  .half-opacity {
    opacity: 0.5;
  }

  &.selectable {
    .select {
      transition: opacity var(--fast) var(--transition);
    }
    .header::before {
      content: "";
      position: absolute;
      width: 100%;
      height: 50px;
      left: 0;
      top: 0;
      opacity: 0;
      background-image: linear-gradient(
        -180deg,
        #000000 4%,
        rgba(0, 0, 0, 0) 100%
      );
      transition: opacity var(--fast) var(--transition);
    }

    &:hover,
    &.selection-mode,
    &.selected {
      .select {
        transition: none;
        opacity: 0.5;

        &:hover {
          opacity: 1;
        }
      }

      .header::before {
        opacity: 0.2;
      }
    }

    &.selected .select {
      opacity: 1;
    }
  }
}
</style>
