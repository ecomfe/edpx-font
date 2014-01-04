/**
 * @file 处理命令行下的输入
 * @author duanlixin[duanlixin@gmail.com]
 */
var log = require( '../log' );
var path = require( '../util/path' );
/**
 * 命令行的输入与配置对象的混合
 * 
 * @inner
 * @param {Array.<string>} args 命令行参数
 * @param {Object.<string, string>} opts 命令可选参数
 * @param {String} type 输入类型
 * @return {Object} 混合后的配置对象
 */

module.exports = exports = function ( args, opts, type ) {

    var inputDir = args[ 0 ];
    var outputDir = opts.output;

    // 装载构建配置模块
    var conf = require( './get-font-config' )( opts.config, inputDir );

    if ( !conf ) {
        log.error( 'Font Build Config cannot found!' );
        process.exit( 0 );
    }
    // 处理构建的输入和输出目录
    if ( inputDir ) {
        conf[ type ] = path.resolve( process.cwd(), inputDir );
        conf.output = path.resolve( inputDir, 'output' );
    }

    outputDir && (conf.output = path.resolve( process.cwd(), outputDir ));

    return conf;
};