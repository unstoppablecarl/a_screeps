'use strict';

var job_energy_collect = {
    name: 'energy_collect',
    _getTarget: function(creep, job) {

        var target = job.target();
        var settings = job.settings() || {};

        if (!target || target.energy === 0) {
            var targets = creep.room.energyPiles();

            if(targets && targets.length){
                if(targets.length === 1){
                    target = targets[0];
                } else {
                    target = creep.pos.findClosest(targets);
                }
            }

            if (target) {
                job.target(target);
            }
        }
        return target;
    },
    act: function(creep, job) {

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

        var result;
        if(target.transferEnergy){
            result = target.transferEnergy(creep);
        } else{
            result = creep.pickup(target);
        }

        if(result !== OK){
            if(result === ERR_NOT_IN_RANGE){
                creep.moveTo(target);
            } else {
                job.end();
            }
        }

    },
};

module.exports = job_energy_collect;
