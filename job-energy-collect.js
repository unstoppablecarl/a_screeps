'use strict';

var job_energy_collect = {
    name: 'energy_collect',
    _getTarget: function(creep, job) {

        var target = job.target();
        var settings = job.settings() || {};

        if(
            target &&
            target.role &&
            target.role() === 'harvester'
        ) {
            return target;
        }

        if (!target || target.energy === 0){
            var targets = creep.pos.findInRange(FIND_MY_CREEPS, 5, {
                filter: function(creep){
                    return creep.role() === 'harvester';
                }
            });

            if(!targets || !targets.length){
                targets = creep.room.energyPiles();
            }

            if(targets.length === 1){
                target = targets[0];
            } else {
                target = creep.pos.findClosestByRange(targets);
            }

            if (target) {
                job.target(target);
            }
        }
        return target;
    },
    act: function(creep, job) {

        // got energy from somewhere; target or a distributor
        if (creep.energy === creep.energyCapacity) {
            job.end();
            return;
        }
        var target = this._getTarget(creep, job);

        if (!target) {
            job.end();
            return;
        }

        var move = creep.moveTo(target);

        var moveOK = (
            move === OK ||
            move === ERR_TIRED ||
            move === ERR_NO_PATH
        );

        if(!moveOK){
            job.end();
            return;
        }

        var action;
        if(target.transferEnergy){
            action = target.transferEnergy(creep);
        } else{
            action = creep.pickup(target);
        }

        var actionOK = (
            action === OK ||
            action === ERR_NOT_IN_RANGE
        );

        if(!actionOK){
            job.end();
        }
    },

    // return only 1 job per energy pile
    // to be broken into smaller jobs later
    getJobs: function(room) {
        var minEnergyPile = room.energyPileThresholdMin();
        var energyPiles = room.energyPiles();

        var jobs = [];

        energyPiles.forEach(function(pile){

            if(pile.isTargetOfJobType('energy_collect')){
                return;
            }

            if(pile.energy < minEnergyPile){
                return;
            }

            var energyToBeCollected = pile.targetOfJobs(function(job){
                return (
                    job.type() === 'energy_collect' &&
                    job.source()
                );
            }).reduce(function(total, job){
                var source = job.source();
                return total + (source.energyCapacity - source.energy);
            }, 0);

            if(energyToBeCollected >= pile.energy){
                return;
            }

            var energyCollectionNeeded = pile.energy - energyToBeCollected;

            var priority = 0.9;

            if(pile){
                // move one decimal over
                // assume energy pile will never be more than 100000 energy
                priority += (energyCollectionNeeded / 100000) * 0.1;
            }

            jobs.push({
                role: 'carrier',
                type: 'energy_collect',
                target: pile,
                priority: priority,
                allocation_settings: {
                    energy_collection_needed: energyCollectionNeeded
                }
            });
        });

        // var harvesters = room.creeps()
        //     .forEach(function(creep){
        //         if(
        //             creep.idle() &&
        //             creep.role() !== 'harvester' &&
        //             creep.isTargetOfJobType('energy_collect')
        //         ){
        //             return;
        //         }

        //         var priority = 0.9;

        //         jobs.push({
        //             role: 'carrier',
        //             type: 'energy_collect',
        //             target: creep,
        //             priority: priority,
        //             allocation_settings: {
        //                 energy_collection_needed: 100
        //             }
        //         });
        //     });

        return jobs;
    }

};

module.exports = job_energy_collect;
