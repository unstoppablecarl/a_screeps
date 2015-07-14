'use strict';

// bring energy to spawn / extensions
var job_energy_store = {
    name: 'energy_store',
    _findTarget: function(creep, job){

        var target = job.target();

        if(
            !target ||
            target.energy === target.energyCapacity ||
            target.isRoom ||

            // prevent carriers passing energy back and forth
            (
                target.isCreep &&
                target.role() === 'carrier' &&
                target.job() &&
                target.job().type() === 'energy_store'
            )
        ){
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

        var action = creep.transferEnergy(target);
        var actionOK = (
            action === OK ||
            action === ERR_NOT_IN_RANGE
        );

        if(!actionOK){
            job.end();
        }
    },
};

module.exports = job_energy_store;
