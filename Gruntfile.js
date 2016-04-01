module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        bower: {
            install: {
                //just run 'grunt bower:install' and you'll see files from your Bower packages in lib directory
            },
            options: {
                copy: false
            }
        },
        less: {
            development: {
                options: {
                    compress: true,
                    yuicompress: true,
                    optimization: 2,
                    banner: '/*!\n (c)<%= grunt.template.today("yyyy") %> The Coding Forge\n <%= pkg.name %> <%= pkg.version %> \n Generated on: <%= grunt.template.today("yyyy-mm-dd") %> \n*/\n',
                },
                files: {
                    // target.css file: source.less file
                    "dist/<%= pkg.name %>.min.css": "src/<%= pkg.name %>.less"
                },
            },
        },
        uglify: {
            options: {
                mangle: true,
                banner: '/*!\n (c)<%= grunt.template.today("yyyy") %> The Coding Forge\n <%= pkg.name %> <%= pkg.version %> \n Generated on: <%= grunt.template.today("yyyy-mm-dd") %> \n*/\n'
            },
            build: {
                files: {
                    'dist/<%= pkg.name %>.min.js': ['src/<%= pkg.name %>.js']
                }
            },
        },
        copy: {
            main: {
                files: [
                    {
                        expand: true,
                        cwd: "bower_components/jquery/dist/",
                        src: ['jquery.min.js'],
                        dest: 'dist/demo/deps/'
                    }
                ],
            },
        }
    });

    // Loading node plugins for our tasks
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-bower-task');
    grunt.loadNpmTasks('grunt-contrib-copy');
    // Default task(s).
    grunt.registerTask('default', ['bower:install', 'less', 'uglify', 'copy:main']);

};
