

module.exports = exports = function ( source, opts ) {
    source = String( source );
    return source.replace( /#\{(.+?)\}/g, function ( match, key ) {
        var replacer = opts[ key ];
        return ( 'undefined' == typeof replacer ? '' : replacer );
    });
};