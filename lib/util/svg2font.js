/**
 * @file 根据svg文件生成css文件和字体文件
 * @author duanlixin[duanlixin@gmail.com]
 */
var fs = require( 'fs' );
var path = require( './path' );
var log = require( '../log' );

/**
 * 根据svg文件生成css文件和字体文件
 *
 * @param {Object} conf 配置文件对象
 */
module.exports = exports = function ( conf ) {
    log( 'svg to font start' );
    log( 'loading...' );
    var fontsmith = require( 'fontsmith' );
    var configFonts = conf.fonts || [];
    var svgDir = path.resolve( conf.svg );
    var svgFilePaths = require( './svgo' )( svgDir );
    
    fontsmith( 
        {
            src: svgFilePaths,
            fonts: configFonts
        }, 
        function ( err, results ) {
            var generateFonts = require( './generate-fonts' );
            var generateStyles = require( './generate-styles');
            var geterateTest = require( './generate-test' );

            generateFonts( results.fonts, conf );
            generateStyles( results.map, conf );
            geterateTest( results.map, conf );

            log( 'done' );
        } 
    );
};