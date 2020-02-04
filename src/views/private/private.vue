<template>
	<div class="private-view">
		<aside class="navigation" :class="{ 'is-open': navOpen }">
			<module-bar />
			<div class="module-nav"></div>
		</aside>
		<div class="content">
			<header>
				<button @click="navOpen = true">Toggle nav</button>
				<button @click="drawerOpen = !drawerOpen">Toggle drawer</button>
			</header>
			<main></main>
		</div>
		<aside class="drawer" :class="{ 'is-open': drawerOpen }"></aside>

		<v-overlay v-if="width <= 800" :active="navOpen" :z-index="49" @click="navOpen = false" />
		<v-overlay
			v-if="width <= 1240"
			:active="drawerOpen"
			:z-index="24"
			@click="drawerOpen = false"
		/>
	</div>
</template>

<script lang="ts">
import { createComponent, ref, computed } from '@vue/composition-api';
import useWindowSize from '@/compositions/window-size';
import ModuleBar from './_module-bar.vue';

// Breakpoints:
// < 800 (.navigation and .drawer as overlay)
// 800-1240 (.navigation on page, .drawer as overlay)
// 1240+ (both on page, .drawer collapsed)

export default createComponent({
	components: {
		ModuleBar
	},
	props: {},
	setup() {
		const navOpen = ref<boolean>(false);
		const drawerOpen = ref<boolean>(false);

		const { width } = useWindowSize();

		return { navOpen, drawerOpen, width };
	}
});
</script>

<style lang="scss" scoped>
.private-view {
	width: 100%;
	height: 100%;
	display: flex;

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

		.module-nav {
			background-color: #eceff1;
			width: 220px;
			height: 100%;
			display: inline-block;
			font-size: 1rem;
		}

		@media (min-width: 800px) {
			position: relative;
			transform: none;
		}
	}

	.content {
		flex-grow: 1;
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

		@media (min-width: 800px) {
			transform: translateX(calc(100% - 64px));
		}

		@media (min-width: 1240px) {
			transform: none;
			position: relative;
			flex-basis: 64px;
			transition: flex-basis var(--slow) var(--transition);

			&.is-open {
				transform: none;
				flex-basis: 284px;
			}
		}
	}
}
</style>
