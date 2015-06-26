'use strict';

var energyCollectTask = {
    name: 'energy_collect',
    _getTarget: function(creep) {
        var target = creep.taskTarget();
        var settings = creep.taskSettings();

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
                    // target = creep.pos.findClosest(targets);
                }
            }

            if (target) {
                creep.taskTarget(target);
            }
        }
        return target;
    },
    start: false,
    act: function(creep) {
        var target = this._getTarget(creep);
        if (!target) {
            creep.cancelTask();
            return;
        }

        creep.moveTo(target);

        if(target.transferEnergy){
            target.transferEnergy(creep);
        } else if(creep.pickup){
            creep.pickup(target);
        } else {
            creep.cancelTask();
        }

        // got energy from somewhere target or a distributor
        if (creep.energy === creep.energyCapacity) {
            creep.endTask();
        }
    },
    cancel: false,
    end: false,
};

module.exports = energyCollectTask;
