'use strict';

var role = {

    init: function(creep) {
        var flag = creep.assignedFlag();
        if (flag && !creep.assignedSourceId()) {
            this.assignToFlag(creep, flag);
        }
    },

    onAssignToFlag: function(creep, flag) {
        var sourceId = flag.assignedSourceId();
        creep.sourceId(sourceId);
    },

    act: function(creep) {

        // var mem = creep.memory;

        // if (mem.wait_count && mem.wait_count > 100 && creep.energy == 0) {

        //     mem.assignedSourceId = null;
        //     mem.wait_count = 0;
        //     creep.say('tired of waiting');
        // }

        // var sourceId = creep.memory.assignedSourceId;

        // if (!sourceId) {
        //     var flaggedSources = manageFlags.getSources();
        //     var index = Math.floor(Math.random() * flaggedSources.length);
        //     creep.memory.assignedSourceId = flaggedSources[index].id;
        //     creep.say('new source id');
        // }

        if (creep.energy < creep.energyCapacity) {
            var source = creep.source();
            if(source){
                creep.moveTo(source);
                creep.harvest(source);
            }

        } else {

            var target = this.findNearestEnergyDrop(creep);
            if (target) {
                creep.moveTo(target);
                creep.transferEnergy(target);
            } else {
                var targetConstruction = creep.pos.findClosest(FIND_CONSTRUCTION_SITES);
                if (targetConstruction) {
                    creep.moveTo(targetConstruction);
                    creep.build(targetConstruction);
                    return;
                } else {
                    creep.moveTo(Game.flags.Flag1);
                }
            }
        }

        // if (!mem.wait_count) {
        //     mem.wait_count = 0;
        // }

        // if (mem.prev_pos && mem.prev_pos.x == creep.pos.x && mem.prev_pos.y == creep.pos.y) {
        //     mem.wait_count++;

        // } else {
        //     mem.wait_count = 0;
        // }

        // mem.prev_pos = creep.pos;

    },
    findNearestEnergyDrop: function(creep) {
        var pos = creep.pos;
        var targets = [];
        var extension = pos.findClosest(FIND_MY_STRUCTURES, {
            filter: function(structure) {
                if (structure.structureType == STRUCTURE_EXTENSION) {
                    return structure.energy < structure.energyCapacity;
                }
            }
        });

        var spawn = pos.findClosest(FIND_MY_SPAWNS, {
            filter: function(structure) {
                return structure.energy < structure.energyCapacity;
            }
        });

        if (extension) {
            targets.push(extension);
        }

        if (spawn) {
            targets.push(spawn);
        }

        if(targets.length === 1){
            return targets[0];
        }

        var target = pos.findClosest(targets);

        return target;
    },
};

module.exports = role;
