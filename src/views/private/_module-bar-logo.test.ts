import { mount, createLocalVue } from '@vue/test-utils';
import VueCompositionAPI from '@vue/composition-api';
import ModuleBarLogo from './_module-bar-logo.vue';

const localVue = createLocalVue();
localVue.use(VueCompositionAPI);

describe('Views / Private / Module Bar / Logo', () => {
	it('Works', async () => {
		const component = mount(ModuleBarLogo);
	});
});
