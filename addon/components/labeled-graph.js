/*
 * Copyright (c) 2015 Urbane Innovation, LLC
 */

import SvgContainer from 'ember-visualization/components/svg-container';

/* global d3 */

export default SvgContainer.extend({

  /**
   * Margin values are subtracted from the viewBox in order to ensure adequate spacing for
   * axes, title, legend, etc.
   *
   * `left` and `bottom` are initially  50 and 30 respectively to compensate for axes (we assume that axes are rendered
   * by default for this component); `top` and `right` are set to a non-zero value if a title and label are rendered,
   * respectively.
   */
  margin: {
    left: function(self) {
      return self.get('width')/20; // Left margin set to 5%
    },
    right: function() {
      return 0;
    },
    bottom: function(self) {
      return self.get('height')/20; // Bottom margin set to 2%
    },
    top: function(self) {
      return self.get('height')/50; // Bottom margin set to 2%
    }
  },

  /**
   * Specifies whether or not we should render the graph legend.
   */
  legend: false,

  /**
   * Graph title.
   *
   * It is expected that modifying this value will add a non-zero value to `margin.top` so that the title
   * does not interfere with the graph itself.
   */
  title: null,

  /**
   * Displays a title for the y-axis.
   */
  xAxisTitle: null,

  /**
   * Displays a title for the x-axis.
   */
  yAxisTitle: null,

  /**
   * Specifies the type of scaling to be used when generating the chart.
   * Currently supported values include:
   *
   * `linear`
   * `time`
   *
   * Default type is `linear`
   */
  xScaleType: 'linear',

  /**
   * Specifies the type of scaling to be used when generating the chart.
   *
   * Currently supported values include:
   *
   * `linear`
   * `time`
   *
   * Default type is `linear`
   */
  yScaleType: 'linear',

  /**
   * Specifies the base to use for logarithmic axis scaling.
   *
   * Defaults to 10.
   */
  base: 10,

  /**
   * Specifies the JSON object value from `dataSource` to use for the x-axis.
   *
   * Defaults to "x."
   */
  xAttr: 'x',

  /**
   * Specifies the JSON object value from `dataSource` to use for the y-axis.
   *
   * Defaults to "y."
   */
  yAttr: 'y',

  /**
   * Closure which returns a d3 scaling function corresponding to `xScale`.
   */
  xScale: function(self) {

    return self.get('_scales.' + self.get('xScaleType'))(
      self.get('_xDomain')(self),
      [self.get('margin.left')(self), self.get('width') - self.get('margin.left')(self) - self.get('margin.right')()],
      { base: self.get('base') });
  },

  /**
   * Closure which returns a d3 scaling function corresponding to `yScaleType`.
   *
   */
  yScale: function(self) {

    return self.get('_scales.' + self.get('yScaleType'))(
      self.get('_yDomain')(self),
      [self.get('height') - self.get('margin.bottom')(self), self.get('margin.top')(self)],
      { base: self.get('base') });
  },

  /**
   * Acts as the base resource for graphs to be rendered from.
   *
   * Assuming that this instance's `xAttr` and `yAttr` attributes are set to
   * "x" and "y" respectively, it should take the following form:
   *
   * ```
   *  [
   *    {x: x_1, y: y_1},
   *    {x: y_2, y: y_2},
   *    .
   *    .
   *    .
   *    {x: y_n, y: y_n}
   *  ]
   * ```
   *
   * ...where x_i and y_i are the x and y values at each index.
   *
   */
  dataSource: [],

  /**
   * Contains scales that are valid for this component.
   *
   * D3 expects a scaling function to be provided to it when creating axes and plots;
   * scaling functions map a provided set of values to the axis/plot domain.
   *
   * @param domain Desired scale domain
   * @param range Desired scale range
   * @param options Contains other options.
   *
   * @private
   */
  _scales: {
    linear: function(domain, range) {
      return d3.scale.linear()
        .domain(domain)
        .range(range);
    },
    time: function(domain, range) {
      return d3.time.scale()
        .domain(domain)
        .range(range);
    },
    log: function(domain, range, options) {
      // Default to base 10 if not otherwise specified
      //
      options.base = options.base || 10;

      // Logarithmic
      //
      return d3.scale.log()
        .base(options.base)
        .domain(domain)
        .range(range);
    }
  },

  /**
   * Calculates the extent of x values found in `dataSource`. The return value of this function is used to generate
   * axes and plots with correct domain scaling.
   *
   * @param self
   * @returns {*}
   * @private
   */
  _xDomain: function(self) {

    var defaultData = [{}];
    defaultData[0][self.get('xAttr')] = 0;
    defaultData[0][self.get('yAttr')] = 0;

    var data = self.get('dataSource') || defaultData;

    var values = data.map(function(d) {
      return d[self.get('xAttr')];
    });

    return d3.extent(values);
  },

  /**
   * Calculates the extent of y values found in `dataSource`. The return value of this function is used to generate
   * axes and plots with correct domain scaling.
   *
   * @param self
   * @returns {*}
   * @private
   */
  _yDomain: function(self) {

    var defaultData = [{}];
    defaultData[0][self.get('xAttr')] = 0;
    defaultData[0][self.get('yAttr')] = 0;

    var data = self.get('dataSource') || defaultData;

    var values = data.map(function(d) {
      return d[self.get('yAttr')];
    });

    return d3.extent(values);
  },

  /**
   * Renders the graph title. Adds an additional top margin if the title exists; otherwise, sets it to zero. Margin
   * state is toggled with a transition.
   *
   * Observes `title`
   */
  _renderTitle: function() {
    if (this.get('title')) {
      this.set('margin.top', function(self) {
        return self.get('height')/10; // Top margin set to 10%);
      });

      var $title = this.get('svg').select('text.ev-title');

      if ($title.empty()) {
        this.get('svg')
          .append('svg:text')
            .attr('class', 'ev-title')
            .attr('x', this.get('width')/2)
            .attr('y', this.get('margin.top')(this)/2)
            .attr('text-anchor', 'middle')
            .text(this.get('title'));
      }
      else {
        $title
          .attr('x', this.get('width')/2)
          .attr('y', this.get('margin.top')(this)/2)
          .attr('text-anchor', 'middle')
          .text(this.get('title'));
      }
    }
    else {
      // Remove when no title is specified, if it exists.
      //
      this.get('svg')
        .select('text.ev-title')
        .remove();

      this.set('margin.top', function(self) {
        return self.get('height')/50; // Bottom margin set to 2%
      });
    }
  }.observes('title'),

  /**
   * Renders the graph's x-axis title. Changes bottom margin of 10% if the label exists; otherwise, sets it to
   * 5% of the container's height (the default value).
   *
   * Observes `xAxisTitle`
   */
  _renderXAxisTitle: function() {
    if (this.get('xAxisTitle')) {
      this.set('margin.bottom', function(self) {
        return self.get('height')/10; // Bottom margin set to 10%);
      });

      var $xAxisTitle = this.get('svg').select('text.ev-axis-title.ev-x-axis-title');

      if ($xAxisTitle.empty()) {
        this.get('svg')
          .append('svg:text')
            .attr('class', 'ev-axis-title ev-x-axis-title')
            .attr('text-anchor', 'middle')
            .attr('x', (this.get('width') + this.get('margin.left')(this) - this.get('margin.right')(this))/2)
            .attr('y', this.get('height'))
            .text(this.get('xAxisTitle'));
      }
      else {
        $xAxisTitle
          .attr('x', (this.get('width') + this.get('margin.left')(this) - this.get('margin.right')(this))/2)
          .attr('y', this.get('height'))
          .text(this.get('xAxisTitle'));
      }
    }
    else {
      // Remove when no title is specified, if it exists.
      //
      this.get('svg')
        .select('text.ev-axis-title.ev-x-axis-title')
        .remove();

      this.set('margin.bottom', function(self) {
        return self.get('height')/20; // Bottom margin set to 5%;
      });
    }
  }.observes('xAxisTitle'),

  /**
   * Renders the graph's y-axis title. Changes bottom margin of 10% if the label exists; otherwise, sets it to
   * 5% of the container's height (the default value).
   *
   * Observes `yAxisTitle`
   */
  _renderYAxisTitle: function() {

    if (this.get('yAxisTitle')) {
      this.set('margin.left', function(self) {
        return self.get('width')/10; // Left margin set to 10%);
      });

      var $yAxisTitle = this.get('svg').select('text.ev-axis-title.ev-y-axis-title');

      if ($yAxisTitle.empty()) {
        this.get('svg')
          .append('svg:text')
            .attr('class', 'ev-axis-title ev-y-axis-title')
            .attr('transform', 'rotate(-90)')
            .attr('text-anchor', 'middle')
            .attr('x', -(this.get('height') + this.get('margin.top')(this) - this.get('margin.bottom')(this))/2)
            .attr('y', this.get('margin.left')(this)/4) // 25% of left margin
            .text(this.get('yAxisTitle'));
      }
      else {
        $yAxisTitle
          .attr('x', -(this.get('height') + this.get('margin.top')(this) - this.get('margin.bottom')(this))/2)
          .attr('y', this.get('margin.left')(this)/4) // 25% of left margin
          .text(this.get('yAxisTitle'));
      }
    }
    else {
      // Remove when no title is specified, if it exists.
      //
      this.get('svg')
        .select('text.ev-axis-title.ev-y-axis-title')
        .remove();

      this.set('margin.left', function(self) {
        return self.get('width')/20; // Left margin set to 5%);
      });
    }
  }.observes('yAxisTitle'),

  /**
   * Renders the x-axis. Since this function observes variables, `this` will refer to the instance whose function is
   * triggered by the observed variable names; hence the reference to `this` instead of passing in `self` as a variable
   * and acting on that.
   *
   * @private
   */
  _renderXAxis: function() {

    var svg = this.get('svg');

    if (svg) {
      var $axis = svg.select('g.ev-axis.ev-x-axis');

      if ($axis.empty()) {
        svg
          .append('svg:g')
            .attr('class', 'ev-axis ev-x-axis')
            .attr('transform', 'translate(0,' + (this.get('height') - this.get('margin.bottom')(this)) + ')')
            .call(d3.svg.axis()
              .scale(this.get('xScale')(this))
              .orient('bottom'));
      }
      else {
        $axis
          .attr('transform', 'translate(0,' + (this.get('height') - this.get('margin.bottom')(this)) + ')')
          .call(d3.svg.axis()
            .scale(this.get('xScale')(this))
            .orient('bottom'));
      }
    }
  }.observes('dataSource.[]', 'margin.left', 'margin.bottom', 'margin.top', 'margin.right', 'height'),

  /**
   * Renders the y-axis. Since this function observes variables, `this` will refer to the instance whose function is
   * triggered by the observed variable names; hence the reference to `this` instead of passing in `self` as a variable
   * and acting on that.
   *
   * @private
   */
  _renderYAxis: function() {

    var svg = this.get('svg');

    // Render only if the root svg element exists.
    //
    if (svg) {
      var $axis = svg.select('g.ev-axis.ev-y-axis');

      if ($axis.empty()) {
        svg
          .append('svg:g')
            .attr('class', 'ev-axis ev-y-axis')
            .attr('transform', 'translate(' + this.get('margin.left')(this) + ',0)')
            .call(d3.svg.axis()
              .scale(this.get('yScale')(this))
              .orient('left'));
      }
      else {
        $axis
          .attr('transform', 'translate(' + this.get('margin.left')(this) + ',0)')
          .call(d3.svg.axis()
            .scale(this.get('yScale')(this))
            .orient('left'));
      }
    }
  }.observes('dataSource.[]', 'margin.left', 'margin.top', 'margin.bottom', 'margin.right')
});
