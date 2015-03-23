/*
 * Copyright (c) 2015 Urbane Innovation, LLC
 */

import LabeledGraph from 'ember-visualization/components/labeled-graph';

export default LabeledGraph.extend({

  /**
   * Specifies the radius for each plot point.
   */
  pointRadius: 3.5,

  /**
   * Renders supporting components.
   */
  svgRender: function(self) {
    self._renderXAxis();
    self._renderYAxis();
    self._renderTitle();
    self._renderXAxisTitle();
    self._renderYAxisTitle();

    self.get('dataSource');
  },

  renderPlot: function() {

    if (this.get('dataSource') && this.get('svg')) {
      var $points = this.get('svg').selectAll('circle.ev-point');

      var xScale = this.get('xScale')(this);
      var yScale = this.get('yScale')(this);
      var xAttr = this.get('xAttr');
      var yAttr = this.get('yAttr');

      // Update currently rendered points
      //
      $points
        .data(this.get('dataSource'))
        .attr('cx', function(d) {
          return xScale(d[xAttr]);
        })
        .attr('cy', function(d) {
          return yScale(d[yAttr]);
        });

      // Add any new points
      //
      $points
        .data(this.get('dataSource'))
        .enter()
      .append('svg:circle')
        .attr('class', 'ev-point')
        .attr('r', this.get('pointRadius'))
        .attr('cx', function(d) {
          return xScale(d[xAttr]);
        })
        .attr('cy', function(d) {
          return yScale(d[yAttr]);
        });
    }
    else {
      // Remove when no data source is specified, if it exists.
      //
      this.get('svg')
        .select('circle.ev-point')
        .transition()
        .remove();
    }
  }.observes('dataSource', 'dataSource.[]', 'margin.left', 'margin.right', 'margin.top', 'margin.bottom')

});
