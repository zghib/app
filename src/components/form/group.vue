<template>
  <v-ext-input
    :id="field.field"
    :name="field.field"
    :options="field.options"
    :type="field.type"
    class="v-group">
    <div class="flex-group">
      <div
        v-for="child in field.children"
        :class="[
          isGroup(child) ? null : `col-${child.width}`,
          isGroup(child) ? 'group' : 'field'
        ]"
        :key="child.field">
        <v-group
          v-if="isGroup(child)"
          :values="values"
          :field="child"
          :new-item="newItem"
          @stage-value="$emit('stageValue', $event)" />
        <v-field
          v-else
          :readonly="readonly"
          :values="values"
          :field="child"
          :blocked="batchMode && !activeFields.includes(field.field)"
          :batch-mode="batchMode"
          :new-item="newItem"
          @activate="$emit('activate', $event)"
          @deactivate="$emit('deactivate', $event)"
          @stage-value="$emit('stageValue', $event)" />
      </div>
    </div>
  </v-ext-input>
</template>

<script>
import VField from "./field.vue";

export default {
  name: "v-group",
  components: {
    VField
  },
  props: {
    values: {
      type: Object,
      required: true
    },
    field: {
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
    },
    activeFields: {
      type: Array,
      default: () => []
    }
  },
  methods: {
    isGroup(field) {
      return field.children && Array.isArray(field.children);
    }
  }
};
</script>
