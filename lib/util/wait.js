/**
 * 每隔1秒执行一次检查函数，当检查函数返回true时，执行回调函数
 * 
 * @param {function} check 检查函数
 * @param {function} callback 回调函数
 */

function wait ( check, callback ) {

    if ( check() ) {
        callback();
    } 
    else {
        setTimeout( 

            function waitForFn () {

                wait( check, callback );
            }, 
            1000
        );
    }
}

module.exports = exports = wait;