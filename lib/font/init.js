/**
 * @file 初始化入口
 * @author duanlixin[duanlixin@gmail.com]
 */

var log = require( '../log' );
var fs = require( 'fs' );
var path = require( '../util/path' );
/**
 * 命令行配置项
 * 
 * @inner
 * @type {Object}
 */
var cli = {};

/**
 * 命令名称
 * 
 * @type {string}
 */
cli.command = 'init';

/**
 * 命令描述信息
 * 
 * @type {string}
 */
cli.description = '初始化';

/**
 * 命令选项信息
 *
 * @type {Array}
 */
cli.options = [

];

/**
 * 默认配置文件名
 * 
 * @const
 * @type {string}
 */
var DEFAULT_CONF_FILE = 'font-config.js';

/**
 * 模块执行入口
 * 
 */
cli.main = function () {
    var file = path.resolve( process.cwd(), DEFAULT_CONF_FILE );
    var tplFile = path.resolve( __dirname, '../util/', DEFAULT_CONF_FILE );

    if ( !fs.existsSync( file ) ) {
        var buf = fs.readFileSync( tplFile );
        fs.writeFileSync( file, buf );
    }

    var config = require( '../util/font-config.js' );
    
    var imageDir = config.image;

    if ( !fs.existsSync( imageDir ) ) {
        fs.mkdirSync( imageDir );
    }

    var svgDir = config.svg;

    if ( !fs.existsSync( svgDir ) ) {
        fs.mkdirSync( svgDir );
    }

    log( 'edp font init done!' );
};

/**
 * 命令行配置项
 * 
 * @type {Object}
 */
exports.cli = cli;
