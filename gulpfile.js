var gulp  = require('gulp');
var shell = require('gulp-shell');


gulp.task('default', shell.task([
    'echo',
    'echo COMMANDS LIST :',
    'echo - build  : Prepare the project to be pushed on the server',
    'echo - push  : Push the project on the server',
    'echo - deploy  : Build then push the project on the server',
    'echo'
]));

gulp.task('build', shell.task([
    'echo',
    'echo Building the project into ./dist ...',
    'echo',
    'rsync -avz --progress --exclude-from "exclude-list-gulp.txt" ./ dist/',
    './node_modules/.bin/webpack',
    'echo',
    'echo Building finished',
    'echo'
]));

gulp.task('push', shell.task([
    'echo',
    'echo Deploying the project on the server ...',
    'echo',
    'scp -r dist/* tester@217.70.189.97:/var/www/html/alexa-parkinson',
    'ssh -t tester@217.70.189.97 "cd /var/www/html/alexa-parkinson && sudo docker-compose down  && sudo docker-compose up -d"',
    'echo',
    'echo Push finished',
    'echo',
]));

gulp.task('deploy', ['build'], function() {
    gulp.run('push');
    shell.task([
        'echo',
        'echo Deleting the build file',
        'echo',
        'rm -rf dist/',
        'echo',
        'echo Deployment finished',
        'echo',
    ]);
});
