'use strict';

var jobHandlers = require('job-all');

var Job = function Job(room, memory) {
    /**
     * memory.type required
     * memory.role required
     * memory.target required
     *
     */
    this.room = room;

    var source = memory.source;
    var target = memory.target;

    memory.source = undefined;
    memory.target = undefined;

    memory.settings = memory.settings || {};

    // keep ref to task memory memory object
    this.memory = memory;

    if(source && source.id){
        this.source(source);
    }

    if(target && target.id){
        this.target(target);
    }

    this._handler = jobHandlers[memory.type];

};

Job.prototype = {
    constructor: Job,
    // added to ease unit testing
    Game: Game || {},
    getObjectById: Game.getObjectById || function(){},

    id: function(){
        return this.memory.id;
    },

    type: function() {
        return this.memory.type;
    },

    role: function() {
        return this.memory.role;
    },

    // source should only ever be set once
    source: function(value) {
        var current;
        if(
            this.memory &&
            this.memory.source &&
            this.memory.source.id
        ){
            current = this.getObjectById(this.memory.source.id);
        }

        if(value === null){
            return;
        }
        if(value !== undefined){


            // make sure value is a creep object
            if(value.jobId === undefined){
                value = this.getObjectById(value.id);
            }
            if(!value){
                console.log('ERROR: trying to set invalid source', value);
                return false;
            }

            if(
                current &&
                current.id &&
                current.id !== value.id
            ){
                console.log('ERROR: job source can only be set once', current, value);
                return false;
            }

            // if source has a prev job that is not this job
            var prevJob = value.job();
            if(
                prevJob &&
                prevJob.memory &&
                prevJob.memory.id !== this.memory.id
            ){
                prevJob.end();
            }
            value.jobId(this.memory.id);
            current = value;
            this.memory.source = value;
        }

        return current;
    },

    target: function(value) {
        var current;

        if(
            this.memory &&
            this.memory.target &&
            this.memory.target.id
        ){
            current = this.getObjectById(this.memory.target.id);
        }

        // set new value
        if(value !== undefined){

            // make sure value is a game object
            if(value && value.setTargetOfJob === undefined){
                value = this.getObjectById(value.id);
            }

            if(!value || (current && current.id && current.id === value.id)){
                return current;
            } else {
                if(current){
                    current.removeTargetOfJob(this.memory.id);
                }

                this.memory.target = value;
                value.setTargetOfJob(this.memory.id);
                current = value;
            }

        }
        return current;
    },

    // the handler of the job
    handler: function() {
        return this._handler;
    },

    // general settings for job
    settings: function() {
        return this.memory.settings;
    },

    // settings related to how this job can be allocated
    allocationSettings: function(){
        /*
        {
            allocate_to: null,
                // string|mixed
                // if === 'spawn' job can only be allocated to spawn new creep
                // if === 'existing' job can only be allocated to existing creeps
                // if any other value will try to allocate to existing then to spawn new creep

            harvester_work_parts_needed: null,
                // number of harvester work parts needed for all harvesters at a source to add up to 5
                // (the max productivity possible at one source)
                // only used for 'harvest' type

            max_creep_cost: null,
                // the max energy to spend on creating a creep for this job

            energy_collection_needed: null,
                // the energy that needs to be collected from an energy pile
        }
        */
        return this.memory.allocation_settings;
    },

    getAllocationSetting: function(key, defaultValue){
        if(
            this.memory.allocation_settings &&
            this.memory.allocation_settings[key]
        ){
          return this.memory.allocation_settings[key];
        } else {
            return defaultValue;
        }
    },

    // this job's priority on a scale from 0 to 1 where 1 is the highest priority
    priority: function(value) {
        if(value !== undefined){
            this.memory.priority = value;
        }
        return this.memory.priority;
    },

    // if this job is actively being performed or pending allocation
    active: function(value){
        if(value !== undefined){
            this.memory.active = value;
        }
        return this.memory.active;
    },

    // if the source of this job is being created
    sourcePendingCreation: function(value){
        if(value !== undefined){
            if(!value){
                // set undefined to remove from memory
                value = undefined;
            }
            this.memory.source_pending_creation = value;
        }
        return this.memory.source_pending_creation;
    },

    // the body of the source pending creation
    sourcePendingCreationBody: function(value){
        if(value !== undefined){
            if(!value){
                // set undefined to remove from memory
                value = undefined;
            }
            this.memory.source_pending_creation_body = value;
        }
        return this.memory.source_pending_creation_body;
    },

    // able to check body parts of current or pending source creep
    sourceActiveBodyparts: function(part){
        var source = this.source();

        if(source){
            return source.getActiveBodyparts(part);
        }
        else if(this.sourcePendingCreation()){
            var body = this.sourcePendingCreationBody();
            return body.reduce(function(total, currentPart) {
                if(currentPart === part){
                    return total + 1;
                }
                return total;
            }, 0);
        }

        return false;
    },

    // start this job and set references
    start: function(){
        var source = this.source();
        var target = this.target();

        var handler = this.handler();

        if(!source){
            console.log('ERROR trying to start job without source', this);

        }
        if(!target){
            console.log('ERROR trying to start job without target', this);

        }

        if(!target || !source){
            return;
        }

        source.say(this.type());
        this.active(true);
    },

    // end this job and remove it and references
    end: function() {

        var source = this.source();
        var target = this.target();

        if(source){
            source.clearJob();
        }

        if(target){
            target.removeTargetOfJob(this.memory.id);
        }

        this.room.jobList().remove(this.memory.id);
    },

    // check if this job is valid or should be removed
    valid: function(){
        // without target
        if(!this.target()){
            return false;
        }
        // active without source
        if(this.active() && !this.sourcePendingCreation() && !this.source()){
            return false;
        }

        return true;
    },

    // how many game ticks since this job was created
    age: function(){
        return this.Game.time - this.memory.created_at;
    },

    toString: function(){
        return [
            '[Job#' + this.id(),
            'type:',
            this.type(),
            ', source:',
            this.source(),
            ', target:',
            this.target(),
            ']'
        ].join(' ');
    },
};

module.exports = Job;
