<template>
  <v-popover placement="right-start" offset="5">
    <button class="box" :class="[{ none: value === null }, value]">
      <i v-if="value === 'none'" class="material-icons">close</i>
      <i v-else-if="value === 'mine'" class="material-icons">person</i>
      <i v-else-if="value === 'role'" class="material-icons">group</i>
      <i v-else-if="value === 'full'" class="material-icons">check</i>
      <i v-else-if="value === 'indeterminate'" class="material-icons">remove</i>
    </button>
    <template slot="popover">
      <div class="popover-content">
        <button
          v-close-popover
          v-for="option in options"
          :key="option"
          @click="$emit('input', option)">

          <div class="box" :class="option">
            <i v-if="option === 'none'" class="material-icons">close</i>
            <i v-else-if="option === 'mine'" class="material-icons">person</i>
            <i v-else-if="option === 'role'" class="material-icons">group</i>
            <i v-else-if="option === 'full'" class="material-icons">check</i>
          </div>

          <template v-if="option === 'none'">No Items</template>
          <template v-if="option === 'mine'">My Items Only</template>
          <template v-if="option === 'role'">Role Items Only</template>
          <template v-if="option === 'full'">All Items</template>
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
      default: "none",
      validator(val) {
        return ["none", "mine", "role", "full", "indeterminate"].includes(val);
      }
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
