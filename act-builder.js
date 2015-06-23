'use strict';

var role = {
    init: false,

    act: function(creep) {
        if(!creep.task()){
            if (creep.energy === 0) {

                if(creep.room.extensionsFull()){
                    creep.startTask('get_energy');
                } else {
                    creep.startTask('goto_queue');
                }

                return;
            }

            creep.startTask('build');
        }

        // creep.moveTo(creep.room.controller);
        // creep.upgradeController(creep.room.controller);
    },
    onAssignToFlag: false,
};

module.exports = role;
