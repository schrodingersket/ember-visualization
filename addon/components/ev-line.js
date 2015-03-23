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

    self.get('dataSource');
  },

  /**
   * Specifies whether data should be sorted (by ascending x-axis) or not.
   */
  sort: false,

  line: function(self) {

    var xScale = self.get('xScale')(self);
    var yScale = self.get('yScale')(self);
    var xAttr = self.get('xAttr');
    var yAttr = self.get('yAttr');

    return d3.svg.line()
      .x(function(d) { return xScale(d[xAttr]); })
      .y(function(d) { return yScale(d[yAttr]); });
  },

  renderPlot: function() {

    var data = this.get('dataSource');
    var xAttr = this.get('xAttr');

    if (data && this.get('svg')) {

      if (this.get('sort')) {

        // Sort ascending
        //
        data.sort(function(a, b) {
          return a[xAttr] - b[xAttr];
        });
      }

      var $line = this.get('svg').selectAll('path.ev-line');

      if ($line.empty()) {
        this.get('svg')
          .append('path')
            .attr('class', 'ev-line')
            .attr('d', this.get('line')(this)(data))
            .attr('stroke', 'black')
            .attr('stroke-width', 2)
            .attr('fill', 'none');
      }
      else {
        $line.attr('d', this.get('line')(this)(data));
      }
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
