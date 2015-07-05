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
                if (ERR_NOT_IN_RANGE) {
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
                    if (ERR_NOT_IN_RANGE) {
                        creep.moveTo(target);
                    } else {
                        job.end();
                    }
                }

            }
        }
    },
};

module.exports = job_harvest;