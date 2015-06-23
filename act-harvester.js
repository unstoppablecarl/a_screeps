'use strict';

var role = {

    init: function(creep) {
        var flag = creep.assignedFlag();
        if (flag && !creep.sourceId()) {
            creep.assignToFlag(flag);
        }
    },

    onAssignToFlag: function(creep, flag) {
        var sourceId = flag.assignedSourceId();
        creep.sourceId(sourceId);
    },

    act: function(creep) {

        if(!creep.task()){
            if (creep.energy < creep.energyCapacity) {
                creep.startTask('harvest');

            } else {
                creep.startTask('return_energy');
            }
        }
    },
};

module.exports = role;
