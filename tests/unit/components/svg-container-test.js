import {
  moduleForComponent,
  test
} from 'ember-qunit';

moduleForComponent('svg-container', {
  // specify the other units that are required for this test
  // needs: ['component:foo', 'helper:bar']
});

test('it renders with svg element', function(assert) {
  assert.expect(10);

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
  assert.equal(element.find('svg').width(), element.width());
  assert.equal(element.find('svg').height(), element.height() - 4);

  // Verify that the component's width and height elements were set properly
  //
  assert.equal(component.get('width'), 100);
  assert.equal(component.get('height'), 162);
});
