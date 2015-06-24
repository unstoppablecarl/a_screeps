'use strict';

var task = {
    name: 'return_energy',
    start: function(creep){

        var target = creep.taskTarget();

        if(!target){
            target = creep.spawn();

            if(target && target.energy === target.energyCapacity){
                target = false;
            }

            if(!target){
                target = creep.pos.findClosest(FIND_MY_SPAWNS, {filter: function(spawn){
                    return spawn.energy < spawn.energyCapacity;
                }});
            }

            if(!target){

                 target = creep.pos.findClosest(FIND_MY_STRUCTURES, {
                        filter: function(s){
                            return s.structureType === 'extension' && s.energy < s.energyCapacity;
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
            if(target.energy === target.energyCapacity){
               creep.taskTarget(false);
               this.start(creep);
            }
            creep.moveTo(target);
            var result = creep.transferEnergy(target);
            if(result === OK){
                creep.endTask();
            }

            else if(result === ERR_FULL){
                creep.taskTarget(false);
                this.start(creep);
            }


        } else {
            this.start(creep);
        }
    },
    cancel: false,
    end: false,
};

module.exports = task;
