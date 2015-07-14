'use strict';


var job_helpers = {

    findEnergy: function(creep, job){

        // get own energy in case of emergency
        if(
            !creep.isTargetOfJobType('energy_deliver', true) &&
            !creep.room.idleCreeps('carrier').length
        ){
            this.startEnergyCollect(creep);
            return true;
        }

        // meet delivery
        if(this.meetEnergyCarrier(creep, job)){
            return true;
        }

        return false;
    },

    startEnergyCollect: function(creep, job){
        var targets = creep.room.energyPiles();
        var target;

        if(targets.length === 1){
            target = targets[0];
        } else {
            target = creep.pos.findClosestByRange(targets);
        }
        if(target){
            creep.room.jobList().add({
                type: 'energy_collect',
                role: 'tech',
                source: creep,
                target: target
            }).start();
        }
    },

    meetEnergyCarrier: function(creep, job){
        var jobSettings = job.settings() || {};

        var carrier;

        if(jobSettings.energy_deliver_carrier_id){
            carrier = Game.getObjectById(jobSettings.energy_deliver_carrier_id);
        }
        else{
            var carriers = creep.targetOfJobs().filter(function(job){
                return (
                    job.type() === 'energy_deliver' &&
                    job.active() &&
                    job.source()
                );
            }).map(function(job){
                return job.source();
            });

            if(carriers.length === 1){
                carrier = carriers[0];
            } else {
                carrier = creep.pos.findClosestByRange(carriers);
            }

            if(carrier){
                jobSettings.energy_deliver_carrier_id = carrier.id;
            }
        }

        if(!carrier){
            return false;
        }

        var move = creep.moveTo(carrier);

        var moveOK = (
            move === OK ||
            move === ERR_TIRED ||
            move === ERR_NO_PATH
        );

        if(!moveOK){
            job.end();
            return false;
        }

        return true;
    },
};


module.exports = job_helpers;