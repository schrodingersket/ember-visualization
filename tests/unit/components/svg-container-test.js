/*
 * Copyright (c) 2015 Urbane Innovation, LLC
 */

import {
  moduleForComponent,
  test
} from 'ember-qunit';

moduleForComponent('svg-container', {
  // specify the other units that are required for this test
  // needs: ['component:foo', 'helper:bar']
});

test('it renders with svg element', function(assert) {
  assert.expect(11);

  // Creates the component instance
  //
  var component = this.subject();
  assert.equal(component._state, 'preRender');

  // Renders the component to the page
  //
  var element = this.render();
  assert.equal(component._state, 'inDOM');
  assert.equal(component.get('element').tagName, 'div'.toUpperCase(), 'matches `div`');

  assert.equal(component.get('classNames').contains('ev-svg-container'), true, 'contains `ev-svg-container` class');
  assert.ok(component.get('svg'));

  // Verify SVG element has the ev-svg class
  //
  assert.equal(element.find('svg').attr('class'), 'ev-svg', 'svg element contains `ev-svg` class');

  // Verify SVG dimensions are equal to the container's dimensions
  //
  assert.equal(element.find('svg').width(), element.width(), 'width is equal');

  // Verify that the component's width and height elements were set properly
  //
  assert.equal(component.get('width'), 600, 'width was set correctly');
  assert.equal(component.get('height'), 400, 'height was set correctly');

  // Update view port
  //
  component.set('width', 1200);
  component.set('height', 800);

  // Verify SVG viewBox was set correctly
  //
  assert.equal(element.find('svg')[0].getAttribute('viewBox'),
    '0 0 1200 800', 'svg element contains correct `viewBox` attribute after height and width update');

  // Verify SVG namespace was set correctly
  //
  assert.equal(element.find('svg')[0].getAttribute('xmlns'), '"http://www.w3.org/2000/svg"',
    'svg element contains correct xmlns');
});
