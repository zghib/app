<template>
  <v-modal
    :title="$t('create_field')"
    :tabs="tabs"
    :active-tab="activeTab"
    :buttons="buttons"
    @tab="activeTab = $event"
    @next="nextTab"
    @close="$emit('close')">

    <template slot="interface">
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
    </template>

    <template slot="schema" v-if="interfaceName">
      <h1 class="style-0">{{ $t("name_field", { field: $helpers.formatTitle(interfaceName) }) }}</h1>
      <p>{{ $t("intelligent_defaults") }}</p>
      <form @submit.prevent class="schema">
        <div class="name">
          <label>{{ $t("name") }}<i v-tooltip="$t('required')" class="material-icons required">star</i> <v-input type="text" v-model="field" :placeholder="$t('db_name')" /></label>
          <label>{{ $t("display_name") }} <v-input type="text" disabled :value="displayName" :placeholder="$t('auto_generated')" /></label>
        </div>
        <label>{{ $t("note") }} <v-input type="text" v-model="note" :placeholder="$t('add_note')" /></label>
        <details class="advanced">
          <summary>{{ $t("show_advanced_options") }}</summary>
          <div class="advanced-form">
            <label>
              {{ $t("field_type") }}
              <v-simple-select v-model="type">
                <option v-for="type in availableFieldTypes" :key="type" :value="type">
                  {{ $helpers.formatTitle(type) }}
                </option>
              </v-simple-select>
            </label>
            <small class="description">{{ fieldTypeDescription }}</small>
            <label>
              {{ $t("db_datatype", { db: $helpers.formatTitle(databaseVendor) }) }}
              <v-simple-select v-model="datatype">
                <option v-for="type in availableDatatypes" :key="type" :value="type">
                  {{ type }}
                </option>
              </v-simple-select>
            </label>
            <small class="description">{{ selectedDatatypeInfo && selectedDatatypeInfo.description }}</small>
            <label>{{ $t("default") }} <v-input type="text" v-model="default_value" placeholder="NULL"/></label>
            <label>{{ $t("length") }} <v-input
              :type="selectedDatatypeInfo && selectedDatatypeInfo.decimal ? 'string' : 'number'"
              @input="length = $event"
              :value="lengthDisabled ? null : length"
              :disabled="lengthDisabled" /></label>
            <label>{{ $t("validation") }} <v-input type="text" v-model="validation" :placeholder="$t('regex')"/></label>
            <div />
            <label class="toggle"><v-toggle v-model="required" /> {{ $t("required") }} </label>
            <label class="toggle"><v-toggle v-model="readonly" /> {{ $t("readonly") }} </label>
            <label class="toggle"><v-toggle v-model="unique" /> {{ $t("unique") }}</label>
            <label class="toggle"><v-toggle v-model="hidden_input" /> {{ $t("hidden_input") }}</label>
            <label class="toggle"><v-toggle v-model="hidden_list" />{{ $t("hidden_list") }}</label>
          </div>
        </details>
      </form>
    </template>

    <template slot="relation" v-if="selectedInterfaceInfo && relation">
      <h1 class="style-0">{{ $t('relation_setup') }}</h1>
      <p>{{ $t('relation_setup_copy', { relation: $t(relation) }) }}</p>

      <form v-if="relation === 'm2o'" class="single">
        <p>{{ $t('this_collection') }}</p>

        <v-simple-select class="select" :value="relationInfo.collection_many" disabled>
          <option selected :value="collectionInfo.collection">{{ collectionInfo.collection }}</option>
        </v-simple-select>

        <v-simple-select class="select" :value="relationInfo.field_many" disabled>
          <option selected :value="field">{{ field }}</option>
        </v-simple-select>

        <i class="material-icons">arrow_backward</i>

        <p>{{ $t('related_collection') }}</p>

        <v-simple-select class="select" v-model="relationInfo.collection_one">
          <option
            v-for="({ collection }) in collections"
            :key="collection"
            :value="collection">{{ collection }}</option>
        </v-simple-select>

        <v-simple-select class="select" :value="primaryKeyField.field" disabled>
          <option selected :value="primaryKeyField.field">{{ primaryKeyField.field }}</option>
        </v-simple-select>
      </form>

      <form v-if="relation === 'o2m'" class="single">
        <p>{{ $t('this_collection') }}</p>

        <v-simple-select class="select" :value="collectionInfo.collection" disabled>
          <option selected :value="collectionInfo.collection">{{ collectionInfo.collection }}</option>
        </v-simple-select>

        <v-simple-select class="select" :value="primaryKeyField.field" disabled>
          <option selected :value="primaryKeyField.field">{{ primaryKeyField.field }}</option>
        </v-simple-select>

        <i class="material-icons">arrow_forward</i>

        <p>{{ $t('related_collection') }}</p>

        <v-simple-select class="select" v-model="relationInfo.collection_many">
          <option
            v-for="({ collection }) in collections"
            :key="collection"
            :value="collection">{{ collection }}</option>
        </v-simple-select>

        <v-simple-select class="select" v-model="relationInfo.field_many">
          <option
            v-for="({ field }) in fields(relationInfo.collection_many)"
            :key="field"
            :value="field">{{ field }}</option>
        </v-simple-select>
      </form>

      <form v-if="relation === 'm2m'" class="full">
        <p>{{ $t('this_collection') }}</p>

        <v-simple-select class="select" :value="collectionInfo.collection" disabled>
          <option selected :value="collectionInfo.collection">{{ collectionInfo.collection }}</option>
        </v-simple-select>

        <v-simple-select class="select" :value="primaryKeyField.field" disabled>
          <option selected :value="primaryKeyField.field">{{ primaryKeyField.field }}</option>
        </v-simple-select>

        <i class="material-icons">arrow_forward</i>

        <p>{{ $t('junction_collection') }}</p>

        <v-simple-select
          class="select"
          :value="relationInfoM2M[0].collection_many"
          @input="(val) => { relationInfoM2M[0].collection_many = val; relationInfoM2M[1].collection_many = val; }">
          <option
            v-for="({ collection }) in collections"
            :key="collection"
            :value="collection">{{ collection }}</option>
        </v-simple-select>

        <v-simple-select class="select" v-model="relationInfoM2M[currentM2MIndex].field_many">
          <option
            v-for="({ field }) in fields(relationInfoM2M[0].collection_many)"
            :key="field"
            :value="field">{{ field }}</option>
        </v-simple-select>

        <v-simple-select class="select" v-model="relationInfoM2M[currentM2MIndex === 0 ? 1 : 0].field_many">
          <option
            v-for="({ field }) in fields(relationInfoM2M[0].collection_many)"
            :key="field"
            :value="field">{{ field }}</option>
        </v-simple-select>

        <i class="material-icons">arrow_backward</i>

        <p>{{ $t('related_collection') }}</p>

        <v-simple-select
          class="select"
          v-model="relationInfoM2M[currentM2MIndex === 0 ? 1 : 0].collection_one">
          <option
            v-for="({ collection }) in collections"
            :key="collection"
            :value="collection">{{ collection }}</option>
        </v-simple-select>

        <v-simple-select class="select" :value="primaryKeyFieldByCollection(relationInfoM2M[currentM2MIndex === 0 ? 1 : 0].collection_one).field" disabled>
          <option selected :value="primaryKeyFieldByCollection(relationInfoM2M[currentM2MIndex === 0 ? 1 : 0].collection_one).field">{{ primaryKeyFieldByCollection(relationInfoM2M[currentM2MIndex === 0 ? 1 : 0].collection_one).field }}</option>
        </v-simple-select>
      </form>
    </template>

    <template slot="options">
      <h1 class="style-0">{{ $t('almost_done_options') }}</h1>
      <p>{{ $t('almost_done_copy') }}</p>
      <form @submit.prevent v-if="selectedInterfaceInfo" class="options">
        <div
          v-for="(option, optionID) in interfaceOptions.regular"
          class="options"
          :key="optionID">
          <label :for="optionID">{{ option.name }}</label>
          <p v-html="$helpers.snarkdown(option.comment)" />
          <v-ext-input
            :id="option.interface"
            :name="optionID"
            :type="option.type"
            :length="option.length"
            :readonly="option.readonly"
            :required="option.required"
            :loading="option.loading"
            :options="option.options"
            :value="options[optionID] || option.default"
            :fields="selectedInterfaceInfo.options"
            :values="options"
            @input="$set(options, optionID, $event)" />
        </div>

        <details v-if="Object.keys(interfaceOptions.advanced).length > 0" class="advanced">
          <summary>{{ $t("show_advanced_options") }}</summary>
          <div
            v-for="(option, optionID) in interfaceOptions.advanced"
            class="options"
            :key="optionID">
            <label :for="optionID">{{ option.name }}</label>
            <p v-html="$helpers.snarkdown(option.comment)" />
            <v-ext-input
              :id="option.interface"
              :name="optionID"
              :type="option.type"
              :length="option.length"
              :readonly="option.readonly"
              :required="option.required"
              :loading="option.loading"
              :options="option.options"
              :value="options[optionID] || option.default"
              :fields="selectedInterfaceInfo.options"
              :values="options"
              @input="$set(options, optionID, $event)" />
          </div>
        </details>
      </form>
    </template>

  </v-modal>
</template>

<script>
import mapping, { datatypes } from "../type-map";

export default {
  name: "v-field-setup",
  props: {
    collectionInfo: {
      type: Object,
      required: true
    },
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
      datatype: null,
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
      validation: null,

      relationInfo: {
        id: null,
        collection_many: null,
        field_many: null,

        collection_one: null,
        field_one: null
      },

      relationInfoM2M: [
        {
          id: null,
          collection_many: null,
          field_many: null,

          collection_one: null,
          field_one: null,

          junction_field: null
        },
        {
          id: null,
          collection_many: null,
          field_many: null,

          collection_one: null,
          field_one: null,

          junction_field: null
        }
      ]
    };
  },
  computed: {
    collections() {
      return this.$store.state.collections;
    },
    interfaces() {
      return this.$store.state.extensions.interfaces;
    },
    databaseVendor() {
      return this.$store.state.serverInfo.databaseVendor;
    },
    selectedInterfaceInfo() {
      if (!this.interfaceName) return null;

      return Object.assign({}, this.interfaces[this.interfaceName]);
    },
    interfaceOptions() {
      if (!this.selectedInterfaceInfo) return null;
      const options = this.selectedInterfaceInfo.options;
      const regular = this.$lodash.pickBy(options, opt => !opt.advanced);
      const advanced = this.$lodash.pickBy(
        options,
        opt => opt.advanced === true
      );

      return { regular, advanced };
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
    availableFieldTypes() {
      if (!this.interfaceName) return [];
      return (
        (this.interfaces[this.interfaceName] &&
          this.interfaces[this.interfaceName].types) ||
        []
      );
    },
    availableDatatypes() {
      if (!this.type) return [];
      if (this.availableFieldTypes.length === 0) return [];
      return mapping[this.type][this.databaseVendor].datatypes;
    },
    selectedDatatypeInfo() {
      return datatypes[this.databaseVendor][this.datatype];
    },
    fieldTypeDescription() {
      if (!this.type) return null;
      return mapping[this.type].description;
    },
    lengthDisabled() {
      if (
        this.selectedDatatypeInfo &&
        this.selectedDatatypeInfo.length === true
      ) {
        return false;
      }

      if (
        this.selectedDatatypeInfo &&
        this.selectedDatatypeInfo.decimal === true
      ) {
        return false;
      }

      return true;
    },
    relation() {
      if (!this.selectedInterfaceInfo) return null;
      if (!this.selectedInterfaceInfo.relation == null) return null;
      return this.selectedInterfaceInfo.relation;
    },
    buttons() {
      let disabled = false;
      if (this.activeTab === "interface" && !this.interfaceName) {
        disabled = true;
      }
      if (this.activeTab === "schema" && !this.field) {
        disabled = true;
      }
      return {
        next: {
          disabled,
          text:
            this.activeTab === "options" ||
            (this.activeTab === "schema" && this.hasOptions === false)
              ? this.$t("save")
              : this.$t("next"),
          loading: this.saving
        }
      };
    },
    tabs() {
      const tabs = {
        interface: {
          text: this.$t("interface")
        },
        schema: {
          text: this.$t("schema"),
          disabled: !(this.interfaceName && this.interfaceName.length > 0)
        }
      };

      if (this.relation) {
        tabs.relation = {
          text: this.$t("relation"),
          disabled: this.schemaDisabled === true || !this.field
        };
      }

      if (
        this.interfaceName &&
        Object.keys(this.selectedInterfaceInfo.options).length > 0
      ) {
        let disabled = this.schemaDisabled === true || !this.field;
        tabs.options = {
          text: this.$t("options"),
          disabled
        };
      }

      return tabs;
    },
    hasOptions() {
      if (
        this.interfaceName &&
        Object.keys(this.interfaces[this.interfaceName].options).length > 0
      )
        return true;

      return false;
    },
    primaryKeyField() {
      return this.$lodash.find(this.collectionInfo.fields, {
        primary_key: true
      });
    },
    currentM2MIndex() {
      const index = this.$lodash.findIndex(this.relationInfoM2M, info => {
        return info.collection_one === this.collectionInfo.collection;
      });

      if (index === -1) return 0;
      return index;
    }
  },
  created() {
    this.useFieldInfo();
    this.initRelation();
  },
  watch: {
    fieldInfo() {
      this.useFieldInfo();
    },
    interfaceName() {
      this.type = this.availableFieldTypes[0];
      this.datatype = this.type
        ? mapping[this.type][this.databaseVendor].default
        : null;

      this.initRelation();
    },
    type(type) {
      if (type) {
        this.datatype = mapping[type][this.databaseVendor].default;
      }
    },
    datatype() {
      if (this.selectedDatatypeInfo.length) {
        this.length = this.selectedDatatypeInfo.defaultLength;
      }

      if (this.selectedDatatypeInfo && this.selectedDatatypeInfo.decimal) {
        this.length =
          this.selectedDatatypeInfo.defaultDigits +
          "," +
          this.selectedDatatypeInfo.defaultDecimals;
      }
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

      if (this.relation) {
        if (this.relation === "m2o") {
          this.relationInfo.field_many = this.field;
        }

        if (this.relation === "o2m") {
          this.relationInfo.field_one = this.field;
        }
      }
    },
    relationInfoM2M: {
      deep: true,
      handler() {
        this.relationInfoM2M[0].junction_field = this.relationInfoM2M[1].field_many;
        this.relationInfoM2M[1].junction_field = this.relationInfoM2M[0].field_many;

        this.relationInfoM2M[this.currentM2MIndex].field_one = this.field;
      }
    },
    relationInfo: {
      deep: true,
      handler() {
        if (this.relation === "o2m") {
          this.getM2OID();
        }
      }
    }
  },
  methods: {
    nextTab() {
      switch (this.activeTab) {
        case "interface":
          this.activeTab = "schema";
          break;
        case "schema":
          if (this.relation) {
            return (this.activeTab = "relation");
          }

          if (this.hasOptions === false) {
            return this.saveField();
          }

          this.activeTab = "options";

          break;
        case "relation":
          if (this.hasOptions === false) {
            return this.saveField();
          }

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
        datatype: this.datatype,
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

      const result = {
        fieldInfo,
        relation: null
      };

      if (this.relation) {
        if (this.relation === "m2o") {
          result.relation = { ...this.relationInfo };
          delete result.relation.field_one;
        }

        if (this.relation === "o2m") {
          result.relation = { ...this.relationInfo };
        }

        if (this.relation === "m2m") {
          result.relation = [...this.relationInfoM2M];
        }
      }

      this.$emit("save", result);
    },
    useFieldInfo() {
      if (!this.fieldInfo) return;

      Object.keys(this.fieldInfo).forEach(key => {
        if (this.fieldInfo[key] != null) this[key] = this.fieldInfo[key];
      });

      // 'interface' is a reserved word in JS, so we need to work around that
      this.interfaceName = this.fieldInfo.interface;
    },
    initRelation() {
      if (!this.relation) return;

      const collection = this.collectionInfo.collection;
      const field = this.field;

      if (this.relation === "m2o") {
        const existingRelation = this.$store.getters.m2o(collection, field);

        if (existingRelation) {
          this.$lodash.forEach(existingRelation, (val, key) => {
            if (key && val && key.startsWith("collection")) {
              return this.$set(this.relationInfo, key, val.collection);
            }

            if (key && val && key.startsWith("field")) {
              return this.$set(this.relationInfo, key, val.field);
            }

            if (val) {
              this.$set(this.relationInfo, key, val);
            }
          });
        } else {
          this.relationInfo.collection_many = this.collectionInfo.collection;
          this.relationInfo.field_many = this.field;
          this.relationInfo.collection_one = Object.values(
            this.$store.state.collections
          )[0].collection;
          this.relationInfo.field_one = this.$lodash.find(
            Object.values(this.$store.state.collections)[0].fields,
            { primary_key: true }
          ).field;
        }
      } else if (this.relation === "o2m") {
        const existingRelation = this.$store.getters.o2m(collection, field);

        if (existingRelation) {
          this.$lodash.forEach(existingRelation, (val, key) => {
            if (key && val && key.startsWith("collection")) {
              return this.$set(this.relationInfo, key, val.collection);
            }

            if (key && val && key.startsWith("field")) {
              return this.$set(this.relationInfo, key, val.field);
            }

            if (val) {
              this.$set(this.relationInfo, key, val);
            }
          });
        } else {
          this.relationInfo.collection_one = this.collectionInfo.collection;
          this.relationInfo.field_one = this.field;

          this.relationInfo.collection_many = Object.values(
            this.$store.state.collections
          )[0].collection;

          this.relationInfo.field_many = this.$lodash.find(
            Object.values(this.$store.state.collections)[0].fields,
            { primary_key: true }
          ).field;

          this.getM2OID();
        }
      } else if (this.relation === "m2m") {
        const existingRelation = this.$store.getters.o2m(collection, field);

        if (field && existingRelation) {
          this.relationInfoM2M[0].id = existingRelation.id;

          this.relationInfoM2M[0].collection_many =
            existingRelation.collection_many.collection;

          this.relationInfoM2M[0].field_many =
            existingRelation.field_many.field;

          this.relationInfoM2M[0].collection_one =
            existingRelation.collection_one.collection;

          this.relationInfoM2M[0].field_one = existingRelation.field_one.field;
          this.relationInfoM2M[0].junction_field =
            existingRelation.junction.field_many.field;

          this.relationInfoM2M[1].id = existingRelation.junction.id;

          this.relationInfoM2M[1].collection_many =
            existingRelation.collection_many.collection;

          this.relationInfoM2M[1].field_many =
            existingRelation.junction.field_many.field;

          this.relationInfoM2M[1].collection_one =
            existingRelation.junction.collection_one.collection;

          this.relationInfoM2M[1].field_one =
            existingRelation.junction.field_one &&
            existingRelation.junction.field_one.field;

          this.relationInfoM2M[1].junction_field =
            existingRelation.field_many.field;
        } else {
          this.relationInfoM2M[0].collection_many = Object.keys(
            this.collections
          )[0];

          this.relationInfoM2M[0].field_many = Object.values(
            Object.values(this.collections)[0].fields
          )[0].field;

          this.relationInfoM2M[0].collection_one = this.collectionInfo.collection;

          this.relationInfoM2M[0].junction_field = Object.values(
            Object.values(this.collections)[0].fields
          )[1].field;

          this.relationInfoM2M[1].collection_many = Object.keys(
            this.collections
          )[0];

          this.relationInfoM2M[1].field_many = Object.values(
            Object.values(this.collections)[0].fields
          )[1].field;

          this.relationInfoM2M[1].collection_one = Object.keys(
            this.collections
          )[1];

          this.relationInfoM2M[1].junction_field = Object.values(
            Object.values(this.collections)[0].fields
          )[0].field;
        }
      }
    },
    getM2OID() {
      const collection = this.relationInfo.collection_many;
      const field = this.relationInfo.field_many;

      const m2o = this.$store.getters.m2o(collection, field);

      if (m2o) {
        this.relationInfo.id = m2o.id;
      } else {
        this.relationInfo.id = null;
      }
    },
    fields(collection) {
      if (!collection) return {};
      return this.collections[collection].fields;
    },
    primaryKeyFieldByCollection(collection) {
      const fields = this.fields(collection);
      return this.$lodash.find(fields, { primary_key: true });
    }
  }
};
</script>

<style lang="scss" scoped>
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

  .name {
    margin-bottom: 20px;
  }

  .advanced-form,
  .name {
    display: grid;
    grid-gap: 20px;
    grid-template-columns: 1fr 1fr;

    .description {
      padding-top: 24px;
      font-style: italic;
      font-size: 12px;
      color: var(--gray);
    }

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

.no-results {
  margin: 20px auto;
  min-height: 0;
}

.required {
  color: var(--accent);
  vertical-align: super;
  font-size: 7px;
}

.single {
  margin-top: 40px;
  display: grid;
  grid-template-areas:
    "a _ b"
    "c _ d"
    "e f g";
  grid-template-columns: 1fr 20px 1fr;
  grid-gap: 10px 0;
  justify-content: center;
  align-items: center;

  p:first-of-type {
    grid-area: a;
  }

  p:last-of-type {
    grid-area: b;
  }

  .select {
    &:first-of-type {
      grid-area: c;
    }

    &:nth-of-type(2) {
      grid-area: e;
    }

    &:nth-of-type(3) {
      grid-area: d;
    }

    &:nth-of-type(4) {
      grid-area: g;
    }
  }

  i {
    grid-area: f;
    font-size: 20px;
    color: var(--light-gray);
  }
}

.full {
  margin-top: 40px;
  display: grid;
  grid-template-areas:
    "a b c d e"
    "f g h i j"
    "k l m n o"
    "p q r s t";
  grid-template-columns: 1fr 20px 1fr 20px 1fr;
  grid-gap: 10px 0;
  justify-content: center;
  align-items: center;

  p:first-of-type {
    grid-area: a;
  }

  p:nth-of-type(2) {
    grid-area: c;
  }

  p:last-of-type {
    grid-area: e;
  }

  .select {
    &:first-of-type {
      grid-area: f;
    }

    &:nth-of-type(2) {
      grid-area: k;
    }

    &:nth-of-type(3) {
      grid-area: h;
    }

    &:nth-of-type(4) {
      grid-area: m;
    }

    &:nth-of-type(5) {
      grid-area: r;
    }

    &:nth-of-type(6) {
      grid-area: j;
    }

    &:nth-of-type(7) {
      grid-area: t;
    }
  }

  i {
    grid-area: l;
    font-size: 20px;
    color: var(--light-gray);

    &:last-of-type {
      grid-area: s;
    }
  }
}
</style>
