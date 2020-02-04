import Vue from 'vue';
import PrivateView from './private.vue';
import markdown from './private.readme.md';

export default {
	title: 'Views / Private',
	component: PrivateView,
	parameters: {
		notes: markdown
	}
};

export const basic = () => ({
	template: `
<private-view />
`
});
