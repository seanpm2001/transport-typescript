/*
 * Copyright 2017 VMware, Inc.
 * SPDX-License-Identifier: BSD-2-Clause
 */

var gulp = require('gulp-help')(require('gulp'));
var rename = require('gulp-rename');
var preprocess = require('gulp-preprocess');
var util = require('gulp-util');


// All packages share the same version number.
var VERSION = util.env.version;
var npmFolder = "dist/npm/";

/**
 * Preparing the Transport package
 */

/**
 * The deliverables for Transport are:
 *   - the compiled js files in es5 with es2015 module format
 *   - the minified umd JS bundle
 *   - the Typescript declaration files
 *   - the source maps.
 */
gulp.task("npm:publish:bundles", function () {
    gulp.src([
        'dist/**/*.d.ts',
        'dist/**/*.js',
        'dist/**/*.js.map',
    ]).pipe(gulp.dest(npmFolder + "/transport"));
});

/**
 * We insert the version number in the correct package.json
 * and copy it to the root of our package.
 */
gulp.task("npm:publish:package", function () {
    return gulp.src("build/npm/transport.json")
        .pipe(preprocess({context: {VERSION: VERSION}, extension: "js"}))
        .pipe(rename("package.json"))
        .pipe(gulp.dest(npmFolder + "/transport"));
});

gulp.task("npm:publish", ["npm:publish:bundles", "npm:publish:package"], function () {});

gulp.task("npm:all", ["npm:publish"], function () {});
