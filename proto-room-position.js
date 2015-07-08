'use strict';


RoomPosition.prototype.findClosestIdleFlag = function(role){

    var room = Game.rooms[this.roomName];
    var flags = room.getIdleFlags();

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

var blockedTile = function(list) {
    for(var i = list.length - 1; i >= 0; i--){
        var tile = list[i];
        var type = list[i].type;
        if (
            tile.type === 'terrain' &&
            tile.terrain === 'wall'
        ) {
            console.log('wall');
            return true;
        }

        if(tile.type ==='structure'){

            if(tile.structure.structureType === STRUCTURE_ROAD){
                continue;
            }
            else if(tile.structure.structureType === STRUCTURE_RAMPART){
                if(!tile.structure.my){
                    console.log('rampart');
                    return true;
                }
            } else {
                console.log('other structure');
                return false;
            }
        }
    }
    return false;
};

// counts tiles adjacent to position that are not blocked by terrain or structures
RoomPosition.prototype.adjacentEmptyTileCount = function(blockedTileFunc) {
    if(blockedTileFunc === undefined){
        blockedTileFunc = blockedTile;
    }

    var x = this.x;
    var y = this.y;
    var room = Game.rooms[this.roomName];
    var tiles = room.lookAtArea(y - 1, x - 1, y + 1, x + 1);
    var spaces = 0;

    // top left
    console.log('top left');
    if (!blockedTileFunc(tiles[y - 1][x - 1])) spaces++;
    console.log('top');
    if (!blockedTileFunc(tiles[y - 1][x]))     spaces++;
    console.log('top right');
    if (!blockedTileFunc(tiles[y - 1][x + 1])) spaces++;
    console.log('left');
    if (!blockedTileFunc(tiles[y][x - 1]))     spaces++;
    console.log('right');
    if (!blockedTileFunc(tiles[y][x + 1]))     spaces++;
    console.log('bottom left');
    if (!blockedTileFunc(tiles[y + 1][x - 1])) spaces++;
    console.log('bottom');
    if (!blockedTileFunc(tiles[y + 1][x]))     spaces++;
    console.log('bottom right');
    if (!blockedTileFunc(tiles[y + 1][x + 1])) spaces++;

    return spaces;
};
