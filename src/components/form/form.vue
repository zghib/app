<template>
  <v-error
    v-if="fieldsGrouped.length === 0"
    :title="$t('no_fields')"
    :body="$t('no_fields_body')"
    icon="error_outline" />
  <form v-else class="v-form flex-group">
    <div
      v-for="field in fieldsGrouped"
      :class="[
        isGroup(field) ? null : `col-${field.view_width || 4}`,
        isGroup(field) ? 'group' : 'field'
      ]"
      :key="field.field">
      <v-group
        v-if="isGroup(field)"
        :values="values"
        :field="field"
        :readonly="readonly"
        :batch-mode="batchMode"
        :active-fields="activeFields"
        @activate="activateField"
        @deactivate="deactivateField"
        @stage-value="$emit('stage-value', $event)" />
      <v-field
        v-else
        :field="field"
        :values="values"
        :fields="fields"
        :readonly="readonly || (field.readonly === true || field.readonly === '1')"
        :blocked="batchMode && !activeFields.includes(field.field)"
        :batch-mode="batchMode"
        @activate="activateField"
        @deactivate="deactivateField"
        @stage-value="$emit('stage-value', $event)" />
    </div>
  </form>
</template>

<script>
import VField from "./field.vue";
import VGroup from "./group.vue";
import VError from "../error.vue";

export default {
  name: "v-form",
  components: {
    VField,
    VGroup,
    VError
  },
  props: {
    fields: {
      type: Object,
      required: true
    },
    values: {
      type: Object,
      required: true
    },
    readonly: {
      type: Boolean,
      default: false
    },
    batchMode: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      activeFields: []
    };
  },
  computed: {
    fieldsGrouped() {
      const fieldsArray = Object.values(this.fields);

      const result = fieldsArray
        .filter(field => field.type.toLowerCase() === "group")
        .map(group => ({
          ...group,
          children: []
        }));

      const nonGroupFields = fieldsArray.filter(
        field => field.type.toLowerCase() !== "group"
      );

      nonGroupFields.forEach(field => {
        if (field.group != null) {
          const groupIndex = this.$lodash.findIndex(
            result,
            group => group.id === field.group
          );
          return result[groupIndex].children.push(field);
        }

        return result.push(field);
      });

      return result.filter(
        field => field.hidden_input === false || field.hidden_input === "0"
      );
    }
  },
  methods: {
    isGroup(field) {
      return field.children && Array.isArray(field.children);
    },
    activateField(field) {
      if (!this.batchMode) return;

      this.activeFields = [...this.activeFields, field];
    },
    deactivateField(field) {
      if (!this.batchMode) return;

      this.activeFields = this.activeFields.filter(
        activeField => activeField !== field
      );
      this.$emit("unstage-value", field);
    }
  }
};
</script>

<style lang="scss">
.v-form {
  width: 100%;
  max-width: 800px;

  @media (min-width: 800px) {
    &.flex-group,
    .flex-group {
      display: flex;
      flex-wrap: wrap;
      & > * {
        flex-shrink: 0;
        flex-basis: 0;
      }
    }

    .col-1 {
      flex-basis: 25%;
    }

    .col-2 {
      flex-basis: 50%;
    }

    .col-3 {
      flex-basis: 75%;
    }

    .col-4 {
      flex-basis: 100%;
    }
  }

  .field,
  .group {
    margin-bottom: 30px;
  }

  .group {
    flex-basis: 100%;
  }
}
</style>
