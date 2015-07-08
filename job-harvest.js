'use strict';

var job_harvest = {
    name: 'harvest',
    _getStoreTarget: function(creep, job) {
        var settings = job.settings();
        var target;
        if (settings && settings.store_energy_id) {
            target = Game.getObjectById(settings.store_energy_id);
        }

        if (!target || target.energy === target.energyCapacity) {
            target = creep.pos.findClosestEnergyStore();
            if (target) {
                settings.store_energy_id = target.id;
            }
        }

        return target;
    },

    act: function(creep, job) {
        var target = job.target();

        if (!target) {
            job.end();
            return;
        }

        var result;
        var source = job.target();
        var energyFull = creep.energy === creep.energyCapacity;

        if (!energyFull) {

            result = creep.harvest(source);
            if (result !== OK) {
                if (result === ERR_NOT_IN_RANGE) {
                    creep.moveTo(target);
                } else {
                    job.end();
                }
            }

            return;
        }

        // energy is full
        else {

            // room has carriers
            // or room energy is full and cannot store more
            if (
                creep.room.roleCount('carrier') ||
                creep.room.roomEnergy() === creep.room.roomEnergyCapacity()
            ) {
                creep.dropEnergy();

            }

            // store energy
            else {

                var storeTarget = this._getStoreTarget(creep, job);
                if (!storeTarget) {
                    job.end();
                    return;
                }

                result = creep.transferEnergy(storeTarget);
                if (result !== OK) {
                    if (result === ERR_NOT_IN_RANGE) {
                        creep.moveTo(storeTarget);
                    } else {
                        job.end();
                    }
                }

            }
        }
    },

    getJobs: function(room){
        return room.flags(function(flag){
            if(flag.role() !== 'source'){
                return false;
            }

            var source = flag.source();

            if(!source){
                return false;
            }

            var allocatedHarvestWork = 0;
            var allocatedCreepCount = 0;
            var harvesterCountMax = flag.harvesterCountMax();

            var maxedWorkCreep;
            var nonMaxedCreepJobs = [];
            var jobs = source.targetOfJobs().map(function(job){
                if(job && job.type() === 'harvest'){

                    var sourceWorkCount = job.sourceActiveBodyparts(WORK);

                    if(sourceWorkCount === 5){
                        maxedWorkCreep = sourceWorkCount;
                    } else {
                        nonMaxedCreepJobs.push(job);
                    }
                    allocatedHarvestWork += sourceWorkCount;
                    allocatedCreepCount++;
                }
            });

            // if maxed work creep, dismiss other harvesters
            if(maxedWorkCreep){
                nonMaxedCreepJobs.forEach(function(job){
                    job.end();
                });
            }

            // console.log(flag);
            // console.log('allocatedCreepCount', allocatedCreepCount);
            // console.log('harvesterCountMax', harvesterCountMax);
            // console.log('allocatedHarvestWork', allocatedHarvestWork);

            // console.log(allocatedCreepCount < harvesterCountMax, allocatedHarvestWork < 5);


            // max 5 work body parts allocated
            return allocatedCreepCount < harvesterCountMax && allocatedHarvestWork < 5;
        }).map(function(flag){
            return {
                role: 'harvester',
                type: 'harvest',
                target: flag.source(),
                priority: 1,
            };
        });
    },
};

module.exports = job_harvest;