<template>
  <div class="nav-bookmarks">
    <h3 v-if="bookmarks && bookmarks.length > 0" class="style-4">
      {{ $t("bookmarks") }}
    </h3>
    <nav
      v-if="bookmarks && bookmarks.length > 0"
      :class="{ 'no-border': noBorder }"
    >
      <ul>
        <li v-for="bookmark in bookmarks" :key="bookmark.id" class="bookmark">
          <router-link
            class="no-wrap"
            :to="`/bookmarks/${bookmark.collection}/${bookmark.id}`"
          >
            <i class="material-icons icon">bookmark_outline</i
            >{{ bookmark.title }}
          </router-link>
          <button
            v-tooltip="$t('delete_bookmark')"
            @click="
              confirmRemove = true;
              toBeDeletedBookmark = bookmark.id;
            "
          >
            <i class="material-icons">remove_circle_outline</i>
          </button>
        </li>
      </ul>
    </nav>
    <portal to="modal" v-if="confirmRemove">
      <v-confirm
        :message="$t('delete_bookmark_body')"
        @cancel="confirmRemove = false;"
        @confirm="deleteBookmark"
      />
    </portal>
  </div>
</template>

<script>
export default {
  name: "nav-bookmarks",
  props: {
    bookmarks: {
      type: Array,
      required: true
    },
    noBorder: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      confirmRemove: false,
      toBeDeletedBookmark: null
    };
  },
  methods: {
    deleteBookmark() {
      this.$store.dispatch("deleteBookmark", this.toBeDeletedBookmark);
      this.confirmRemove = false;
      this.toBeDeletedBookmark = null;
    }
  }
};
</script>

<style lang="scss" scoped>
h3 {
  margin-bottom: 5px;
  margin-top: 15px;
}

.icon {
  font-size: 18px;
  width: 15px;
  height: 18px;
  margin-right: 10px;
  color: var(--light-gray);
  fill: var(--light-gray);

  /* Forces left-alignment of material-icons */
  display: inline-flex;
  justify-content: flex-end;
  align-items: center;
  vertical-align: -5px;
}

i,
svg {
  transition: var(--fast) var(--transition);
}

.bookmark button:first-child:hover,
.user-menu button:hover {
  color: var(--accent);

  i,
  svg {
    color: var(--accent);
    fill: var(--accent);
  }

  &::before {
    content: "";
    position: absolute;
    height: 100%;
    width: 3px;
    background-color: var(--accent);
    left: -20px;
    top: 0;
  }
}

ul {
  list-style: none;
  padding: 0;
}

nav > ul > li > * {
  padding: 5px 0;
}

nav:not(.no-border) {
  padding-bottom: 10px;
  margin-bottom: 10px;
  border-bottom: 1px solid var(--lightest-gray);
}

.bookmark {
  display: flex;
  align-items: center;

  > * {
    display: block;
  }

  & a {
    flex-grow: 1;
    text-align: left;
    text-decoration: none;

    &:hover {
      color: var(--accent);

      i {
        color: var(--accent);
      }
    }
  }

  & button {
    opacity: 0;
    transition: opacity var(--fast) var(--transition);
    display: flex;

    i {
      font-size: 18px;
      vertical-align: baseline;
      color: var(--lighter-gray);
    }

    &:hover i {
      color: var(--danger);
    }
  }

  &:hover button:last-child {
    opacity: 1;
  }
}
</style>
