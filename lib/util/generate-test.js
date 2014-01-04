/**
 * @file 生成测试文件
 * @author duanlixin[duanlixin@gmail.com]
 */
var fs = require( 'fs' );
var path = require( './path' );
var less = require( 'less' );
var log = require( '../log' );
var format = require( './format' );
/**
 * 生成测试文件
 *
 * @param {Object} map 字体的unicode集合
 * @param {Object} config 配置文件对象
 */
module.exports = exports = function ( map, config ) {

    var testPath = path.resolve( config.test );
    if ( !fs.existsSync( testPath ) ) {
        fs.mkdirSync( testPath );
    }

    writeCss( map, config );
    writeFont( config );
    writeHtml( config );

    log( 'test file done!');

};
function writeCss( map, config ) {
    var names = Object.getOwnPropertyNames( map );
    var addContent = [];
    var tpl = [
        '.icon-e_svg_#{name} {',
        '    .icon(@e_svg_#{name});',
        '}',
    ].join( '\n' );

    

    names.forEach( function ( name ) {
        addContent.push( format( 
            tpl, 
            {
                name: name
            }
        ) );
    } );

    var fontName = config.name;
    var cssPath = path.resolve( config.css );
    var lessFilePath = path.resolve( cssPath, fontName + '.less' );
    var LessContent = fs.readFileSync( lessFilePath, 'utf8' );
    var testPath = path.resolve( config.test );
    var cssFilePath = path.resolve( testPath, fontName + '.css' );

    LessContent += addContent.join( '\n' );

    less.render( LessContent, function ( e, css ) {

        fs.writeFileSync( cssFilePath, css, 'utf8' );
    });
}
function writeFont( config ) {

    var cssPath = path.resolve( config.css );
    var testPath = path.resolve( config.test );
    var files = fs.readdirSync( cssPath );

    var configFonts = config.fonts;

    files.forEach( function ( file ) {

        if ( configFonts.indexOf( path.extname( file ).slice( 1 ) ) !== -1 ) {
            var srcFilePath = path.resolve( cssPath, file );
            var tarFilePath = path.resolve( testPath, file );
            fs.writeFileSync( tarFilePath, fs.readFileSync( srcFilePath, 'utf8' ), 'utf8' );

        }
    } );
}
function writeHtml( config ) {
    var fontName = config.name;
    var cssPath = path.resolve( config.css );
    var jsonPath = path.resolve( cssPath, fontName + '.json' );
    var htmlTplFilePath = path.resolve( __dirname, 'test.tpl' );
    var htmlTpl = fs.readFileSync( htmlTplFilePath, 'utf8' );
    var json = fs.readFileSync( jsonPath, 'utf8' );
    var chars = JSON.parse( json ).chars;

    var result = [];

    chars.forEach( function ( char ) {
        result.push( '<span class="icon icon-' + char.name + '"></span>' );
    } );

    var htmlContent = format( 
        htmlTpl, 
        {
            name: fontName,
            content: result.join( '\n' )
        }
    );
    var testPath = path.resolve( config.test );
    var htmlPath = path.resolve( testPath, 'test.html' );
    fs.writeFileSync( htmlPath, htmlContent, 'utf8' );
}
