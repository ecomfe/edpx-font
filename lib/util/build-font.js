/**
 * @file 图片转换成字体
 * @author duanlixin[duanlixin@gmail.com]
 */
var log = require( '../log' );
var fs = require( 'fs' );
var path = require( './path' );
var async = require( 'async' );

/**
 * 图片转换成字体
 *
 * @param {Object} conf 配置文件对象
 */
module.exports = exports = function ( conf ) {

    var imageDir = path.resolve( process.cwd(), conf.image );
    if ( fs.existsSync( imageDir ) ) {

        var files = fs.readdirSync( imageDir );

        async.series(
            [
                function ( cb ) {
                    require( './img2svg' )( conf, cb );
                },
                function ( cb ) {
                    require( './svg2font' )( conf );
                    cb( null );
                }
            ],
            function ( err ) {
                if( err ) {
                    log( err );
                }
            } 
        );
        log( 'image files : ', files );
    }
    else {
        log( 'image目录不存在' );
    }
};