<template>
  <transition name="fade">
    <div class="login">
      <form @submit.prevent="login">
        <img class="logo" alt="" src="../assets/logo-dark.svg" />

        <h1 class="style-0">{{ $t('sign_in') }}</h1>

        <label class="project-switcher">
          <select v-model="url">
            <option
              v-for="(name, url) in urls"
              :value="url"
              :key="url">
              {{ name }}
            </option>
          </select>
          {{ $t('to') }} <span>{{ $helpers.formatTitle(urls[url] || $t('choose_project')) }} <i class="material-icons">arrow_drop_down</i></span>
        </label>

        <div class="material-input">
          <input
            v-model="email"
            :class="{ 'has-value': email && email.length > 0}"
            type="text"
            id="email"
            name="email" />
          <label for="email">{{ $t('email') }}</label>
        </div>

        <div class="material-input">
          <input
            v-model="password"
            :class="{ 'has-value': password && password.length > 0}"
            type="password"
            id="password"
            name="password" />
          <label for="password">{{ $t('password') }}</label>
        </div>

        <a class="forgot" href="/reset-password">{{ $t('forgot_password') }}</a>

        <button class="style-btn" type="submit">{{ $t('sign_in') }}</button>

        <transition-group
          name="list"
          class="third-party-auth"
          tag="ul">
          <i key="lock" v-if="!thirdPartyAuthProviders.length" class="material-icons lock">lock_outline</i>
          <li
            v-else
            v-for="provider in thirdPartyAuthProviders"
            :key="provider.name">
            <a v-tooltip.bottom="$helpers.formatTitle(provider.name)" :href="url + '/_/auth/sso/' + provider.name">
              <img
                :alt="provider.name"
                :src="provider.icon">
            </a>
          </li>
        </transition-group>
      </form>
      <transition name="slide">
        <div
          v-if="error"
          :class="errorType"
          class="notice">
          <i class="material-icons">{{ errorType }}</i>
          {{ errorMessage }}
          <button
            class="close"
            @click="error = null">Close error</button>
        </div>
      </transition>
      <small v-tooltip="version" class="style-4">{{ $t('powered_by_directus') }}</small>
    </div>
  </transition>
</template>

<script>
import sdk from "directus-sdk-javascript/remote";
import { version } from "../../package.json";

export default {
  name: "login",
  data() {
    return {
      url: null,
      email: null,
      password: null,

      loading: false,
      error: null,

      exists: null,
      checkingExistence: false,
      thirdPartyAuthProviders: [],
      gettingThirdPartyAuthProviders: false
    };
  },
  computed: {
    urls() {
      if (!window.__DirectusConfig__) return;
      return window.__DirectusConfig__.api;
    },
    version() {
      return `${this.$t("version")} v${version}`;
    },
    storeError() {
      return this.$store.state.auth.error;
    },
    errorType() {
      if (!this.error) return;

      if (+this.error.code >= 100 && +this.error.code < 200) {
        if (+this.error.code === 101 || +this.error.code === 102) {
          return null;
        }

        return "warning";
      }
      return "error";
    },
    errorMessage() {
      if (!this.error) return;

      if (
        this.localeMessages.errors &&
        this.localeMessages.errors[this.error.code] != null
      ) {
        return this.$t(`errors[${this.error.code}]`);
      }

      return this.$t("error_unknown");
    },
    localeMessages() {
      return this.$i18n.getLocaleMessage(this.$i18n.locale);
    }
  },
  created() {
    this.checkUrl = this.$lodash.debounce(this.checkUrl, 300);

    if (this.url) {
      this.checkUrl();
    }

    const lastUsedURL = this.$store.state.auth.url;
    this.url =
      lastUsedURL || Object.keys(window.__DirectusConfig__.api)[0] || "";

    this.trySSOLogin();
  },
  watch: {
    url() {
      this.exists = null;
      this.checkUrl();
    },
    exists(newVal, oldVal) {
      if (newVal === true && newVal !== oldVal) {
        this.getThirdPartyAuthProviders();
      }
    },
    $route() {
      this.trySSOLogin();
    },
    storeError(error) {
      this.error = error;
    }
  },
  methods: {
    login() {
      const credentials = {
        url: this.url,
        email: this.email,
        password: this.password
      };

      this.loading = true;

      this.$store
        .dispatch("login", credentials)
        .then(() => {
          this.enterApp();
        })
        .catch(() => {
          this.loading = false;
        });
    },
    enterApp() {
      if (this.$route.query.redirect) {
        this.loading = false;
        return this.$router.push(this.$route.query.redirect);
      }

      this.$api
        .getMe({ fields: "last_page" })
        .then(res => res.data.last_page)
        .then(lastPage => {
          this.loading = false;
          this.$router.push(lastPage || "/");
        })
        .catch(error => {
          this.loading = false;
          this.$events.emit("error", {
            notify: this.$t("something_went_wrong_body"),
            error
          });
          this.$router.push("/");
        });
    },
    checkUrl() {
      if (!this.url) return;

      this.checkingExistence = true;
      this.exists = false;
      this.thirdPartyAuthProviders = [];

      const scopedAPI = new sdk();

      scopedAPI.url = this.url;

      scopedAPI
        .ping()
        .then(() => {
          this.exists = true;
          this.checkingExistence = false;
        })
        .catch(() => {
          this.exists = false;
          this.checkingExistence = false;
        });
    },
    getThirdPartyAuthProviders() {
      this.gettingThirdPartyAuthProviders = true;
      this.thirdPartyAuthProviders = [];

      const scopedAPI = new sdk();

      scopedAPI.url = this.url;

      scopedAPI
        .getThirdPartyAuthProviders()
        .then(res => res.data)
        .then(thirdPartyAuthProviders => {
          this.thirdPartyAuthProviders = thirdPartyAuthProviders;
          this.gettingThirdPartyAuthProviders = false;
        })
        .catch(error => {
          this.$events.emit("error", {
            notify: this.$t("something_went_wrong_body"),
            error
          });
          this.gettingThirdPartyAuthProviders = false;
        });
    },
    resetPassword() {
      this.resetLoading = true;

      this.$api
        .request(
          "POST",
          "/auth/reset-request",
          {},
          {
            email: this.email
          }
        )
        .then(() => {
          this.resetLoading = false;
        })
        .catch(err => {
          alert(JSON.stringify(err, "    ", false));
        });
    },
    trySSOLogin() {
      /**
       * NOTE: The only reason this was implemented this way is due to the fact that the API doesn't return
       *   error codes yet for SSO errors. As soon as issue directus/api#126 has been fixed, we can
       *   use the "pretty" error notice instead
       */
      if (this.$route.query.error) {
        this.error = this.$route.query.error;

        var uri = window.location.toString();
        if (uri.indexOf("?") > 0) {
          var clean_uri = uri.substring(0, uri.indexOf("?"));
          window.history.replaceState({}, document.title, clean_uri);
        }

        return null;
      }

      if (
        this.$route.query.request_token &&
        this.$route.query.request_token.length > 0
      ) {
        this.$store
          .dispatch("loginSSO", this.$route.query.request_token)
          .then(() => this.enterApp())
          .catch(error => {
            this.$events.emit("error", {
              notify: this.$t("something_went_wrong_body"),
              error
            });
          });
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.login {
  background-color: var(--darkest-gray);
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

form {
  background-color: var(--white);
  border-radius: var(--border-radius);
  max-width: 340px;
  width: 100%;
  position: relative;
  top: -5vh;
  padding: 30px 40px 20px;
  box-shadow: var(--box-shadow);
}

.logo {
  height: 40px;
  margin-bottom: 60px;
  pointer-events: none;
  user-select: none;
}

label {
  position: relative;
  text-transform: none;
  font-size: 16px;
  color: var(--light-gray);
  font-weight: 400;
}

select {
  position: absolute;
  width: 100%;
  height: 100%;
  opacity: 0;
  z-index: +1;
  left: 0;
  top: 0;
  font-size: 14px;
  cursor: pointer;
}

.project-switcher {
  margin-bottom: 30px;

  span {
    transition: color var(--fast) var(--transition);
  }

  select:hover + span,
  select:focus + span {
    transition: none;
    cursor: pointer;
    color: var(--darker-gray);
  }

  i {
    font-size: 18px;
    width: 10px;
    height: 10px;
    vertical-align: top;
  }
}

.material-input {
  position: relative;
  width: 100%;
  margin: 20px 0;

  input {
    border: 0;
    font-size: 16px;
    border-bottom: 2px solid var(--lighter-gray);
    width: 100%;
    padding: 10px 0;

    &:focus {
      outline: 0;
      border-color: var(--accent);
    }
  }

  label {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    font-size: 15px;
    font-weight: 400;
    transform-origin: left;
    transition: all var(--fast) var(--transition);
  }

  input:focus,
  input.has-value {
    & + label {
      transform: scale(0.8);
      top: -10px;
    }
  }
}

.forgot {
  text-align: right;
  display: block;
  text-decoration: none;
  margin-bottom: 40px;
  transition: color var(--fast) var(--transition-out);

  &:hover,
  .user-is-tabbing &:focus {
    outline: 0;
    transition: none;
    color: var(--darkest-gray);
  }
}

button {
  background-color: var(--darkest-gray);
  width: 100%;
  display: block;
  padding: 10px 0;
  border-radius: var(--border-radius);
  margin-bottom: 20px;
  box-shadow: 0;
  transition: box-shadow var(--fast) var(--transition);

  &:hover {
    transition: none;
    box-shadow: var(--box-shadow-accent);
  }
}

.lock {
  display: block;
  margin: 0 auto;
  width: max-content;
  pointer-events: none;
  user-select: none;
  color: var(--lighter-gray);
}

small {
  position: absolute;
  bottom: 20px;
  text-align: center;
  cursor: help;
  left: 0;
  right: 0;
  margin-left: auto;
  margin-right: auto;
}

.third-party-auth {
  padding: 0;
  list-style: none;
  display: flex;
  justify-content: space-around;

  a {
    display: block;
  }

  img {
    width: 21px;
    height: 21px;
    object-fit: contain;
  }
}

.list-enter-active {
  transition: var(--medium) var(--transition-in);
}

.list-leave-active {
  transition: var(--fast) var(--transition-out);
}

.list-enter,
.list-leave-to {
  opacity: 0;
  transform: translateY(10px) scale(0.9);
  position: absolute;
}

.notice {
  position: absolute;
  bottom: 50px;
  background-color: var(--light-gray);
  border-radius: var(--border-radius);
  color: var(--white);
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 10px 13px;
  left: 0;
  right: 0;
  margin-left: auto;
  margin-right: auto;
  width: max-content;

  i {
    margin-right: 5px;
  }
}

.notice.error {
  background-color: var(--danger-dark);
}

.notice.warning {
  background-color: var(--warning);
}

.slide-enter-active {
  transform: translateY(0);
  opacity: 1;
  transition: var(--slow) var(--transition-in);
}

.slide-leave-active {
  transform: translateY(0);
  transition: var(--medium) var(--transition-out);
}

.slide-enter,
.slide-leave-to {
  transform: translateY(calc(50px + 100%));
  opacity: 0;
}

.close {
  position: absolute;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  z-index: 5;
  cursor: pointer;
  opacity: 0;
}

.fade-enter-active {
  opacity: 1;
  transition: var(--slow) var(--transition-in);
}

.fade-leave-active {
  transition: var(--slow) var(--transition-out);
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
