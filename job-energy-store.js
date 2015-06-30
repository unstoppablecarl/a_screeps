'use strict';

// bring energy to spawn / extensions
var job_energy_store = {
    name: 'energy_store',
    _findTarget: function(creep){
        var target = creep.taskTarget();
        if(!target || target.energy === target.energyCapacity){
            var spawns = creep.room.spawns(function(spawn) {
                return spawn.energy < spawn.energyCapacity;
            });

            var extensions = creep.room.extensions(function(s) {
                return s.structureType === 'extension' && s.energy < s.energyCapacity;
            });

            var targets = spawns.concat(extensions);

            target = creep.pos.findClosest(targets);

            if(target){
                creep.taskTarget(target);
            }
        }

        return target;
    },
    start: false,
    act: function(creep){
        var target = this._findTarget(creep);

        if(!target){
            creep.cancelTask();
            return;
        }
        if(target){
            creep.moveTo(target);
            var result = creep.transferEnergy(target);
            if(result === OK){
                creep.endTask();
            }
        }
    },
    cancel: false,
    end: false,
};

module.exports = job_energy_store;
