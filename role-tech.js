'use strict';

// repairs and builds structures
var role_tech = {
    init: false,
    act: function(creep) {
        // if (!creep.idle() && creep.energy <= creep.energyCapacity * 0.5) {
        //     creep.room.requestEnergy(creep);
        // }

        // // @TODO check if energy is being delivered to this creep before going to get it by itself
        // if (!creep.idle() && creep.energy === 0) {
        //     var taskName = creep.taskName();
        //     if(taskName === 'repair' || taskName === 'build' || taskName === 'upgrade_room_controller'){
        //         // set current task to next task after finding energy
        //         creep.nextTask(creep.taskName(), creep.taskSettings());
        //         creep.startTask('energy_collect', {
        //             energy_piles_only: true
        //         });
        //     }
        // }

        // // end task and move onto next when energy full
        // if(creep.taskName() === 'energy_collect' && creep.energy === creep.energyCapacity){
        //     creep.endTask();
        // }
    },
};

module.exports = role_tech;
