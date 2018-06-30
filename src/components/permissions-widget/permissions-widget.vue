<template>
  <div class="permissions-widget">
    <v-permissions-widget-header />

    <div class="body">
      <v-permissions-widget-row
        v-for="(permission, name) in permissions"
        :permission="permission"
        :permission-name="name"
        :statuses="(statuses[name] || {}).mapping"
        :key="name"
        :fields="fields[name]"
        @input="$emit('input', $event)" />
    </div>
  </div>
</template>

<script>
import VPermissionsWidgetHeader from "./permissions-widget-header.vue";
import VPermissionsWidgetRow from "./permissions-widget-row.vue";

export default {
  name: "permissions-widget",
  components: {
    VPermissionsWidgetHeader,
    VPermissionsWidgetRow
  },
  props: {
    permissions: {
      type: Object,
      required: true
    },
    statuses: {
      type: Object,
      required: true
    },
    fields: {
      type: Object,
      required: true
    }
  }
};
</script>

<style lang="scss" scoped>
.permissions-widget {
  background-color: var(--white);
  border-radius: var(--border-radius);
  border: var(--input-border-width) solid var(--lighter-gray);
  max-width: 1000px;

  /deep/ .row {
    display: flex;
    align-items: center;
    padding: 10px;

    &.sub {
      &::before {
        content: "call_missed_outgoing";
        font-family: "Material Icons";
        position: absolute;
        transform: rotate(45deg);
        font-size: 18px;
        color: var(--lighter-gray);
      }

      & .cell:first-child {
        padding-left: 2rem;
      }
    }

    &:not(.sub) {
      border-top: 1px solid var(--lightest-gray);
    }
  }

  /deep/ .cell {
    flex-basis: 70px;

    &:first-child {
      flex-grow: 2;
    }

    &:nth-last-child(3),
    &:nth-last-child(2),
    &:last-child {
      flex-grow: 1;
    }
  }
}
</style>
