<template>
	<div class="private-view">
		<aside class="modules"></aside>
		<aside class="navigation"></aside>
		<header class="header"></header>
		<main class="content"></main>
		<aside class="drawer"></aside>
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

		console.log(width, height);

		return { navOpen, drawerOpen };
	}
});
</script>

<style lang="scss" scoped>
.private-view {
	width: 100%;
	height: 100%;
	background-color: black;
}
</style>
