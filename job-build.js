'use strict';

var job_build = {
    name: 'build',
    act: function(creep, job){
        var target = job.target();

        if(!target){
            job.end();
            return;
        }

        var result = creep.build(target);
        if(result !== OK){
            if(result === ERR_NOT_IN_RANGE){
                creep.moveTo(target);
            } else {
                job.end();
            }
        }

    },
    getJobs: function(room) {
        var jobs = [];

        var sites = room.constructionSites().forEach(function(site){
            var currentCount = site.targetOfJobTypeCount('build');
            var adjacentTiles = site.pos.adjacentEmptyTileCount();

            if(adjacentTiles > 3){
                adjacentTiles = 3;
            }

            if(currentCount >= adjacentTiles){
                return;
            }

            var priority = 0.5;

            var allocationRatio = 1 - (currentCount / adjacentTiles);
            var progress = site.progress / site.progressTotal;
            var buildPriority = room.buildPriority(site.structureType);
            // average
            var buildJobPriority = (progress + buildPriority + allocationRatio) / 3;
            // move one decimal over
            priority += buildJobPriority * 0.1;

            var jobsToAdd = adjacentTiles - currentCount;

            for (var i = 0; i < jobsToAdd; i++) {

                jobs.push({
                    role: 'tech',
                    type: 'build',
                    target: site,
                    priority: priority
                });

            }

        });

        return jobs;
    },
};

module.exports = job_build;
