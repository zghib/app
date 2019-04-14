<template>
  <div class="header">
    <div class="row">
      <div class="cell style-4">{{ $t("collection") }}</div>
      <div class="cell style-4">
        <button
          type="button"
          v-tooltip="$t('create')"
          class="cell"
          @click="$emit('toggle-all', 'create')"
        >
          <i class="material-icons">add_circle</i>
        </button>
      </div>
      <div class="cell style-4">
        <button
          type="button"
          v-tooltip="$t('read')"
          class="cell"
          @click="$emit('toggle-all', 'read')"
        >
          <i class="material-icons">visibility</i>
        </button>
      </div>
      <div class="cell style-4">
        <button
          type="button"
          v-tooltip="$t('update')"
          class="cell"
          @click="$emit('toggle-all', 'update')"
        >
          <i class="material-icons">edit</i>
        </button>
      </div>
      <div class="cell style-4">
        <button
          type="button"
          v-tooltip="$t('delete')"
          class="cell"
          @click="$emit('toggle-all', 'delete')"
        >
          <i class="material-icons">delete</i>
        </button>
      </div>
      <div class="cell style-4">
        <button
          type="button"
          v-tooltip="$t('comment')"
          class="cell"
          @click="$emit('toggle-all', 'comment')"
        >
          <i class="material-icons">comment</i>
        </button>
      </div>
      <!-- <div class="cell">{{ $t("explain") }}</div> -->
      <div class="cell style-4">{{ $t("fields") }}</div>
      <div class="cell style-4">{{ $t("statuses") }}</div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.header {
  height: 60px;
  .row {
    display: flex;
    align-items: center;
    padding: 10px;
    height: 60px;
    .material-icons {
      margin-left: -2px;
    }
  }

  button {
    transition: color var(--fast) var(--transition);
  }

  button:hover {
    transition: none;
    color: var(--dark-gray);
  }
}
</style>
