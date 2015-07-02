'use strict';

var rolesMeta = require('roles-meta');

var JobManager = function JobManager(room) {
    this.room = room;
};

JobManager.prototype = {
    constructor: JobManager,


    getReplacementJobs: function() {
        // @TODO base threshold on distance from spawn
        var threshold = this.room.creepReplaceThreshold();
        // @TODO exclude unused, something more advanced than just checking idle
        var creeps = this.room.creeps(function(creep) {
            return !creep.idle() && creep.ticksToLive < threshold && !creep.isTargetOfJobType('replace');
        });

        return creeps.map(function(creep) {
            return {
                role: creep.role(),
                type: 'replace',
                target: creep,
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
            var havesterCountMax = flag.havesterCountMax();
            var jobs = source.targetOfJobs().map(function(job){
                if(job && job.type() === 'harvest'){
                    var source = job.source();
                    if(source){
                        allocatedHarvestWork += source.getActiveBodyparts(WORK);

                    } else {
                        allocatedHarvestWork++;
                    }
                    allocatedCreepCount++;
                }
            });
            // max 5 work body parts allocated
            return allocatedCreepCount < havesterCountMax && allocatedHarvestWork < 5;
        }).map(function(flag){
            return {
                role: 'harvester',
                type: 'harvest',
                target: flag.source(),
            };
        });
    },

    getRepairJobs: function() {

        var structures = this.room.structures(function(s){
            return s.hits < s.hitsLeft && !s.isTargetOfJobType('repair');
        });

        var roads = this.room.roads(function(road){
            return road.hitsLeft < road.hits && !road.isTargetOfJobType('repair');
        });

        structures = structures.concat(roads);
        return structures.map(function(structure){
            return {
                role: 'tech',
                type: 'repair',
                target: structure,
            };
        }, this);
    },

    getBuildJobs: function() {
        var sites = this.room.constructionSites(function(site){
            return !site.isTargetOfJobType('build');
        });
        var techCount = this.room.roleCount('tech');
        var existing_only = techCount > sites.length;

        // @TODO handle existing only, when setting priority
        return sites.map(function(site){
            return {
                role: 'tech',
                type: 'build',
                target: site,
                existing_only: existing_only,
            };

        }, this);
    },

    getUpgradeJobs: function() {
        var controller = this.room.controller;
        if(!controller){
            return [];
        }

        var upgraders = this.room.creeps(function(creep){
            return creep.role() === 'upgrader';
        });

        if(!upgraders || !upgraders.length){
            return [{
                role: 'upgrader',
                type: 'upgrade_room_controller',
                target: controller,
            }];
        }

        return [];
    },

    getEnergyDeliverJobs: function() {

        var jobs = [];
        var minJobEnergyRatio = this.room.minJobEnergyRatio();
        var energyPercent = this.room.extensionEnergy() / this.room.extensionEnergyCapacity();
        if(minJobEnergyRatio > energyPercent){

            // @TODO push split into multiple jobs
            jobs.push({
                role: 'carrier',
                type: 'energy_deliver',
                target: this.room,
            });
        }

        var creeps = this.room.creeps(function(creep){
            return creep.role() === 'tech' && creep.energy < creep.energyCapacity && !creep.isTargetOfJobType('energy_deliver');
        });

        return creeps.map(function(creep){
            return {
                role: 'carrier',
                type: 'energy_deliver',
                target: creep,
            };
        }, this);
    },

    getEnergyCollectJobs: function() {
        var minEnergySpawn = this.room.energyPileThresholdSpawn();

        return this.room.energyPiles().filter(function(pile){
            // one job per pile over the limit or with no collectors assigned
            return (pile.energy > minEnergySpawn) || !pile.isTargetOfJobType('energy_collect');
        }).map(function(pile){
            return {
                role: 'carrier',
                type: 'energy_collect',
                target: pile,
            };
        });
    },

    getGuardJobs: function() {
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
                type: 'guard',
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
        // else if(type === 'energy_store'){

        //     priority = 0.8;
        //     if(target){
        //         priority += (target.energy / target.energyCapacity) * 0.1;
        //     }

        // }
        else if(type === 'energy_deliver'){

            priority = 0.6;

            if(target){
                priority += (target.energy / target.energyCapacity) * 0.1;
            }

        }
        else if(type === 'energy_collect'){

            priority = 0.9;

            if(target){
                // move one decimal over
                // assume energy pile will never be more than 100000 energy
                priority += (target.energy / 100000) * 0.1;
            }

        }
        else if(type === 'replace'){

            if(target){
                var targetJob = target.job();
                if(targetJob){
                    priority = this.getBaseJobPriority(targetJob);
                }
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

            priority = 0.4;

            if(target){
                var damage = 1 - (target.hits / target.hitsLeft);
                var repairPriority = this.room.repairPriority(target.structureType);
                // average
                var repairJobPriority = (damage + repairPriority) / 2;
                // move one decimal over
                priority += repairJobPriority * 0.1;
            }

        }
        else if(type === 'guard'){

            priority = 0.7;

        }
        else if(type === 'upgrade_room_controller'){

            priority = 0.1;

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

        if(type === 'replacement'){

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
// console.log('allocateJobToSpawn');
        var spawns = this.room.availableSpawns();
        if(!spawns|| !spawns.length){
            return false;
        }
        var role = job.role();
        var target;
        var maxCreepCost;
        var spawn = spawns[0];
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

        // if there are no harvesters spawn whatever type of harvester possible
        if(role === 'harvester'){
            var harvesterCount = this.room.roleCount('harvester');
            if(!harvesterCount){
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
        // console.log('spawn creep', result, body, memory);

        // var result = spawn.canCreateCreep(body, memory);
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

        // var replacementJobs = this.getReplacementJobs();
        var harvestJobs = this.getHarvestJobs();
        var energyCollectJobs = this.getEnergyCollectJobs();
        // var repairJobs = this.getRepairJobs();
        // var buildJobs = this.getBuildJobs();
        var upgradeJobs = this.getUpgradeJobs();
        // var guardJobs = this.getGuardJobs();
        // var energyDeliverJobs = this.getEnergyDeliverJobs();

        // deturmine creeps that really need to be spawned

        jobs = jobs.concat(
            // replacementJobs,
            harvestJobs,
            energyCollectJobs,
            // repairJobs,
            // buildJobs,
            upgradeJobs
            // guardJobs,
            // energyDeliverJobs
         // attack / defend
        );
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
                    target: 'nearest energy dropoff'
                });
            }
        }
    },

    allocate: function(){

        // this.allocateEnergyStoreJobs();

        // @todo or get from cache

        // if(this.room.sources().length <= this.room.roleCount('harvester')){
        //     this.room.jobList().add({
        //         type: 'energy_collect',
        //         role: 'carrier',
        //     });
        // }

        _.each(this.room.jobList().getPending(), function(job){
            var allocated;

            allocated = this.allocateJobToExisting(job);

            if(!allocated){
                allocated = this.allocateJobToSpawn(job);
            }

        }, this);


        var idleCreeps = this.room.creeps(function(creep){
            return creep.idle();
        });

        for (var i = 0; i < idleCreeps.length; i++) {
            var creep = idleCreeps[i];
            var role = creep.role();
            var idleFlag = creep.pos.findClosestIdleFlag(role);
            var newJob = this.room.jobList().add({
                type: 'idle',
                role: role,
                source: creep,
                target: idleFlag
            });
            newJob.start();
        };
    },

    update: function(){

        var newJobs = this.getJobs();
        var list = this.room.jobList();
        list.addMultiple(newJobs);
        this.prioritizeJobs(list.all());

        this.report();
    },
    reportData: function(jobs) {
        var jobData = [];
        _.each(jobs, function(job){
            var target;
            var pos;
            jobData.push({
                id: job.id(),
                role: job.role(),
                type: job.type(),
                prior: job.priority(),
                source: job.source(),
                target: job.target(),
            });
        });
        return jobData;
    },

    report: function() {
        var jobs = this.room.jobList().getPending();
        var table = require('util').table;
        var str = table(this.reportData(jobs));
        if(str){
            console.log(str);
        }
    },

};


module.exports = JobManager;
