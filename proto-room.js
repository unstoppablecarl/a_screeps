'use strict';

var metaRoles = require('meta-roles');

Room.prototype.act = function() {
    // if (Game.time % 5 === 0) {
        this.updateEnergyPiles();
        this.updateJobs();
        this.allocateJobs();
    // }

    if (Game.time % 20 === 0) {
        this.updateExtensionCount();
    }
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
    var table = require('util').table;

    for (var roleName in populationData) {
        var roleData = populationData[roleName];
        var percent = roleData.count / totalPopulation;
        roleData.percent = (Math.round(percent * 100) / 100) + '%';
    }
    table(populationData);
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

Room.prototype.availableSpawns = function() {
    return this.spawns(function(spawn) {
        return !spawn.spawning;
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

Flag.prototype.repairPriority = function(structure, priority) {
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

Flag.prototype.buildPriority = function(structure, priority) {
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

Room.prototype.energyPiles = function(piles){
    if (piles !== void 0) {
        this.memory.energy_piles = piles;
    }
    return this.memory.energy_piles;
};

// min energy a pile must have to be considered
Room.prototype.energyPileThresholdMin = function(value){
    if (value !== void 0) {
        this.memory.energy_pile_threshold_min = value;
    }
    return this.memory.energy_pile_threshold_min || 150;
};

// the size of an energy pile required to prompt assigning another collector
Room.prototype.energyPileThresholdMax = function(value){
    if (value !== void 0) {
        this.memory.energy_pile_threshold_max = value;
    }
    return this.memory.energy_pile_threshold_max || 1500;
};

Room.prototype.updateEnergyPiles = function() {
    var threshold = this.energyPileThresholdMin();
    var piles = this.energy(function(pile){
        return pile.energy >= threshold;
    });
    this.energyPiles(piles);
};

Room.prototype.requestEnergy = function(creep) {
    if(!this.memory.energy_requests){
        this.memory.energy_requests = [];
    }
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

// JOBS

Room.prototype.jobs = function(jobs) {
    if (jobs !== void 0) {
        this.memory.jobs = jobs;
    }
    return this.memory.jobs;
};


Room.prototype.getJobPriority = function(job) {
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
        collector: 0.90,
    };

    var rolePriority = rolePriorities[role] || 0;
    var taskPriority = 0;

    if(target){
        if(taskName === 'repair'){

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

            taskPriority = 25;
        }
    }

    var priority = (rolePriority + taskPriority) / 2;
    return priority;
};

Room.prototype.getReplacementJobs = function() {

    var threshold = this.creepReplaceThreshold();
    // exclude idle
    var creeps = this.creeps(function(creep){
        return !creep.idle() && creep.ticksToLive < threshold;
    });

    return creeps.map(function(creep){
        return {
            role: creep.role(),
            task_name: creep.taskName(),
            task_settings: creep.taskSettings(),
            memory: null
        };
    });
};

Room.prototype.getCollectorJobs = function() {
    var min = this.energyPileThresholdMin();
    var energyPiles = this.energyPiles();
    energyPiles = energyPiles.filter(function(pile){
        return pile.energy > min;
    });
    return energyPiles.map(function(pile){
        return {
            role: 'carrier',
            task_name: 'energy_collect',
            task_settings: {
                target_id: pile.id
            },
            memory: null
        };
    });
};

Room.prototype.getRepairJobs = function() {

    var structures = this.structures(function(s){
        return s.hits < s.hitsLeft;
    });

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

    var harvesters = this.creeps(function(creep){
        return creep.role() === 'harvester';
    });
    var harvestedSourceIds = harvesters.map(function(creep){
        return creep.taskTarget();
    }).filter(function(id){
        return id;
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
    var energyPercent = this.energyPercent();

    if(minJobEnergyRatio > energyPercent){
        return [];
    }

    var creeps = this.energyRequests();

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
};

Room.prototype.updateJobs = function() {

    var jobs = [];

    // check for creeps about to die that need to be replaced
    jobs = jobs.concat(
        // this.getReplacementJobs(),
        this.getHarvesterJobs(),
        this.getCollectorJobs(),
        this.getRepairJobs()
        // this.getBuildJobs(),
        // this.getDeliverJobs(),
        // this.getUpgradeJobs()
        // attack / defend
    );
        this.jobs(jobs);

    jobs = _.sortBy(jobs, function(job){
        return job.priority;
    });
    // this.jobs(jobs);
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

    if(taskName){
        creep.startTask(taskName, taskSettings);
    }

    if(job.memory){
        _.extend(creep.memory, job.memory);
    }

    return true;
};

Room.prototype.allocateJobToSpawn = function(job) {

    var memory = {
        role: job.role,
        task_name: job.task_name,
        task_settings: job.task_settings,
    };

    if(job.memory){
        _.extend(memory, job.memory);
    }

    var maxEnergyRatio = this.maxCreepSpawnEnergyRatio();
    // energy a room must have to allocate a job instead of build a creep
    var energyThreshold = this.extensionEnergyCapacity() * maxEnergyRatio;

    var spawns = this.availableSpawns();

    if(!spawns || !spawns.length){
        return;
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

    var body = metaRoles.getBody(job.role, energyThreshold);
    for (var i = 0; i < spawns.length; i++) {
        var spawn = spawns[i];
        if(spawn.spawnCreep(body, memory) === OK){
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
        var allocated = this.allocateJobToExisting(job);

        if(!allocated){
            allocated = this.allocateJobToSpawn(job);
        }

        // only keep un allocated jobs in jobs list
        return !allocated;
    }, this);

    // save updated jobs list
    this.jobs(jobs);

    // @TODO move idle creeps to idle flags to get out of the way

};
