require('proto-all'); console.log(Game.flags.Flag1.source().targetOfJobs().length);

require('proto-all');
var target = Game.rooms.sim.extensions()[0];
Game.rooms.sim.jobList().add({source: Game.creeps.Jon, target: target, type: 'attack', role: 'guard'});

Game.creeps.Jon.suicide();

require('proto-all'); Game.rooms['W15N4'].populationReport();
require('proto-all'); console.log('j', Game.creeps..job());


require('proto-all'); console.log('x ' + Game.flags.Idle4.idleCreepValid(Game.creeps.Kaitlyn));
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

require('proto-all');
console.log('z', Game.rooms['W15N4'].idleCreeps('carrier').length);

require('proto-all'); Game.rooms.sim.constructionSites();

require('proto-all'); Game.rooms.sim.populationReport();
require('proto-all'); console.log(Game.rooms['W15N4'].jobManager().getCarrierCountMax());
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
var body = [
 MOVE, MOVE, MOVE, MOVE, MOVE,
 ATTACK, ATTACK, ATTACK, ATTACK, ATTACK
];


jobList.add({
    type: 'attack',
    role: 'guard',
    source: Game.creeps.Kylie,
    target: room.lookAt(24,41)[0].structure
}).start();

var memory = {
    role: 'guard',
    source_of_job_id: job.id(),
};

Game.spawns.Spawn1.spawnCreep(body, memory);


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


Game.flags.Idle6.memory.role = 'idle';

Game.flags.Idle6.memory.idle_creep_max =   4;

Game.flags.Idle6.memory.idle_creep_role =   'carrier';

Game.flags.Idle6.memory.idle_priority   =   2;

Game.flags.Idle6.memory.idle_creep_exclude_energy_full  =   true;



Game.flags.Guard1.memory.role = 'guard';
Game.flags.Guard1.memory.guard_max = 3;

Game.flags.Guard2.memory.role = 'guard';
Game.flags.Guard2.memory.guard_max = 3;


Game.flags.Guard3.memory.role = 'guard';
Game.flags.Guard3.memory.guard_max = 3;


Game.flags.R1.memory.role = 'defend_rampart';
Game.flags.Guard1.memory.guard_max = 2;
