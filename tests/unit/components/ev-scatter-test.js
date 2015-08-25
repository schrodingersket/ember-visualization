/*
 * Copyright (c) 2015 Urbane Innovation, LLC
 */

import {
  moduleForComponent,
  test
} from 'ember-qunit';

//import startApp from '../../helpers/start-app';
//import Ember from 'ember';
//
//var App;

moduleForComponent('ev-scatter', {
  // specify the other units that are required for this test
  // needs: ['component:foo', 'helper:bar']
  //
  //setup: function() {
  //  App = startApp();
  //},
  //teardown: function() {
  //  Ember.run(App, 'destroy');
  //}
});

test('it renders', function(assert) {
  assert.expect(2);

  // creates the component instance
  var component = this.subject();
  assert.equal(component._state, 'preRender');

  // renders the component to the page
  this.render();
  assert.equal(component._state, 'inDOM');
});

// Scatterplot rendering
//
test('renders correct number of scatter plot elements', function(assert) {
  assert.expect(1);

  // Initialize/render component
  //
  var component = this.subject();
  var element = this.render();

  // Set `dataSource` values
  //
  var testDataSource = [
    {
      label: 'Test data',
      data: [
        {x: 20, y: 70},
        {x: 60, y: 30},
        {x: 30, y: 80}
      ]
    }
  ];

  component.set('dataSource', testDataSource);

  var points = element.find('circle.ev-point');

  assert.equal(points.length, 3, 'Rendered correct number of scatter points.');
});

// Points don't render on null values
//
test('doesn\'t render when `dataSource` is null', function(assert) {
  assert.expect(1);

  // Initialize/render component
  //
  var element = this.render();

  var points = element.find('circle.ev-point');

  assert.equal(points.length, 0, 'Did not render scatter points.');
});
