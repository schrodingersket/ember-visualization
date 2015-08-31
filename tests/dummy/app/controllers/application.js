import Ember from 'ember';

export default Ember.Controller.extend({
	dummyData: [
		{
			label: 'Dummy 1',
			color: 'black',
			data: [
				{x: 0, y: 0},
				{x: 1, y: 1}
			]
		},
		{
			label: 'Dummy 2',
			color: 'red',
			data: [
				{x: -2, y: 1},
				{x: -1, y: 1}
			]
		},
		{
			label: 'Dummy 3',
			color: 'blue',
			data: [
				{x: -3, y: 1},
				{x: -2, y: 2}
			]
		}
	],

	dummyData2: [
		{
			label: 'Dummy 1',
			color: 'black',
			data: [
				{x: 0, y: 0},
				{x: 1, y: 1}
			]
		}
	],

	activeData: [
		{
			label: 'Dummy 1',
			color: 'black',
			data: [
				{x: 0, y: 0},
				{x: 1, y: 1}
			]
		}
	],

	toggleData: function() {
			if (this.get('foo')) {
				this.set('activeData', this.dummyData);
			} else {
				this.set('activeData', this.dummyData2);
			}
	}.observes('foo')
});
