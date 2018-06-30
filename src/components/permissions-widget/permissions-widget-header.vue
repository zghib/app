<template functional>
  <div class="header">
    <div class="row">
      <div class="cell">
        <div>{{ parent.$t("collection") }}</div>
      </div>
      <div class="cell">
        <div>{{ parent.$t("create") }}</div>
      </div>
      <div class="cell">
        <div>{{ parent.$t("read") }}</div>
      </div>
      <div class="cell">
        <div>{{ parent.$t("update") }}</div>
      </div>
      <div class="cell">
        <div>{{ parent.$t("delete") }}</div>
      </div>
      <div class="cell">
        <div>{{ parent.$t("comment") }}</div>
      </div>
      <div class="cell">
        <div>{{ parent.$t("fields") }}</div>
      </div>
      <div class="cell">
        <div>{{ parent.$t("allowed_statuses") }}</div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.header {
  border-bottom: 1px solid var(--lightest-gray);

  .cell {
    text-transform: uppercase;
    font-size: 10px;
    color: var(--gray);
    font-weight: 700;
  }
}
</style>
