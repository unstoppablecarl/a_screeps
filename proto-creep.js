'use strict';

var roles = {
    carrier: require('act-carrier'),
    guard: require('act-guard'),
    harvester: require('act-harvester'),
    tech: require('act-tech'),
};

var tasks = {
    attack: require('task-attack'),
    build: require('task-build'),
    energy_collect: require('task-energy-collect'),
    energy_deliver: require('task-energy-deliver'),
    energy_store: require('task-energy-store'),
    harvest: require('task-harvest'),
    move_to: require('task-move-to'),
    repair: require('task-repair'),
    upgrade_room_controller: require('task-upgrade-room-controller'),
};

Creep.prototype.act = function() {
    var role = this.role();
    var roleHandler = roles[role];
    if (roleHandler) {
        if (this.memory.pending_creation){
            if(roleHandler.init) {
                roleHandler.init(this);
            }
            this.memory.pending_creation = undefined;
        }
        if (roleHandler.act) {
            roleHandler.act(this);
        }
    }

    var task = this.task();
    if (task) {
        task.act(this);
    }
};

Creep.prototype.role = function(role) {
    if (role !== void 0) {
        this.memory.role = role;
    }
    return this.memory.role;
};

Creep.prototype.energySourceId = function(id) {
    if (id !== void 0) {
        this.memory.energy_sorce_id = id;
    }
    return this.memory.energy_sorce_id;
};
Creep.prototype.energySource = function(obj) {
    if (obj !== void 0) {
        this.energySourceId(obj.id);
    }
    return Game.getObjectById(this.energySourceId());
};

Creep.prototype.idle = function(value) {
    return !this.task();
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
    if (task.start) {
        task.start(this);
    }
    this.say('> ' + taskName);
};

Creep.prototype.cancelTask = function() {
    var task = this.task();
    if (task) {
        if (task.cancel) {
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
    if (task) {
        if (task.end) {
            task.end(this);
        }
        this.prevTaskName(this.taskName());
        this.prevTaskSettings(this.taskSettings());
    }
    var nextTask = this.nextTask();

    if(nextTask){
        this.startTask(this.nextTaskName(), this.nextTaskSettings());
    } else {
        this.memory.task_name = undefined;
        this.memory.task_settings = undefined;
    }
};

Creep.prototype.taskTarget = function(target) {
    var settings = this.taskSettings();

    if (target !== void 0) {
        settings = settings || {};
        settings.target_id = target.id;
        this.taskSettings(settings);
    }

    if (settings && settings.target_id) {
        return Game.getObjectById(settings.target_id);
    }
};

Creep.prototype.prevTaskName = function(prevTaskName) {
    if (prevTaskName !== void 0) {
        this.memory.prev_task_name = prevTaskName;
    }
    return this.memory.prev_task_name;
};
Creep.prototype.prevTaskSettings = function(prevTaskSettings) {
    if (prevTaskSettings !== void 0) {
        this.memory.prev_task_settings = prevTaskSettings;
    }
    return this.memory.prev_task_settings;
};
Creep.prototype.prevTaskTarget = function(target) {
    var settings = this.prevTaskSettings();

    if (target !== void 0) {
        settings = settings || {};
        settings.target_id = target.id;
        this.prevTaskSettings(settings);
    }

    if (settings && settings.target_id) {
        return Game.getObjectById(settings.target_id);
    }
};

Creep.prototype.nextTask = function(taskName, settings) {
    this.nextTaskName(taskName);
    this.nextTaskSettings(settings);
};

Creep.prototype.nextTaskName = function(nextTaskName) {
    if (nextTaskName !== void 0) {
        this.memory.next_task_name = nextTaskName;
    }
    return this.memory.next_task_name;
};
Creep.prototype.nextTaskSettings = function(nextTaskSettings) {
    if (nextTaskSettings !== void 0) {
        this.memory.next_task_settings = nextTaskSettings;
    }
    return this.memory.next_task_settings;
};
Creep.prototype.nextTaskTarget = function(target) {
    var settings = this.nextTaskSettings();

    if (target !== void 0) {
        settings = settings || {};
        settings.target_id = target.id;
        this.nextTaskSettings(settings);
    }

    if (settings && settings.target_id) {
        return Game.getObjectById(settings.target_id);
    }
};


