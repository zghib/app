<template>
	<div class="v-overlay" v-show="active" :class="{ active, absolute }" :style="styles">
		<div class="overlay" />
		<div v-if="active" class="content"><slot /></div>
	</div>
</template>

<script lang="ts">
import { createComponent, computed } from '@vue/composition-api';
import parseCSSVar from '@/utils/parse-css-var';

export default createComponent({
	props: {
		active: {
			type: Boolean,
			default: false
		},
		absolute: {
			type: Boolean,
			default: false
		},
		color: {
			type: String,
			default: '--modal-smoke-color'
		},
		zIndex: {
			type: Number,
			default: 500
		},
		opacity: {
			type: Number,
			default: 0.75
		}
	},
	setup(props) {
		const styles = computed(() => ({
			'--_v-overlay-color': parseCSSVar(props.color),
			'--_v-overlay-z-index': props.zIndex,
			'--_v-overlay-opacity': props.opacity
		}));

		return { styles };
	}
});
</script>

<style lang="scss" scoped>
.v-overlay {
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	pointer-events: none;
	display: flex;
	justify-content: center;
	align-items: center;
	z-index: var(--_v-overlay-z-index);

	&.active {
		pointer-events: auto;
	}

	&.absolute {
		position: absolute;
	}

	.overlay {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-color: var(--_v-overlay-color);
		opacity: var(--_v-overlay-opacity);
	}

	.content {
		position: relative;
	}
}
</style>
