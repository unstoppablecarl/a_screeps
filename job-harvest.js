'use strict';

var job_harvest = {
    name: 'harvest',
    start: false,

    _getStoreTarget: function(creep, job){
        var settings = job.settings();
        var target;
        if(settings && settings.store_energy_id){
            target = Game.getObjectById(settings.store_energy_id);
        }

        if(!target || target.energy === target.energyCapacity){
            target = creep.pos.findClosestEnergyStore();
            if(target){
                settings.store_energy_id = target.id;
            }
        }

        return target;
    },

    act: function(creep, job){
        var target;

        creep.say(job.type());
        if(job){
            target = job.target();
        }

        if(target){

            var source = job.target();
            var result = creep.harvest(source);
            if(result === ERR_NOT_IN_RANGE){
                creep.moveTo(target);
            }
            if(creep.energy === creep.energyCapacity){
                console.log('energy full');
                creep.say('energy full');
                if(!creep.room.roleCount('carrier')){

                    var storeTarget = this._getStoreTarget(creep, job);

                    if(storeTarget){
                        creep.moveTo(target);
                        var dropResult = creep.transferEnergy(target);
                        if(dropResult === OK){
                            job.end();
                            return;
                        }
                    } else {
                        job.end();
                        return;
                    }
                } else {
                    creep.dropEnergy();
                }
            }
        } else {
            job.end();
        }
    },
    cancel: false,
    end: false,
};

module.exports = job_harvest;
