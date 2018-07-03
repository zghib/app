<template>
  <div class="v-activity-overview">
    <form
      v-show="show !== 'activity'"
      class="new-comment"
      @submit.prevent="postComment">

      <v-textarea
        v-model="comment"
        class="textarea"
        :rows="5"
        required
        :placeholder="$t('leave_comment')" />

      <button type="submit">{{ $t('submit') }}</button>
    </form>

    <article
      v-for="(activity, index) in activityWithChanges"
      class="activity-item"
      :key="activity.id">
      <i
        v-if="activity.type === 'comment'"
        class="material-icons">message</i>
      <span
        v-else
        :title="activity.action"
        :class="activity.action"
        class="indicator" />

      <div class="content">
        <details v-if="activity.action !== 'external' && activity.changes && activity.name">
          <summary class="title">{{ activity.name }}<span v-if="activity.date">•</span><v-timeago
            v-if="activity.date"
            :auto-update="1"
            :since="activity.date"
            :locale="$i18n.locale"
            class="date" />
          <i class="material-icons chevron">chevron_left</i></summary>
          <div v-if="activity.changes">
            <div
              v-for="({ field, before, after }) in activity.changes"
              class="change"
              :key="field">
              <p>{{ $helpers.formatTitle(field) }}</p>
              <div class="diff">
                <div
                  :class="{ empty: !before }"
                  class="before">{{ before || '--' }}</div>
                <div
                  :class="{ empty: !after }"
                  class="after">{{ after || '--' }}</div>
              </div>
            </div>
            <button
              v-if="index !== 0"
              class="revert">{{ $t("revert") }}</button>
          </div>
        </details>
        <div class="title" v-else-if="activity.name">{{ activity.name }}<span v-if="activity.date">•</span><v-timeago
          v-if="activity.date"
          :auto-update="1"
          :since="activity.date"
          :locale="$i18n.locale"
          class="date" /></div>
        <p v-if="activity.htmlcomment" v-html="activity.htmlcomment"></p>
      </div>
    </article>
  </div>
</template>

<script>
import snarkdown from "snarkdown";
import EditForm from "../edit-form/edit-form.vue";

export default {
  name: "v-activity-overview",
  components: {
    EditForm
  },
  data() {
    return {
      comment: ""
    };
  },
  props: {
    activity: {
      type: Array,
      required: true
    },
    revisions: {
      type: Object,
      required: true
    },
    loading: {
      type: Boolean,
      default: false
    },
    show: {
      type: String,
      default: "both"
    }
  },
  computed: {
    activityFiltered() {
      switch (this.show) {
        case "comments":
          return this.activity.filter(item => item.comment !== null);
        case "activity":
          return this.activity.filter(item => item.comment === null);
        case "both":
        default:
          return this.activity;
      }
    },
    activityWithChanges() {
      const activityWithChanges = this.activityFiltered.map((activity, i) => ({
        ...activity,
        changes: this.getChanges(activity.id, i),
        revision: this.revisions[activity.id]
      }));

      const lastItem =
        activityWithChanges &&
        activityWithChanges[activityWithChanges.length - 1];

      if (
        !lastItem ||
        ((lastItem.type.toLowerCase() !== "entry" ||
          lastItem.action.toLowerCase() !== "add") &&
          this.show !== "comments")
      ) {
        activityWithChanges.push({
          action: "external",
          comment: this.$t("activity_outside_directus"),
          id: -1
        });
      }

      return activityWithChanges.map(activity => ({
        ...activity,
        htmlcomment: snarkdown((activity.comment || "").replace(/#/g, "") || "")
      }));
    }
  },
  methods: {
    getChanges(activityID, index) {
      const revision = this.revisions[activityID];

      if (!revision) return null;

      let previousUpdate = null;

      for (let i = index + 1; i < this.activityFiltered.length; i++) {
        if (
          this.activityFiltered[i].action === "update" ||
          this.activityFiltered[i].action === "add"
        ) {
          previousUpdate = this.activityFiltered[i];
          break;
        }
      }

      if (!previousUpdate) return null;

      const previousRevision = this.revisions[previousUpdate.id];
      const previousData = previousRevision.data;
      const currentDelta = revision.delta;

      return this.$lodash.mapValues(currentDelta, (value, field) => ({
        before: previousData[field],
        after: value,
        field
      }));
    },
    postComment() {
      this.$emit("input", this.comment);
      this.comment = "";
    }
  }
};
</script>

<style lang="scss" scoped>
.v-activity-overview {
  position: relative;

  &::before {
    content: "";
    position: absolute;
    left: 6px;
    height: 100%;
    width: 1px;
    background-color: var(--lightest-gray);
    z-index: -1;
  }

  .indicator {
    position: relative;
    top: 1px;
    display: inline-block;
    width: 13px;
    height: 13px;
    border-radius: 50%;
    border: 2px solid;
    background-color: var(--white);
    box-shadow: 0 0 0 5px var(--white);
    flex-shrink: 0;

    &.update {
      border-color: var(--action);
    }
    &.delete {
      border-color: var(--danger);
    }
    &.add {
      border-color: var(--success);
    }
    &.external {
      border-color: var(--gray);
    }
  }

  i.material-icons {
    width: 13px;
    background-color: var(--white);
    font-size: 20px;
    transform: translateX(-2px);
    height: 20px;
  }

  article {
    display: flex;
    margin-bottom: 40px;
  }

  .content {
    margin-left: 10px;
    flex-grow: 1;

    .title {
      list-style-type: none;

      &::-webkit-details-marker {
        display: none;
      }

      span,
      .date {
        color: var(--light-gray);
      }

      span {
        margin: 0 5px;
      }
    }

    summary {
      cursor: pointer;

      .chevron {
        float: right;
        color: var(--lighter-gray);
        transition: transform var(--fast) var(--transition);
      }
    }

    > *:not(:first-child) {
      margin-top: 10px;
    }

    .change {
      width: 100%;
      margin-top: 20px;

      p {
        margin-bottom: 10px;
      }

      .diff {
        width: 100%;
        border-radius: var(--border-radius);
        overflow: hidden;

        > div {
          width: 100%;
          padding: 4px;
        }
      }

      .before {
        color: var(--danger);
        background-color: #fdefed;
      }

      .after {
        color: var(--success);
        background-color: #f6faf0;
      }

      .empty {
        background-color: var(--lightest-gray);
        color: var(--gray);
      }
    }

    .revert {
      color: var(--action);
      margin-top: 20px;
    }
  }

  details[open] .chevron {
    transform: rotate(-90deg);
  }
}

.new-comment {
  position: relative;
  height: var(--input-height);
  transition: height var(--slow) var(--transition);
  margin-bottom: 30px;

  .textarea {
    height: 100%;
    resize: none;
    box-shadow: 0px 5px 0px 0px rgba(255, 255, 255, 1);
  }

  button {
    position: absolute;
    bottom: 10px;
    right: 10px;
    color: var(--light-gray);
    text-transform: uppercase;
    font-weight: 700;
    font-size: 0.875rem;
    transition: var(--fast) var(--transition);
    transition-property: color, opacity;
    opacity: 0;
  }

  &:valid button {
    color: var(--accent);
  }

  &:focus,
  &:focus-within {
    height: calc(3 * var(--input-height));

    button {
      opacity: 1;
    }
  }
}
</style>
