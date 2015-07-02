'use strict';

var job_harvest = {
    name: 'harvest',
    start: false,
    act: function(creep, job){
        var target;

        creep.say(job.type());
        if(job){
            target = job.target();
        }

        if(target){

            var source = job.target();
            var result = creep.harvest(source);
            if(result === ERR_NOT_IN_RANGE){
                creep.moveTo(target);
            }
            if(creep.energy === creep.energyCapacity){
                creep.say('energy full');
                if(!creep.room.roleCount('carrier')){

                    // can afford to make carrier
                    var roomEnergy = creep.room.roomEnergy();
                    var minCarrierCost = 200;
                    if(roomEnergy < minCarrierCost){
                        var newJob = creep.room.jobList().add({
                            role: 'harvester',
                            type: 'energy_store',
                            source: creep,
                            target: creep.pos.findClosestEnergyStore()
                        });
                        job.cancel();
                        newJob.start();
                        return;
                    }
                } else {
                    creep.dropEnergy();
                }
            }
        } else {
            job.end();
        }
    },
    cancel: false,
    end: false,
};

module.exports = job_harvest;
