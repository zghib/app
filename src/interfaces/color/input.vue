<template>
  <div class="interface-color">
    <div v-if="!options.paletteOnly && options.input === 'hex' && readonly === false" class="input">
      <v-input
        v-if="options.allowAlpha"
        v-model="rawValue"
        type="text"
        placeholder="#3498dbee"
        pattern="[#0-9a-fA-F]"
        icon-left="palette"
        :maxlength="9"
      ></v-input>
      <v-input
        v-else
        v-model="rawValue"
        type="text"
        placeholder="#3498db"
        pattern="[#0-9a-fA-F]"
        icon-left="palette"
        :maxlength="7"
      ></v-input>
    </div>
    <div
      v-else-if="!options.paletteOnly && options.input === 'rgb' && readonly === false"
      class="sliders"
    >
      <template v-for="(label, idx) in rgbLabels">
        <label
          v-if="
            rawValue[idx] ||
              rawValue[idx] === 0 ||
              (options.allowAlpha && rawValue[idx] === undefined)
          "
          :key="'label' + idx"
          class="slider-label"
        >
          {{ label }}
        </label>
        <v-slider
          v-if="(rawValue[idx] && label !== 'A') || (rawValue[idx] === 0 && label !== 'A')"
          :key="idx"
          v-model.lazy="rawValue[idx]"
          :min="0"
          :max="256"
          :always-show-output="true"
          class="slider"
        ></v-slider>
        <span
          v-if="options.allowAlpha && label === 'A'"
          :key="'hidden-model-fix' + idx"
          style="display: none; visibility: hidden; opacity: 0"
        >
          {{ rawValue[idx] === undefined ? (rawValue[idx] = 1) : rawValue[idx] }}
        </span>
        <v-slider
          v-if="
            options.allowAlpha && label === 'A' && rawValue[idx] === undefined
              ? (rawValue[idx] = 1)
              : rawValue[idx]
          "
          :key="idx"
          v-model.lazy="rawValue[idx]"
          :min="0"
          :max="1"
          :step="0.01"
          :always-show-output="true"
          class="slider"
        ></v-slider>
        <br :key="'break-' + idx" />
      </template>
    </div>
    <div
      v-else-if="!options.paletteOnly && options.input === 'hsl' && readonly === false"
      class="sliders"
    >
      <template v-for="(label, idx) in hslLabels">
        <label
          v-if="
            rawValue[idx] ||
              rawValue[idx] === 0 ||
              (options.allowAlpha && rawValue[idx] === undefined)
          "
          :key="'label' + idx"
          class="slider-label"
        >
          {{ label }}
        </label>
        <v-slider
          v-if="(rawValue[idx] && label !== 'A') || (rawValue[idx] === 0 && label !== 'A')"
          :key="idx"
          v-model.lazy="rawValue[idx]"
          :min="0"
          :max="idx < 1 ? 100 : 360"
          :always-show-output="true"
          class="slider"
        ></v-slider>
        <span
          v-if="options.allowAlpha && label === 'A'"
          :key="'hidden-model-fix' + idx"
          style="display: none; visibility: hidden; opacity: 0"
        >
          {{ rawValue[idx] === undefined ? (rawValue[idx] = 1) : rawValue[idx] }}
        </span>
        <v-slider
          v-if="options.allowAlpha && label === 'A'"
          :key="idx"
          v-model.lazy="rawValue[idx]"
          :min="0"
          :max="1"
          :step="0.01"
          :always-show-output="true"
          class="slider"
        ></v-slider>
        <br :key="'break-' + idx" />
      </template>
    </div>
    <div
      v-else-if="!options.paletteOnly && options.input === 'cmyk' && readonly === false"
      class="sliders"
    >
      <template v-for="(label, idx) in cmykLabels">
        <label
          v-if="
            rawValue[idx] ||
              rawValue[idx] === 0 ||
              (options.allowAlpha && rawValue[idx] === undefined)
          "
          :key="'label' + idx"
          class="slider-label"
        >
          {{ label }}
        </label>
        <v-slider
          v-if="(rawValue[idx] && label !== 'A') || (rawValue[idx] === 0 && label !== 'A')"
          :key="idx"
          v-model="rawValue[idx]"
          :min="0"
          :max="100"
          :always-show-output="true"
          class="slider"
        ></v-slider>
        <span
          v-if="options.allowAlpha && label === 'A'"
          :key="'hidden-model-fix' + idx"
          style="display: none; visibility: hidden; opacity: 0"
        >
          {{ rawValue[idx] === undefined ? (rawValue[idx] = 1) : rawValue[idx] }}
        </span>
        <v-slider
          v-if="options.allowAlpha && label === 'A'"
          :key="idx"
          v-model.lazy="rawValue[idx]"
          :min="0"
          :max="1"
          :step="0.01"
          :always-show-output="true"
          class="slider"
        ></v-slider>
        <br :key="'break-' + idx" />
      </template>
    </div>
    <div class="swatch" :style="`background-color: ${color ? color.hex() : 'transparent'}`">
      <v-icon name="check" size="20" />
    </div>
    <template v-if="readonly === false">
      <button
        v-for="(color, idx) in palette"
        :key="idx"
        :style="{ backgroundColor: color, color: color }"
        @click="setRawValue(color)"
      >
        <v-icon name="check" size="20" />
      </button>
    </template>
  </div>
</template>

<script>
import mixin from "@directus/extension-toolkit/mixins/interface";
import Color from "color";

export default {
  name: "InterfaceColor",
  mixins: [mixin],
  data() {
    return {
      rgbLabels: ["R", "G", "B", "A"],
      hslLabels: ["H", "S", "L", "A"],
      cmykLabels: ["C", "M", "Y", "K", "A"],
      rawValue: null
    };
  },
  computed: {
    color() {
      try {
        if (this.options.input === "hex") {
          return Color(this.rawValue);
        }
        return Color[this.options.input](this.rawValue);
      } catch (err) {
        return null;
      }
    },
    palette() {
      if (this.options.palette) {
        const rawPalette = Array.isArray(this.options.palette)
          ? this.options.palette
          : this.options.palette.split(",");
        return rawPalette.map(val => Color(val));
      }

      return null;
    }
  },
  watch: {
    rawValue() {
      if (this.color === null) {
        return this.$emit("input", null);
      }

      let value;

      if (this.options.output === "hex") {
        value = this.color.hex();
      } else {
        value = this.color[this.options.output]().array();
        value = value.map((num, index) => {
          if (index === value.length - 1) {
            return Math.round(num * 100) / 100;
          }

          return Math.round(num);
        });
      }
      if (value) {
        this.$emit("input", value);
      }
    },
    options: {
      deep: true,
      handler() {
        this.setDefault();
      }
    }
  },
  created() {
    this.setDefault();
  },
  methods: {
    setDefault() {
      let savedColor = Color(this.value || "#263238");
      this.setRawValue(savedColor);
    },
    setRawValue(color) {
      if (this.options.input === "hex") {
        return (this.rawValue = color.hex());
      }

      return (this.rawValue = color[this.options.input]()
        .array()
        .map(val => {
          return Math.round(val);
        }));
    }
  }
};
</script>

<style scoped lang="scss">
.input {
  display: inline-block;
  margin-right: 16px;
  vertical-align: middle;
  width: 130px;
}

.sliders {
  max-width: 200px;
  display: inline-block;
  margin-right: 36px;
  vertical-align: middle;
  .slider-label {
    display: inline-block;
    color: var(--light-gray);
    width: 14px;
    vertical-align: text-bottom;
  }
  .slider {
    display: inline-block;
    margin-bottom: 8px;
  }
}

.swatch {
  transition: var(--fast) var(--transition);
  display: inline-block;
  width: 24px;
  height: 24px;
  border-radius: 100%;
  vertical-align: middle;
  margin-right: 4px;
  color: var(--white);
  text-align: center;
  i {
    line-height: 24px;
  }
}

button {
  transition: var(--fast) var(--transition);
  position: relative;
  display: inline-block;
  width: 24px;
  height: 24px;
  border-radius: 100%;
  margin-right: 4px;
  margin-bottom: 4px;
  &:last-of-type {
    margin-right: 0;
  }
  &:hover {
    transition: none;
    color: var(--white) !important;
  }
  i {
    line-height: 24px;
  }
}
</style>
