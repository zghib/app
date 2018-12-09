<template>
  <v-popover placement="right-start" offset="5">
    <button class="box" :class="[{ none: value === null }, value]">
      <i v-if="value === 'none'" class="material-icons">close</i>
      <i v-else-if="value === 'mine'" class="material-icons">person</i>
      <i v-else-if="value === 'role'" class="material-icons">group</i>
      <i v-else-if="value === 'full'" class="material-icons">check</i>
      <i v-else-if="value === 'read'" class="material-icons">remove_red_eye</i>
      <i v-else-if="value === 'create'" class="material-icons">add</i>
      <i v-else-if="value === 'update'" class="material-icons">edit</i>
      <i v-else-if="value === 'always'" class="material-icons">announcement</i>
      <i v-else-if="value === 'indeterminate'" class="material-icons">remove</i>
    </button>
    <template slot="popover">
      <div class="popover-content">
        <button
          v-close-popover
          v-for="option in options"
          :key="option"
          @click="$emit('input', option);"
        >
          <div class="box" :class="option">
            <i v-if="option === 'none'" class="material-icons">close</i>
            <i v-else-if="option === 'mine'" class="material-icons">person</i>
            <i v-else-if="option === 'role'" class="material-icons">group</i>
            <i v-else-if="option === 'full'" class="material-icons">check</i>
            <i v-else-if="option === 'read'" class="material-icons"
              >remove_red_eye</i
            >
            <i v-else-if="option === 'create'" class="material-icons">add</i>
            <i v-else-if="option === 'update'" class="material-icons">edit</i>
            <i v-else-if="option === 'always'" class="material-icons"
              >announcement</i
            >
          </div>

          <template v-if="option === 'none'">{{
            $t("permission_states.none")
          }}</template>
          <template v-if="option === 'mine'">{{
            $t("permission_states.mine")
          }}</template>
          <template v-if="option === 'role'">{{
            $t("permission_states.role")
          }}</template>
          <template v-if="option === 'full'">{{
            $t("permission_states.full")
          }}</template>
          <template v-if="option === 'read'">{{
            $t("permission_states.read")
          }}</template>
          <template v-if="option === 'create'">{{
            $t("permission_states.create")
          }}</template>
          <template v-if="option === 'update'">{{
            $t("permission_states.update")
          }}</template>
          <template v-if="option === 'always'">{{
            $t("permission_states.always")
          }}</template>
        </button>
      </div>
    </template>
  </v-popover>
</template>

<script>
export default {
  name: "permission-toggle",
  props: {
    options: {
      type: Array,
      default: () => []
    },
    value: {
      type: String,
      default: "none"
    }
  }
};
</script>

<style lang="scss" scoped>
.box {
  width: 18px;
  height: 18px;
  border: 2px solid;
  border-radius: 2px;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: var(--fast) var(--transition);
  position: relative;
}

i {
  position: relative;
  top: -1px;
  left: -0.5px;
  font-size: 16px;
  color: var(--white);
}

.none {
  border-color: var(--red);
}

.mine {
  background-color: var(--orange);
  border-color: var(--orange);
}

.role {
  background-color: var(--yellow-700);
  border-color: var(--yellow-700);
}

.full {
  background-color: var(--accent);
  border-color: var(--accent);
}

.read {
  background-color: var(--orange);
  border-color: var(--orange);
}

.create {
  background-color: var(--yellow-700);
  border-color: var(--yellow-700);
}

.update {
  background-color: var(--success);
  border-color: var(--success);
}

.always {
  background-color: var(--warning);
  border-color: var(--warning);
}

.indeterminate {
  background-color: var(--light-gray);
  border-color: var(--light-gray);
}

.popover-content {
  button {
    display: flex;
    align-items: center;
    text-transform: uppercase;
    font-weight: 700;
    font-size: 12px;
    color: var(--light-gray);

    // Hack to fix misaligned icons
    i {
      top: 0;
      left: 0;
    }

    &:hover {
      color: var(--dark-gray);
    }
  }

  .box {
    margin: 5px 10px 5px 0;
  }
}
</style>
