'use strict';
require('proto-all');
// return;

var cpu = require('cpu');
cpu.start('all');

var room = Game.rooms['W15N4'];



// var room = Game.rooms.sim;
if(room){
    // room.populationReport();
    _.each(room.creeps(), function(creep) {
        creep.act();
    });

    var jobManager = room.jobManager();
    var jobList = room.jobList();

if(!Memory.cmd){
    var body = [
     MOVE, MOVE, MOVE, MOVE, MOVE,
     ATTACK, ATTACK, ATTACK, ATTACK, ATTACK
    ];


    var job = jobList.add({
        type: 'attack',
        role: 'guard',
        source: Game.creeps.Kylie,
        target: room.lookAt(24,41)[0].structure
    });

    var memory = {
        role: 'guard',
        source_of_job_id: job.id(),
    };

    Game.spawns.Spawn1.spawnCreep(body, memory);
    Memory.cmd = true;
}

    if (Game.time % 5 === 0) {
        jobList.cleanup();
    }

    if (Game.time % 20 === 0) {
        jobManager.auditHarvesters();
    }

    jobManager.update();
    jobManager.allocate();

    // jobList.report();
    // jobList.report(jobList.getActive());

    room.reportHostiles();
}

// cleanup dead creeps from memory
if (Game.time % 5 === 0) {
    for (var k in Memory.creeps) {
        var memCreep = Memory.creeps[k];
        if (!Game.creeps[k] && !(memCreep && memCreep.pending_creation)) {
            delete Memory.creeps[k];
        }
    }
}



cpu.end();
cpu.report();
cpu.shutdown();
