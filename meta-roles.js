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
                [
                    CARRY,
                    WORK,
                    MOVE
                ],
                [
                    CARRY,
                    WORK, WORK,
                    MOVE
                ],
                [
                    CARRY, CARRY,
                    WORK, WORK,
                    MOVE
                ],
                [
                    CARRY, CARRY,
                    WORK, WORK,
                    MOVE, MOVE
                ],

                [
                    CARRY, CARRY, CARRY,
                    WORK, WORK,
                    MOVE, MOVE
                ],

                [
                    CARRY, CARRY, CARRY,
                    WORK, WORK, WORK,
                    MOVE, MOVE
                ],

                [
                    CARRY, CARRY, CARRY,
                    WORK, WORK, WORK,
                    MOVE, MOVE, MOVE
                ],
            ]
        },
        builder: {
            bodies: [
                [
                    CARRY,
                    WORK, WORK, WORK,
                    MOVE
                ],
                [
                    CARRY,
                    WORK, WORK, WORK,
                    MOVE, MOVE
                ],
                [
                    CARRY, CARRY,
                    WORK, WORK, WORK,
                    MOVE, MOVE
                ],
                [
                    CARRY, CARRY,
                    WORK, WORK, WORK,
                    MOVE, MOVE, MOVE
                ],
                [
                    CARRY, CARRY, CARRY,
                    WORK, WORK, WORK,
                    MOVE, MOVE, MOVE
                ],
            ]
        },
        repair: {
            bodies: [
                [
                    CARRY,
                    WORK,
                    MOVE
                ],
                [
                    CARRY,
                    WORK,
                    MOVE, MOVE
                ],
                [
                    CARRY,
                    WORK, WORK,
                    MOVE, MOVE
                ],
                [
                    CARRY, CARRY,
                    WORK, WORK,
                    MOVE, MOVE
                ],
            ]

        },
        guard: {
            bodies: [
                [
                    TOUGH,
                    ATTACK,
                    MOVE, MOVE
                ],
                [
                    TOUGH,
                    ATTACK, ATTACK,
                    MOVE, MOVE
                ],
                [
                    TOUGH,
                    ATTACK, ATTACK,
                    MOVE, MOVE, MOVE
                ],
                [
                    TOUGH,
                    ATTACK, ATTACK, ATTACK,
                    MOVE, MOVE, MOVE
                ],
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
