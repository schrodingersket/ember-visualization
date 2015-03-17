/*
 * Copyright (c) 2015 Urbane Innovation, LLC
 */

/* jshint node: true */
'use strict';

module.exports = {
  name: 'ember-visualization',

  included: function(app) {
    this._super.included(app);

    app.import(app.bowerDirectory + '/d3/d3.min.js');
  }
};
