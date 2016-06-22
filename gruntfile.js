module.exports = function (grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    // minify css
    cssmin: {
      minify_css: {
        files: [{
          expand: true,
          cwd: 'client/src/css',
          src: ['**/*.css', '!**/*.min.css'],
          dest: 'client/dist/css',
          ext: '.min.css'
        }]
      }
    },

    // minify js
    uglify: {
      options: {
        manage: false
      },
      minify_js: {
        files: {
          'client/dist/js/app.min.js': ['client/src/app.js', 'client/src/js/**/*.js']
        }
      }
    },

    // compile sass
    sass: {
      options: {
        style: 'expanded',
        sourcemap: 'none'
      },
      compile_sass: {
        files: [{
          expand: true,
          cwd: 'client/src/sass',
          src: ['**/*.scss'],
          dest: 'client/src/css',
          ext: '.css'
        }]
      }
    },

    // concat css
    concat: {
      concat_css: {
        src: ['client/src/css/**/*.css', '!client/src/css/styles.css'],
        dest: 'client/src/css/styles.css'
      }
    },

    // watch
    watch: {
      sass: {
        files: ['client/src/sass/**/*.scss'],
        tasks: ['sass', 'concat']
      }
    }

  });

  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');

  grunt.registerTask('default', ['sass', 'cssmin', 'uglify']);
};
