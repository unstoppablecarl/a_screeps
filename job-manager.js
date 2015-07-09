'use strict';

var rolesMeta = require('roles-meta');
var jobHandlers = require('job-all');

var JobManager = function JobManager(room) {
    this.room = room;
};

JobManager.prototype = {
    constructor: JobManager,

    update: function(){

        var newJobs = this.getJobs();
        var list = this.room.jobList();
            list.addMultiple(newJobs);
    },

    getJobs: function() {
        var handlers = jobHandlers;
        var jobs = [];
        var room = this.room;
        // var attack = jobHandlers.attack.getJobs();
        var build = handlers.build.getJobs(room);
        jobs = jobs.concat(build);

        var defendRampart = handlers.defend_rampart.getJobs(room);
        jobs = jobs.concat(defendRampart);

        var energyCollect = handlers.energy_collect.getJobs(room);
        jobs = jobs.concat(energyCollect);

        var energyDeliver = handlers.energy_deliver.getJobs(room);
        jobs = jobs.concat(energyDeliver);

        // var energyStore = handlers.energy_store.getJobs(room);
        // jobs = jobs.concat(energyStore);

        // var guard = handlers.guard.getJobs(room);
        // jobs = jobs.concat(guard);

        var harvest = handlers.harvest.getJobs(room);
        jobs = jobs.concat(harvest);

        // var moveToFlag = handlers.move_to_flag.getJobs(room);
        // jobs = jobs.concat(moveToFlag);

        var repair = handlers.repair.getJobs(room);
        jobs = jobs.concat(repair);

        var replace = handlers.replace.getJobs(room);
        jobs = jobs.concat(replace);

        var standby = handlers.standby.getJobs(room);
        jobs = jobs.concat(standby);

        var upgrade = handlers.upgrade_room_controller.getJobs(room);
        jobs = jobs.concat(upgrade);



        jobs.forEach(function(job){
            if(!job){
                console.log("!");
            }
        });

        return jobs;
    },

    allocate: function(){

        var idleCreepsByRole = this.getIdleCreepsByRole();

        var jobList = this.room.jobList();
        var pending = jobList.getPending();
        pending =  jobList.sortByPriority(pending);

        pending = this.preAllocateEnergyCollectJobs(pending, idleCreepsByRole);
        pending = this.preAllocateEnergyDeliverJobs(pending, idleCreepsByRole);

        this.preAllocateEnergyStoreJobs(idleCreepsByRole);
        this.preAllocateDefendJobs();

        for (var i = 0; i < pending.length; i++) {
            var job = pending[i];

            var settings = job.allocationSettings();
            var allocateTo = false;

            if(settings && settings.allocate_to){
                allocateTo = settings.allocate_to;
            }

            var allocated;

            if(!allocateTo || allocateTo === 'existing'){
                allocated = this.allocateJobToExisting(job, idleCreepsByRole);
            }

            if(!allocated && (!allocateTo || allocateTo === 'spawn') && this.canAllocateJobToSpawn(job)){
                allocated = this.allocateJobToSpawn(job);
            }
        }
    },

    getIdleCreepsByRole: function(){
        var idleCreepsByRole = {
            carrier: [],
            guard: [],
            harvester: [],
            healer: [],
            rampart_defender: [],
            upgrader: [],
            tech: [],
        };

        this.room.creeps(function(creep){
            return creep.idle();
        }).forEach(function(creep){
            var role = creep.role();
            if(idleCreepsByRole[role] === undefined){
                idleCreepsByRole[role] = [];
            }
            idleCreepsByRole[role].push(creep);
        });
        return idleCreepsByRole;
    },

    allocateJobToExisting: function(job, idleCreepsByRole) {
        // console.log('allocateJobToExisting');
        var type = job.type();
        var target = job.target();

        var allocationSettings = job.allocationSettings();
        // all creeps valid for job
        var creeps;
        // creep selected for job
        var creep;

        // if(type === 'attack'){


        // }

        // else


        if(type === 'build'){

            creeps = idleCreepsByRole.tech;
        }
        else if(type === 'defend_rampart'){

            creeps = idleCreepsByRole.rampart_defender;
        }
        else if(type === 'energy_collect'){

            creeps = idleCreepsByRole.carrier.filter(function(creep){
                return creep.energy < creep.energyCapacity;
            });

        }
        else if(type === 'energy_deliver'){

            creeps = idleCreepsByRole.carrier.filter(function(creep){
                return creep.energy > 0;
            });

        }
        // else if(type === 'energy_store'){

        // }
        else if(type === 'guard'){

            creeps = idleCreepsByRole.guard;
        }

        else if(type === 'harvest'){


            if(
                allocationSettings &&
                allocationSettings.harvester_work_parts_needed
            ){
                creeps = idleCreepsByRole.harvester.filter(function(creep){
                    return creep.activeBodyParts(WORK) === allocationSettings.harvester_work_parts_needed;
                });
            }

            if(!creeps) {
                creeps = idleCreepsByRole.harvester;
            }
        }

        else if(type === 'move_to_flag'){

            creeps = idleCreepsByRole.guard;
        }

        else if(type === 'repair'){

            creeps = idleCreepsByRole.tech;
        }
        else if(type === 'replace'){

            var replaceRole = job.role();
            creeps = idleCreepsByRole[replaceRole];

        }
        // else if(type === 'standby'){

        // }
        else if(type === 'upgrade_room_controller'){

            creeps = idleCreepsByRole.upgrader;
        }


        if(!creeps || !creeps.length){
            return false;
        }

        if(creeps.length > 1){
            creep = target.pos.findClosest(creeps);
        } else {
            creep = creeps[0];
        }

        var index = creeps.indexOf(creep);
        if(index !== -1){
            creeps.splice(1, index);
        }

        job.source(creep);
        job.start();

        console.log('allocating job to existing', job);

        return true;
    },

    canAllocateJobToSpawn: function(job){
        var role = job.role();
        var type = job.type();
        var roleCountMax;
        var roleCount;
        var roleCountFilter;

        if(role === 'carrier'){
            roleCountMax = this.getCarrierCountMax();
        } else {
            roleCountMax = this.room.roleCountMax(role);
        }

        if(!_.isNumber(roleCountMax)){
            return true;
        }

        if(type === 'replace'){
            var creepReplaceThreshold = this.room.creepReplaceThreshold();
            // exclude creeps being replaced from count when getting count
            var creeps = this.room.creeps(function(creep){
                return (
                    creep.ticksToLive > creepReplaceThreshold && // not close enough to death to be replaced
                    !creep.replaced() && // not already been replaced
                    !creep.isTargetOfJobType('replace') // not already assigned a replace job
                );
            });

            roleCount = creeps.length;
        } else {
             roleCount = this.room.roleCount(role);
        }

        return roleCount < roleCountMax;
    },

    allocateJobToSpawn: function(job) {
        var spawns = this.room.availableSpawns();
        if(!spawns || !spawns.length){
            return false;
        }
        var role = job.role();
        var type = job.type();
        var target = job.target();
        var maxCreepCost;
        var spawn = spawns[0];
        var room = this.room;
        var allocationSettings = job.allocationSettings();

        if(allocationSettings && allocationSettings.max_creep_cost){
            maxCreepCost = allocationSettings.max_creep_cost;
        }

        // order spawns by closest
        // untested
        // if(spawns.length > 1){
        //     if(job.target && job.target.id){
        //         target = Game.getObjectById(job.target.id);
        //         if(target){
        //              spawn = target.pos.getClosest(spawns);
        //         }
        //     }
        // }


        // if there are no harvesters spawn whatever type of harvester possible
        if(role === 'harvester'){
            var roleCount = this.room.roleCount(role);
            if(!roleCount){
                maxCreepCost = this.room.extensionEnergy() + spawn.energy;
            }
        }

        if(!maxCreepCost){
            var singleSpawnEnergyCap = 300;
            maxCreepCost = this.room.extensionEnergyCapacity() + singleSpawnEnergyCap;
        }

        if(maxCreepCost === 0 ){
            console.log('no energy');
            return false;
        }
        var memory = {
            role: role,
            source_of_job_id: job.id()
        };

        var body = rolesMeta.getBody(role, maxCreepCost);
        if(!body){
            console.log('no affordable body', role, maxCreepCost);
            return;
        }

        var result = spawn.spawnCreep(body, memory);
        if(result === ERR_NOT_ENOUGH_ENERGY ||
            result === ERR_NOT_OWNER ||
            result === ERR_NAME_EXISTS ||
            result === ERR_BUSY ||
            result === ERR_INVALID_ARGS){
            result = false;
        } else {
            result = true;
        }

        if(result){
            console.log('spawn allocating', job.role(), job.type(), body, maxCreepCost, result);
            job.sourcePendingCreation(true);
            job.sourcePendingCreationBody(body);
            job.active(true);
        }

        return result;
    },

    preAllocateEnergyCollectJobs: function(jobs, idleCreepsByRole){

        if(
            !idleCreepsByRole.carrier ||
            !idleCreepsByRole.carrier.length
        ){
            return jobs;
        }

        var collectJobs = jobs.filter(function(job){
            return job.type() === 'energy_collect';
        });

        if(!collectJobs.length){
            return jobs;
        }

        var creeps = idleCreepsByRole.carrier.filter(function(creep){
            return creep.energy < creep.energyCapacity;
        });

        var minEnergyPile = this.room.energyPileThresholdMin();
        var energyPiles = this.room.energyPiles();

        collectJobs.forEach(function(job){

            var collectionNeeded = job.getAllocationSetting('energy_collection_needed');
            // if(!collectionNeeded){
            //     return false;
            // }

            var pile = job.target();

            // @TODO make sure this is the correct sort direction
            var creeps = _.sortBy(creeps, function(creep){
                return pile.pos.getRangeTo(creep);
            });

            creeps.forEach(function(creep){

                if(collectionNeeded > 0){

                    var collectableAmount = creep.energyCapacity - creep.energy;

                    collectionNeeded -= collectableAmount;
                    var priority = 0.9;

                    if(pile){
                        // move one decimal over
                        // assume energy pile will never be more than 100000 energy
                        priority += (pile.energy / 100000) * 0.1;
                    }

                    var index = idleCreepsByRole.carrier.indexOf(creep);
                    idleCreepsByRole.carrier.splice(index, 1);

                    this.room.jobList().add({
                        role: 'carrier',
                        type: 'energy_collect',
                        source: creep,
                        target: pile,
                        priority: priority
                    }).start();
                }
            });

            if(collectionNeeded <= 0){
                job.end();
                var ind = jobs.indexOf(job);
                jobs.splice(ind, 1);

                return jobs;
            }

            var aSettings = job.allocationSettings() || {};
            aSettings.energy_collection_needed = collectionNeeded;
            job.allocationSettings(aSettings);
        });

        return jobs;
    },

    preAllocateEnergyDeliverJobs: function(jobs, idleCreepsByRole){

        if(
            !idleCreepsByRole.carrier ||
            !idleCreepsByRole.carrier.length
        ){
            return jobs;
        }

        var deliverJobs = jobs.filter(function(job){
            return job.type() === 'energy_deliver';
        });

        if(!deliverJobs.length){
            return jobs;
        }

        var creeps = idleCreepsByRole.carrier.filter(function(creep){
            return creep.energy > 0;
        });

        if(!creeps.length){
            return jobs;
        }

        deliverJobs.forEach(function(job){

            var deliveryNeeded = job.getAllocationSetting('energy_delivery_needed');
            var target = job.target();

            var creeps = _.sortBy(creeps, function(creep){
                return target.pos.getRangeTo(creep);
            });

            creeps.forEach(function(creep){

                if(deliveryNeeded > 0){

                    var deliverableAmount = creep.energy;

                    deliveryNeeded -= deliverableAmount;

                    var index = idleCreepsByRole.carrier.indexOf(creep);
                    idleCreepsByRole.carrier.splice(index, 1);

                    this.room.jobList().add({
                        role: 'carrier',
                        type: 'energy_deliver',
                        source: creep,
                        target: target,
                        priority: job.priority()
                    }).start();
                }
            });

            if(deliveryNeeded <= 0){
                job.end();
                var ind = jobs.indexOf(job);
                jobs.splice(ind, 1);
                return jobs;
            }

            var aSettings = job.allocationSettings() || {};
            aSettings.energy_delivery_needed = deliveryNeeded;
            job.allocationSettings(aSettings);
        });

        return jobs;
    },

    preAllocateEnergyStoreJobs: function(idleCreepsByRole){

        if(!idleCreepsByRole.carrier || !idleCreepsByRole.carrier.length){
            return;
        }
        // fill room energy first
        // split energy jobs by energy amount
        var energyStoreAmount = this.room.roomEnergyCapacity() - this.room.roomEnergy();
        if(energyStoreAmount){
            var creeps = idleCreepsByRole.carrier.filter(function(creep){
                return creep.energy;
            });

            // allocate energy store tasks to creeps until full
            for(var i = creeps.length - 1; i >= 0; i--){
                if(energyStoreAmount <= 0){
                    break;
                }

                var creep = creeps[i];
                energyStoreAmount -= creep.energy;
                // allocate creep to energy_store

                var index = idleCreepsByRole.carrier.indexOf(creep);
                idleCreepsByRole.carrier.splice(index, 1);

                this.room.jobList().add({
                    role: 'carrier',
                    type: 'energy_store',
                    source: creep,
                    target: this.room,
                    priority: 0.8,
                }).start();
            }
        }
    },

    preAllocateDefendJobs: function() {
        if(!this.room.containsHostiles()){
            return [];
        }

        var room = this.room;
        var guardFlags = this.room.flags(function(flag){
            return flag.role() === 'guard';
        }).forEach(function(flag){
            var range = flag.guardRadius();
            var targets = flag.pos.findInRange(FIND_HOSTILE_CREEPS, range);
            var guards = flag.guards();

            guards.forEach(function(guard){
                var target = guard.pos.findClosest(targets, {
                    filter: function(target){
                        return !target.isTargetOfJobType('attack');
                    }
                });
                if(!target){
                    target = guard.pos.findClosest(targets);
                }
                room.jobList().add({
                    type: 'attack',
                    role: 'guard',
                    source: guard,
                    target: target,
                    settings: {
                        defending_flag: flag
                    }
                }).start();
            });
        });
    },

    getCarrierCountMax: function(){

        var total = 2;

        this.room.flags(function(flag){
            return flag.role() === 'source';
        }).forEach(function(flag){
            total += flag.carrierCountMax();
        });

        var creepCount = this.room.creeps(function(creep){
            return (
                !creep.idle() &&
                creep.roleNeedsEnergy() &&
                !creep.replaced()
            );
        }).length;

        total += creepCount;

        var roleMax = this.room.roleCountMax('carrier');

        if(total > roleMax){
            total = roleMax;
        }
        return total;
    },

    // if a source has a harvester with 5 work parts
    // dismiss all other harvesters at that source
    auditHarvesters: function(){
        var sources = this.room.flags(function(flag){
            if(flag.role() !== 'source'){
                return false;
            }

            var source = flag.source();

            if(!source){
                return false;
            }
            return true;
        }).map(function(flag){
            return flag.source();
        });

        _.each(sources, function(source){

            var jobs = source.targetOfJobs(function(job){
                return job && job.type() === 'harvest';
            });

            var matchJob = _.find(jobs, function(job){
                var sourceWorkCount = job.sourceActiveBodyparts(WORK);
                return sourceWorkCount === 5;
            });

            if(matchJob){
                _.each(jobs, function(job){
                    if(job !== matchJob){
                        job.end();
                    }
                });
            }
        });
    }
};


module.exports = JobManager;
