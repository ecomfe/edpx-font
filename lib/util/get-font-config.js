/**
 * @file 获取配置文件信息
 * @author duanlixin[duanlixin@gmail.com]
 */
var fs = require( 'fs' );
var path = require( './path' );
/**
 * 默认配置文件名
 * 
 * @const
 * @type {string}
 */
var DEFAULT_CONF_FILE = 'font-config.js';

/**
 * 加载配置文件
 * 
 * @inner
 * @param {string=} confFile 配置文件路径
 * @param {string=} baseDir 自动查找配置文件的基础路径
 * @return {Object}
 */

module.exports = exports = function ( confFile, baseDir ) {
    var cwd = process.cwd();

    if ( confFile ) {
        confFile = path.resolve( cwd, confFile );
        if ( fs.existsSync( confFile ) ) {
            return require( confFile );
        }

        return null;
    }
    
    var dir;
    var parentDir = baseDir || cwd;
    do {
        dir = parentDir;
        confFile = path.resolve( dir, DEFAULT_CONF_FILE );
        if ( fs.existsSync( confFile ) ) {
            return require( confFile );
        }

        parentDir = path.resolve( dir, '..' );
    } while ( parentDir != dir );

    return getDefaultConfig();
};

function getDefaultConfig() {

    var config = require( './font-config' );
    return config;
}