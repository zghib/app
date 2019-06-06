<template>
  <div>
    <div v-if="showLabel" class="name">
      {{ field.name || $helpers.formatTitle(field.field) }}
      <v-icon
        v-if="field.required !== false"
        name="star"
        color="light-gray"
        sup
        class="material-icons"
      />
      <v-icon
        v-if="field.note"
        v-tooltip="$helpers.snarkdown(field.note)"
        name="info"
        size="18"
        icon-style="outline"
        class="note"
      />
      <v-toggle
        v-if="batchMode"
        class="batch-toggle"
        :value="!blocked"
        @input="$emit(blocked ? 'activate' : 'deactivate', field.field)"
      />
    </div>

    <div class="field">
      <v-ext-input
        :id="field.interface || 'text-input'"
        :name="name"
        :required="field.required"
        :readonly="field.readonly || blocked"
        :options="field.options"
        :type="field.type"
        :datatype="field.datatype"
        :value="values[field.field]"
        :relation="relation"
        :fields="fields"
        :collection="collection"
        :values="values"
        :length="field.length"
        :new-item="newItem"
        @input="
          $emit('stage-value', {
            field: field.field,
            value: $event
          })
        "
        @setfield="
          $emit('stage-value', {
            field: $event.field,
            value: $event.value
          })
        "
      />
    </div>
  </div>
</template>

<script>
export default {
  name: "VField",
  props: {
    name: {
      type: String,
      required: true
    },
    field: {
      type: Object,
      required: true
    },
    fields: {
      type: Object,
      required: true
    },
    values: {
      type: Object,
      required: true
    },
    collection: {
      type: String,
      default: null
    },
    blocked: {
      type: Boolean,
      default: false
    },
    batchMode: {
      type: Boolean,
      default: false
    },
    newItem: {
      type: Boolean,
      default: false
    }
  },

  computed: {
    showLabel() {
      const interfaceName = this.field.interface;
      const interfaceMeta = this.getInterfaceMeta(interfaceName);

      // In case the current field doesn't have an interface setup
      if (!interfaceMeta) return true;

      const hideLabel = interfaceMeta.hideLabel;

      if (hideLabel === true) return false;

      return true;
    },

    relation() {
      const { collection, field, type } = this.field;

      if (type.toLowerCase() === "m2o") return this.$store.getters.m2o(collection, field);
      if (type.toLowerCase() === "o2m") return this.$store.getters.o2m(collection, field);
      if (type.toLowerCase() === "translation") return this.$store.getters.o2m(collection, field);
      return null;
    }
  },

  methods: {
    getInterfaceMeta(interfaceName) {
      const interfaceMeta = this.$store.state.extensions.interfaces[interfaceName];

      return interfaceMeta || undefined;
    }
  }
};
</script>

<style lang="scss" scoped>
.name {
  font-size: var(--size-2);
  margin-bottom: 10px;
  color: var(--darkest-gray);
}

.note {
  color: var(--lighter-gray);
  vertical-align: -4px;
  cursor: help;
}

.batch-toggle {
  display: inline-block;
  vertical-align: -4px;
  margin-left: 4px;
}
</style>
