import VueCompositionAPI from '@vue/composition-api';
import { mount, createLocalVue, Wrapper } from '@vue/test-utils';
import PrivateView from './private.vue';
import VOverlay from '@/components/v-overlay/';

const localVue = createLocalVue();
localVue.use(VueCompositionAPI);
localVue.component('v-overlay', VOverlay);

describe('Views / Private', () => {
	let component: Wrapper<Vue>;

	beforeEach(() => {
		component = mount(PrivateView, { localVue });
	});

	it('Defaults to nav / drawer closed', () => {
		expect((component.vm as any).navOpen).toBe(false);
		expect((component.vm as any).drawerOpen).toBe(false);
	});
});
