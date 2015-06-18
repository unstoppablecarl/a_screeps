'use strict';

var data = {
    harvester: {
        populationWeight: 0.5
    },
    builder: {
        populationWeight: 0.25
    },
    guard: {
        populationWeight: 0.25
    }
};

var totalWeight = 0;
for(var key in data){
    var creep = data[key];
    totalWeight += creep.populationWeight;
}

for(var key in data){
    var creep = data[key];
    creep.populationPercent = creep.populationWeight / totalWeight;
}

module.exports = data;