'use strict';
require('proto-all');

// return;

// var cpu = require('cpu');

// cpu.start('all');

var room = Game.rooms['W15N4'];

// var room = Game.rooms.sim;
if(room){
    _.each(room.creeps(), function(creep) {
        creep.act();
    });

    var jobManager = room.jobManager();
    var jobList = room.jobList();


    if (Game.time % 5 === 0) {
        jobList.cleanup();
    }

    if (Game.time % 20 === 0) {
        jobManager.auditHarvesters();
    }



    jobManager.update();
    jobManager.allocate();

    jobList.report();
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


// cpu.end();
// cpu.report();
// cpu.shutdown();
