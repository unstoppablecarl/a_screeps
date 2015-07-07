'use strict';

var rolesMeta = require('roles-meta');

var JobManager = function JobManager(room) {
    this.room = room;
};

JobManager.prototype = {
    constructor: JobManager,

    getCarrierCountMax: function(){

        var total = 2;

        this.room.flags(function(flag){
            return flag.role() === 'source';
        }).forEach(function(flag){
            total += flag.carrierCountMax();
        });

        this.room.creeps(function(creep){
            return !creep.idle() && creep.role() === 'tech';
        });
    },

    getReplacementJobs: function() {

        // @TODO base threshold on distance from spawn
        var threshold = this.room.creepReplaceThreshold();

        // @TODO exclude unused
        // something more advanced than just checking .idle() ?
        var creeps = this.room.creeps(function(creep) {

            if(creep.idle()){
                return false;
            }

            return (
                creep.ticksToLive < threshold && // close enough to death to be replaced
                !creep.replaced() && // already been replaced
                !creep.isTargetOfJobType('replace') // already assigned a replace job
            );
        });

        var room = this.room;

        return creeps.map(function(creep) {
            return {
                target: creep,
                type: 'replace',
                role: creep.role()
            };
        });
    },

    getHarvestJobs: function() {
        return this.room.flags(function(flag){
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
            };
        });



    },

    getRepairJobs: function() {

        var room = this.room;
        var structures = this.room.structures(function(s){

            if(s.hits < s.hitsMax && !s.isTargetOfJobType('repair')){

                var type = s.structureType;
                var threshold = room.repairStartThreshold(type);
                var hitPercent = s.hits / s.hitsMax;

                return hitPercent < threshold;
            }
            return false;
        });

        var roads = this.room.roads(function(road){
            if(road.hits < road.hitsMax && !road.isTargetOfJobType('repair')){
                var type = road.structureType;
                var threshold = room.repairStartThreshold(type);
                var hitPercent = road.hits / road.hitsMax;

                return hitPercent < threshold;
            }

            return false;
        });

        structures = structures.concat(roads);
        return structures.map(function(structure){
            return {
                role: 'tech',
                type: 'repair',
                target: structure,
            };
        });
    },

    getBuildJobs: function() {
        // @TODO asign idle builders to sites that already have a builder
        var sites = this.room.constructionSites(function(site){
            return !site.isTargetOfJobType('build');
        });

        return sites.map(function(site){
            return {
                role: 'tech',
                type: 'build',
                target: site,
            };

        });
    },

    getUpgradeJobs: function() {
        var controller = this.room.controller;
        if(!controller){
            return [];
        }

        var roleMax = this.room.roleMax('upgrader');

         // || controller.isTargetOfJobType('upgrade_room_controller')
        return [{
            role: 'upgrader',
            type: 'upgrade_room_controller',
            target: controller,
        }];

    },

    getEnergyDeliverJobs: function() {

        return this.room.creeps(function(creep){
            var role = creep.role();
            return (
                (role === 'tech' || role === 'upgrader') &&
                creep.energy < creep.energyCapacity &&
                !creep.isTargetOfJobType('energy_deliver')
            );
        }).map(function(creep){
            return {
                role: 'carrier',
                type: 'energy_deliver',
                target: creep,
            };
        });
    },

    // primarily to trigger the creation of new carrier creeps as carrier creeps collect automatically
    getEnergyCollectJobs: function() {
        var minEnergySpawn = this.room.energyPileThresholdMin();

        var energyPiles = this.room.energyPiles();
        var carrierCount = this.room.roleCount('carrier');
        if(carrierCount > energyPiles.length){

        }
        return energyPiles.filter(function(pile){
            // one job per pile over the limit or with no collectors assigned
            return (pile.energy > minEnergySpawn) || !pile.isTargetOfJobType('energy_collect');
        }).map(function(pile){

            // var existing_only = pile.energy < minEnergySpawn;
            var existing_only = true;
            return {
                role: 'carrier',
                type: 'energy_collect',
                target: pile,
                existing_only: existing_only,
            };
        });
    },

    getGuardStandbyJobs: function() {
        var jobs = [];
        var flags = this.room.flags(function(flag){

            if(flag.role() !== 'guard'){
                return false;
            }
            var guardMax = flag.guardMax();
            var guardCount = flag.guardCount();

            return guardCount < guardMax;
        });
        return flags.map(function(flag){
            return {
                role: 'guard',
                type: 'move_to_flag',
                target: flag,
            };
        });
    },

    getHealerStandbyJobs: function() {
        var flags = this.room.flags(function(flag){

            if(flag.role() !== 'healer'){
                return false;
            }
            var healerMax = flag.healerMax();
            var healerCount = flag.healerCount();

            return healerCount < healerMax;
        });
        return flags.map(function(flag){
            return {
                role: 'healer',
                type: 'move_to_flag',
                target: flag,
            };
        });
    },

    getHealerJobs: function(){
        var creeps = this.room.creeps(function(creep){

        });
    },

    getDefendRampartJobs: function(){
        return this.room.flags(function(flag){
            return flag.role() === 'defend_rampart' && !flag.isTargetOfJobType('defend_rampart');
        }).map(function(flag){
            return {
                role: 'defend_rampart',
                type: 'defend_rampart',
                target: flag,
            };
        });
    },

    getBaseJobPriority: function(job){
        var type = job.type();
        var target = job.target();
        var priority = 0;


        if(type === 'harvest'){

            priority = 1;

        }
        else if(type === 'energy_collect'){

            priority = 0.9;

            if(target){
                // move one decimal over
                // assume energy pile will never be more than 100000 energy
                priority += (target.energy / 100000) * 0.1;
            }

        }
        else if(type === 'attack'){

            priority = 0.8;

        }
        else if(type === 'guard'){

            priority = 0.7;
            if(target){
                var guardBasePriority = target.guardPriority();
                if(guardBasePriority){
                    priority = guardBasePriority;
                }
                var guardCount = target.guardCount();
                var guardMax = target.guardMax();
                var guardPriority = 1 - (guardCount / guardMax);
                priority += guardPriority * 0.1;
            }

        }
        else if(type === 'defend_rampart'){

            priority = 0.7;
            if(target){
                var guardBasePriority = target.guardPriority();
                if(guardBasePriority){
                    priority = guardBasePriority;
                }
                var guardCount = target.guardCount();
                var guardMax = target.guardMax();
                var guardPriority = 1 - (guardCount / guardMax);
                priority += guardPriority * 0.1;
            }

        }
        else if(type === 'energy_deliver'){

            priority = 0.6;

            if(target){
                priority += (1 - (target.energy / target.energyCapacity)) * 0.1;
            }

        }
        else if(type === 'build'){

            priority = 0.5;

            if(target){
                var progress = target.progress / target.progressTotal;
                var buildPriority = this.room.buildPriority(target.structureType);
                // average
                var buildJobPriority = (progress + buildPriority) / 2;
                // move one decimal over
                priority += buildJobPriority * 0.1;
            }

        }
        else if(type === 'repair'){

            // @TODO higher priority to repair rampart when under attack
            priority = 0.4;

            if(target){
                var damage = 1 - (target.hits / target.hitsMax);
                var repairPriority = this.room.repairPriority(target.structureType);
                // average
                var repairJobPriority = (damage + repairPriority) / 2;
                // move one decimal over
                priority += repairJobPriority * 0.1;
            }

        }
        else if(type === 'upgrade_room_controller'){

            priority = 0.1;

        }
        else if(type === 'replace'){

            if(target){
                var targetJob = target.job();
                if(targetJob){
                    priority = this.getBaseJobPriority(targetJob);
                }
            }

        }

        return priority;
    },
    allocateJobToExisting: function(job) {
        // console.log('allocateJobToExisting');
        var type = job.type();
        var target = job.target();

        // all creeps valid for job
        var creeps;
        // creep selected for job
        var creep;

        var idleCreepsByRole = {
            carrier: [],
            guard: [],
            upgrader: [],
            harvester: [],
            tech: [],
        };

        this.room.creeps(function(creep){
            return creep.idle();
        }).forEach(function(creep){
            var role = creep.role();
            if(!idleCreepsByRole[role]){
                idleCreepsByRole[role] = [];
            }
            idleCreepsByRole[role].push(creep);
        });

        if(type === 'replace'){

            var replaceRole = job.role;
            creeps = idleCreepsByRole[replaceRole];

        }
        else if(type === 'harvest'){

            creeps = idleCreepsByRole.harvester;
        }
        else if(type === 'energy_deliver'){

            creeps = idleCreepsByRole.carrier.filter(function(creep){
                return creep.energy > 0;
            });
        }
        else if(type === 'energy_collect'){
            creeps = idleCreepsByRole.carrier.filter(function(creep){
                return creep.energy < creep.energyCapacity;
            });
        }
        else if(type === 'repair'){

            creeps = idleCreepsByRole.tech;
        }
        else if(type === 'build'){

            creeps = idleCreepsByRole.tech;
        }
        else if(type === 'upgrade_room_controller'){

            creeps = idleCreepsByRole.upgrader;
        }
        else if(type === 'move_to_flag'){
            creeps = idleCreepsByRole.guard;
        }

        if(!creeps || !creeps.length){
            return false;
        }

        if(creeps.length > 1){
            creep = target.pos.findClosest(creeps);
        } else {
            creep = creeps[0];
        }
        // if(!creep){
        //     return false;
        // }

        console.log('allocate job ', job.id(), job.type(), creep);

        job.source(creep);
        job.start();

        return true;
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
        // order spawns by closest
        // un tested
        // if(spawns.length > 1){
        //     if(job.target && job.target.id){
        //         target = Game.getObjectById(job.target.id);
        //         if(target){
        //              spawn = target.pos.getClosest(spawns);
        //         }
        //     }
        // }

        var roleCountFilter;

        if(type === 'replace'){
            var creepReplaceThreshold = this.room.creepReplaceThreshold();
            // exclude creeps being replaced from count when getting count
            roleCountFilter = function(creep){
                return (
                    creep.ticksToLive > creepReplaceThreshold && // not close enough to death to be replaced
                    !creep.replaced() && // not already been replaced
                    !creep.isTargetOfJobType('replace') // not already assigned a replace job
                );
            };
        }

        var roleCount = this.room.roleCount(role, roleCountFilter);
        var roleCountMax = this.room.roleCountMax(role);
        if(roleCount >= roleCountMax){
            return false;
        }

        // if there are no harvesters spawn whatever type of harvester possible
        else if(role === 'harvester'){
            if(!roleCount){
                maxCreepCost = this.room.extensionEnergy() + spawn.energy;
            }
        }

        if(maxCreepCost === undefined){
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

    prioritizeJobs: function(jobs){

        for (var i = 0; i < jobs.length; i++) {
            var job = jobs[i];
            job.priority(this.getBaseJobPriority(job));
        }

        jobs = _.sortByOrder(jobs, [function(job){
            return job.priority;
        }], [false]);

        return jobs;
    },

    getJobs: function() {

        var jobs = [];

        var replacementJobs = this.getReplacementJobs();
        var harvestJobs = this.getHarvestJobs();
        var energyCollectJobs = this.getEnergyCollectJobs();
        var repairJobs = this.getRepairJobs();
        var buildJobs = this.getBuildJobs();
        var upgradeJobs = this.getUpgradeJobs();
        var guardJobs = this.getGuardStandbyJobs();
        var energyDeliverJobs = this.getEnergyDeliverJobs();

        // deturmine creeps that really need to be spawned

        jobs = jobs.concat(
            replacementJobs,
            harvestJobs,
            energyCollectJobs,
            repairJobs,
            buildJobs,
            upgradeJobs,
            guardJobs,
            energyDeliverJobs
         // attack / defend
        );

        // console.log('replacementJobs', JSON.stringify(replacementJobs));
        // console.log('harvestJobs', JSON.stringify(harvestJobs));
        // console.log('energyCollectJobs', JSON.stringify(energyCollectJobs));
        // console.log('repairJobs', JSON.stringify(repairJobs));
        // console.log('buildJobs', JSON.stringify(buildJobs));
        // console.log('upgradeJobs', JSON.stringify(upgradeJobs));
        // console.log('guardJobs', JSON.stringify(guardJobs));
        // console.log('energyDeliverJobs', JSON.stringify(energyDeliverJobs));

        return jobs;
    },

    allocateEnergyStoreJobs: function(){
        // fill room energy first
        // split energy jobs by energy amount
        var energyStoreAmount = this.room.roomEnergyCapacity() - this.room.roomEnergy();
        if(energyStoreAmount){
            var creeps = this.room.creeps(function(creep){
                return creep.role() === 'carrier' && creep.energy;
            });

            // allocate energy store tasks to creeps until full
            for(var i = creeps.length - 1; i >= 0; i--){
                if(!energyStoreAmount){
                    break;
                }

                var creep = creeps[i];
                energyStoreAmount -= creep.energy;
                // allocate creep to energy_store

                this.room.jobList().add({
                    role: 'carrier',
                    type: 'energy_store',
                    source: creep,
                    target: this.room
                }).start();
            }
        }
    },


    allocateDefendJobs: function() {
        if(!this.room.containsHostiles()){
            return [];
        }

        var jobs = [];
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

    allocate: function(){

        this.allocateEnergyStoreJobs();
        this.allocateDefendJobs();

        var pending = this.room.jobList().getPending();

        for (var i = 0; i < pending.length; i++) {
            var job = pending[i];

            var allocated;

            allocated = this.allocateJobToExisting(job);

            if(!allocated){
                allocated = this.allocateJobToSpawn(job);
            }
        }
    },

    update: function(){

        var newJobs = this.getJobs();
        var list = this.room.jobList();
        list.addMultiple(newJobs);
        this.prioritizeJobs(list.all());
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
