/**
 * @file 生成样式文件
 * @author duanlixin[duanlixin@gmail.com]
 */
var fs = require( 'fs' );
var path = require( './path' );
var log = require( '../log' );

// 给生成的字体样式加前缀，防止全局覆盖
var PREVIOUSFONT = 'e_svg_';

/**
 * 生成样式文件
 *
 * @param {Object} map 字体的unicode集合
 * @param {Object} config 配置文件对象
 */
module.exports = exports = function ( map, config ) {
    var formatMap = [];
    var names = Object.getOwnPropertyNames( map );

    names.forEach( function ( name ) {
        formatMap.push( {
            name: PREVIOUSFONT + name,
            value: map[ name ].toString(16)
        } );
    } );

    var fontObj = {};
    var configFonts = config.fonts;
    var fontName = config.name;
    
    configFonts.forEach( function ( type ) {
        var fileName = fontName + '.' + type;
        fontObj[ type ] = fileName;
    } );
    
    var json2fontcss = require( 'json2fontcss' );
    var template = config.template;
    var cssPath = path.resolve( config.css );

    if ( !fs.existsSync( cssPath ) ) {
        fs.mkdirSync( cssPath );
    }
    
    template.forEach( function ( key ) {
        var css = json2fontcss({ 
            chars: formatMap,
            fonts: fontObj,
            fontFamily: config.fontFamily,
            template: key,
            options: {} 
        });
        var fileName = fontName + '.' + ( key == 'stylus' ? 'styl': key );
        var filepath = path.resolve( cssPath, fileName );

        fs.writeFileSync( filepath, css, 'utf8' );
    } );
    log( 'style has created' , formatMap );
};
