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
        return this.tableData(data).join('\n');
    },
    tableData: function(data, indexBy) {
        var defaultRow = {};
        var columnMaxLength = {};

        var allKeys =
        _.map(data, 'user');


        _.each(data, function(row) {
            _.each(row, function(val, key) {
                if(defaultRow[key] === undefined){
                    defaultRow[key] = null;
                }
                if(columnMaxLength[key] === undefined){
                    columnMaxLength[key] = 0;
                }
                key = string(key);
                val = string(val);
                var keyLength = length(key);
                var valLength = length(val);

                columnMaxLength[key] = _.max([columnMaxLength[key], keyLength, valLength]);
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

        if(indexBy){
            var out = {};

            var len = string(strRows.length);
            var rowNumberWidth = length(len) + 2;
            _.each(strRows, function(row, i){
                i = string(i);
                // var key = padRight(i, rowNumberWidth);

                var key = row[indexBy];

                console.log('indexBy', indexBy, JSON.stringify(row));

                out[key] = row;
            });
            return out;
        }

        return strRows;
    },
};

module.exports = util;
