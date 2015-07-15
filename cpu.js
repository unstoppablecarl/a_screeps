'use strict';




var out = {

    max: 1000,

    data: {},
    results: {},

    last: null,

    start: function(name){
        if(!Memory.cpu){
            Memory.cpu = {};
        }
        this.data[name] = Game.getUsedCpu();
        this.last = name;
    },

    end: function(name){
        name = name || this.last;

        if(!name) {
            return;
        }

        var start = this.data[name];

        if(!start){
            return;
        }

        var result = Game.getUsedCpu() - start;

        this.results[name] = Math.round(result * 100) / 100;
    },

    shutdown: function(){
        for(var key in this.results){
            var result = this.results[key];

            if(!_.isArray(Memory.cpu[key])){
                Memory.cpu[key] = [];
            }
            var dest = Memory.cpu[key];
            dest.push(result);

            if(dest.length > this.max){
                Memory.cpu[key] = dest.slice(0, this.max);
            }
        }
    },

    average: function(name){
        var source = Memory.cpu[name];
        var total = 0;

        for (var i = 0; i < source.length; i++) {
            total += source[i];
        }
        var average = total / source.length;

        return Math.round(average * 100) / 100;
    },
    report: function(){
        console.log('cpu results');

        for(var key in Memory.cpu){

            var item = Memory.cpu[key];

            if(item && item.length){
                console.log(key, this.average(key), '(avg) ', item.length, '(test count)');
            }
        }
    }
};

module.exports = out;