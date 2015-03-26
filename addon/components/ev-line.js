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
    var xAttr = self.get('xAttr');
    var yAttr = self.get('yAttr');

    return d3.svg.line()
      .x(function(d) { return xScale(d[xAttr]); })
      .y(function(d) { return yScale(d[yAttr]); });
  },

  /**
   * Renders the SVG "path" element corresponding to elements found in `dataSource`. Renders as an SVG "path" element.
   * If `dataSource` is null, or if it contains no elements, the "path" element is removed.
   */
  renderPlot: function() {

    var data = this.get('dataSource');
    var xAttr = this.get('xAttr');

    if (data && data.length > 0 && this.get('svg')) {

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
