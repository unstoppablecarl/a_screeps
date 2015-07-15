'use strict';

var job_helpers = require('job-helpers');

var job_repair = {
    name: 'repair',
    act: function(creep, job){
        var target = job.target();

        if(!target){
            job.end();
            return;
        }

        var repairEnd = creep.room.repairEndThreshold(target.structureType);
        if(repairEnd){
            var repairPercent = target.hits / target.hitsMax;
            if(repairPercent >= repairEnd){
                job.end();
                return;
            }
        }

        if(creep.energy === 0){
            if(job_helpers.findEnergy(creep, job)){
                return;
            }
        }

        // do not stand on top of target
        if(!creep.pos.isNearTo(target)){
            var move = creep.moveTo(target);

            var moveOK = (
                move === OK ||
                move === ERR_TIRED ||
                move === ERR_NO_PATH
            );

             if(!moveOK){
                job.end();
                return;
            }
        }

        var action = creep.repair(target);
        var actionOK = (
            action === OK ||
            action === ERR_NOT_IN_RANGE ||
            action === ERR_NOT_ENOUGH_ENERGY
        );

        if(!actionOK){
            job.end();
        }

        if(target.hits === target.hitsMax){
            job.end();
        }

    },

    getJobs: function(room){
        var structures = room.structures(function(s){
            if(s.hits < s.hitsMax){

                var repairAmount = s.hitsMax - s.hits;
                if(repairAmount > 10000){
                    var adjacentTiles = s.pos.adjacentEmptyTileCount();

                    if(adjacentTiles > 3){
                        adjacentTiles = 3;
                    }

                    var currentCount = s.targetOfJobTypeCount('repair');
                    if(currentCount >= adjacentTiles){
                        return false;
                    }
                } else {
                    if(s.isTargetOfJobType('repair')){
                        return false;
                    }
                }

                var type = s.structureType;
                var threshold = room.repairStartThreshold(type);
                var hitPercent = s.hits / s.hitsMax;
                return hitPercent < threshold;
            }
            return false;
        });

        var cpu = require('cpu');
        cpu.start('roads');
        var roads = room.roads(function(road){
            if(
                road.hits < road.hitsMax &&
                !road.isTargetOfJobType('repair')
            ){
                var type = road.structureType;
                var threshold = room.repairStartThreshold(type);
                var hitPercent = road.hits / road.hitsMax;

                return hitPercent < threshold;
            }

            return false;
        });
        cpu.end();

        // var repairWallsTo = 10000;
        // var wallFlags = room.flags().filter(function(flag){
        //     return flag.role() === 'wall_repair';
        // });

        // wallFlags.forEach(function(flag){
        //     var range = flag.memory.wall_repair_range || 2;
        //     var walls = flag.pos.findInRange(FIND_STRUCTURES, range).filter(function(s){
        //         return (
        //             s.structureType === STRUCTURE_WALL &&
        //             s.hits < repairWallsTo &&
        //             !s.isTargetOfJobType('repair')
        //         );
        //     });

        //     walls.forEach(function(wall){
        //         structures.push(wall);
        //     });
        // });

        // var walls = room.walls(function(wall){
        //     if(
        //         wall.hits < wall.hitsMax &&
        //         !wall.isTargetOfJobType('repair') &&
        //         wall.pos.adjacentEmptyTileCount() > 0
        //     ){
        //         var type = wall.structureType;
        //         var threshold = room.repairStartThreshold(type);
        //         var hitPercent = wall.hits / wall.hitsMax;

        //         return hitPercent < threshold;
        //     }

        //     return false;
        // });

        structures = structures.concat(roadsu);

        return structures.map(function(structure){

            var priority = 0.6;

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
