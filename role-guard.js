'use strict';

var role_guard = {
    init: false,

    act: function(creep) {
        return;
        if(creep.idle()){
            var target;
            var range = creep.memory.hostile_range || 10;
            var targets = creep.pos.findInRange(FIND_HOSTILE_CREEPS, range);

            if (targets.length) {
                target = creep.pos.findClosest(targets);
            }

            if(target){
                creep.startTask('attack', {
                    target_id: target.id
                });
            } else {
                creep.startTask('guard');
            }
        }
    },

    onAssignToFlag: false,
};

module.exports = role_guard;