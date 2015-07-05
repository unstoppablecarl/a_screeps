'use strict';


var roles_meta = {

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

            if(cost <= maxCost && maxMatchCost <= cost){
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
                    CARRY,
                    WORK, WORK, WORK,
                    MOVE
                ],
                [
                    CARRY,
                    WORK, WORK, WORK, WORK,
                    MOVE
                ],

                [
                    CARRY,
                    WORK, WORK, WORK, WORK, WORK,
                    MOVE
                ],
            ]
        },
        upgrader: {
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
                    CARRY,
                    WORK, WORK, WORK,
                    MOVE
                ],
                // [
                //     CARRY,
                //     WORK, WORK, WORK, WORK,
                //     MOVE
                // ],

                // [
                //     CARRY,
                //     WORK, WORK, WORK, WORK, WORK,
                //     MOVE
                // ],
            ]
        },
        tech: {
            bodies: [
                [
                    CARRY,
                    WORK, WORK,
                    MOVE
                ],
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
        carrier: {
            bodies: [
                [
                    CARRY,
                    MOVE
                ],
                [
                    CARRY,
                    MOVE, MOVE
                ],
                [
                    CARRY, CARRY,
                    MOVE, MOVE
                ],
                [
                    CARRY, CARRY,
                    MOVE, MOVE, MOVE
                ],
                [
                    CARRY, CARRY, CARRY,
                    MOVE, MOVE, MOVE
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
};

module.exports = roles_meta;
