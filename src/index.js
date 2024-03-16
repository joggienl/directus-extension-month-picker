import InterfaceComponent from './interface.vue';

export default {
	id: 'month-picker',
	name: 'Month Picker',
	icon: 'calendar_month',
	description: 'An interface extension that allows easy picking of any month in a given year.',
	component: InterfaceComponent,
	options: null,
	group: 'selection',
	types: ['date'],
};
