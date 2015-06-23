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

        var flags = this.find(FIND_FLAGS, function(flag) {
            return !flag.isMaxed();
        });

        if (!flags.length) {
            return false;
        }
        flags = _.sortBy(flags, function(flag) {
            return flag.percentAssigned();
        });

        flags.forEach(function(flag) {
            var neededRole = flag.getMostNeededRole();
            if(neededRole){
                out.push({
                    flag: flag,
                    role: neededRole
                });
            }
        });

    return out;
};

Room.prototype.flagReport = function(){
    var flags = this.find(FIND_FLAGS);
    var roomName = this.name;


    flags.forEach(function(flag){
        var percent = Math.round(flag.percentAssigned() * 100) / 100;
        var count = '( ' + flag.assignedCount() + '/' + flag.assignedCountMax() + ' )';

        console.log(
            roomName,
            flag.name,
            flag.role(),
            percent + '%' ,
            count
        );
    });
};

Room.prototype.populationCapped = function(value){
    if (value !== void 0) {
        this.population_capped = value;
    }
    return this.population_capped;
};
