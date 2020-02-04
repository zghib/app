<template>
	<div class="module-bar">
		<module-bar-logo />
	</div>
</template>

<script lang="ts">
import { createComponent } from '@vue/composition-api';
import ModuleBarLogo from './_module-bar-logo.vue';

export default createComponent({
	components: {
		ModuleBarLogo
	},
	setup() {}
});
</script>

<style lang="scss" scoped>
.module-bar {
	background-color: #263238;
	width: 64px;
	height: 100%;
	display: inline-block;
	font-size: 1rem;
}
</style>
