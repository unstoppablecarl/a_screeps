'use strict';

var roles = {
    builder: require('act-builder'),
    guard: require('act-guard'),
    harvester: require('act-harvester'),
    repair: require('act-repair'),
};

var tasks = {
    get_energy: require('task-get-energy'),
    build: require('task-build'),
    repair: require('task-repair'),
    return_energy: require('task-return-energy'),
    goto_queue: require('task-goto-queue'),
    harvest: require('task-harvest'),
};

Creep.prototype.pendingCreation = function(){
    return this.memory.pending_creation;
};

Creep.prototype.role = function(role) {
    if (role !== void 0) {
        this.memory.role = role;
    }
    return this.memory.role;
};

Creep.prototype.spawnId = function(id) {
    if (id !== void 0) {
        this.memory.spawn_id = id;
    }
    return this.memory.spawn_id;
};

Creep.prototype.spawn = function(spawn) {
    if (spawn !== void 0) {
        this.memory.spawn_id = spawn.id;
    }
    return Game.getObjectById(this.spawnId());
};

Creep.prototype.assignedFlagId = function(id) {
    if (id !== void 0) {
        this.memory.assigned_flag_id = id;
    }
    return this.memory.assigned_flag_id;
};

Creep.prototype.assignedFlag = function(flag) {
    if (flag !== void 0) {
        this.assignedFlagId(flag.id);
    }
    return Game.getObjectById(this.assignedFlagId());
};

Creep.prototype.sourceId = function(id) {
    if (id !== void 0) {
        this.memory.source_id = id;
    }
    return this.memory.source_id;
};

Creep.prototype.source = function(source) {
    if (source !== void 0) {
        this.sourceId(source.id);
    }
    return Game.getObjectById(this.sourceId());
};

Creep.prototype.assignToFlag = function(flag){
    var role = this.role();
    if(flag.role() !== role){
        console.log('FLAG ASSIGN ERROR');
        return;
    }
    var roleHandler = roles[role];
    if(roleHandler && roleHandler.onAssignToFlag){
        roleHandler.onAssignToFlag(this, flag);
    }
    flag.assignedCount(true);
};

Creep.prototype.queueFlagId = function(id) {
    if (id !== void 0) {
        this.memory.queue_flag_id = id;
    }
    return this.memory.queue_flag_id;
};

Creep.prototype.queueFlag = function(queueFlag) {
    if (queueFlag !== void 0) {
        this.queueFlagId(queueFlag.id);
    }
    return Game.getObjectById(this.queueFlagId());
};

Creep.prototype.init = function() {
    var role = this.role();
    var roleHandler = roles[role];
    if(roleHandler && roleHandler.init){
        roleHandler.init(this);
    }
    this.memory.pending_creation = undefined;
};

Creep.prototype.act = function() {
    var role = this.role();
    var roleHandler = roles[role];
    if(roleHandler && roleHandler.act){
        roleHandler.act(this);
    }

    var task = this.task();
    if(task){
        task.act(this);
    }
};

Creep.prototype.task = function() {
    var taskName = this.taskName();
    return tasks[taskName];
};

Creep.prototype.taskName = function(name) {
    if (name !== void 0) {
        this.memory.task_name = name;
    }
    return this.memory.task_name;
};

Creep.prototype.taskSettings = function(name) {
    if (name !== void 0) {
        this.memory.task_settings = name;
    }
    return this.memory.task_settings;
};

Creep.prototype.startTask = function(taskName, settings) {
    this.cancelTask();
    this.taskName(taskName);
    this.taskSettings(settings);
    var task = this.task();
    if(task.start){
        task.start(this);
    }
};

Creep.prototype.cancelTask = function() {
    var task = this.task();
    if(task){
        if(task.cancel){
            task.cancel(this);
        }
        this.prevTaskName(task.name);
        this.prevTaskSettings(this.taskSettings());
    }
    this.memory.task_settings = undefined;
    this.memory.task_name = undefined;
};

Creep.prototype.endTask = function() {
    var task = this.task();
    if(task){
        if(task.end){
            task.end(this);
        }
        this.prevTaskName(task.name);
        this.prevTaskSettings(this.taskSettings());
    }
    this.memory.task_settings = undefined;
    this.memory.task_name = undefined;
};

Creep.prototype.taskTarget = function(target) {
    var settings = this.taskSettings();

    if(target !== void 0){
        settings = settings || {};
        settings.target_id = target.id;
        this.taskSettings(settings);
    }

    if(settings && settings.target_id){
        return Game.getObjectById(settings.target_id);
    }
};

Creep.prototype.prevTaskName = function(prevTaskName){
    if (prevTaskName !== void 0) {
        this.memory.prev_task_name = prevTaskName;
    }
    return this.memory.prev_task_name;
};

Creep.prototype.prevTaskSettings = function(prevTaskSettings){
    if (prevTaskSettings !== void 0) {
        this.memory.prev_task_settings = prevTaskSettings;
    }
    return this.memory.prev_task_settings;
};

