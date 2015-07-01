'use strict';

require('proto-room-settings');

var JobList = require('job-list');
var JobManager = require('job-manager');


Room.prototype.isRoom = true;

Room.prototype.jobsActive = function(){
    if(this.jobs_active === undefined){
        this.jobs_active = new JobList(this, 'jobs_active');
    }

    return this.jobs_active;
};

Room.prototype.jobsPending = function(){
    if(this.jobs_active === undefined){
        this.jobs_active = new JobList(this, 'jobs_pending');
    }

    return this.jobs_active;
};

Room.prototype.jobManager = function(){
    if(this.job_manager === undefined){
        this.job_manager = new JobManager(this);
    }
    return this.job_manager;
};

Room.prototype.act = function() {
    // if (Game.time % 5 === 0) {
    //     this.updateJobs();
    // }

    this.jobManager().allocate();
    // this.jobManager.allocate;

    // this.allocateJobs();

    // if (Game.time % 20 === 0) {
    //     this.updateExtensionCount();
    // }
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
    console.log(table(populationData));
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

Room.prototype.creepsByRole = function(role) {
    return finder(this, FIND_MY_CREEPS, function(creep){
        return creep.role() === role;
    });
};

Room.prototype.structures = function(filter) {
    return finder(this, FIND_MY_STRUCTURES, filter);
};

Room.prototype.roads = function(filter){
    if(filter){
        return finder(this, FIND_STRUCTURES, function(s){
            return s.structureType === STRUCTURE_ROAD && filter(s);
        });
    }
    return finder(this, FIND_STRUCTURES, {structureType: STRUCTURE_ROAD});
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
        return !spawn.isBusy();
    });
};

Room.prototype.extensionCount = function() {
    return this.extensions().legnth;
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
    return spawns.length * 300;
};

Room.prototype.roomEnergy = function() {
    return this.spawnEnergy() + this.extensionEnergy();
};

Room.prototype.roomEnergyCapacity = function() {
    return this.spawnEnergyCapacity() + this.extensionEnergyCapacity();
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

Room.prototype.roleCount = function(role){
    if(this.roleCounts === undefined){
        this.roleCounts = {};
        var creeps = this.creeps();
        for (var i = 0; i < creeps.length; i++) {
            var creep = creeps[i];
            var creepRole = creep.role();
            if(!this.roleCounts[creepRole]){
                this.roleCounts[creepRole] = 0;
            }
            this.roleCounts[creepRole]++;
        }
    }
    return this.roleCounts[role];
};

Room.prototype.energyPiles = function(){
    var threshold = this.energyPileThresholdMin();
    return this.energy(function(pile){
        return pile.energy >= threshold;
    });
};

Room.prototype.jobTargets = function(){
    if(this.memory.job_targets === undefined){
        this.memory.job_targets = {};
    }
    return this.memory.job_targets;
};

