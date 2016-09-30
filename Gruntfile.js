module.exports = function(grunt) {

    var fs = require("fs");

    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-sync');
    grunt.loadNpmTasks("grunt-contrib-watch");

    grunt.initConfig({
        sass: {
            dist: {
                options: {
                    style: 'compressed',
                    noCache: true
                  },
                files: {
                    'client/css/styles.css' : 'client/src/styles.scss',
                }
            }
        },
        watch: {
            scss: {
                files: '**/*.scss',
                tasks: ['sass']
            }
        }
    });

    grunt.registerTask("default", ["sass", "watch"]);

}