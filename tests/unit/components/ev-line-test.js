/*
 * Copyright (c) 2015 Urbane Innovation, LLC
 */

import {
  moduleForComponent,
  test
} from 'ember-qunit';

moduleForComponent('ev-line', {
  // specify the other units that are required for this test
  // needs: ['component:foo', 'helper:bar']
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
test('renders path for non-empty `dataSource`', function(assert) {
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

  var path = element.find('path.ev-line');

  assert.equal(path.length, 1, 'Rendered path element');
});

// Points don't render on null values
//
test('doesn\'t render when `dataSource` is null', function(assert) {
  assert.expect(1);

  // Initialize/render component
  //
  var element = this.render();

  var points = element.find('path.ev-line');

  assert.equal(points.length, 0, 'Did not render path.');
});
