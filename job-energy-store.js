'use strict';

// bring energy to spawn / extensions
var job_energy_store = {
    name: 'energy_store',
    _findTarget: function(creep, job){

        var target = job.target();

        if(!target || target.energy === target.energyCapacity || target.isRoom){
            target = creep.pos.findClosestEnergyStore();
            if(target){
                job.target(target);
            }
        }

        return target;
    },
    act: function(creep, job){
        if(creep.energy === 0){
            job.end();
            return;
        }

        var target = this._findTarget(creep, job);
        if(!target){
            job.end();
            return;
        }

        var result = creep.transferEnergy(target);
        if(result !== OK){
            if(ERR_NOT_IN_RANGE){
                creep.moveTo(target);
            } else {
                job.end();
            }
        }
    },
};

module.exports = job_energy_store;
