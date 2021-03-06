'use strict';

RoomPosition.prototype.isRoomPosition = true;

RoomPosition.prototype.findClosestIdleFlag = function(creep){
    var role = creep.role();
    var room = Game.rooms[this.roomName];
    var flags = room.getIdleFlags();

    flags = flags.filter(function(flag){
        return flag.idleCreepValid(creep);
    });

    flags = _.sortBy(flags, function(flag){
        var priority = flag.idlePriority() || 0;
        if(flag.idleCreepRole()){
            priority += 100;
        }
        return priority;
    }).reverse();

    if(flags.length){
        return flags[0];
    }

    return false;
};


var road = STRUCTURE_ROAD;
var rampart = STRUCTURE_RAMPART;

var blockedTile = function(list) {
    for(var i = list.length - 1; i >= 0; i--){
        var tile = list[i];
        var type = tile.type;
        if (type === 'terrain' && tile.terrain === 'wall')  return true;
        if(type ==='structure'){
            var s = tile.structure;
            // road
            if(s.structureType === road){
                continue;
            }
            // enemy rampart
            else if(s.structureType === rampart){
                if(s.my) continue;
            }
            // any other structure
            return true;
        }
    }
    return false;
};
// var cpu = require('cpu');
// counts tiles adjacent to position that are not blocked by terrain or structures
// manually minified to allow inlining in v8
RoomPosition.prototype.adjacentEmptyTileCount = function(blockedFunc) {
    var room = Game.rooms[this.roomName];
    var b = blockedFunc || blockedTile;
    var x = this.x;
    var y = this.y;
    var tiles = room.lookAtArea(y - 1, x - 1, y + 1, x + 1);
    var spaces = 0;

    if (!b(tiles[y - 1][x - 1])) spaces++;
    if (!b(tiles[y - 1][x]))     spaces++;
    if (!b(tiles[y - 1][x + 1])) spaces++;
    if (!b(tiles[y][x - 1]))     spaces++;
    if (!b(tiles[y][x + 1]))     spaces++;
    if (!b(tiles[y + 1][x - 1])) spaces++;
    if (!b(tiles[y + 1][x]))     spaces++;
    if (!b(tiles[y + 1][x + 1])) spaces++;
    return spaces;
};

RoomPosition.prototype.findHostileTarget = function(range){
    // ranged attack distance
    range = range || 3;

    var targets = this.findInRange(FIND_HOSTILE_CREEPS, range);

    if(targets.length){
        targets = _.sortBy(targets, function(target){
            return target.hits;
        });

        return targets[0];
    }

    return false;
};
