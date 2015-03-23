/*
 * Copyright (c) 2015 Urbane Innovation, LLC
 */

/* global d3 */

import {
  moduleForComponent,
  test
} from 'ember-qunit';

import startApp from '../../helpers/start-app';
import Ember from 'ember';

var App;

moduleForComponent('labeled-graph', {
  // specify the other units that are required for this test
  // needs: ['component:foo', 'helper:bar']
  //
  setup: function() {
    App = startApp();
  },
  teardown: function() {
    Ember.run(App, 'destroy');
  }
});

// Render
//
test('it renders', function(assert) {

  assert.expect(2);

  // Initialize component
  //
  var component = this.subject();
  assert.equal(component._state, 'preRender');

  // Create the component instance
  //
  this.render();
  assert.equal(component._state, 'inDOM');
});

// Initialization
//
test('margins initialize correctly', function(assert) {

  assert.expect(4);

  // Initialize component
  //
  var component = this.subject();

  // Verify margins were rendered correctly
  //
  assert.equal(component.get('margin.left')(component), component.get('width')/20,
    'margin.left equal to 5% of width');

  assert.equal(component.get('margin.bottom')(component), component.get('height')/20,
    'margin.bottom equal to 5% of height');

  assert.equal(component.get('margin.top')(component), component.get('height')/50,
    'margin.top equal to 2% of height');

  assert.equal(component.get('margin.right')(component), 0,
    'margin.right equal to 0');
});

// Domains
//
test('creates correct domains for `dataSource`', function(assert) {
  assert.expect(4);

  // Initialize component
  //
  var component = this.subject();

  // Set `dataSource` values
  //
  var testDataSource = [
    {x: 20, y: 70},
    {x: 60, y: 30},
    {x: 30, y: 80}
  ];

  component.set('dataSource', testDataSource);

  // Assert that the domain returned by `_xDomain` is correct
  //
  var sutXDomain = component.get('_xDomain')(component);

  assert.equal(sutXDomain[0], testDataSource[0].x,
    'returned correct start of x domain for `dataSource`');

  assert.equal(sutXDomain[1], testDataSource[1].x,
    'returned correct end of x domain for `dataSource`');

  // Assert that the domain returned by `_yDomain` is correct
  //
  var sutYDomain = component.get('_yDomain')(component);

  assert.equal(sutYDomain[0], testDataSource[1].y,
    'returned correct start of y domain for `dataSource`');

  assert.equal(sutYDomain[1], testDataSource[2].y,
    'returned correct end of y domain for `dataSource`');
});


// Linear scale
//
test('`_scales` returns correct linear scale', function(assert) {
  assert.expect(2);

  // Initialize component
  //
  var component = this.subject();

  // Input value
  //
  var x = 5;

  // By Rice's Theorem, we can't assert that providing a certain string value for `_scaleForType` will return a given function.
  // Instead, we start with a constant value (`x`) which, when passed as a parameter to the function that `_scaleForType`
  // returns, returns a predictable (and therefore testable) value.
  //
  var testDomain = [0, 10];
  var testRange = [0, 100];

  // Linear scales apply a transform of the form y = m*x + b
  //
  var linearScale = d3.scale.linear()
    .domain(testDomain)
    .range(testRange);

  // Get result of linear scaling
  //
  var scalingResult = component.get('_scales.linear')(testDomain, testRange)(x);

  assert.ok(scalingResult, 'result of linear scaling not null');
  assert.equal(scalingResult, linearScale(x), 'scaling results equal');
});

// Time scale
//
test('`_scales` returns correct time scale', function(assert) {
  assert.expect(2);

  // Initialize component
  //
  var component = this.subject();

  // Input value
  //
  var x = new Date(new Date().getTime() - 1000*60*60*24*365*20); // Today minus 20 years

  // By Rice's Theorem, we can't assert that providing a certain string value for `_scaleForType` will return a given function.
  // Instead, we start with a constant value (`x`) which, when passed as a parameter to the function that `_scaleForType`
  // returns, returns a predictable (and therefore testable) value.
  //
  var testDomain = [new Date(0), new Date()];
  var testRange = [0, 100];

  // Time scales are simply linear scales with a special tick format.
  //
  var timeScale = d3.time.scale()
    .domain(testDomain)
    .range(testRange);

  // Get result of time scaling
  //
  var scalingResult = component.get('_scales.time')(testDomain, testRange)(x);

  assert.ok(scalingResult, 'result of time scaling not null');
  assert.equal(scalingResult, timeScale(x), 'scaling results equal');
});

// Logarithmic scale
//
test('`_scales` returns correct logarithmic scale', function(assert) {
  assert.expect(2);

  // Initialize component
  //
  var component = this.subject();

  // Input value (e^2)
  //
  var x = Math.exp(2);

  // By Rice's Theorem, we can't assert that providing a certain string value for `_scaleForType` will return a given function.
  // Instead, we start with a constant value (`x`) which, when passed as a parameter to the function that `_scaleForType`
  // returns, returns a predictable (and therefore testable) value.
  //
  var testDomain = [Math.exp(0), Math.exp(4)];
  var testRange = [0, 100];
  var testBase = Math.E;

  // Log scales are of the form y = m * log(x) + b
  //
  var logScale = d3.scale.log()
    .base(testBase)
    .domain(testDomain)
    .range(testRange);

  // Get result of logarithmic scaling
  //
  var scalingResult = component.get('_scales.log')(testDomain, testRange, { base: testBase })(x);

  assert.ok(scalingResult, 'result of logarithmic scaling not null');
  assert.equal(scalingResult, logScale(x), 'scaling results equal');
});

// `xScale` maps correctly to `margin`, `height`, and `width`
//
test('returns scale with correct domain and range for `_xScale`', function(assert) {
  assert.expect(2);

  // Initialize component
  //
  var component = this.subject();

  // Input value (e^2)
  //
  var x = 15;

  // Set `dataSource` values
  //
  var testDataSource = [
    {x: 10, y: 20},
    {x: 20, y: 30},
    {x: 30, y: 60}
  ];

  component.set('dataSource', testDataSource);

  // Set scaleType
  //
  component.set('xScaleType', 'linear');

  // Fetch domain and range corresponding to `dataSource`
  //
  var testDomain = component.get('_xDomain')(component);
  var testRange = [component.get('margin.left')(component), component.get('width') - component.get('margin.left')(component) - component.get('margin.right')()];

  // Get expected function
  //
  var expectedScale = component.get('_scales.linear')(testDomain, testRange);

  // Get actual function
  //
  var actualScale = component.get('xScale')(component);

  assert.ok(actualScale(x), 'result of logarithmic scaling not null');
  assert.equal(actualScale(x), expectedScale(x), 'scaling results equal');
});

// `_yScale` maps correctly to `margin`, `height`, and `width`
//
test('returns scale with correct domain and range for `_yScale`', function(assert) {
  assert.expect(2);

  // Initialize component
  //
  var component = this.subject();

  // Input value (e^2)
  //
  var x = 15;

  // Set `dataSource` values
  //
  var testDataSource = [
    {x: 10, y: 20},
    {x: 20, y: 30},
    {x: 30, y: 60}
  ];

  component.set('dataSource', testDataSource);

  // Set scaleType
  //
  component.set('yScaleType', 'linear');

  // Fetch domain and range corresponding to `dataSource`
  //
  var testDomain = component.get('_yDomain')(component);
  var testRange = [component.get('height') - component.get('margin.bottom')(component), component.get('margin.top')(component)];

  // Get expected function
  //
  var expectedScale = component.get('_scales.linear')(testDomain, testRange);

  // Get actual function
  //
  var actualScale = component.get('yScale')(component);

  assert.ok(actualScale(x), 'result of logarithmic scaling not null');
  assert.equal(actualScale(x), expectedScale(x), 'scaling results equal');
});

// Title renders
//
test('title renders when `title` variable is set, and is removed when it is unset', function(assert) {
  assert.expect(3);

  // Initialize/render component
  //
  var component = this.subject();
  var element = this.render();

  // Set `title` variable
  //
  var testTitle = 'Test title';

  // Set `title`. This should fire an event to add the graph title.
  //
  component.set('title', testTitle);

  // Verify that title was rendered with the correct inner text and text-anchor
  //
  assert.equal(element.find('text.ev-title').text(), testTitle, 'title updated correctly');
  assert.equal(element.find('text.ev-title').attr('text-anchor'), 'middle', 'text-anchor of middle added');

  // Set `title`. This should fire an event to add the graph title.
  //
  component.set('title', '');

  // Verify that title was rendered
  //
  assert.equal(element.find('text.ev-title').text(), '', 'title removed correctly');
});

// x-Axis title Renders
//
test('x-axis title renders correctly when `xAxisTitle` variable is set, and is removed when it is unset', function(assert) {
  assert.expect(6);

  // Initialize/render component
  //
  var component = this.subject();
  var element = this.render();

  // Set `title` variable
  //
  var testTitle = 'x-Axis Title';

  // Set `xAxisTitle`. This should fire an event to add the x axis title.
  //
  component.set('xAxisTitle', testTitle);

  // Verify that the x-axis title was rendered after transition period.
  //
  Ember.run.later(function(){

    var $xAxisTitle = element.find('text.ev-axis-title.ev-x-axis-title');

    // Verify text
    //
    assert.equal($xAxisTitle.text(), testTitle, 'x-axis title updated correctly');

    // Verify translation
    //
    assert.equal($xAxisTitle.attr('x'), (component.get('width') + component.get('margin.left')(component) - component.get('margin.right')(component))/2,
      'x axis title translated horizontally correctly');
    assert.equal($xAxisTitle.attr('y'), component.get('height'),
      'x axis title translated horizontally correctly');

    // Verify bottom margin change
    //
    assert.equal(component.get('margin.bottom')(component), component.get('height')/10, 'bottom margin updated after x-axis title added');

    // Reset x-axis title
    //
    component.set('xAxisTitle', '');
  }, 0); // Default time period for d3 transitions is 250ms, so we wait for 300.

  // Verify that the x-axis title was rendered after transition period.
  //
  Ember.run.later(function(){
    assert.equal(element.find('text.ev-axis-title.ev-x-axis-title').text(), '', 'x-axis title removed');

    assert.equal(component.get('margin.bottom')(component), component.get('height')/20, 'bottom margin reset after x-axis title removed');
  }, 100); // Default time period for d3 transitions is 250ms, so we wait for 600 for two.

  wait(); // For Ember.run to complete execution
});

// y-Axis title Renders
//
test('y-axis title renders correctly when `yAxisTitle` variable is set, and is removed when it is unset', function(assert) {
  assert.expect(6);

  // Initialize/render component
  //
  var component = this.subject();
  var element = this.render();

  // Set `title` variable
  //
  var testTitle = 'y-Axis Title';

  // Set `xAxisTitle`. This should fire an event to add the x axis title.
  //
  component.set('yAxisTitle', testTitle);

  // Verify that the y-axis title was rendered after transition period.
  //
  Ember.run.later(function(){

    var $yAxisTitle = element.find('text.ev-axis-title.ev-y-axis-title');

    // Verify text
    //
    assert.equal($yAxisTitle.text(), testTitle, 'y-axis title updated correctly');

    // Verify translation
    //
    assert.equal($yAxisTitle.attr('x'), -(component.get('height') + component.get('margin.top')(component) - component.get('margin.bottom')(component))/2,
      'y axis title translated horizontally correctly');
    assert.equal($yAxisTitle.attr('y'), component.get('margin.left')(component)/4,
      'y axis title translated vertically correctly');

    // Verify left margin change
    //
    assert.equal(component.get('margin.left')(component), component.get('width')/10, 'left margin updated after x-axis title added');

    // Reset y-axis title
    //
    component.set('yAxisTitle', '');
  }, 0); // Default time period for d3 transitions is 250ms, so we wait for 300.

  // Verify that y-axis title was removed after transition period.
  //
  Ember.run.later(function(){
    assert.equal(element.find('text.ev-axis-title.ev-y-axis-title').text(), '', 'y-axis title removed');

    assert.equal(component.get('margin.left')(component), component.get('width')/20, 'left margin reset after y-axis title removed');
  }, 100); // Default time period for d3 transitions is 250ms, so we wait for 600 for two.

  wait(); // For Ember.run to complete execution
});

// x-Axis Renders
//
test('x-axis renders with correct translation', function(assert) {
  assert.expect(1);

  // Initialize/render component
  //
  var component = this.subject();
  var element = this.render();

  // Set `dataSource` values to generate x-axis from.
  //
  var testDataSource = [
    {x: 10, y: 20},
    {x: 20, y: 30},
    {x: 30, y: 60}
  ];

  component.set('dataSource', testDataSource);

  // Render x-axis
  //
  component._renderXAxis();

  // Verify that the x-axis was rendered with the correct translation after transition period.
  //
  Ember.run.later(function(){

    var $xAxis = element.find('g.ev-axis.ev-x-axis');

    assert.equal($xAxis.attr('transform'), 'translate(0,' + (component.get('height') - component.get('margin.bottom')(component)) + ')',
      'x-axis translated correctly on render');

  }, 0); // Default time period for d3 transitions is 250ms, so we wait for 300.

  wait(); // For Ember.run to complete execution
});

// y-Axis Renders
//
test('y-axis renders with correct translation', function(assert) {
  assert.expect(1);

  // Initialize/render component
  //
  var component = this.subject();
  var element = this.render();

  // Set `dataSource` values to generate x-axis from.
  //
  var testDataSource = [
    {x: 10, y: 20},
    {x: 20, y: 30},
    {x: 30, y: 60}
  ];

  component.set('dataSource', testDataSource);

  // Render y-axis
  //
  component._renderYAxis();

  // Verify that the y-axis was rendered with the correct translation after transition period.
  //
  Ember.run.later(function(){

    var $yAxis = element.find('g.ev-axis.ev-y-axis');

    assert.equal($yAxis.attr('transform'), 'translate(' + component.get('margin.left')(component) + ',0)',
      'y-axis translated correctly on render');

  }, 0); // Default time period for d3 transitions is 250ms, so we wait for 300.

  wait(); // For Ember.run to complete execution
});
