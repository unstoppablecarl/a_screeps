'use strict';

Memory.cpu = Memory.cpu || {};
Memory.cpu.results = Memory.cpu.results || {};
Memory.cpu.max = Memory.cpu.max || 1000;
Memory.cpu.store_average = Memory.cpu.store_average || false;
Memory.cpu.avg = Memory.cpu.avg || {};

var util = require('util');

var average = function(arr){
    return _.sum(arr) / arr.length;
};

var out = {

    startTimes: {},
    last: null,

    memory: Memory.cpu,
    results: Memory.cpu.results,

    start: function(name){

        this.startTimes[name] = Game.getUsedCpu();
        this.last = name;
    },

    end: function(name){
        var end = Game.getUsedCpu();
        name = name || this.last;

        if(!name) {
            return;
        }

        var start = this.startTimes[name];

        if(!start){
            return;
        }

        var result = end - start;

        if(!this.results[name]){
            this.results[name] = [];
        }

        this.results[name].push(result);
    },

    shutdown: function(){
        var max = this.memory.max || 1000;
        for(var key in this.results){

            if(!_.isArray(this.results[key])){
                this.results[key] = [];
            }

            var records = this.results[key];

            if(records.length > max){
                this.results[key] = records = records.slice(0, max);
            }

            if(this.memory.store_average){
                this.memory.avg[key] = this.resultStr(key);
            }
        }
    },

    resultStr: function(key){
        var records = this.results[key];
        return key + ':: last: ' + _.round(records[records.length - 1]) + ', avg: ' + _.round(average(records)) + ', count: ' + records.length + ' / ' + this.memory.max;
    },

    report: function(){
        console.log('** cpu results **');
        var data = [];
        for(var key in this.results){
            var records = this.results[key];

            if(records && records.length){
                data.push({
                    name: key,
                    avg: _.round(average(records), 2),
                    last: _.round(records[records.length - 1], 2),
                    count: records.length,
                    max: this.memory.max,
                });
            }
        }

        var total = _.sum(data, 'avg');


        console.log(util.table(data));
    }
};

module.exports = out;