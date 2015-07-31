'use strict';

module.exports = function(grunt) {

    var password = grunt.option('pass');

    grunt.loadNpmTasks('grunt-screeps');

    grunt.initConfig({
        screeps: {
            options: {
                email: 'unstoppablecarlolsen@gmail.com',
                password: password,
                branch: 'default'
            },
            dist: {
                src: ['src/*.js']
            }
        }
    });
};
