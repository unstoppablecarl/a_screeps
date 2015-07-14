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


/*
part costs
MOVE:           50
WORK:           100
CARRY:          50
ATTACK:         80
RANGED_ATTACK:  150
HEAL:           200
TOUGH:          10

 */
    roles: {
        harvester: {
            needs_energy_delivered: false,
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
            needs_energy_delivered: true,
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
                    WORK, WORK, WORK,
                    MOVE
                ],
                [
                    CARRY, CARRY,
                    WORK, WORK, WORK, WORK,
                    MOVE
                ],
                [
                    CARRY, CARRY,
                    WORK, WORK, WORK, WORK, WORK,
                    MOVE
                ],

                [
                    CARRY, CARRY, CARRY,
                    WORK, WORK, WORK, WORK,
                    MOVE
                ],
            ]
        },
        tech: {
            needs_energy_delivered: true,
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

                [
                    CARRY, CARRY, CARRY,
                    WORK, WORK, WORK, WORK,
                    MOVE, MOVE, MOVE
                ],
                [
                    CARRY, CARRY, CARRY, CARRY,
                    WORK, WORK, WORK, WORK,
                    MOVE, MOVE, MOVE
                ],
                [
                    CARRY, CARRY, CARRY, CARRY,
                    WORK, WORK, WORK, WORK,
                    MOVE, MOVE, MOVE, MOVE
                ],
            ]
        },
        carrier: {
            needs_energy_delivered: false,
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
                [
                    CARRY, CARRY, CARRY,
                    MOVE, MOVE, MOVE, MOVE
                ],
                [
                    CARRY, CARRY, CARRY, CARRY,
                    MOVE, MOVE, MOVE, MOVE
                ],

                [
                    CARRY, CARRY, CARRY, CARRY, CARRY,
                    MOVE, MOVE, MOVE, MOVE, MOVE
                ],

                [
                    CARRY, CARRY, CARRY, CARRY, CARRY, CARRY,
                    MOVE, MOVE, MOVE, MOVE, MOVE, MOVE
                ],

                [
                    CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY,
                    MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE
                ],
                [
                    CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY,
                    MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE
                ],
            ]
        },
        guard: {
            needs_energy_delivered: false,
            bodies: [
                [
                    TOUGH,
                    ATTACK,
                    MOVE, MOVE
                ],
                [
                    TOUGH, TOUGH,
                    ATTACK, ATTACK,
                    MOVE, MOVE
                ],
                [
                    TOUGH, TOUGH,
                    RANGED_ATTACK, RANGED_ATTACK,
                    MOVE, MOVE, MOVE
                ],
                [
                    TOUGH, TOUGH,
                    RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK,
                    MOVE, MOVE, MOVE
                ],
            ]
        },
        healer: {
            needs_energy_delivered: true,
            bodies: [
                [
                    TOUGH,
                    HEAL,
                    MOVE
                ],
                [
                    TOUGH,
                    HEAL,
                    MOVE, MOVE
                ],
            ]
        },
        rampart_defender: {
            needs_energy_delivered: false,
            bodies: [
                [
                    MOVE,
                    ATTACK, ATTACK,
                ],
                [
                    MOVE,
                    RANGED_ATTACK, RANGED_ATTACK,
                ],
                [
                    MOVE,
                    RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK
                ],
                [
                    MOVE, MOVE,
                    RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK,
                ],
            ]
        }
    },
};

module.exports = roles_meta;
