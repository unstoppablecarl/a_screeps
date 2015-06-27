'use strict';

var string = function(val) {
    return val === undefined ? '' : '' + val;
};

var length = function(str) {
    return str.replace(/\u001b\[\d+m/g, '').length;
};

var padRight = function(val, width) {
    var str = string(val);
    var len = length(str);
    var pad = width > len ? Array(width - len + 1).join(' ') : '';
    return str + pad;
};

var util = {
    table: function(data) {
        var defaultRow = {};
        var columnMaxLength = {};

        _.each(data, function(row) {
            _.defaults(defaultRow, row);

            _.each(row, function(val, key) {
                var len = length(key);
                if (!columnMaxLength[key] || columnMaxLength[key] < len) {
                    columnMaxLength[key] = len;
                }
            });

            _.each(row, function(val, key) {
                val = string(val);
                var len = length(val);
                if (!columnMaxLength[key] || columnMaxLength[key] < len) {
                    columnMaxLength[key] = len;
                }
            });
        });

        var strRows = [];
        var headerRow = '';
        _.each(defaultRow, function(val, key) {
            var width = columnMaxLength[key] + 2;
            headerRow += padRight(key, width);
        });
        strRows.push(headerRow);

        _.each(data, function(row) {
            row = _.defaults(row, defaultRow);

            var rowStr = '';

            _.each(row, function(val, key) {
                val = string(val);
                var width = columnMaxLength[key] + 2;
                rowStr += padRight(val, width);
            });
            strRows.push(rowStr);
        });

        return strRows.join('\n');
    },
};

module.exports = util;
