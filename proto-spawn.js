'use strict';

Spawn.prototype.spawnCreep = function(body, memory) {

    var canCreate = this.canCreateCreep(body);
    if (canCreate !== OK) {
        if(canCreate === ERR_NOT_ENOUGH_ENERGY){
            return;
        }
        else if(canCreate === ERR_NOT_OWNER){
            canCreate = 'ERR_NOT_OWNER';
        }
        else if(canCreate === ERR_NAME_EXISTS){
            canCreate = 'ERR_NAME_EXISTS';
        }
        else if(canCreate === ERR_BUSY){
            canCreate = 'ERR_BUSY';
        }

        else if(canCreate === ERR_INVALID_ARGS){
            canCreate = 'ERR_INVALID_ARGS';
        }
        console.log(this.name, 'cannot create', memory.role, canCreate);
        return;
    }

    var creepName = this.createCreep(body, null, memory);
    console.log(this.name, 'spawning', creepName, memory.role);
    return creepName;
};

Spawn.prototype.getBody = function(type){

};