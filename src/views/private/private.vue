<template>
	<div class="private-view">
		<aside class="module"></aside>
		<aside class="navigation"></aside>
		<header class="header"></header>
		<main class="content"></main>
		<aside class="detail"></aside>
	</div>
</template>

<script lang="ts">
import { createComponent } from '@vue/composition-api';

export default createComponent({
	setup() {}
});
</script>

<style lang="scss" scoped>
.private-view {
	width: 100%;
	height: 100%;
	background-color: black;
}
</style>
