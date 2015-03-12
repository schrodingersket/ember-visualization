import Ember from 'ember';

/* global d3 */

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
   * Holds a reference to this
   */
  svg: null,

  /**
   * Renders the SVG element and adds an event handler for window resizing.
   */
  addResizeListener: (function() {
    this.set('svg', d3.selectAll(this.$()).append('svg:svg'));

    this.get('svg')
      .attr('width', this.$().width())
      .attr('height', this.$().height());

    var that = this;

    // Check the visibility when the window is resized (once per run-loop)
    //
    Ember.$(window).on('resize', function() {
      return this.Ember.run.once(that, 'resizeHandler');
    });
  }).on('didInsertElement'),

  /**
   * Called when the component is to be removed from the DOM.
   *
   * This is where we unbind our resize handler.
   */
  removeResizeListener: (function() {
    Ember.$(window).off('resize');
  }).on('willDestroyElement'),

  /**
   * Handles window resize events to re-render SVG. This method is what provides
   * us with a reponsive SVG window.
   */
  resizeHandler: function() {
    this.get('svg')
      .attr('width', this.$().width())
      .attr('height', this.$().height());
  }
});
