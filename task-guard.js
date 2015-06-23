'use strict';

var task = {
    name: 'harvest',
    start: function(creep){

        var target = creep.taskTarget();

        if(!target){
            target = creep.assignedFlag();
            if(!target){
                target = creep.pos.findClosest(FIND_FLAGS, {
                    filter: function(flag){
                        return flag.role === 'guard';
                    }
                });
            }

            if(target){
                creep.taskTarget(target);
            }
        }
    },
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
            this.start(creep);
        }
    },
    cancel: false,
    end: false,
};

module.exports = task;
