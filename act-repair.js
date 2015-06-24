'use strict';

var role = {
    init: false,

    act: function(creep) {

        if (creep.energy === 0) {
                var spawn = creep.spawn();

                if (!spawn) {
                    spawn = creep.pos.findClosest(FIND_MY_SPAWNS);
                }
                var roomNeededRoles = creep.room.neededRoles();
                var roomNeedsCreeps = roomNeededRoles && roomNeededRoles.length;
                var energyThreshold = creep.room.getEnergyCapacity() * 0.5;

                if (!roomNeedsCreeps || spawn.energy >= energyThreshold) {
                    creep.startTask('get_energy');
                } else {
                    creep.startTask('goto_queue');
                }

            return;
        }

        creep.startTask('repair');

    },

    onAssignToFlag: false,
};

module.exports = role;
