<template>
  <v-modal :title="$t('create_field')" :cancel="() => {}" :buttons="buttons" @next="nextTab" @close="$emit('close')">

    <div class="tabs">
      <button
        :class="{ active: activeTab === 'interface' }"
        @click="activeTab = 'interface'">{{ $t('interface') }}</button>
      <button
        :class="{ active: activeTab === 'schema' }"
        @click="activeTab = 'schema'"
        :disabled="schemaDisabled">{{ $t('schema') }}</button>
      <button
        :class="{ active: activeTab === 'options' }"
        @click="activeTab = 'options'"
        :disabled="optionsDisabled">{{ $t('options') }}</button>
    </div>

    <div class="tab" v-show="activeTab === 'interface'">
      <h1 class="style-0">{{ $t("choose_interface") }}</h1>
      <p v-if="interfaceName">
        {{ $t("currently_selected", { thing: interfaces[interfaceName].name}) }}
      </p>
      <p v-else>
        {{ $t("select_interface_below" )}}
      </p>
      <div class="interfaces">
        <article
          v-for="ext in interfaces"
          :key="ext.id"
          :class="{ active: interfaceName === ext.id }"
          class="interface"
          @click="interfaceName = ext.id">
          <div class="header">
            <i class="material-icons">text_fields</i>
          </div>
          <div class="body">
            <h2>{{ ext.name }}</h2>
            <p>Directus Team</p>
          </div>
        </article>
      </div>
    </div>

    <div class="tab" v-show="activeTab === 'schema'">
      <h1 class="style-0">{{ $t("name_field", { field: "dropdown" }) }}</h1>
      <p>{{ $t("intelligent_defaults") }}</p>
      <form @submit.prevent class="schema">
        <div class="name">
          <label>{{ $t("name") }} <v-input type="text" v-model="field" :placeholder="$t('db_name')" /></label>
          <label>{{ $t("display_name") }} <v-input type="text" disabled :value="displayName" :placeholder="$t('auto_generated')" /></label>
        </div>
        <label>{{ $t("note") }} <v-input type="text" v-model="note" :placeholder="$t('add_note')" /></label>
        <details>
          <summary>{{ $t("show_advanced_options") }}</summary>
          <div class="advanced-form">
            <label>
              {{ $t("datatype") }}
              <v-simple-select v-model="type">
                <option v-for="(defaultLength, datatype) in availableDatatypes" :key="datatype" :value="datatype">
                  {{ datatype }}
                </option>
              </v-simple-select>
            </label>
            <label>{{ $t("length") }} <v-input type="number" v-model="length" /></label>
            <label>{{ $t("default") }} <v-input type="text" v-model="default_value" placeholder="NULL"/></label>
            <label>{{ $t("validation") }} <v-input type="text" v-model="validation" :placeholder="$t('regex')"/></label>
            <label class="toggle"><v-toggle v-model="required" /> {{ $t("required") }} </label>
            <label class="toggle"><v-toggle v-model="readonly" /> {{ $t("readonly") }} </label>
            <label class="toggle"><v-toggle v-model="unique" /> {{ $t("unique") }}</label>
            <label class="toggle"><v-toggle v-model="hidden_input" /> {{ $t("hidden_input") }}</label>
            <label class="toggle"><v-toggle v-model="hidden_list" />{{ $t("hidden_list") }}</label>
          </div>
        </details>
      </form>
    </div>

    <div class="tab" v-show="activeTab === 'options'">
      <h1 class="style-0">{{ $t('almost_done_options') }}</h1>
      <p>{{ $t('almost_done_copy') }}</p>
      <form @submit.prevent v-if="selectedInterfaceInfo" class="options">
        <div
          v-for="(option, optionID) in selectedInterfaceInfo.options"
          class="options"
          :key="optionID">
          <label :for="optionID">{{ option.name }}</label>
          <p>{{ option.comment }}</p>
          <v-interface
            :id="option.interface"
            :name="optionID"
            :type="option.type"
            :length="option.length"
            :readonly="option.readonly"
            :required="option.required"
            :loading="option.loading"
            :options="option.options"
            :value="options[optionID] || option.default"
            @input="$set(options, optionID, $event)" />
        </div>
      </form>
    </div>

  </v-modal>
</template>

<script>
export default {
  name: "v-field-setup",
  props: {
    fieldInfo: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      activeTab: "interface",
      id: null,
      sort: null,
      saving: false,

      field: null,
      type: null,
      interfaceName: null,
      options: {},
      translation: {},
      readonly: false,
      required: false,
      unique: false,
      note: null,
      hidden_input: false,
      hidden_list: false,
      length: null,
      default_value: null,
      validation: null
    };
  },
  computed: {
    interfaces() {
      return this.$store.state.extensions.interfaces;
    },
    selectedInterfaceInfo() {
      if (!this.interfaceName) return null;

      return this.interfaces[this.interfaceName];
    },
    schemaDisabled() {
      return !(this.interfaceName && this.interfaceName.length > 0);
    },
    optionsDisabled() {
      return this.schemaDisabled === true || !this.field;
    },
    displayName() {
      if (!this.field) return "";
      return this.$helpers.formatTitle(this.field);
    },
    availableDatatypes() {
      if (!this.interfaceName) return {};

      return this.interfaces[this.interfaceName].datatypes;
    },
    buttons() {
      let disabled = false;

      if (this.activeTab === "interface" && !this.interfaceName)
        disabled = true;

      if (this.activeTab === "schema" && !this.field) disabled = true;

      return {
        next: {
          disabled,
          text:
            this.activeTab === "options" ? this.$t("save") : this.$t("next"),
          loading: this.saving
        }
      };
    }
  },
  created() {
    this.useFieldInfo();
  },
  watch: {
    fieldInfo() {
      this.useFieldInfo();
    },
    interfaceName() {
      this.type = Object.keys(this.availableDatatypes)[0];
    },
    field(val) {
      // Based on https://gist.github.com/mathewbyrne/1280286
      this.field = val
        .toString()
        .toLowerCase()
        .replace(/\s+/g, "_") // Replace spaces with _
        .replace(/[^\w_]+/g, "") // Remove all non-word chars
        .replace(/__+/g, "_") // Replace multiple _ with single _
        .replace(/^_+/, "") // Trim _ from start of text
        .replace(/_+$/, ""); // Trim _ from end of text
    },
    type(datatype) {
      this.length = this.availableDatatypes[datatype];
    }
  },
  methods: {
    nextTab() {
      switch (this.activeTab) {
        case "interface":
          this.activeTab = "schema";
          break;
        case "schema":
          this.activeTab = "options";
          break;
        case "options":
        default:
          this.saveField();
          break;
      }
    },
    saveField() {
      const fieldInfo = {
        id: this.id,
        sort: this.sort,
        field: this.field,
        type: this.type,
        interface: this.interfaceName,
        default_value: this.default_value,
        options: this.options,
        readonly: this.readonly,
        required: this.required,
        unique: this.unique,
        note: this.note,
        hidden_input: this.hidden_input,
        hidden_list: this.hidden_list,
        length: this.length,
        validation: this.validation
        // translation: this.translation, < Haven't implemented that yet
      };

      this.saving = true;

      this.$emit("save", fieldInfo);
    },
    useFieldInfo() {
      if (!this.fieldInfo) return;

      Object.keys(this.fieldInfo).forEach(key => {
        if (this.fieldInfo[key] != null) this[key] = this.fieldInfo[key];
      });

      // 'interface' is a reserved word in JS, so we need to work around that
      this.interfaceName = this.fieldInfo.interface;
    }
  }
};
</script>

<style lang="scss" scoped>
.tab {
  padding: 30px;

  .style-0 {
    max-width: 80%;
    margin-bottom: 30px;
  }

  p {
    line-height: 2;
    max-width: 70%;
  }

  .interfaces {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-gap: 20px;
    margin-top: 30px;

    article {
      display: block;
      background-color: var(--white);
      border-radius: var(--border-radius);
      box-shadow: var(--box-shadow);
      flex-basis: 160px;
      flex-shrink: 0;
      overflow: hidden;
      transition: box-shadow var(--fast) var(--transition-out);
      cursor: pointer;

      .header {
        background-color: var(--lighter-gray);
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 20px 0;
        transition: background-color var(--fast) var(--transition-out);

        i {
          font-size: 48px;
          color: var(--white);
        }
      }

      &.active {
        .header {
          background-color: var(--accent);
          transition: background-color var(--fast) var(--transition-in);
        }
      }

      .body {
        padding: 10px;
      }

      h2 {
        margin: 0;
        font-size: 13px;
      }

      p {
        text-transform: uppercase;
        font-weight: 700;
        color: var(--lighter-gray);
        font-size: 11px;
      }

      &:hover {
        box-shadow: var(--box-shadow-accent);
        transform: translateY(-1px);
        transition: box-shadow var(--fast) var(--transition-in);
      }
    }
  }

  form.schema {
    margin-top: 30px;

    label:not(.toggle) {
      > *:last-child {
        margin-top: 10px;
      }
    }

    summary {
      color: var(--accent);
      cursor: pointer;
      text-align: center;
      margin: 30px 0;
      text-transform: capitalize;

      &:hover {
        color: var(--accent-dark);
      }

      &::-webkit-details-marker {
        display: none;
      }
    }

    .name {
      margin-bottom: 20px;
    }

    .advanced-form,
    .name {
      display: grid;
      grid-gap: 20px;
      grid-template-columns: 1fr 1fr;

      .toggle {
        display: flex;
        align-items: center;
        text-transform: capitalize;
        font-size: 1rem;

        > *:first-child {
          margin-right: 10px;
        }
      }
    }
  }

  form.options {
    > div {
      margin-top: 30px;
    }
  }
}

.no-results {
  margin: 20px auto;
  min-height: 0;
}

.tabs {
  display: flex;
  padding: 0;
  list-style: none;
  justify-content: center;
  border-bottom: 1px solid var(--lightest-gray);
  position: sticky;
  top: 0;
  background-color: var(--white);
  z-index: +1;

  button {
    flex-grow: 1;
    flex-shrink: 1;
    max-width: 120px;
    flex-basis: 120px;
    height: 50px;
    position: relative;
    color: var(--gray);

    text-decoration: none;
    text-transform: uppercase;
    font-size: 12px;
    font-weight: 700;
    position: relative;

    &:hover {
      color: var(--darker-gray);
    }

    &::after {
      content: "";
      display: block;
      width: 100%;
      position: absolute;
      height: 3px;
      bottom: -2px;
      background-color: var(--accent);
      transform: scaleY(0);
      transition: transform var(--fast) var(--transition-out);
    }

    &.active {
      color: var(--accent);

      &::after {
        transform: scaleY(1);
        transition: transform var(--fast) var(--transition-in);
      }
    }

    &[disabled] {
      color: var(--lighter-gray);
      cursor: not-allowed;
    }
  }
}
</style>
