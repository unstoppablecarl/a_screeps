'use strict';

// bring energy to creep
var task = {
    name: 'energy_deliver',
    start: false,
    act: function(creep) {
        var target = creep.taskTarget();
        console.log('deliver target', target);
        if(!target){
            creep.cancelTask();
            return;
        }

        if (target) {
            if (target.energy === target.energyCapacity) {
                creep.endTask();
                return;
            }
            creep.moveTo(target);
            var result = creep.transferEnergy(target);
            if (result === OK) {
                creep.endTask();
            }
        }
    },
    cancel: false,
    end: false,
};

module.exports = task;
