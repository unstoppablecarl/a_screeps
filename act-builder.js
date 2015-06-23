'use strict';

var role = {
    init: false,

    act: function(creep) {
    return;
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
                if(spawn.populationCapped()){
                    spawn.transferEnergy(creep);
                } else {
                    var amount = Math.round(spawn.energy * 0.05);
                    spawn.transferEnergy(creep, amount);
                }
            }

            return;
        }

        var target = creep.pos.findClosest(FIND_CONSTRUCTION_SITES);
        if (target) {
            creep.moveTo(target);
            creep.build(target);
            return;
        }

        creep.moveTo(creep.room.controller);
        creep.upgradeController(creep.room.controller);
    },

    onAssignToFlag: false,
};

module.exports = role;
