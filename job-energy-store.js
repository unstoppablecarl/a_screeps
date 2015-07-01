'use strict';

// bring energy to spawn / extensions
var job_energy_store = {
    name: 'energy_store',
    _findTarget: function(creep, job){

        var target = job.target();

        if(!target || target.energy === target.energyCapacity){
            target = creep.closestEnergyStore();
            if(target){
                job.target(target);
            }
        }

        return target;
    },
    start: false,
    act: function(creep, job){

        var target = this._findTarget(creep, job);

        if(creep.energy === 0){
            job.end();
            return;
        }

        if(!target){
            job.end();
            return;
        }
        if(target){
            creep.moveTo(target);
            var result = creep.transferEnergy(target);
            if(result === OK){
                job.end();
                return;
            }
        }
    },
    cancel: false,
    end: false,
};

module.exports = job_energy_store;
