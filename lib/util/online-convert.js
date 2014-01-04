var page = require('webpage').create();
var async = require('async');
var wait = require( './wait' );

var resultUrl;
var IMAGEONLINECONVERT = 'http://image.online-convert.com/convert-to-svg';
var SUFFIX = '.svg';

/**
 * 打开图片转换网址
 * 
 * @param {Function} cb 回调函数
 */
function openImageOnlineConvert ( cb ) {
    page.open( IMAGEONLINECONVERT, function ( status ) {
        var err = null;
        if ( status === 'fail' ) {
            err = new Error( IMAGEONLINECONVERT + ' could not be opened.' );
        }

        cb( err );
    });
}

/**
 * 等页面的上传文件可用
 * 
 * @param {Function} cb 回调函数
 */
function waitUploadAvailable ( cb ) {
    // Wait for loading to complete
    wait( 
        function () {
            return page.evaluate( function () {

                return document.getElementById( 'file' );
            });
        },
        cb
    );
}

/**
 * 上传文件
 * 
 * @param {Function} cb 回调函数
 */
function uploadImage ( cb ) {

    page.uploadFile( '#file', phantom.args[ 0 ] );

    cb( null );

}

/**
 * 等待上传图片完毕
 * 
 * @param {Function} cb 回调函数
 */
function waitUploadFinish ( cb ) {
    wait(
        function () {

            var uploadValue = page.evaluate( function () {

                return document.getElementById( 'file' ).value;
            });

            return uploadValue;
        }, 
        cb
    );
}
/**
 * 返回svg的下载地址
 * 
 * @param {Function} cb 回调函数
 */
function getSvgUrl ( cb ) {

    page.onNavigationRequested = function ( url ) {
        if ( url.length == url.indexOf( SUFFIX ) + SUFFIX.length ) {
            resultUrl = url;
        }
    };

    page.evaluate( function () {
        $( '#submit_button' ).click();
    });

    wait(
        function () {
            return resultUrl;
        }, 
        cb
    );
}

async.series(
    [
        openImageOnlineConvert,
        waitUploadAvailable,
        uploadImage,
        waitUploadFinish,
        getSvgUrl
    ],
    function ( err ) {
        if (err) {
            console.error( err );
            phantom.exit( 1 );
        } 
        else {
            console.log( resultUrl );
            phantom.exit( 0 );
        }
    } 
);
