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
  classNames: ['svg-container'],

  /**
   * Holds a reference to the SVG element inside this container. Objects which extend this
   * should retrieve this element via `this.get('svg')`, and can then call d3's `append` method
   * to add SVG elements inside of  it.
   */
  svg: null,

  /**
   * Holds a reference to this container's current width. Objects which extend this should retrieve
   * this value via `this.get('width')`. This value is updated whenever the container is resized,
   * and is meant to be used as a bound property for re-rendering the contents of this component's
   * SVG element.
   */
  width: null,

  /**
   * Holds a reference to this container's current height. Objects which extend this should retrieve
   * this value via `this.get('height')`. This value is updated whenever the container is resized,
   * and is meant to be used as a bound property for re-rendering the contents of this component's
   * SVG element.
   */
  height: null,

  /**
   * Defines the margins for this SVG element.
   */
  margin: {top: 20, right: 10, bottom: 20, left: 10},

  /**
   * Called when the component is to be inserted into the DOM.
   *
   * Renders the SVG element and adds an event handler for window resizing.
   */
  didInsertElement: (function() {
    this.set('svg', d3.selectAll(this.$()).append('svg:svg'));

    // Set initial dimension
    //
    this._resizeHandler();

    var self = this;

    // Check the visibility when the window is resized (once per run-loop)
    //
    Ember.$(window).on('resize', function() {
      return this.Ember.run.once(self, '_resizeHandler');
    });
  }),

  /**
   * Called when the component is to be removed from the DOM.
   *
   * This is where we unbind our resize handler.
   */
  willDestroyElement: (function() {
    Ember.$(window).off('resize');
  }),

  /**
   * Handles window resize events to re-render SVG. This method is what provides
   * us with a reponsive SVG window.
   */
  _resizeHandler: function() {

    // Set component variables
    //
    this.set('width', this.$().width() - this.get('margin.left') - this.get('margin.right'));
    this.set('height', this.$().height());

    this.get('svg')
      .attr('width', this.get('width'))
      .attr('height', this.get('height'));
  }
});
