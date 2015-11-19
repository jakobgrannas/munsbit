var gulp = require('gulp'),
    del = require('del'),
    gutil = require('gulp-util'),
	path = require('path'),
    sass = require('gulp-sass'),
    webpack = require('webpack'),
    nodemon = require('gulp-nodemon'),
    rename = require('gulp-rename'),
    imagemin = require('gulp-imagemin'),
    minifyCSS = require('gulp-minify-css'),
    bourbon = require('node-bourbon'),
	env = process.env.NODE_ENV || 'development',
    basePath = './public',
    paths = {
		scripts: {
			src: basePath + '/js',
			dest: basePath + '/dist/js'
		},
        sass: {
            src: basePath + '/sass/**/*.scss',
            dest: basePath + '/dist/css'
        },
        images: {
            src: basePath + '/images/**/*',
            dest: basePath + '/dist/images'
        }
    };


gulp.task('scripts', function(callback) {
    webpack({
        entry: {
			app: paths.scripts.src + "/app.js",
			vendors: ['react', 'react/addons', 'flux', 'react-dnd']
		},
        output: {
            path: __dirname,
            filename: paths.scripts.dest + "/bundle.js"
        },
        module: {
            loaders: [
                {
                    test: /\.js$/,
                    loader: 'jsx-loader?insertPragma=React.DOM&harmony'
                }
            ]
        },
		plugins: function () {
			var plugins = [
				new webpack.optimize.CommonsChunkPlugin('vendors', paths.scripts.dest + '/vendor.js')
			];

			if(env === 'production') {
				plugins.push(
					new webpack.optimize.UglifyJsPlugin({
						mangle: {
							except: ['$super', '$', 'exports', 'require']
						}
					})
				);
			}

			return plugins;
		}(),
        resolve: {
            extensions: ['', '.js', '.jsx']
        }
    }, function(err, stats) {
        if(err) throw new gutil.PluginError("webpack", err);
        gutil.log("[webpack]", stats.toString());
        callback();
    })

});

gulp.task('sass', function() {
    var atomicPaths = ['utils', 'atoms', 'molecules', 'organisms', 'templates'],
        includePaths = atomicPaths.concat(bourbon.includePaths);

    return gulp.src(paths.sass.src)
        .pipe(sass({
            imagePath: '../images',
            includePaths: includePaths,
            sourceComments: 'map',
            sourceMap: 'sass',
            errLogToConsole: true
        }).on('error', sass.logError))
        .pipe(gulp.dest(paths.sass.dest))
        .pipe(minifyCSS())
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest(paths.sass.dest))
});


gulp.task('images', function() {
    return gulp.src(paths.images.src)
        .pipe(imagemin())
        .pipe(gulp.dest(paths.images.dest));
});

gulp.task('clean', function(callback) {
    del([
		paths.sass.dest + '/**/*.css',
		paths.scripts.dest + '/**/*.js'
	], callback);
});

var changeEvent = function(evt, src) {
    gutil.log('File', gutil.colors.cyan(evt.path.replace(new RegExp('/.*(?=/' + src + ')/'), '')), 'was', gutil.colors.magenta(evt.type));
};

gulp.task('serve', function () {
	require('./server.js');
});

gulp.task('watch', function() {
    gulp.watch(paths.scripts.src + '/**/*.js', ['scripts']);
    gulp.watch(paths.images.src, ['images']);
    gulp.watch(paths.sass.src, ['sass']).on('change', function(evt) {
        changeEvent(evt, 'sass/');
    });
});

gulp.task('default', ['clean', 'sass', 'images', 'scripts', 'serve', 'watch']);
