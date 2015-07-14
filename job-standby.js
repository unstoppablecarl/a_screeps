'use strict';

// creep is not idle
// but manning its assigned flag/destination
var job_standby = {
    name: 'standby',
    act: false,

    // returns move to flag jobs that will convert to standby
    getJobs: function(room){

        var jobs = [];

        var flags = room.flags();

        for (var i = 0; i < flags.length; i++) {
            var flag = flags[i];
            var role = flag.role();

            if(role === 'guard'){

                var guardMax = flag.guardMax();
                var guardCount = flag.guardCount();

                if(guardCount < guardMax){

                    var priority = 0.7;
                    var guardBasePriority = flag.guardPriority();
                    if(guardBasePriority){
                        priority = guardBasePriority;
                    }

                    var guardPriority = 1 - (guardCount / guardMax);
                    priority += guardPriority * 0.1;

                    jobs.push({
                        role: 'guard',
                        type: 'move_to_flag',
                        target: flag,
                        priority: priority
                    });
                }

            }
            else if(role === 'healer'){

            }

        }
        return jobs;

    }
};

module.exports = job_standby;
