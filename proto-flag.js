'use strict';
var creepTypes = require('creep-types');

Flag.prototype.assignedCount = function(forceRefresh) {
    if (forceRefresh || !this.memory.assigned_count) {
        var count = 0;
        for (var key in this.room.creeps) {
            var creep = this.room.creeps[key];
            if (creep.flagId() === this.id) {
                count++;
            }
        }
        this.memory.assigned_count = count;
    }
    return this.memory.assigned_count;
};

Flag.prototype.assignedCountMax = function(max) {
    if (max !== void 0) {
        this.memory.assigned_count_max = max;
    }
    return this.memory.assigned_count_max;
};

Flag.prototype.isMaxed = function() {
    return this.assignedCount() >= this.assignedCountMax();
};

Flag.prototype.assignedCountAvailable = function() {
    return this.assignedCountMax() - this.assignedCount();
};

Flag.prototype.percentAssigned = function() {
    return this.assignedCount() / this.assignedCountMax();
};

Flag.prototype.assignedSourceId = function(id) {
    if (id !== void 0) {
        this.memory.assigned_source_id = id;
    }
    return this.memory.assigned_source_id;
};

Flag.prototype.assignedSource = function(source) {
    if (source !== void 0) {
        this.assignedSourceId(source.id);
    }
    return Game.getObjectById(this.assignedSourceId());
};

Flag.prototype.setSourceToClosest = function(){
    var source = this.room.findClosest(FIND_SOURCES);
    if(source){
        this.assignedSource(source);
    }
};

Flag.prototype.role = function(role) {
    if (role !== void 0) {
        this.memory.role = role;
    }
    return this.memory.role;
};

Flag.prototype.getMostNeededRole = function(){
    if(!this.isMaxed()){
        return this.role();
    }
    return false;
};

