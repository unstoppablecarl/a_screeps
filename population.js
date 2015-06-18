'use strict';

var populationData = {};
var totalPopulation = 0;

for(var name in Game.creeps) {
    var creep = Game.creeps[name];
    var role = creep.memory.role;

    if(!populationData[role]){
        populationData[role] = {
            count: 0,
            percent: 0,
        };
    }
    populationData[role].count++;
    totalPopulation++;
}

for(var role in populationData){
    var roleData = populationData[role];
    roleData.percent = roleData.count / totalPopulation;
}

module.exports = populationData;