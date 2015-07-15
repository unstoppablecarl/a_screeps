'use strict';

Memory.cpu = Memory.cpu || {};
Memory.cpu.results = Memory.cpu.results || {};
Memory.cpu.max = Memory.cpu.max || 1000;
Memory.cpu.store_average = Memory.cpu.store_average || false;

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
                records = records.slice(0, max);
            }

            if(this.memory.store_average){
                this.results[key + '_avg'] = this.resultStr(key);
            }
        }
    },

    resultStr: function(key){
        var records = this.results[key];
        return key + ' ' + _.round(average(records)) + ' (avg) ' + records.length + '/' + this.max + '(test count)';
    },

    report: function(){
        console.log('** cpu results **');

        for(var key in this.results){
            var records = this.results[key];

            if(records && records.length){
                console.log(this.resultStr(key));
            }
        }
    }
};

module.exports = out;