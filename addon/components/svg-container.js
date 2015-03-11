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
   * Adds and stores the base svg element for this view
   *
   * Be sure to call this._super() when extending this method!
   */
  didInsertElement: function() {
    this.set('svg', d3.selectAll(this.$()).append('svg:svg'));

    this.get('svg')
        .attr('width', this.$().width())
        .attr('height', this.$().height());

    Ember.$(window).on('resize', this.resizeHandler.bind(this));
  },

  /**
   * Called when the component is to be removed from the DOM.
   *
   * This is where we unbind our resize handler.
   */
  willDestroyElement: function() {
    Ember.$(window).off('resize', this.resizeHandler);
  },

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
