'use strict';

var metaRoles = require('meta-roles');

Room.prototype.act = function() {
    if (Game.time % 5 === 0) {
        this.updateJobs();
        this.updateTotalCarrierCapacity();
        this.jobsReport();
    }

    this.allocateJobs();

    if (Game.time % 20 === 0) {
        this.updateExtensionCount();
    }
};

Room.prototype.jobsReportData = function() {
     var jobData = [];
        _.each(this.jobs(), function(job){
            var target;
            var pos;
            if(job.task_settings && job.task_settings.target_id){
                target = Game.getObjectById(job.task_settings.target_id);
                if(target){
                    pos = target.pos;
                }
            }
            jobData.push({
                pos: pos,
                role: job.role,
                task: job.task_name,
                prior: job.priority,
                existing_only: job.existing_only,
            });
        });
        return jobData;

};


Room.prototype.jobsReport = function() {
    var table = require('util').table;
    var str = table(this.jobsReportData());
    console.log(str);
};

Room.prototype.populationReport = function() {
    var populationData = {};
    var totalPopulation = 0;
    var creeps = this.creeps();
    for (var name in creeps) {
        var creep = creeps[name];
        var role = creep.role();
        if (!populationData[role]) {
            populationData[role] = {
                role: role,
                count: 0,
                percent: 0,
            };
        }
        populationData[role].count++;
        totalPopulation++;
    }

    console.log('* population report *');
    var tableLog = require('util').tableLog;

    for (var roleName in populationData) {
        var roleData = populationData[roleName];
        var percent = roleData.count / totalPopulation;
        roleData.percent = (Math.round(percent * 100) / 100) + '%';
    }
    tableLog(populationData);
};

var finder = function(room, key, filter){
    if (filter) {
        var settings = {
            filter: filter
        };
        return room.find(key, settings);
    } else {
        return room.find(key);
    }
};

Room.prototype.spawns = function(filter) {
    return finder(this, FIND_MY_SPAWNS, filter);
};

Room.prototype.creeps = function(filter) {
    return finder(this, FIND_MY_CREEPS, filter);
};

Room.prototype.structures = function(filter) {
    return finder(this, FIND_MY_STRUCTURES, filter);
};

Room.prototype.extensions = function(filter) {
    return this.structures(function(s){
        if(s.structureType !== 'extension'){
            return false;
        }

        if(filter && !filter(s)){
            return false;
        }

        return true;
    });
};

Room.prototype.flags = function(filter) {
    return finder(this, FIND_FLAGS, filter);
};

Room.prototype.constructionSites = function(filter) {
    return finder(this, FIND_CONSTRUCTION_SITES, filter);
};

Room.prototype.energy = function(filter) {
    return finder(this, FIND_DROPPED_ENERGY, filter);
};

Room.prototype.sources = function(filter){
    return finder(this, FIND_SOURCES, filter);
};

Room.prototype.roads = function(filter){
    return finder(this, FIND_STRUCTURES, filter);
};

Room.prototype.availableSpawns = function() {
    return this.spawns(function(spawn) {
        return !spawn.isBusy();
    });
};

Room.prototype.extensionCount = function(count) {
    if (count !== void 0) {
        this.memory.extension_count = count;
    }
    return this.memory.extension_count;
};

Room.prototype.updateExtensionCount = function() {
    var extensions = this.extensions();
    if (extensions && extensions.length) {
        this.extensionCount(extensions.length);
    }
};

Room.prototype.extensionEnergyCapacity = function() {
    var extensionCount = this.extensionCount();
    if (extensionCount) {
        return extensionCount * 50;
    }
    return 0;
};

Room.prototype.extensionEnergy = function() {
    var extensions = this.extensions();
    var total = 0;
    for (var i = 0; i < extensions.length; i++) {
       var ex = extensions[i];

       total += ex.energy;
    }
    return total;
};

Room.prototype.spawnEnergy = function() {
    var spawns = this.spawns();
    var total = 0;
    for (var i = 0; i < spawns.length; i++) {
       var ex = spawns[i];

       total += ex.energy;
    }
    return total;
};

Room.prototype.spawnEnergyCapacity = function() {
    var spawns = this.spawns();
    return spawns.length * 50;
};

Room.prototype.roomEnergy = function() {
    return this.spawnEnergy() + this.extensionEnergy();
};

Room.prototype.roomEnergyCapacity = function() {
    return this.spawnEnergyCapacity() + this.extensionEnergyCapacity();
};

Room.prototype.energyPercent = function(){
    var spawns = this.spawns();
    var extensions = this.extensions();
    var total = 0;
    var totalCapacity = (spawns.length * 300) + (extensions.length * 50);

    for (var i = 0; i < spawns.length; i++) {
       var spawn = spawns[i];
       total += spawn.energy;
    }

    for (var j = 0; j < extensions.length; j++) {
        var extension = extensions[i];
        total += extension.energy;
    }
    return total / totalCapacity;
};

Room.prototype.ildeCreeps = function(role){
    return this.find(FIND_MY_CREEPS, {
        filter: function(creep){
            if(role && creep.role() === role){
                return false;
            }
            return creep.idle();
        }
    });
};

var defaultRepairPriority = {};
defaultRepairPriority[STRUCTURE_EXTENSION] = 95;
defaultRepairPriority[STRUCTURE_ROAD] = 90;
defaultRepairPriority[STRUCTURE_LINK] = 80;
defaultRepairPriority[STRUCTURE_RAMPART] = 60;
defaultRepairPriority[STRUCTURE_WALL] = 50;

Room.prototype.repairPriority = function(structure, priority) {
    if(!this.memory.repair_priority){
        this.memory.repair_priority = defaultRepairPriority;
    }

    var repairPriority = this.memory.repair_priority;
    if (priority !== void 0) {
        repairPriority[structure] = priority;
    }
    return repairPriority[structure] || 0;
};

var defaultBuildPriority = {};
defaultBuildPriority[STRUCTURE_EXTENSION] = 95;
defaultBuildPriority[STRUCTURE_ROAD] = 90;
defaultBuildPriority[STRUCTURE_LINK] = 80;
defaultBuildPriority[STRUCTURE_RAMPART] = 60;
defaultBuildPriority[STRUCTURE_WALL] = 50;

Room.prototype.buildPriority = function(structure, priority) {
    if(!this.memory.repair_priority){
        this.memory.repair_priority = defaultBuildPriority;
    }

    var buildPriority = this.memory.repair_priority;
    if (priority !== void 0) {
        buildPriority[structure] = priority;
    }
    return buildPriority[structure] || 0;
};

// ENERGY

// the minimum percentage of room energy there must be to get energy for a job
Room.prototype.minJobEnergyRatio = function(ratio) {
    if (ratio !== void 0) {
        this.memory.job_min_energy_ratio = ratio;
    }
    var r = this.memory.job_min_energy_ratio;
    if (!r) {
        this.memory.job_min_energy_ratio = 0.5;
    }
    return this.memory.job_min_energy_ratio;
};

// the maximum percentage of room energy that can be used to spawn a creep
Room.prototype.maxCreepSpawnEnergyRatio = function(max) {
    if (max !== void 0) {
        this.memory.max_creep_spawn_energy_ratio = max;
    }
    var r = this.memory.max_creep_spawn_energy_ratio;
    if (!r) {
        this.memory.max_creep_spawn_energy_ratio = 0.5;
    }
    return this.memory.max_creep_spawn_energy_ratio;
};

Room.prototype.getEnergyPiles = function(forceRefresh){
    if(forceRefresh || !this.piles){
        var threshold = this.energyPileThresholdMin();
        this.piles = this.energy(function(pile){
            return pile.energy >= threshold;
        });
    }
    return this.piles;
};

// min energy a pile must have to be considered
Room.prototype.energyPileThresholdMin = function(value){
    if (value !== void 0) {
        this.memory.energy_pile_threshold_min = value;
    }
    return this.memory.energy_pile_threshold_min || 150;
};

// the size of an energy pile required to prompt spawning another collector
Room.prototype.energyPileThresholdSpawn = function(value){
    if (value !== void 0) {
        this.memory.energy_pile_threshold_spawn = value;
    }
    return this.memory.energy_pile_threshold_spawn || 1500;
};

Room.prototype.requestEnergy = function(creep) {
    if(!this.memory.energy_requests){
        this.memory.energy_requests = [];
    }
    console.log('request energy');
    this.memory.energy_requests.push(creep);
};

Room.prototype.energyRequests = function(requests) {
    if(!this.memory.energy_requests){
        this.memory.energy_requests = [];
    }
    if (requests !== void 0) {
        this.memory.energy_requests = requests;
    }
    return this.memory.energy_requests;
};

// if creep.ticksToLive <= threshold it will be replaced
Room.prototype.creepReplaceThreshold = function(value){
    if (value !== void 0) {
        this.memory.creep_replace_threshold = value;
    }
    return this.memory.creep_replace_threshold || 100;
};

// CREEP DATA
Room.prototype.totalCarrierCapacity = function(capacity) {
    if (capacity !== void 0) {
        this.memory.total_carrier_capacity = capacity;
    }
    return this.memory.total_carrier_capacity;
};

Room.prototype.updateTotalCarrierCapacity = function() {
    var total = 0;
    var totalCarrierCapacity = this.creeps(function(creep){
        if(creep.role() === 'carrier'){
            total += creep.energyCapacity;
        }
    });
    this.totalCarrierCapacity(total);
};



// JOBS

Room.prototype.jobs = function(jobs) {
    if (jobs !== void 0) {
        this.memory.jobs = jobs;
    }
    return this.memory.jobs;
};


Room.prototype.getJobPriority = function(job, jobs) {
    var role = job.role;
    var taskName = job.task_name;
    var taskSettings = job.task_settings || {};
    var targetId = taskSettings.target_id;
    var target;

    if(targetId){
        target = Game.getObjectById(targetId);
    }
    var rolePriorities = {
        harvester: 0.95,
    };

    var rolePriority = rolePriorities[role] || 0;
    var taskPriority = 0;

    if(target){
        if(taskName === 'energy_collect'){
            return 0.9;
        }
        else if(taskName === 'repair'){

            var damagePercent = 1 - (target.hits / target.hitsLeft);
            var repairPriority = this.repairPriority(target.structureType);
            var repairPriorityPercent = (repairPriority / 100);
            // average of damage percent and basePriority
            taskPriority = (damagePercent + repairPriorityPercent) / 2;

        } else if(taskName === 'build'){

            var progressPercent = target.progress / target.progressTotal;
            var buildPriority = this.buildPriority(target.structureType);
            var buildPriorityPercent = (buildPriority / 100);
            // average of progress percent and basePriority
            taskPriority = (progressPercent + buildPriorityPercent) / 2;

        } else if(taskName === 'energy_deliver'){

            var energyPriority = 1 - (target.energy / target.energyCapacity);
            taskPriority = (energyPriority + 55) / 2;

        } else if(taskName === 'upgrade_room_controller'){

            taskPriority = 0.25;
        }
    }

    var priority = (rolePriority + taskPriority) / 2;
    return priority;
};

Room.prototype.getReplacementJobs = function() {

    var threshold = this.creepReplaceThreshold();
    // exclude idle
    var creeps = this.creeps(function(creep){
        return !creep.idle() && !creep.replaced() && creep.ticksToLive < threshold;
    });

    return creeps.map(function(creep){
        return {
            type: 'replacement',
            job_settings: {
                replacing_creep_id: creep.id,
            },
            role: creep.role(),
            task_name: creep.taskName(),
            task_settings: creep.taskSettings(),
            memory: null
        };
    });
};


Room.prototype.getCollectorJobs = function() {
    var minEnergySpawn = this.energyPileThresholdSpawn();
    var min = this.energyPileThresholdMin();
    var energyPiles = this.getEnergyPiles();

    var energyPilesTotal = 0;
    energyPiles.forEach(function(pile){
        energyPilesTotal += pile.energy;
    });

    var carriers = this.creeps(function(creep){
        return creep.role() === 'carrier';
    });

    var carrierCapacityTotal = 0;
    carriers.forEach(function(carrier){
        carrierCapacityTotal += carrier.energyCapacity;
    });

    var collectorLimitReached = energyPilesTotal * 0.5 < carrierCapacityTotal;

    var pileAssignedCollectCapacity = {};

    var collectors = this.creeps().forEach(function(creep){
        if(
            creep.role() === 'carrier' &&
            creep.taskName() === 'energy_collect'
        ){
            var target = creep.taskTarget();
            if(!target){
                return;
            }
            if(!pileAssignedCollectCapacity[target.id]){
                pileAssignedCollectCapacity[target.id] = 0;
            }
            pileAssignedCollectCapacity[target.id] += creep.energyCapacity;
        }
    });

    energyPiles = energyPiles.filter(function(pile){
        var assignedCapacity = pileAssignedCollectCapacity[pile.id] || 0;
        if(pile.energy < assignedCapacity){
            return false;
        }
        return pile.energy > min;
    });

    return energyPiles.map(function(pile){
        var existing_only = collectorLimitReached || pile.energy < minEnergySpawn;
        return {
            role: 'carrier',
            task_name: 'energy_collect',
            task_settings: {
                target_id: pile.id
            },
            existing_only: existing_only,
            memory: null
        };
    });
};

Room.prototype.getRepairJobs = function() {

    var structures = this.structures(function(s){
        return s.hits < s.hitsLeft;
    });

    var roads = this.roads(function(road){
        return road.hitsLeft < road.hits;
    });

    structures = structures.concat(roads);
    return structures.map(function(s){
        return {
            role: 'tech',
            task_name: 'repair',
            task_settings: {
                target_id: s.id,
            }
        };

    }, this);
};

Room.prototype.getHarvesterJobs = function() {
    var sources = this.sources(function(source){
        var flags = source.pos.findInRange(FIND_FLAGS, 3, {
            filter: function(flag){
                return flag.role() === 'source';
            }
        });
        return flags && flags.length;
    });

    var harvestedSourceIds = this.creeps(function(creep){
        return creep.role() === 'harvester' && creep.taskTarget();
    }).map(function(creep){
        var target = creep.taskTarget();
        return target.id;
    });

    return sources
        .filter(function(source){
            return harvestedSourceIds.indexOf(source.id) === -1;
        }, this)
        .map(function(source){
            return {
                role: 'harvester',
                task_name: 'harvest',
                task_settings: {
                    target_id: source.id
                },
                memory: null
            };
        });
};

Room.prototype.getBuildJobs = function() {

    var sites = this.constructionSites();
    return sites.map(function(s){
        return {
            role: 'tech',
            task_name: 'build',
            task_settings: {
                target_id: s.id,
            },
            memory: null
        };

    }, this);
};

Room.prototype.getDeliverJobs = function() {

    var minJobEnergyRatio = this.minJobEnergyRatio();
    var energyPercent = this.extensionEnergy() / this.extensionEnergyCapacity();
    if(minJobEnergyRatio > energyPercent){
        return [];
    }

    var creeps = this.energyRequests();
    this.energyRequests([]);
    return creeps.map(function(c){
        return {
            role: 'carrier',
            task_name: 'energy_deliver',
            task_settings: {
                target_id: c.id,
            }
        };
    }, this);
};

Room.prototype.getUpgradeJobs = function() {
    var controller = this.controller;
    if(!controller){
        return [];
    }

    var upgraders = this.creeps(function(creep){
        return creep.role() === 'upgrader';
    });

    if(!upgraders || !upgraders.length){
        return [{
            role: 'upgrader',
            task_name: 'upgrade_room_controller',
            task_settings: {
                target_id: controller.id
            }
        }];
    }

    return [];
};

Room.prototype.updateJobs = function() {

    var jobs = [];

    // check for creeps about to die that need to be replaced
    jobs = jobs.concat(
        this.getReplacementJobs(),
        this.getHarvesterJobs(),
        this.getCollectorJobs(),
        this.getRepairJobs(),
        this.getBuildJobs(),
        this.getDeliverJobs(),
        this.getUpgradeJobs()
        // attack / defend
    );

    jobs = jobs.map(function(job){
        job.priority = this.getJobPriority(job, jobs);
        return job;
    }, this);

    jobs = _.sortByOrder(jobs, [function(job){
        return job.priority;
    }], [false]);

    this.jobs(jobs);

};

Room.prototype.allocateJobToExisting = function(job) {
    var creeps;
    if(job.task_name === 'energy_deliver'){
        creeps = this.creeps(function(creep){
            return creep.energy > 0 && creep.role() === job.role;
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
    var memory = job.memory || {};
    var taskName = job.task_name;
    var taskSettings = job.task_settings || {};
    var targetId = taskSettings.target_id;
    var target = Game.getObjectById(targetId);

    var creep;
    if(target && creeps.length > 1){
        creep = target.pos.findClosest(creeps);
    } else {
        creep = creeps[0];
    }

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
