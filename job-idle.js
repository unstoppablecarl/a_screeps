'use strict';

var job_energy_collect = {
    name: 'energy_collect',
    _getTarget: function(creep, job) {

        var flags = creep.room.flags(function(flag){

            if(flag.role() !== 'idle'){
                return false;
            }

            var assignedCreeps = flag.targetOfJobs(function(job){
                return job.type() === 'idle';
            });

            return assignedCreeps < flag.idleCreepMax();

        });


    },
    start: false,
    act: function(creep) {

        var job = creep.job();

        // got energy from somewhere; target or a distributor
        if (creep.energy === creep.energyCapacity) {
            job.end();
            return;
        }
        var target = this._getTarget(creep, job);

        if (!target) {
            job.end();
            return;
        }

        creep.moveTo(target);

        if(target.transferEnergy){
            target.transferEnergy(creep);
        } else if(creep.pickup){
            creep.pickup(target);
        } else {
            job.end();
        }

    },
    cancel: false,
    end: false,
};

module.exports = job_energy_collect;
