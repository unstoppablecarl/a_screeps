'use strict';

// bring energy to spawn / extensions
var job_energy_store = {
    name: 'energy_store',
    _findTarget: function(creep){

        var job = creep.job();

        var target;

        if(job){
            target = job.target();
        }

        if(!target || target.energy === target.energyCapacity){
            target = creep.closestEnergyStore();
            if(target){
                job.target(target);
            }
        }

        return target;
    },
    start: false,
    act: function(creep){
        var target = this._findTarget(creep);

        if(creep.energy === 0){
            creep.job().end();
        }

        if(!target){
            creep.job().cancel();
            return;
        }
        if(target){
            creep.moveTo(target);
            var result = creep.transferEnergy(target);
            if(result === OK){
                creep.job().end();
                return;
            }
        }
    },
    cancel: false,
    end: false,
};

module.exports = job_energy_store;
