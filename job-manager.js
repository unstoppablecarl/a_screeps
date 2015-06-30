'use strict';


var JobManager = function JobManager(room) {
    this.room = room;
};

JobManager.prototype = {
    constructor: JobManager,

    assignNewJob: function(creep, jobData){
        var active = this.room.jobsActive();
        jobData.source_id = creep.id;
        var job = active.add(jobData);
        job = active.get(job.id);
        job.start();
    },

    assignPendingJob: function(creep, jobId){
        var pending = this.room.jobsPending();
        var active = this.room.jobsActive();
        var job = pending.get(jobId);
        if(!job){
            return false;
        }

        var currentJob = creep.job();
        if(currentJob){
            currentJob.cancel();
        }

        pending.remove(jobId);
        active.add(job.jobData);

        active.get(jobId).start();
        return true;
    },

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

        var sources = this.room.flags(function(flag){
            return flag.role() === 'source' && !flag.harvester() && flag.source() && !flag.isTargetOfJobType('harvest');
        }).map(function(flag){
            return flag.source();
        });

        return sources.map(function(source){
            return {
                role: 'harvester',
                type: 'harvest',
                target: source,
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
        var minJobEnergyRatio = this.minJobEnergyRatio();
        var energyPercent = this.extensionEnergy() / this.extensionEnergyCapacity();
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

        // var minEnergySpawn = this.energyPileThresholdSpawn();
        // var min = this.energyPileThresholdMin();
        var energyPiles = this.energyPiles();

        return energyPiles.map(function(pile){
            return {
                role: 'carrier',
                type: 'energy_collect',
                target: pile,
            };
        });
    },

    getEnergyStoreJobs: function() {

        if(this.room.roomEnergy() < this.room.roomEnergyCapacity()){

        }
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
    prioritizeJobs: function(jobs){

        for (var i = 0; i < jobs.length; i++) {
            var job = jobs[i];
            job.priority = this.getBaseJobPriority(job);
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
        var guardJobs = this.getGuardJobs();

        // deturmine creeps that really need to be spawned

        // jobs = jobs.concat(


        //     // attack / defend
        // );


        // split energy jobs by energy amount

        // fill room energy first
        var energyStoreAmount = this.room.roomEnergyCapacity() - this.room.roomEnergy();
        if(energyStoreAmount){
            var creeps = this.room.creeps(function(creep){
                return creep.role() === 'carrier' && creep.energy;
            });

            for(var i = creeps.length - 1; i >= 0; i--){
                if(!energyStoreAmount){
                    break;
                }

                var creep = creeps[i];
                energyStoreAmount -= creep.energy;
                // allocate creep to energy_store

                this.assignNewJob(creep, {
                    role: 'carrier',
                    type: 'energy_store'
                });
                creeps.splice(1, i);
            }
        }

        var energyStoreJobs = this.getEnergyStoreJobs();
        var energyDeliverJobs = this.getEnergyDeliverJobs();

        jobs = this.prioritizeJobs(jobs);
        return jobs;
    },
};



Room.prototype.allocateJobToExisting = function(job) {
    var creeps;
    if(job.task_name === 'energy_deliver'){
        creeps = this.creeps(function(creep){

            if(creep.role() !== job.role){
                return false;
            }

            return (creep.idle() || (creep.taskName() === 'energy_store'));
        });

    } else if(job.task_name === 'energy_collect'){
        // idle creeps
        creeps = this.creeps(function(creep){
            return creep.idle() && creep.role() === job.role && creep.energy < creep.energyCapacity;
        });
    }else {
        // idle creeps
        creeps = this.creeps(function(creep){
            return creep.idle() && creep.role() === job.role;
        });
    }

    if(!creeps || !creeps.length){
        return false;
    }
    var creep;
    if(target && creeps.length > 1){
        creep = target.pos.findClosest(creeps);
    } else {
        creep = creeps[0];
    }
    if(!creep){
        return false;
    }

    var memory = job.memory || {};
    var taskName = job.task_name;
    var taskSettings = job.task_settings || {};
    var targetId = taskSettings.target_id;
    var target = Game.getObjectById(targetId);

    if(creep && taskName){
        creep.startTask(taskName, taskSettings);
    }

    if(job.memory){
        _.extend(creep.memory, job.memory);
    }

    if(job.type === 'replacement'){
        if(job.job_settings && job.job_settings.replacing_creep_id){
            var replacingCreep = Game.getObjectById(job.job_settings.replacing_creep_id);
            if(replacingCreep){
                replacingCreep.replaced(true);
            }
        }
    }
    console.log('allocate job ', taskName, creep.name);

    return true;
};

Room.prototype.allocateJobToSpawn = function(job) {
    var spawns = this.availableSpawns();
    if(!spawns|| !spawns.length){
        return false;
    }

    var memory = {
        role: job.role,
        task_name: job.task_name,
        task_settings: job.task_settings,
    };

    if(job.memory){
        _.extend(memory, job.memory);
    }

    var maxEnergyRatio = this.maxCreepSpawnEnergyRatio();
    var energyThreshold = (300 + this.extensionEnergyCapacity()) * maxEnergyRatio;

    // if there are no harvesters spawn whatever type of harvester possible
    if(job.role === 'harvester'){
        var harvesters = this.creeps(function(creep){
           return creep.role() === 'harvester';
        });

        if(!harvesters || !harvesters.length){
            energyThreshold = this.roomEnergy();
        }
    }
    // order spawns by closest
    if(memory.task_settings && memory.task_settings.target_id){
        var target = Game.getObjectById(memory.task_settings.target_id);
        if(target){
            spawns = _.sortBy(spawns, function(spawn){
                return spawn.pos.getRangeTo(target);
            });
        }
    }

    if(energyThreshold === 0 ){
        console.log('no energy');
        return false;
    }
    var body = metaRoles.getBody(job.role, energyThreshold);

    for (var i = 0; i < spawns.length; i++) {
        var spawn = spawns[i];
        var result = spawn.spawnCreep(body, memory);

        // var result = spawn.canCreateCreep(body, memory);
        if(result === ERR_NOT_ENOUGH_ENERGY ||
            result === ERR_NOT_OWNER ||
            result === ERR_NAME_EXISTS ||
            result === ERR_BUSY ||
            result === ERR_INVALID_ARGS){
            result = false;
        } else {
            console.log('spawn allocating', job.role, job.task_name, body, energyThreshold, result);
            result = true;
        }

        if(result){

            if(job.type === 'replacement'){
                if(job.job_settings && job.job_settings.replacing_creep_id){
                    var replacingCreep = Game.getObjectById(job.job_settings.replacing_creep_id);
                    if(replacingCreep){
                        replacingCreep.replaced(true);
                    }
                }
            }
            return true;
        }
    }

    return false;
};

Room.prototype.allocateJobs = function() {
    var jobs = this.jobs();
    if(!jobs || !jobs.length){
        return;
    }

    jobs = jobs.filter(function(job){

        var allocated;

        allocated = this.allocateJobToExisting(job);

        if(!allocated && !job.existing_only){
            allocated = this.allocateJobToSpawn(job);
        }

        // only keep un allocated jobs in jobs list
        return !allocated;
    }, this);

    // save updated jobs list
    this.jobs(jobs);

    // @TODO move idle creeps to idle flags to get out of the way

};

module.exports = JobManager;
