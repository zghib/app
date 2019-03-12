<template>
  <div class="nav-menu">
    <h3 v-if="title" class="style-4">{{ title }}</h3>
    <nav :class="{ 'no-border': noBorder }">
      <ul>
        <li v-for="{ path, name, icon, color } in links" :key="path">
          <router-link :to="path" :class="color || null">
            <i v-if="icon" class="material-icons icon">{{ icon }}</i>
            <svg v-else class="icon" viewBox="0 0 17 18">
              <path
                d="M.4783 14.2777l7.676 3.5292a.7888.7888 0 0 0 .6913 0l7.6738-3.5292a.7661.7661 0 0 0 .4805-.748V4.3566a.8228.8228 0 0 0-.0147-.1474V4.165a.824.824 0 0 0-.0329-.1054l-.0113-.034a.8228.8228 0 0 0-.0669-.1246l-.0181-.0261a.824.824 0 0 0-.0726-.0873l-.0396-.026a.8228.8228 0 0 0-.0907-.0748l-.0227-.0159a.824.824 0 0 0-.111-.0623L8.8434.0794a.7888.7888 0 0 0-.6914 0L.4794 3.6086a.8228.8228 0 0 0-.111.0623l-.0227.0159a.824.824 0 0 0-.0907.0748l-.0283.0283a.824.824 0 0 0-.0726.0873l-.0181.026a.8228.8228 0 0 0-.0657.1247l-.0227.0317a.824.824 0 0 0-.034.1054v.043A.8228.8228 0 0 0 0 4.3567v9.1731c0 .3513.1587.6007.4783.748zm1.1684-8.6325L7.675 8.4218v7.3587l-6.0282-2.7778V5.644v.0012zM9.324 15.7794V8.4207l6.027-2.7767v7.3587l-6.027 2.7755v.0012zm-.825-14.051l5.7062 2.6293-5.7063 2.627-5.7052-2.6281 5.7052-2.6282z"
                fill-rule="nonzero"
              />
            </svg>
            {{ name }}
          </router-link>
        </li>
      </ul>
    </nav>
  </div>
</template>

<script>
export default {
  name: "nav-menu",
  props: {
    title: {
      type: String,
      default: null
    },
    links: {
      type: Array,
      required: true
    },
    noBorder: {
      type: Boolean,
      default: false
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
  width: 18px;
  height: 18px;
  margin-right: 8px;
  color: var(--light-gray);
  fill: var(--light-gray);

  /* Forces left-alignment of material-icons */
  display: inline-flex;
  justify-content: center;
  align-items: center;
  vertical-align: -5px;
}

a {
  text-decoration: none;
  display: block;
  position: relative;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  &::before {
    content: "";
    position: absolute;
    height: 100%;
    width: 3px;
    background-color: currentColor;
    left: -20px;
    top: 0;
    transform: scaleX(0);
    transform-origin: left;
    transition: var(--medium) var(--transition-out);
  }
}

a:hover,
.content .router-link-active,
.user-menu .router-link-exact-active {
  color: var(--accent);

  .icon {
    color: currentColor;
    fill: currentColor;
  }
}

.content .router-link-active,
.user-menu .router-link-exact-active {
  &::before {
    transform: scaleX(1);
    transition: var(--medium) var(--transition-in);
  }
}

ul {
  list-style: none;
  padding: 0;
}

nav > ul > li > * {
  padding: 5px 0;
}

nav {
  padding-bottom: 10px;
  margin-bottom: 10px;
  border-bottom: 1px solid var(--lightest-gray);

  &.no-border {
    border-bottom: 0;
  }
}

.success {
  color: var(--success);

  a:hover,
  .content .router-link-active,
  .user-menu .router-link-exact-active {
    color: var(--success-dark);

    &::before {
      background-color: var(--success);
    }
  }
}

.warning {
  color: var(--warning);

  &:hover,
  .content &.router-link-active,
  .user-menu &.router-link-exact-active {
    color: var(--warning-dark);

    &::before {
      background-color: var(--warning);
    }
  }
}

.danger {
  color: var(--danger);
}

.accent,
.success,
.warning,
.danger {
  .icon {
    color: currentColor;
    fill: currentColor;
  }
}
</style>
