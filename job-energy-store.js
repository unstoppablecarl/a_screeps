'use strict';

// bring energy to spawn / extensions
var job_energy_store = {
    name: 'energy_store',

    _findTarget: function(creep, job){

        var target = job.target();

        if(!this.isValidTarget(target)){
            target = this.findClosestTarget(creep);
            if (target) {
                job.target(target);
            }
        }

        return target;
    },
    act: function(creep, job){
        if(creep.carry.energy === 0){
            job.end();
            return;
        }

        var target = this._findTarget(creep, job);
        if(!target){
            job.end();
            return;
        }

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

        var action = creep.transferEnergy(target);
        var actionOK = (
            action === OK ||
            action === ERR_NOT_IN_RANGE
        );

        if(!actionOK){
            job.end();
        }
    },

    preGenerateJobs: function(room, idleCreepsByRole){
        // @TODO allocate more intellegently to specific energy drop off
        if(!idleCreepsByRole.carrier || !idleCreepsByRole.carrier.length){
            return;
        }
        // fill room energy first
        // split energy jobs by energy amount
        var energyStoreAmount = room.energyCapacityAvailable - room.energyAvailable;
        if(energyStoreAmount){
            var creeps = idleCreepsByRole.carrier.filter(function(creep){
                return creep.carry.energy;
            });

            var piles = room.energyPiles();

            // allocate energy store tasks to creeps until full
            for(var i = creeps.length - 1; i >= 0; i--){
                if(energyStoreAmount <= 0){
                    break;
                }

                var creep = creeps[i];
                energyStoreAmount -= creep.carry.energy;
                // allocate creep to energy_store

                var target = this.findClosestTarget(creep, true);

                if(!target){
                    continue;
                }
                room.jobList().add({
                    role: 'carrier',
                    type: 'energy_store',
                    source: creep,
                    target: target,
                    priority: 0.8,
                }).start();

                var index = idleCreepsByRole.carrier.indexOf(creep);
                idleCreepsByRole.carrier.splice(index, 1);
            }
        }

    },

    isValidTarget: function(target, forNewJobsOnly){
        if(!target){
            return false;
        }

        if(target.isStructure){
            if(
                target.store &&
                target.store.energy === target.storeCapacity
            ){
                return false;
            }

            if(
                target.energy &&
                target.energy === target.energyCapacity
            ){
                return false;
            }
            if(
                forNewJobsOnly &&
                // storage can have unlimited jobs assigned
                target.structureType !== STRUCTURE_STORAGE
            ){
                return !target.isTargetOfJobType('energy_store');
            }

            return true;
        }

        else if(target.isCreep){

            if(!target.energyCanCarryMore()){
                return false;
            }


            if(target.role() === 'harvester'){
                return false;
            }
            if(
                target.role() === 'carrier' &&
                target.job() &&
                target.job().type() === 'energy_store'
            ){
                return false;
            }

            if(forNewJobsOnly){
                return !target.isTargetOfJobType('energy_store');
            }

            return true;
        }

        return false;
    },
    findClosestTarget: function(creep, forNewJobsOnly){

        var room = creep.room;
        var pos = creep.pos;

        var isValidTarget = this.isValidTarget;

        var spawns = room.spawns(function(spawn) {
            return isValidTarget(spawn, forNewJobsOnly);
        });

        var extensions = room.extensions(function(extension) {
            return isValidTarget(extension, forNewJobsOnly);
        });

        var targets = spawns.concat(extensions);

        if(
            !targets.length &&
            room.storage
        ){
            targets.push(room.storage);
        }

        if(!targets.length){
            targets = room.creeps(function(creep){
                return isValidTarget(creep, forNewJobsOnly);
            });
        }

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

module.exports = job_energy_store;
