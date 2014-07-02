'use strict';
var gutil = require('gulp-util');
var through = require('through2');
var generator = require('loopback-sdk-angular');

module.exports = function (options) {
  return through.obj(function (file, enc, cb) {
    if (file.isNull()) {
      this.emit('error', new gutil.PluginError('gulp-loopback-sdk-angular', 'Input file ' + file.path + ' not found.'));
      cb();
      return;
    }

    var app;
    try {
      app = require(file.path);

      options = options || { ngModuleName: 'lbServices', apiUrl: undefined };
      options.apiUrl = options.apiUrl || app.get('restApiRoot') || '/api';

      gutil.log('Loaded LoopBack app', gutil.colors.magenta(file.path));
			gutil.log('Generating',
        gutil.colors.magenta(options.ngModuleName),
        'for the API endpoint',
        gutil.colors.magenta(options.apiUrl)
      );

      var script = generator.services(
        app,
        options.ngModuleName,
        options.apiUrl
      );

      file.contents = new Buffer(script);
      
      gutil.log('Generated Angular services file.'); 

			this.push(file);
		} catch (err) {
			this.emit('error', new gutil.PluginError('gulp-loopback-sdk-angular', err));
		}

		cb();
	});
};