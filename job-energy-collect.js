'use strict';

var job_energy_collect = {
    name: 'energy_collect',
    _getTarget: function(creep, job) {

        var target = job.target();
        var settings = job.settings() || {};

        if (!target || target.energy === 0) {
            var targets = [];
            if(!settings.spawns_only){
                 var energyPiles = creep.room.energyPiles();
                 targets = targets.concat(energyPiles);
            }

            if(!settings.energy_piles_only){
                var spawns = creep.room.spawns(function(spawn) {
                    return spawn.energy > 0;
                });
                targets = targets.concat(spawns);
            }

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
    start: false,
    act: function(creep, job) {

        // got energy from somewhere; target or a distributor
        if (creep.energy === creep.energyCapacity) {
            console.log('energy full');
            job.end();
            return;
        }
        var target = this._getTarget(creep, job);

        if (!target) {
            console.log('no target cancel');
            job.end();
            return;
        }

        creep.moveTo(target);

        if(target.transferEnergy){
            target.transferEnergy(creep);
        } else if(creep.pickup){
            creep.pickup(target);
        } else {
            console.log('picked up energy');
            job.end();
        }

    },
    cancel: false,
    end: false,
};

module.exports = job_energy_collect;
