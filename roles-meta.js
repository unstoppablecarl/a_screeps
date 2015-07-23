'use strict';
var bodyAdd = function(body, part, count){
    for (var i = 0; i < count; i++) {
        body.push(part);
    }
};

var roles_meta = {

    getBodyCost: function(body) {
        var total = 0;
        return body.reduce(function(total, part){
            return total + BODYPART_COST[part];
        }, 0);
    },

    getBody: function(type, maxCost) {

        if(type === 'carrier'){
            var count = Math.floor((maxCost / 50) );
            var half = Math.floor(count / 2);
            var remainder = count % 2;
            var body = [];

            bodyAdd(body, CARRY, half);
            bodyAdd(body, CARRY, remainder);
            bodyAdd(body, MOVE, half);

            return body;
        }


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
                [
                    CARRY,
                    WORK, WORK, WORK, WORK, WORK,
                    MOVE, MOVE
                ],
                [
                    CARRY, CARRY,
                    WORK, WORK, WORK, WORK, WORK,
                    MOVE, MOVE,
                ],
                [
                    CARRY, CARRY, CARRY,
                    WORK, WORK, WORK, WORK, WORK,
                    MOVE, MOVE, MOVE
                ],
                [
                    CARRY, CARRY, CARRY, CARRY,
                    WORK, WORK, WORK, WORK, WORK,
                    MOVE, MOVE, MOVE, MOVE
                ],
                [
                    CARRY, CARRY, CARRY, CARRY, CARRY,
                    WORK, WORK, WORK, WORK, WORK,
                    MOVE, MOVE, MOVE, MOVE, MOVE,
                ],
                // [
                //     CARRY, CARRY, CARRY, CARRY, CARRY, CARRY,
                //     WORK, WORK, WORK, WORK, WORK,
                //     MOVE, MOVE, MOVE, MOVE, MOVE, MOVE,
                // ],
                // [ // 1200
                //     CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY,
                //     WORK, WORK, WORK, WORK, WORK,
                //     MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE,
                // ],
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
                    WORK, WORK, WORK, WORK, WORK, WORK,
                    MOVE, MOVE
                ],
                [
                    CARRY, CARRY, CARRY, CARRY,
                    WORK, WORK, WORK, WORK, WORK, WORK, WORK,
                    MOVE, MOVE
                ],
                [
                    CARRY, CARRY, CARRY, CARRY,
                    WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK,
                    MOVE, MOVE
                ],
                [
                    CARRY, CARRY, CARRY, CARRY,
                    WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK,
                    MOVE, MOVE, MOVE
                ],
                [
                    CARRY, CARRY, CARRY, CARRY,
                    WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK,
                    MOVE, MOVE, MOVE, MOVE
                ],
                [
                    CARRY, CARRY, CARRY, CARRY,
                    WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK,
                    MOVE, MOVE, MOVE, MOVE, MOVE
                ],
                [ // 1800
                    CARRY, CARRY, CARRY, CARRY,
                    WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK,
                    MOVE, MOVE, MOVE, MOVE, MOVE, MOVE
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

                [
                    CARRY, CARRY, CARRY, CARRY, CARRY,
                    WORK, WORK, WORK, WORK, WORK,
                    MOVE, MOVE, MOVE, MOVE, MOVE
                ],
                [
                    CARRY, CARRY, CARRY, CARRY, CARRY,
                    WORK, WORK, WORK, WORK, WORK, WORK,
                    MOVE, MOVE, MOVE, MOVE, MOVE, MOVE
                ],
                [
                    CARRY, CARRY, CARRY, CARRY, CARRY,
                    WORK, WORK, WORK, WORK, WORK, WORK, WORK,
                    MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE
                ],
                [
                    CARRY, CARRY, CARRY, CARRY, CARRY,
                    WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK,
                    MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE
                ],

                [
                    CARRY, CARRY, CARRY, CARRY, CARRY, CARRY,
                    WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK,
                    MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE
                ],
                [ // 1800
                    CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY,
                    WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK,
                    MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE
                ],
            ]
        },
        carrier: {
            needs_energy_delivered: false,
            bodies: [
                    // [
                    //     CARRY,
                    //     MOVE
                    // ],
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

                [
                    TOUGH, TOUGH,
                    RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK,
                    MOVE, MOVE, MOVE, MOVE
                ],

                [
                    TOUGH, TOUGH, TOUGH,
                    RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK,
                    MOVE, MOVE, MOVE, MOVE,
                ],
                [
                    TOUGH, TOUGH, TOUGH,
                    RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK,
                    MOVE, MOVE, MOVE, MOVE, MOVE,
                ],
                [
                    TOUGH, TOUGH, TOUGH,
                    RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK,
                    MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE,
                ],
            ]
        },
        healer: {
            needs_energy_delivered: true,
            bodies: [
                [
                    HEAL,
                    CARRY,
                    MOVE
                ],
                [
                    HEAL, HEAL,
                    CARRY,
                    MOVE
                ],
                [
                    HEAL, HEAL,
                    CARRY, CARRY,
                    MOVE, MOVE
                ],

                [
                    HEAL, HEAL, HEAL,
                    CARRY, CARRY,
                    MOVE, MOVE
                ],
                [
                    HEAL, HEAL, HEAL,
                    CARRY, CARRY, CARRY,
                    MOVE, MOVE, MOVE
                ],
            ]
        },
        rampart_defender: {
            needs_energy_delivered: false,
            bodies: [
                [
                    MOVE,
                    ATTACK, ATTACK
                ],
                [
                    MOVE,
                    RANGED_ATTACK, RANGED_ATTACK
                ],
                [
                    MOVE,
                    RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK
                ],
                [
                    MOVE, MOVE,
                    RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK
                ],
                [
                    MOVE, MOVE,
                    RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK
                ],
                [
                    MOVE, MOVE,
                    RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK
                ],

                [
                    MOVE, MOVE,
                    RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK
                ],

                [
                    MOVE, MOVE,
                    RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK
                ],

                [
                    MOVE, MOVE, MOVE,
                    RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK
                ],
                [
                    MOVE, MOVE, MOVE, MOVE,
                    RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK,
                ],

                [
                    MOVE, MOVE, MOVE, MOVE, MOVE, MOVE,
                    RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK,
                ],
            ]
        }
    },
};

module.exports = roles_meta;
