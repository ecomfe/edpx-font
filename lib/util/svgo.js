var log = require( '../log' );
var fs = require( 'fs' );
var path = require( './path' );
var async = require('async');
module.exports = exports = function ( dirPath ) {
    if ( fs.existsSync( dirPath ) ) {
        var exec = require( 'child_process' ).exec;
        var files = fs.readdirSync( dirPath );

        if( files.length == 0 ) {
            log.error( '目录为空!' );
            return;
        }
        
        var fullPaths = [];
        files.forEach( function ( file ) {
            if ( file === '.svn' || file === '.git' ) {
                return;
            }
            var filePath = path.resolve( dirPath, file );
            // log(filePath)
            async.series( 
                [
                    function ( callback ) {
                        exec('svgo ' + filePath );
                        callback( null );
                    },
                    function ( callback ) {
                        fullPaths.push( filePath );
                        callback( null );
                    }
                ], 
                function ( error ) {
                }
            );
        } );

        // console.log(fullPaths)
        return fullPaths;
    }
    else {

        log.error( '目录不存在!' );
    }

};

