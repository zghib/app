<template>
	<div class="module-bar-logo">
		<img v-if="customLogoPath" :src="customLogoPath" />
		<div
			v-else
			class="logo"
			:class="{ running: queueHasItems }"
			@animationiteration="checkRunning"
		/>
	</div>
</template>

<script lang="ts">
import { createComponent, ref, computed } from '@vue/composition-api';
const { useStore } = require('@/store/');

export default createComponent({
	setup() {
		const store = useStore();
		const queueHasItems = computed<boolean>(() => store.state.queue.length !== 0);
		const customLogoPath = computed<string | null>(() => {
			return store.getters.currentProject?.data.project_name || null;
		});

		return { queueHasItems, customLogoPath };
	}
});
</script>

<style lang="scss" scoped>
.module-bar-logo {
	background-color: var(--brand);

	display: flex;
	justify-content: center;
	align-items: center;
	position: relative;
	width: 64px;
	height: 64px;
	padding: 12px;

	> * {
		width: 100%;
		height: 100%;
		object-fit: contain;
	}

	.logo {
		background-image: url('../../assets/sprite.svg');
		background-size: 600px 32px;
		background-position: 0% 0%;
		width: 40px;
		height: 32px;
		margin: 0 auto;
		position: absolute;
		top: 20px;
		left: 12px;
	}

	.running {
		animation: 560ms run steps(14) infinite;
	}
}

@keyframes run {
	100% {
		background-position: 100%;
	}
}
</style>
