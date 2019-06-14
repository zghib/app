<template>
  <div class="input-single-file">
    <template v-if="file">
      <v-file-preview
        :value="file"
        :subtitle="subtitle + subtitleExtra"
        :readonly="readonly"
        :required="required"
        :options="filePreviewOptions"
        :editor="options.edit && options.edit.includes('image_editor')"
        @remove="$emit('input', null)"
      ></v-file-preview>
    </template>
    <template v-else>
      <v-button type="button" :disabled="readonly" @click="newFile = true">
        <v-icon name="add" />
        {{ $t("new_file") }}
      </v-button>
      <v-button type="button" :disabled="readonly" @click="existing = true">
        <v-icon name="playlist_add" />
        {{ $t("existing") }}
      </v-button>
    </template>

    <portal v-if="newFile" to="modal">
      <v-modal
        :title="$t('file_upload')"
        :buttons="{
          done: {
            text: $t('done')
          }
        }"
        @close="newFile = false"
      >
        <div class="body">
          <v-upload :accept="options.accept" :multiple="false" @upload="saveUpload"></v-upload>
        </div>
      </v-modal>
    </portal>

    <portal v-if="existing" to="modal">
      <v-modal
        :title="$t('choose_one')"
        :buttons="{
          done: {
            text: $t('done')
          }
        }"
        action-required
        @close="existing = false"
        @done="existing = false"
      >
        <div class="search">
          <v-input
            type="search"
            :placeholder="$t('search')"
            class="search-input"
            @input="onSearchInput"
          />
        </div>
        <v-items
          class="items"
          collection="directus_files"
          :view-type="viewType"
          :selection="file ? [file] : []"
          :filters="filters"
          :view-query="viewQuery"
          :view-options="viewOptions"
          @options="setViewOptions"
          @query="setViewQuery"
          @select="$emit('input', $event[$event.length - 1])"
        ></v-items>
      </v-modal>
    </portal>
  </div>
</template>

<script>
import mixin from "@directus/extension-toolkit/mixins/interface";
import formatSize from "../file-size/format-size";

export default {
  mixins: [mixin],
  data() {
    return {
      newFile: false,
      existing: false,

      viewOptionsOverride: {},
      viewTypeOverride: null,
      viewQueryOverride: {},
      filtersOverride: []
    };
  },
  computed: {
    file() {
      // needed to overcome incompatibility between directus_files and normal collection detail view
      // TODO: investigate why directus_files is still incompatible with normal collection view
      if (this.value !== null) return this.value;
      if (this.values !== null && this.values.filesize && this.values.filename) return this.values;
      return null;
    },
    filePreviewOptions() {
      if (!this.options || !this.options.edit) return {};
      return {
        remove: {
          text: this.$t("delete"),
          icon: "delete"
        }
      };
    },
    subtitle() {
      if (!this.file) return "";

      return (
        this.file.filename.split(".").pop() +
        " • " +
        this.$d(new Date(this.file.uploaded_on), "short")
      );
    },
    subtitleExtra() {
      // Image ? -> display dimensions and formatted filesize
      return this.file.type && this.file.type.startsWith("image")
        ? " • " +
            this.file.width +
            " x " +
            this.file.height +
            " (" +
            formatSize(this.file.filesize) +
            ")"
        : "";
    },
    viewOptions() {
      const viewOptions = this.options.viewOptions;
      return {
        ...viewOptions,
        ...this.viewOptionsOverride
      };
    },
    viewType() {
      if (this.viewTypeOverride) return this.viewTypeOverride;
      return this.options.viewType;
    },
    viewQuery() {
      const viewQuery = this.options.viewQuery;
      return {
        ...viewQuery,
        ...this.viewQueryOverride
      };
    },
    fileTypeFilters() {
      if (
        !this.options.accept ||
        this.filtersOverride.length > 0 ||
        this.options.filters.some(filter => filter.field === "type")
      ) {
        return [];
      }

      return [
        {
          field: "type",
          operator: "in",
          value: this.options.accept.trim().split(/,\s*/)
        }
      ];
    },
    filters() {
      return [...this.options.filters, ...this.fileTypeFilters, ...this.filtersOverride];
    }
  },
  created() {
    this.onSearchInput = _.debounce(this.onSearchInput, 200);
  },
  methods: {
    saveUpload(fileInfo) {
      this.$emit("input", fileInfo.data);
      this.newFile = false;
    },
    setViewOptions(updates) {
      this.viewOptionsOverride = {
        ...this.viewOptionsOverride,
        ...updates
      };
    },
    setViewQuery(updates) {
      this.viewQueryOverride = {
        ...this.viewQueryOverride,
        ...updates
      };
    },
    onSearchInput(value) {
      this.setViewQuery({
        q: value
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.input-single-file {
  margin-bottom: 20px;
  max-width: var(--width-x-large);
}

button {
  display: inline-block;
  margin-left: 20px;
  &:first-of-type {
    margin-left: 0;
  }
}

.body {
  padding: 20px;
}

.items {
  height: calc(100% - var(--header-height) - 1px);
}
</style>
