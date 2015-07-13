require('proto-all'); console.log(Game.flags.Flag1.source().targetOfJobs().length);

require('proto-all');
var target = Game.rooms.sim.extensions()[0];
Game.rooms.sim.jobList().add({source: Game.creeps.Jon, target: target, type: 'attack', role: 'guard'});

Game.creeps.Jon.suicide();

require('proto-all'); Game.rooms['W15N4'].populationReport();
require('proto-all'); console.log(Game.rooms['W15N4'].jobManager().getCarrierCountMax());


require('proto-all'); console.log('x ' + Game.flags.Idle3.idleCreepSlots());
console.log(
    JSON.stringify(
        Game.rooms.sim.jobManager().report()
        )
    );
require('proto-all'); Game.rooms.sim.creeps().forEach(function(creep){
    if(creep.role() === 'tech'){
        console.log(creep.name);
    }
});

require('proto-all'); Game.rooms.sim.constructionSites();

require('proto-all'); Game.rooms.sim.populationReport();
require('proto-all'); console.log(Game.rooms.sim.jobManager().getCarrierCountMax());
require('proto-all'); Game.rooms.sim.jobList().report(Game.rooms.sim.jobList().all().filter(function(job){
    return job.type() === 'build';
}));



Game.flags.Idle5.memory.role = 'idle';
Game.flags.Idle5.memory.idle_creep_max = 7;


// init room

require('proto-all');  Game.rooms.sim.roleCountMax('tech', 6);
require('proto-all');  Game.rooms.sim.roleCountMax('carrier', 5);
require('proto-all');  Game.rooms.sim.jobCountMax('build', 3);


require('proto-all');
var r = Game.rooms['W15N4'].containsHostiles();
            console.log('r', r);


Game.flags.Idle1.memory.role = 'idle';
Game.flags.Idle1.memory.idleCreepMax = 7;

Game.flags.Idle2.memory.role = 'idle';
Game.flags.Idle2.memory.idleCreepMax = 7;

Game.flags.Flag1.memory.role = 'source';
Game.flags.Flag1.memory.harvester_count_max = 2;

Game.flags.Flag2.memory.role = 'source';
Game.flags.Flag2.memory.harvester_count_max = 2;

Game.flags.Flag3.memory.role = 'source';
Game.flags.Flag3.memory.harvester_count_max = 2;

Game.flags.Flag4.memory.role = 'source';
Game.flags.Flag4.memory.harvester_count_max = 2;





Game.flags.Guard1.memory.role = 'guard';
Game.flags.Guard1.memory.guard_max = 3;

Game.flags.Guard2.memory.role = 'guard';
Game.flags.Guard2.memory.guard_max = 3;


Game.flags.Guard3.memory.role = 'guard';
Game.flags.Guard3.memory.guard_max = 3;


Game.flags.R1.memory.role = 'defend_rampart';
Game.flags.Guard1.memory.guard_max = 2;
