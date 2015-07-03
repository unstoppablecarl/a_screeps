require('proto-all'); console.log(Game.flags.Flag1.source().targetOfJobs().length);

require('proto-all'); Game.rooms.sim.jobManager().allocate();

require('proto-all');
console.log(
    JSON.stringify(
        Game.rooms.sim.jobManager().report()
        )
    );



require('proto-all'); Game.rooms.sim.populationReport();

require('proto-all');  Game.rooms.sim.roleCountMax('carrier', 8);

Game.flags.Idle1.memory.role = 'idle';
Game.flags.Idle1.memory.idleCreepMax = 7;

Game.flags.Idle2.memory.role = 'idle';
Game.flags.Idle2.memory.idleCreepMax = 7;

Game.flags.Flag1.memory.role = 'source';
Game.flags.Flag1.memory.harvester_count_max = 1;

Game.flags.Flag2.memory.role = 'source';
Game.flags.Flag2.memory.harvester_count_max = 1;