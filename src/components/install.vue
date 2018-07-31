<template>
  <v-modal :buttons="buttons" @next="nextTab" action-required>

    <div class="tabs">
      <button
        :class="{ active: activeTab === 'project' }"
        @click="activeTab = 'project'">{{ $t('project') }}</button>
      <button
        :class="{ active: activeTab === 'database' }"
        @click="activeTab = 'database'"
        :disabled="databaseDisabled">{{ $t('database') }}</button>
    </div>

    <div class="tab" v-show="activeTab === 'project'">
      <h1 class="style-0">{{ $t("project_info") }}</h1>
      <p>
        {{ $t("project_info_copy" )}}
      </p>

      <form @submit.prevent>
        <label>
          {{ $t("project_name") }}
          <v-input class="input" id="project-name" v-model="values.project_name" />
        </label>
        <label>
          {{ $t("environment") }}
          <v-input class="input" id="environment" disabled value="Default ( _ )" />
        </label>
        <label>
          {{ $t("admin_email") }}
          <v-input class="input" id="admin-email" type="email" v-model="values.user_email" />
        </label>
        <label>
          {{ $t("admin_password") }}
          <v-input class="input" id="admin-password" type="password" v-model="values.user_password" autocomplete="new-password" />
        </label>
      </form>
    </div>

    <div class="tab" v-show="activeTab === 'database'">
      <h1 class="style-0">{{ $t("database_connection") }}</h1>
      <p>{{ $t("database_connection_copy") }}</p>
      <form @submit.prevent>
        <label>
          {{ $t("host") }}
          <v-input class="input" id="db_host" v-model="values.db_host" />
        </label>
        <label>
          {{ $t("port") }}
          <v-input class="input" id="db_port" v-model="values.db_port" />
        </label>
        <label>
          {{ $t("db_user") }}
          <v-input class="input" id="db_user" v-model="values.db_user" />
        </label>
        <label>
          {{ $t("db_password") }}
          <v-input type="password" class="input" id="db_password" v-model="values.db_password" />
        </label>
        <label>
          {{ $t("db_name") }}
          <v-input class="input" id="db_name" v-model="values.db_name" />
        </label>
        <label>
          {{ $t("db_type") }}
          <v-input class="input" disabled id="db_type" value="MySQL & Variants" />
        </label>
      </form>
    </div>

  </v-modal>
</template>

<script>
export default {
  name: "v-install",
  data() {
    return {
      activeTab: "project",
      saving: false,

      values: {
        db_host: "localhost",
        db_port: 3306,
        db_name: "directus",
        db_user: "root",
        db_password: null,
        user_email: null,
        user_password: null,
        project_name: "Directus",
        cors_enabled: true
      }
    };
  },
  computed: {
    databaseDisabled() {
      const { isEmpty } = this.$lodash;
      const { project_name, user_email, user_password } = this.values;

      return (
        isEmpty(project_name) || isEmpty(user_email) || isEmpty(user_password)
      );
    },
    schemaDisabled() {
      const { isEmpty } = this.$lodash;
      const { db_host, db_port, db_name, db_user, db_password } = this.values;

      return (
        isEmpty(db_host) ||
        isEmpty(db_port) ||
        isEmpty(db_name) ||
        isEmpty(db_user) ||
        isEmpty(db_password)
      );
    },
    buttons() {
      let disabled = false;

      if (this.activeTab === "project" && this.databaseDisabled)
        disabled = true;

      return {
        next: {
          disabled,
          text:
            this.activeTab === "database" ? this.$t("save") : this.$t("next"),
          loading: this.saving
        }
      };
    }
  },
  methods: {
    nextTab() {
      switch (this.activeTab) {
        case "project":
          this.activeTab = "database";
          break;
        case "database":
        default:
          this.save();
          break;
      }
    },
    save() {
      this.saving = true;
      this.$emit("install", this.values);
    }
  }
};
</script>

<style lang="scss" scoped>
.tab {
  padding: 30px;

  .style-0 {
    max-width: 80%;
    margin-bottom: 30px;
  }

  p {
    line-height: 2;
    max-width: 70%;
  }
}

.tabs {
  display: flex;
  padding: 0;
  list-style: none;
  justify-content: center;
  border-bottom: 1px solid var(--lightest-gray);
  position: sticky;
  top: 0;
  background-color: var(--white);
  z-index: +1;

  button {
    flex-grow: 1;
    flex-shrink: 1;
    max-width: 120px;
    flex-basis: 120px;
    height: 50px;
    position: relative;
    color: var(--gray);

    text-decoration: none;
    text-transform: uppercase;
    font-size: 12px;
    font-weight: 700;
    position: relative;

    &:hover {
      color: var(--darker-gray);
    }

    &::after {
      content: "";
      display: block;
      width: 100%;
      position: absolute;
      height: 3px;
      bottom: -2px;
      background-color: var(--accent);
      transform: scaleY(0);
      transition: transform var(--fast) var(--transition-out);
    }

    &.active {
      color: var(--accent);

      &::after {
        transform: scaleY(1);
        transition: transform var(--fast) var(--transition-in);
      }
    }

    &[disabled] {
      color: var(--lighter-gray);
      cursor: not-allowed;
    }
  }
}

form {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: 20px;
  padding: 50px 0;

  .input {
    margin-top: 10px;
  }
}
</style>
