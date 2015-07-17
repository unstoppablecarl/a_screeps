'use strict';

var string = function(val) {
    return val === undefined ? '' : '' + val;
};

var length = function(str) {
    return str.replace(/\u001b\[\d+m/g, '').length;
};
var padRight = function(val, width, padStr) {
    padStr = padStr || ' ';
    var str = string(val);
    var len = length(str);
    var pad = width > len ? Array(width - len + 1).join(padStr) : '';
    return str + pad;
};

var padLeft = function(val, width, padStr) {
    padStr = padStr || ' ';
    var str = string(val);
    var len = length(str);
    var pad = width > len ? Array(width - len + 1).join(padStr) : '';
    return pad + str;
};

var util = {
    table: function(data) {
        return this.tableData(data).join('\n');
    },
    tableData: function(data, indexBy, padStr) {
        var defaultRow = {};
        var columnMaxLength = {};

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

        var headerRow = '';
        var strRows = [];
        var out = {};

        _.each(defaultRow, function(val, key) {
            var width = columnMaxLength[key] + 2;
            headerRow += padLeft(key, width, padStr);
        });

        if(!indexBy){
            strRows.push(headerRow);
        } else {
             out._columns = headerRow;
        }

        _.each(data, function(row) {
            row = _.defaults(row, defaultRow);

            var rowStr = '';

            _.each(row, function(val, key) {
                val = string(val);
                var width = columnMaxLength[key] + 2;
                rowStr += padLeft(val, width, padStr);
            });

            if(!indexBy){
                strRows.push(rowStr);
            } else {
                out[row[indexBy]] = rowStr;
            }
        });

        if(indexBy){
           return out;
        }

        return strRows;
    },
};

module.exports = util;
