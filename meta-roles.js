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
            var cost = this.getBodyCost(type, body);

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
            ]
        },
        builder: {
            bodies: [
                [WORK, WORK, WORK, CARRY, MOVE],
            ]
        },
        guard: {
            bodies: [
                [TOUGH, ATTACK, MOVE, MOVE],
            ]
        },
        repair: {
            bodies: [
                [MOVE, WORK, CARRY],
                [MOVE, WORK, CARRY],
            ]

        }
    },
};




module.exports = data;
