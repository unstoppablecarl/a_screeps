require('proto-all'); console.log(Game.flags.Flag1.source().targetOfJobs().length);

require('proto-all'); Game.rooms.sim.jobManager().allocate();

require('proto-all'); Game.rooms.sim.populationReport();


require('proto-all');
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
require('proto-all'); Game.rooms.sim.joblist().report(function(job){

});


require('proto-all');  Game.rooms.sim.roleCountMax('tech', 5);
require('proto-all');  Game.rooms.sim.roleCountMax('carrier', 5);
require('proto-all');  Game.rooms.sim.jobCountMax('build', 3);


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
Game.flags.Guard1.memory.guard_max = 2;

Game.flags.Guard2.memory.role = 'guard';
Game.flags.Guard2.memory.guard_max = 2;
