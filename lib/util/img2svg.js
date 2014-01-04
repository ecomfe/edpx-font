/**
 * @file 根据图片文件生成svg文件
 * @author duanlixin[duanlixin@gmail.com]
 */
var fs = require( 'fs' );
var path = require( './path' );
var log = require( '../log' );
var exec = require( 'child_process' ).exec;
var wait = require( './wait' );
var async = require( 'async' );
var onLineconvert = path.resolve( __dirname, 'online-convert.js' );
var request = require( 'request' );
var fileCount = 0;
var index = 0;
var baseDir = process.cwd();
/**
 * 根据svg文件生成css文件和字体文件
 *
 * @param {Object} conf 配置文件对象
 */
module.exports = exports = imageToSvg;

function getFiles ( imageDir ) {
    var files = [];
    
    if ( fs.existsSync( imageDir ) ) {
        files = fs.readdirSync( imageDir );
        fileCount = files.length;
        return files;
    }
}

function imageToSvg ( conf, cb ) {
    cb = cb || function( err ) {
            if( err ) {
                log( err );
                return;
            }
    };
    var imageDir = path.resolve( baseDir, conf.image );
    var file = getFiles( imageDir )[ index ];
    async.waterfall(
        [
            function execOnlineConvert ( cb ) {
                var filePath = path.resolve( imageDir, file );
                log( 'image convert to svg start...' );
                // log( 
                //     'onLineconvert start...' , 
                //     'phantomjs ' + onLineconvert + ' ' + filePath
                // );
                exec( 'phantomjs ' + onLineconvert + ' ' + filePath, cb );
            },
            function handleReturn ( svgUrl, err, cb ) {
                if ( err ) {
                  var err = new Error( err );
                  return cb( err );
                }

                cb( null, svgUrl );
            },
            function getSvgUrl ( svgUrl, cb ) {
                log( 'svg url', svgUrl );
                request( 
                    {
                        'url': svgUrl, 
                        'encoding': 'binary'
                    }, 
                    cb
                );
            },
            function ( res, body, cb ) {
                var svgPath = path.resolve( conf.svg );

                if ( !fs.existsSync( svgPath ) ) {
                    fs.mkdirSync( svgPath );
                }
                
                var fileName = path.basename( file, path.extname( file ) );
                var svgFile = path.resolve( svgPath, fileName + '.svg' );

                fs.writeFileSync( svgFile, body, 'utf8' );
                
                cb( null );
            }
        ],
        function( err ) {
            if( err ) {
                log( err );
                return;
            }

            index++;

            log( '已完成' + index + '/' + fileCount + '文件!' );

            index != fileCount ? imageToSvg( conf, cb ) : cb( null );

        }

    );
}