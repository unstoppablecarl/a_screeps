'use strict';

var cpu = require('cpu');

cpu.start('proto_all');
    require('proto-all');
cpu.end('proto_all');

// return;

var room = Game.rooms.W15N4;



// var room = Game.rooms.sim;
if(room){
    // room.populationReport();

    cpu.start('creeps');
    _.each(room.creeps(), function(creep) {
        creep.act();
    });

    cpu.end();

    var jobManager = room.jobManager();
    var jobList = room.jobList();

// if(!Memory.cmd){
    // var body = [
    //  MOVE, MOVE, MOVE, MOVE, MOVE,
    //  ATTACK, ATTACK, ATTACK, ATTACK, ATTACK
    // ];


    // var job = jobList.add({
    //     type: 'attack',
    //     role: 'guard',
    //     source: Game.creeps.Kylie,
    //     target: room.lookAt(24,41)[0].structure
    // });

    // var memory = {
    //     role: 'guard',
    //     source_of_job_id: job.id(),
    // };

    // Game.spawns.Spawn1.spawnCreep(body, memory);
//     Memory.cmd = true;
// }

    if (Game.time % 5 === 0) {
        jobList.cleanup();
    }

    if (Game.time % 20 === 0) {
        jobManager.auditHarvesters();
    }

    if (Game.time % 2 === 0) {
        cpu.start('update');
        jobManager.update();
        cpu.end();
    }
    else {
        cpu.start('allocate');
        jobManager.allocate();
        cpu.end();
    }

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

// cpu.report();
cpu.shutdown();

Memory.cpu.__end = Game.getUsedCpu();

/*
@TODO flags to override priority of objects on tile (build, repair)
@TODO flags to override settings of objects on tile (repair min/max, build/repair priority)
@TODO base job priority as room config setting
@TODO add higher cost creep bodies to metaroles
@TODO optimize metaroles with precalculated body costs?
@TODO write algo to calculate travel time
@TODO calculate creep build time when replacing creeps
@TODO carrier energy store waypoints to decide if they are too far away to comback to collect and store energy?
@TODO more intellegently decide when a new creep needs to be created
@TODO workflow for pulling energy out of extensions
 */