'use strict';

var task = {
    name: 'move_to',
    start: false,
    act: function(creep){
        var target = creep.taskTarget();
        if(target){
            creep.moveTo(target);
            var settings = creep.taskSettings();
            var distance = settings.target_precision || 2;
            if(creep.pos.inRangeTo(target, distance)){
                creep.endTask();
            }
        } else {
            this.cancelTask();
        }
    },
    cancel: false,
    end: false,
};

module.exports = task;
