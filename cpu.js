'use strict';

var out = {
    data: {},
    results: {},

    last: null,

    start: function(name){
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

    report: function(){
        console.log('cpu results');
        for(var key in this.results){
            console.log('cpu ', key, this.results[key]);
        }
    }
};

module.exports = out;