/*
 * Copyright (c) 2015 Urbane Innovation, LLC
 */

import LabeledGraph from 'ember-visualization/components/labeled-graph';

/* global d3 */

export default LabeledGraph.extend({

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
   * Specifies whether data should be sorted (by ascending x-axis) or not.
   */
  sort: false,

  /**
   * Returns a d3 line function, which scaled provided points into a form which renders as an SVG "path" element.
   * @param self
   * @returns {*}
   */
  line: function(self) {

    var xScale = self.get('xScale')(self);
    var yScale = self.get('yScale')(self);

    return d3.svg.line()
      .x(function(d) { return xScale(d.x); })
      .y(function(d) { return yScale(d.y); });
  },

  /**
   * Renders the SVG "path" element corresponding to elements found in `dataSource`. Renders as an SVG "path" element.
   * If `dataSource` is null, or if it contains no elements, the "path" element is removed.
   */
  renderPlot: function() {

    var data = this.get('dataSource');
    var self = this;

    if (data && data.length > 0 && this.get('svg')) {

      if (this.get('sort')) {

        // Sort ascending
        //
        data.forEach(function(dataSet) {
          dataSet.data.sort(function(a, b) {
            return a.x - b.x;
          });
        });
      }

      var $line = this.get('svg').selectAll('path.ev-line');
      var lineData = $line.data(data);

      // Handle data exit
      //
      lineData.exit().remove();

      // Modify existing plot
      //
      lineData.attr('d', function(d) {
        return self.get('line')(self)(d.data);
      });

      // Handle data entry
      //
      lineData.enter()
          .append('path')
            .attr('class', 'ev-line')
            .attr('d', function(d) {
              return self.get('line')(self)(d.data);
            })
            .attr('stroke', function(d) {
              d.color = d.color || 'black';

              return d.color;
            })
            .attr('stroke-width', 2)
            .attr('fill', 'none');


    }
    else {
      // Remove when no data source is specified, if it exists.
      //
      this.get('svg')
        .select('path.ev-line')
        .remove();
    }
  }.observes('dataSource', 'dataSource.[]', 'margin.left', 'margin.right', 'margin.top', 'margin.bottom', 'sort')

});
