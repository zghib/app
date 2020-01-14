<template>
	<span :class="{ empty: !displayValue }">
		{{ displayValue }}
		<template v-if="!displayValue">
			{{ $t("not_translated_in_language", { language: systemLanguagePrinted }) }}
		</template>
	</span>
</template>

<script>
import mixin from "@directus/extension-toolkit/mixins/interface";

export default {
	mixins: [mixin],
	computed: {
		systemLanguage() {
			return this.$i18n.locale;
		},
		systemLanguagePrinted() {
			return this.$i18n.availableLanguages[this.systemLanguage].split("(")[0];
		},
		systemLanguageValues() {
			const { languageField } = this.options;
			const fullMatch = _.find(this.value, { [languageField]: this.systemLanguage });
			const partialMatch = _.find(this.value, {
				[languageField]: this.systemLanguage.split("-")[0]
			});

			return fullMatch || partialMatch;
		},
		displayValue() {
			if (!this.value || this.value.length === 0) {
				return null;
			}

			if (!this.options.template) {
				return this.$tc("item_count", (this.value || []).length);
			}

			if (this.systemLanguageValues) {
				return this.$helpers.micromustache.render(
					this.options.template,
					this.systemLanguageValues
				);
			}

			return null;
		}
	}
};
</script>

<style lang="scss">
.empty {
	color: var(--empty-value);
}
</style>
