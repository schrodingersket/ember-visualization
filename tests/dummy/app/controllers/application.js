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
			label: 'Dummy 1',
			color: 'red',
			data: [
				{x: -2, y: 0},
				{x: -1, y: 1}
			]
		}
	]
});