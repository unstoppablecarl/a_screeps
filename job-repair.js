'use strict';

var job_repair = {
    name: 'repair',
    act: function(creep, job){
        var target = job.target();

        if(!target){
            job.end();
            return;
        }

        var result = creep.repair(target);
        if(result !== OK){
            if(
                result === ERR_NOT_IN_RANGE ||
                result === ERR_NOT_ENOUGH_ENERGY
            ){
                creep.moveTo(target);
            } else {
                job.end();
                return;
            }
        }

        if(target.hits === target.hitsMax){
            job.end();
        }

    },

    getJobs: function(room){
        var structures = room.structures(function(s){

            if(s.hits < s.hitsMax && !s.isTargetOfJobType('repair')){

                var type = s.structureType;
                var threshold = room.repairStartThreshold(type);
                var hitPercent = s.hits / s.hitsMax;

                return hitPercent < threshold;
            }
            return false;
        });

        var roads = room.roads(function(road){
            if(road.hits < road.hitsMax && !road.isTargetOfJobType('repair')){
                var type = road.structureType;
                var threshold = room.repairStartThreshold(type);
                var hitPercent = road.hits / road.hitsMax;

                return hitPercent < threshold;
            }

            return false;
        });

        structures = structures.concat(roads);
        return structures.map(function(structure){

            var priority = 0.4;

            // higher priority to repair rampart when under attack
            if(room.containsHostiles()){
                priority = 0.75;
            }

            if(structure){
                var damage = 1 - (structure.hits / structure.hitsMax);
                var repairPriority = room.repairPriority(structure.structureType);
                // average
                var repairJobPriority = (damage + repairPriority) / 2;
                // move one decimal over
                priority += repairJobPriority * 0.1;
            }

            return {
                role: 'tech',
                type: 'repair',
                target: structure,
                priority: priority
            };

        });
    }
};

module.exports = job_repair;
