'use strict';

var job_energy_collect = {
    name: 'energy_collect',

    _getTarget: function(creep, job) {

        var target = job.target();
        var settings = job.settings() || {};

        if(
            target &&
            target.isCreep &&
            target.role() === 'harvester' &&
            !target.idle()
        ) {
            return target;
        }

        if (
            !target ||
            target.energy === 0
        ){
            var targets = creep.room.creeps(function(creep){
                return (
                    creep.role() === 'harvester' &&
                    !creep.idle() &&
                    creep.targetOfJobTypeCount('energy_collect') < 2
                );
            });

            targets = targets.concat(creep.room.energyPiles());

            if(!targets.length){
                return false;
            }
            else if(targets.length === 1){
                target = targets[0];
            }
            else {
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

        // do not stand on top of target
        if(!creep.pos.isNearTo(target)){
            var move = creep.moveTo(target, {
                reusePath: 20,
            });

            var moveOK = (
                move === OK ||
                move === ERR_TIRED ||
                move === ERR_NO_PATH
            );

            if(!moveOK){
                job.end();
                return;
            }
        }

        // look for dropped harvester energy
        if(target.isCreep){
            var energy = target.pos.lookFor('energy');
            if(energy !== undefined){
                var energyTarget;
                if(_.isArray(energy)){
                    energyTarget = energy[0];
                }
                else{
                    energyTarget = energy;
                }
                creep.pickup(energyTarget);
            }
        }

        var action;
        if(target.transferEnergy){
            action = target.transferEnergy(creep);
        }
        else {
            action = creep.pickup(target);
        }

        var actionOK = (
            action === OK ||
            action === ERR_NOT_IN_RANGE ||
            // if getting energy from harvester
            // it is ok if the harvester has no energy
            (
                target.isCreep &&
                action === ERR_NOT_ENOUGH_ENERGY
            )
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

            if(
                pile.energy < minEnergyPile ||
                pile.isTargetOfJobType('energy_collect')
            ){
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

        var harvesters = room.creeps()
            .filter(function(creep){
                return (
                    creep.role() === 'harvester' &&
                    !creep.idle() &&
                    !creep.isTargetOfJobType('energy_collect')
                );
            })
            .forEach(function(creep){

                var priority = 0.9;

                jobs.push({
                    role: 'carrier',
                    type: 'energy_collect',
                    target: creep,
                    priority: priority,
                    allocation_settings: {
                        energy_collection_needed: 100
                    }
                });
            });

        return jobs;
    }

};

module.exports = job_energy_collect;
