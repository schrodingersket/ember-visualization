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
			label: 'Dummy 2',
			color: 'blue',
			data: [
				{x: -3, y: 1},
				{x: -2, y: 2}
			]
		}
	]
});
