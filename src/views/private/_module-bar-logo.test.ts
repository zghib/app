import { mount, createLocalVue, Wrapper } from '@vue/test-utils';
import Vuex from 'vuex';
import VueCompositionAPI from '@vue/composition-api';
import ModuleBarLogo from './_module-bar-logo.vue';

const localVue = createLocalVue();
localVue.use(VueCompositionAPI);

describe('Views / Private / Module Bar / Logo', () => {
	let component: Wrapper<Vue>;

	beforeEach(() => {
		component = mount(ModuleBarLogo, {
			localVue,
			store: new Vuex.Store({
				state: {
					queue: []
				},
				getters: {
					currentProject: () => {
						return {
							name: 'rijk'
						};
					}
				}
			})
		});
	});

	it('Works', async () => {
		const component = mount(ModuleBarLogo, {});
	});
});
