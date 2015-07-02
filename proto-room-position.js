'use strict';


RoomPosition.prototype.findClosestIdleFlag = function(role){

    var room = Game.rooms[this.roomName];
    var flags = this.getIdleFlags();

    var roleFlags = [];
    var anyRoleFlags = [];

    for (var i = 0; i < flags.length; i++) {
        var flag = flags[i];

        var idleRole = flag.idleCreepRole();

        if(
            (idleRole === role || !idleRole) &&
            flag.getCreepIdleSlots()
        ){
            if(idleRole === role){
                roleFlags.push(flag);
            } else {
                anyRoleFlags.push(flag);
            }
        }
    }

    if(roleFlags.length){
        return this.findClosest(roleFlags);
    }

    if(anyRoleFlags.length){
        return this.findClosest(anyRoleFlags);
    }
    return false;
};

RoomPosition.prototype.findClosestEnergyStore = function(){
    var room = Game.rooms[this.roomName];
    var spawns = room.spawns(function(spawn) {
        return spawn.energy < spawn.energyCapacity;
    });

    var extensions = room.extensions(function(s) {
        return s.structureType === 'extension' && s.energy < s.energyCapacity;
    });
    var targets = spawns.concat(extensions);
    return this.findClosest(targets);
};
