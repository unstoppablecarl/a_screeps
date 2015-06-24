'use strict';

var metaRoles = require('meta-roles');

Room.prototype.act = function() {

    var createCreepMaxEnergyPercent = 0.6;
    if (Game.time % 5 === 0) {
        this.updateNeededRoles();
    }

    if(Game.time % 20 === 0){
        this.updateExtensionCount();
    }

    var neededRoles = this.neededRoles();

    if (neededRoles && neededRoles.length) {
        var availableSpawns = this.getAvailableSpawns();
        if (availableSpawns.length) {

            var maxCost = this.getEnergyCapacity() * createCreepMaxEnergyPercent;
            availableSpawns.forEach(function(spawn) {
                var needed = neededRoles.shift();
                var newRole = needed.role;
                var assignedFlagId = needed.flag_id;
                var roleData = metaRoles.roles[newRole];

                var body = metaRoles.getBody(newRole, maxCost);
                var memory = {
                    spawn_id: spawn.id,
                    role: newRole,
                    assigned_flag_id: assignedFlagId
                };
                spawn.spawnCreep(body, memory);
            });
        }
    }
};

Room.prototype.getPopulationReport = function() {
    var populationData = {};
    var totalPopulation = 0;
    var creeps = this.creeps;

    for (var name in creeps) {
        var creep = creeps[name];
        var role = creep.role();
        if (!populationData[role]) {
            populationData[role] = {
                count: 0,
                percent: 0,
            };
        }
        populationData[role].count++;
        totalPopulation++;
    }

    for (var roleName in populationData) {
        var roleData = populationData[roleName];
        var percent = roleData.count / totalPopulation;
        roleData.precent = Math.round(percent * 100) / 100;
    }
    return populationData;
};


Room.prototype.flagReport = function() {
    var flags = this.find(FIND_FLAGS);
    var roomName = this.name;

    flags.forEach(function(flag) {
        var percent = (Math.round(flag.percentAssigned() * 100) / 100) * 100;
        var count = '( ' + flag.assignedCount() + '/' + flag.assignedCountMax() + ' )';

        console.log(
            roomName,
            flag.name,
            flag.role(),
            percent + '%',
            count
        );
    });
};

Room.prototype.populationCapped = function(value) {
    if (value !== void 0) {
        this.population_capped = value;
    }
    return this.population_capped;
};

Room.prototype.extensionsFull = function(forceRefresh) {
    if (forceRefresh || !this.extensions_full) {
        var extensions = this.find(FIND_STRUCTURES, {
            filter: function(s) {
                return s.structureType = 'extension' && s.energy < s.energyCapacity;
            }
        });

        this.extensions_full = !extensions.length;
    }

    return this.extensions_full;
};


Room.prototype.caclulateNeededRoles = function() {
    var out = [];

    var flags = this.find(FIND_FLAGS, function(flag) {
        return !flag.isMaxed();
    });

    if (!flags.length) {
        return false;
    }

    flags = _.sortByAll(
        flags,
        function(flag) {
            return flag.percentAssigned();
        },
        function(flag) {
            return flag.role === 'harvester';
        });

    flags.forEach(function(flag) {
        var neededRole = flag.getMostNeededRole();
        if (neededRole) {
            out.push({
                flag_id: flag.id,
                role: neededRole
            });
        }
    });

    return out;
};


Room.prototype.updateNeededRoles = function() {
    this.neededRoles(this.caclulateNeededRoles());
};

Room.prototype.neededRoles = function(neededRoles) {
    if (neededRoles !== void 0) {
        this.memory.needed_roles = neededRoles;
    }
    return this.memory.needed_roles;
};

Room.prototype.spawns = function(filter) {
    if(filter){
        var settings = {
            filter: filter
        };
        return this.find(FIND_MY_SPAWNS, settings);
    } else {
        return this.find(FIND_MY_SPAWNS);
    }
};

Room.prototype.getAvailableSpawns = function() {
    return this.spawns(function(spawn){
        return !spawn.spawning;
    });
};

Room.prototype.updateExtensionCount = function() {
    var extensions = this.find(FIND_STRUCTURES, {
        filter: function(s) {
            return s.structureType === 'extension';
        }
    });
    this.extensionCount(extensions.length);
};

Room.prototype.extensionCount = function(count) {
    if (count !== void 0) {
        this.memory.extension_count = count;
    }
    return this.memory.extension_count;
};

Room.prototype.getEnergyCapacity = function(){
    var total = 0;
    var spawns = this.spawns();

    if(spawns && spawns.length){
        total += spawns.length * 300;
    }

    var extensionCount = this.extensionCount();

    if(extensionCount){
        total += extensionCount * 50;
    }

    return total;
};


