'use strict';

// meet creep delivering energy to you.

var job_energy_deliver_receive = {
    name: 'energy_deliver_receive',

    start: function(creep){

    },

    act: function(creep, job) {

        if(creep.energy === creep.energyCapacity){
            job.end();
            return;
        }

        var target = job.target();

        if(!target){
            job.end();
            return;
        }

        if(!creep.isTargetOfJobType('energy_deliver', true)){
            job.end();
            return;
        }

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
    },
};

module.exports = job_energy_deliver_receive;
