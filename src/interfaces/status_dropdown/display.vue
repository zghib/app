<template>
	<div class="no-wrap">
		{{ currentStatus.name }}
	</div>
</template>

<script>
import mixin from '@directus/extension-toolkit/mixins/interface';

export default {
	mixins: [mixin],
	computed: {
		currentStatus() {
			return this.options.status_mapping[this.value];
		}
	}
};
</script>

<style lang="scss" scoped></style>
