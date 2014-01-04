/**
 * @file 生成字体文件
 * @author duanlixin[duanlixin@gmail.com]
 */
var fs = require( 'fs' );
var path = require( './path' );
var log = require( '../log' );

/**
 * 生成字体文件
 *
 * @param {Object} fonts 字体集合
 * @param {Object} config 配置文件对象
 */
module.exports = exports = function ( fonts, config ) {

    var fontName = config.name;
    var configFonts = config.fonts;
    var cssPath = path.resolve( config.css );


    if ( !fs.existsSync( cssPath ) ) {
        fs.mkdirSync( cssPath );
    }

    configFonts.forEach( function ( type ) {
        var fileName = fontName + '.' + type;
        var filepath = path.resolve( cssPath, fileName );

        if ( fonts[ type ] ) {
            
            fs.writeFileSync( filepath, fonts[ type ], 'binary' );

            log( fileName, ' has created' );
        }
    } );
};
