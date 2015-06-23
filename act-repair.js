'use strict';

var role = {
    init: false,

    act: function(creep) {

        if (creep.energy === 0) {

            var spawn = creep.spawn();
            if(!spawn){
                spawn = creep.pos.findClosest(FIND_MY_SPAWNS, {
                    filter: function(s) {
                        return s.energy < s.energyCapacity;
                    }
                });
            }

            if (spawn) {
                creep.moveTo(spawn);
                spawn.transferEnergy(creep);
            }

            return;
        }

        var target = creep.pos.findClosest(FIND_MY_STRUCTURES, {
            filter: function(s){
                return s.hits < s.hitsMax;
            }
        });

        if(!target){
            target = creep.pos.findClosest(FIND_STRUCTURES, {
                filter: function(s){
                    return !s.owner && s.hits < s.hitsMax;
                }
            });
        }

        if (target) {
            creep.moveTo(target);
            creep.repair(target);
            return;
        }

        var flag =creep.assignedFlag();
        if(flag){
            creep.moveTo(flag);
        }

    },

    onAssignToFlag: false,
};

module.exports = role;
