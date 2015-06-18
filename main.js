var harvester = require('harvester');
var builder = require('builder');
var guard = require('guard');

if (!Game.spawns.Spawn1.spawning){

    // data
    var creepTypes = require('creep-types');
    var roleDistribution = require('role-distribution.js');
    var population = require('population');

    var maxGapRole;
    var maxGap = 0;

    for(var role in roleDistribution){
        var populationPercent = population[role].populationPercent;
        var targetPopulationPercent = roleDistribution[role].populationPercent;
        var gap = targetPopulationPercent - targetPopulationPercent;
        if(gap > maxGap){
            maxGap = gap;
            maxGapRole = role;
        }
    }

    Game.spawns.Spawn1.spawnCreep(role);
}

for(var name in Game.creeps) {
    var creep = Game.creeps[name];

    if(creep.memory.role == 'harvester') {
        harvester(creep);
    }

    if(creep.memory.role == 'builder') {
        builder(creep);
    }

    if(creep.memory.role == 'guard') {
        guard(creep);
    }
}