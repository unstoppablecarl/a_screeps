'use strict';

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

Room.prototype.getMostNeededRoles = function() {
    var out = [];
    for (var roomName in Game.rooms) {
        var room = Game.rooms[roomName];
        var flags = _.filter(room.flags, function(flag) {
            return !flag.isMaxed();
        });

        if (!flags.length) {
            return false;
        }

        flags = _.sort(flags, function(flag) {
            return flag.percentAssigned();
        });

        _.each(flags, function(flag) {
            out.push(flag.getMostNeededRole());
            console.log(flag.name, flag.percentAssigned(), flag.getMostNeededRole());
        });
    }

    return out;
};

Room.prototype.populationCapped = function(value){
    if (value !== void 0) {
        this.population_capped = value;
    }
    return this.population_capped;
};
