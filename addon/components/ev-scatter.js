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
    self._renderLegend();
  },

  /**
   * Renders each point found in `dataSource` as an SVG "circle" element. If `dataSource` is null,
   * or if it contains no elements, all already-rendered points are removed.
   */
  renderPlot: function() {

    if (this.get('dataSource') && this.get('dataSource').length > 0 && this.get('svg')) {

      var xScale = this.get('xScale')(this);
      var yScale = this.get('yScale')(this);

      var self = this;

      // Remove all points
      //
      this.get('svg').selectAll('circle.ev-point').remove();

      var $points = this.get('svg').selectAll('circle.ev-point');

      // Update currently rendered points
      //
      this.get('dataSource').forEach(function(dataSet) {

        var color = dataSet.color || 'black';

        // Add any new points
        //
        $points
          .data(dataSet.data)
          .enter()
        .append('svg:circle')
          .attr('data-series', 'foo')
          .attr('class', 'ev-point')
          .attr('r', self.get('pointRadius'))
          .attr('cx', function(d) {
            return xScale(d.x);
          })
          .attr('cy', function(d) {
            return yScale(d.y);
          })
          .attr('fill', color);
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
