'use strict';

var gulp = require('gulp');
var pkg = require('./package.json');
var plug = require('gulp-load-plugins')();
var browserSync = require('browser-sync').create();

var env = plug.util.env;
var log = plug.util.log;

/**
 * @desc Minify and bundle the app's JavaScript
 */

gulp.task('js', function () {
    log('Bundling, minifying, and copying the app\'s JavaScript');

    var source = [].concat(pkg.paths.js);

    return gulp
        .src(source)
        // .pipe(plug.sourcemaps.init()) // get screwed up in the file rev process
        .pipe(plug.concat('all.min.js'))
        .pipe(plug.ngAnnotate({add: true, single_quotes: true}))
        .pipe(plug.uglify({mangle: true}))
        // .pipe(plug.sourcemaps.write('./'))
        .pipe(gulp.dest(pkg.paths.build));
});

/**
 * @desc Minify and bundle the CSS
 */
gulp.task('css', function () {
    log('Bundling, minifying, and copying the app\'s CSS');
    return gulp.src(pkg.paths.css)
        .pipe(plug.concat('all.min.css')) // Before bytediff or after
        .pipe(plug.autoprefixer('last 2 version', '> 5%'))
        .pipe(plug.minifyCss({}))
        //        .pipe(plug.concat('all.min.css')) // Before bytediff or after
        .pipe(gulp.dest(pkg.paths.build + '/css'));
});
/**
 * @desc Create, connect to the server
 */
var reload = browserSync.reload;
gulp.task('connect', function () {
    browserSync.init({
        notify: false,
        port: 1338,
        server: {
            baseDir: [
                'app'
            ]
        }
    });
});

/*
 * @desc Watch files
 */
gulp.task('watch', function () {
    gulp.watch([pkg.paths.js, pkg.paths.html]).on('change', browserSync.reload);
});



/**
 * Inject all the files into the new index.html
 * rev, but no map
 * @return {Stream}
 */
gulp.task('rev-and-inject', ['js', 'css'], function () {
    log('Rev\'ing files and building index.html');

    var minified = pkg.paths.build + '**/*.min.*';
    var index = pkg.paths.client + 'index.html';

    var minFilter = plug.filter(['**/*.min.*', '!**/*.map']);
    var indexFilter = plug.filter(['index.html']);

    return gulp
        .src([].concat(minified, index)) // add all staged min files and index.html
        .pipe(minFilter) // filter the stream to minified css and js
        // .pipe(plug.rev()) // create files with rev's
        .pipe(gulp.dest(pkg.paths.build)) // write the rev files
        // if we create and write rev.manifest here, replace doesn't happen.
        .pipe(minFilter.restore()) // remove filter, back to original stream
        .pipe(indexFilter) // filter to index.html
        .pipe(inject('css/all.min.css'))
        .pipe(inject('all.min.js'))
        .pipe(indexFilter.restore()) // remove filter, back to original stream
        .pipe(gulp.dest(pkg.paths.build)) // write the index.html file changes
        .pipe(gulp.dest(pkg.paths.build)); // write the manifest

    function inject(path, name) {
        var glob = pkg.paths.build + path;
        var options = {
            ignorePath: pkg.paths.build.substring(1),
            addRootSlash: false
        };
        if (name) {
            options.name = name;
        }
        return plug.inject(gulp.src(glob), options);
    }
});

/**
 * Build the optimized app
 * @return {Stream}
 */
gulp.task('build', ['rev-and-inject'], function () {
    log('Building the optimized app');

    return gulp.src('').pipe(plug.notify({
        onLast: true,
        message: 'Deployed code!'
    }));
});

gulp.task('default', ['connect']);


gulp.task('js:build', function () {
    gulp.src(path.src.js)
        .pipe(uglify())
        .pipe(gulp.dest('build/all.min.js'));
});