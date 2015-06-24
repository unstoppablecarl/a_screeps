'use strict';


var data = {

    getBodyCost: function(body) {
        var total = 0;
        for (var i = 0; i < body.length; i++) {
            var part = body[i];
            total += BODYPART_COST[part];
        }
        return total;
    },

    getBody: function(type, maxCost) {
        var creepType = this.roles[type];
        var maxMatchCost = 0;
        var maxMatchBody;
        for (var i = 0; i < creepType.bodies.length; i++) {
            var body = creepType.bodies[i];
            var cost = this.getBodyCost(body);

            if(cost < maxCost && maxMatchCost < cost){
                maxMatchCost = cost;
                maxMatchBody = body;
            }
        }
        return maxMatchBody;
    },

    roles: {
        harvester: {
            bodies: [
                [MOVE, WORK, CARRY],
                [MOVE, WORK, WORK, CARRY],
                [MOVE, MOVE, WORK, WORK, CARRY],
                [MOVE, MOVE, WORK, WORK, CARRY, CARRY],
            ]
        },
        builder: {
            bodies: [
                [WORK, WORK, WORK, CARRY, MOVE],
                [WORK, WORK, WORK, CARRY, CARRY, MOVE],
            ]
        },
        repair: {
            bodies: [
                [MOVE, WORK, CARRY],
                [MOVE, MOVE, WORK, CARRY],
            ]

        },
        guard: {
            bodies: [
                [TOUGH, ATTACK, MOVE, MOVE],
            ]
        },
    },

    defaultRolePriority: {
        harvester: 90,
        builder: 80,
        repair: 70,
        guard: 50,
    }
};




module.exports = data;