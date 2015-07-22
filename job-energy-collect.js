'use strict';

var job_energy_collect = {
    name: 'energy_collect',

    _getTarget: function(creep, job) {

        var target = job.target();

        if(!this.isValidTarget(target)){
            target = this.findClosestTarget(creep);
            if (target) {
                job.target(target);
            }
        }

        return target;
    },
    act: function(creep, job) {

        // got energy from somewhere; target or a distributor
        if (!creep.energyCanCarryMore()) {
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

        var isValidTarget = this.isValidTarget;
        energyPiles.forEach(function(pile){

            if(
                pile.energy < minEnergyPile &&
                // only returns 1 job per energy pile to be broken up later
                pile.isTargetOfJobType('energy_collect')
            ){
                return;
            }

            // NOTE: this does not use isValidTarget as it needs the value of energyToBeCollected
            var energyToBeCollected = pile.energyToBeCollected();
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
                isValidTarget(creep, true);
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
    },
    // valid target for any energy_collect job potential or current
    isValidTarget: function(target, forNewJobsOnly){
        if(!target){
            return false;
        }

        if(target.isEnergy){

            if(forNewJobsOnly){
                return (
                    target.room.energyPileThresholdMin() < target.energy &&
                    target.energy <= target.energyToBeCollected()
                );
            }
            return true;
        }

        else if(target.isCreep){
            if(
                target.role() === 'harvester' &&
                ( // has energy or job
                    target.carry.energy ||
                    !target.idle()
                )
            ) {

                if(forNewJobsOnly){
                    return target.targetOfJobTypeCount('energy_collect') < 2;
                }

                return true;
            }

            return false;
        }
    },
    findClosestTarget: function(creep){

        var room = creep.room;
        var pos = creep.pos;

        var isValidTarget = this.isValidTarget;

        var creeps = room.creeps(function(creep){
            return isValidTarget(creep, true);
        });

        var energyPiles = room.energyPiles(function(pile){
            return isValidTarget(pile, true);
        });

        var targets = creeps.concat(energyPiles);

        if(!targets.length){
            return false;
        }
        else if(targets.length === 1){
            return targets[0];
        }
        else {
            return pos.findClosestByRange(targets);
        }
        return false;
    }
};

module.exports = job_energy_collect;
