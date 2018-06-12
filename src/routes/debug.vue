<template>
  <div class="debug">
    <v-header-bar title="Debug whatever yo" />
    <v-item-listing
      :collection="collection"
      :filters="filters"
      :search-query="searchQuery"
      :view-query="viewQuery"
      :view-type="viewType"
      :view-options="viewOptions"
      :selection="selection"
      links
      @fetch="meta = $event"
      @options="viewOptions = $event"
      @select="selection = $event"
      @query="viewQuery = $event" />
  </div>
</template>

<script>
export default {
  data() {
    return {
      collection: "movies",
      filters: [],
      searchQuery: "",
      viewQuery: {},
      viewType: "tabular",
      viewOptions: {},
      selection: [],
      meta: {}
    };
  }
};
</script>
