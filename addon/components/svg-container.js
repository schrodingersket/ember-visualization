/*
 * Copyright (c) 2015 A Digital Edge, LLC
 */

import Ember from 'ember';

/* global d3 */

/**
 * The expected result of rendering this component is a containing div which has inside
 * of it an SVG element whose size correlates directly to the container's  size. The HTML
 * that is inserted into the DOM is:
 *
 * `<div class="svg-container">`
 * `  <svg width={container width} height={container height}></svg>`
 * `</div>
 */
export default Ember.Component.extend({

  /**
   * The type of element to render this view into. By default,
   * samples will render as `<div/>` elements.
   */
  tagName: 'div',

  /**
   * Class names associated with this view.
   */
  classNames: ['ev-svg-container'],

  /**
   * Holds a reference to the SVG element inside this container. Objects which extend this
   * should retrieve this element via `this.get('svg')`, and can then call d3's `append` method
   * to add SVG elements inside of  it.
   */
  svg: null,

  /**
   * View box height; returns the viewport width for this element, and functions as the effective width
   * for the root SVG element. Note that this does NOT correspond to the width in pixels!
   *
   * Subclasses should use this attribute (which can be overridden) to position their elements relative to the
   * viewport to ensure proper scaling behavior.
   *
   * Returns 809 by default.
   */
  width: 600,

  /**
   * View box height; returns the viewport height for this element, and functions as the effective height
   * for the root SVG element. Note that this does NOT correspond to the width in pixels!
   *
   * Subclasses should use this attribute (which can be overridden) to position their elements relative to the
   * viewport to ensure proper scaling behavior.
   *
   * returns 500 by default.
   */
  height: 400,

  /**
   * Called when the component is to be inserted into the DOM.
   *
   * Renders the SVG element and adds an event handler for window resizing.
   */
  _initializeContainer: (function() {
    this.set('svg', d3.selectAll(this.$()).append('svg:svg')
      .attr('class', 'ev-svg')
      .attr('width', '100%'));

    Ember.run.once(this, '_updateViewPort');

    // Render SVG elements into the base element.
    //
    Ember.run.once(this, 'svgRender');
  }).on('didInsertElement'),

  /**
   * Updates the viewport according to `width` and `height` attributes.
   *
   * Observes `width` and `height`
   */
  _updateViewPort: function() {
    this.get('svg').attr('viewBox', '0 0 ' + this.get('width') + ' ' + this.get('height'));
  }.observes('width', 'height'),

  /**
   * Called when the element's been inserted into the DOM.
   *
   * This function is to be overridden by subclasses in order
   * to append SVG elements to the base element.
   *
   * Subclasses can bind this to properties to render SVG elements
   * when a property of interest changes.
   */
  svgRender: function() { }
});
