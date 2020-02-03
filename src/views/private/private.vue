<template>
	<div class="private-view">
		<aside class="navigation" :class="{ 'is-open': navOpen }">
			<div class="modules"></div>
			<div class="module-nav"></div>
		</aside>
		<header class="header">
			<button @click="navOpen = true">Toggle nav</button>
			<button @click="drawerOpen = true">Toggle drawer</button>
		</header>
		<main class="content"></main>
		<aside class="drawer" :class="{ 'is-open': drawerOpen }"></aside>
		<v-overlay :active="navOpen" :z-index="49" @click="navOpen = false" />
		<v-overlay :active="drawerOpen" :z-index="24" @click="drawerOpen = false" />
	</div>
</template>

<script lang="ts">
import { createComponent, ref } from '@vue/composition-api';
import useWindowSize from '@/compositions/window-size';

export default createComponent({
	setup() {
		const navOpen = ref<boolean>(false);
		const drawerOpen = ref<boolean>(false);

		const { width, height } = useWindowSize();

		return { navOpen, drawerOpen };
	}
});
</script>

<style lang="scss" scoped>
.private-view {
	width: 100%;
	height: 100%;

	.navigation {
		height: 100%;
		font-size: 0;
		transform: translateX(-100%);
		position: fixed;
		top: 0;
		left: 0;
		z-index: 50;
		transition: transform var(--slow) var(--transition);

		&.is-open {
			transform: translateX(0);
		}

		.modules {
			background-color: #263238;
			width: 64px;
			height: 100%;
			display: inline-block;
			font-size: 1rem;
		}

		.module-nav {
			background-color: #eceff1;
			width: 220px;
			height: 100%;
			display: inline-block;
			font-size: 1rem;
		}
	}

	.drawer {
		width: 284px;
		height: 100%;
		background-color: #eceff1;
		position: fixed;
		top: 0;
		right: 0;
		transform: translateX(100%);
		transition: transform var(--slow) var(--transition);
		z-index: 25;

		&.is-open {
			transform: translateX(0);
		}
	}
}
</style>
