'use strict';

const GlimmerApp = require('@glimmer/application-pipeline').GlimmerApp;
const merge = require('broccoli-merge-trees');
const funnel = require('broccoli-funnel');

module.exports = function(defaults) {
  let app = new GlimmerApp(defaults, {
    // Add options here
  });

  const stls = funnel('vendors/tm3_split_mesh/files');

  const stlViewer = funnel('vendors/stl_viewer');

  return merge([app.toTree(), stls, stlViewer]);
};