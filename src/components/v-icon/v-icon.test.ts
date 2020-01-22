import { mount, createLocalVue } from '@vue/test-utils';
import VueCompositionAPI from '@vue/composition-api';

const localVue = createLocalVue();
localVue.use(VueCompositionAPI);

import VIcon from './v-icon.vue';

describe('Icon', () => {
	it('Renders the correct markup for a Material Icon', () => {
		const component = mount(VIcon, {
			localVue,
			propsData: {
				color: '--blue-grey',
				name: 'person'
			}
		});

		expect(component.html()).toContain('<span class="v-icon"><i class="">person</i></span>');
	});

	it('Renders custom icons as inline <svg>', () => {
		const component = mount(VIcon, {
			localVue,
			propsData: {
				color: '--blue-grey',
				name: 'box'
			}
		});

		expect(component.contains('svg')).toBe(true);
	});

	it('Allows Hex/RGB/other CSS for color', () => {
		const component = mount(VIcon, {
			localVue,
			propsData: {
				color: 'papayawhip',
				name: 'person'
			}
		});

		expect((component.vm as any).colorStyle).toBe('papayawhip');
	});

	it('Passes custom size as px value', () => {
		const component = mount(VIcon, {
			localVue,
			propsData: {
				color: '--blue-grey',
				name: 'person',
				size: 120
			}
		});

		expect((component.vm as any).customSize).toBe('120px');
	});

	describe('Sizes', () => {
		const component = mount(VIcon, {
			localVue,
			propsData: {
				color: '--blue-grey',
				name: 'person'
			}
		});

		test('Superscript', () => {
			component.setProps({
				sup: true,
				xSmall: false,
				small: false,
				large: false,
				xLarge: false
			});
			component.vm.$nextTick(() => expect(component.classes()).toContain('sup'));
		});

		test('Extra Small', () => {
			component.setProps({
				sup: false,
				xSmall: true,
				small: false,
				large: false,
				xLarge: false
			});
			component.vm.$nextTick(() => expect(component.classes()).toContain('x-small'));
		});

		test('Small', () => {
			component.setProps({
				sup: false,
				xSmall: false,
				small: true,
				large: false,
				xLarge: false
			});
			component.vm.$nextTick(() => expect(component.classes()).toContain('small'));
		});

		test('Large', () => {
			component.setProps({
				sup: false,
				xSmall: false,
				small: false,
				large: true,
				xLarge: false
			});
			component.vm.$nextTick(() => expect(component.classes()).toContain('large'));
		});

		test('Extra Large', () => {
			component.setProps({
				sup: false,
				xSmall: false,
				small: false,
				large: false,
				xLarge: true
			});
			component.vm.$nextTick(() => expect(component.classes()).toContain('x-large'));
		});

		it('Uses the smallest size prop provided (sup)', () => {
			component.setProps({
				sup: true,
				xSmall: false,
				small: true,
				large: false,
				xLarge: true
			});
			component.vm.$nextTick(() => expect(component.classes()).toContain('sup'));
		});
	});
});
