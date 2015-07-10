'use strict';

var job_build = {
    name: 'build',
    act: function(creep, job){
        var target = job.target();

        if(!target){
            job.end();
            return;
        }

        var move = creep.moveTo(target);

        var moveOK = (
            move === OK ||
            move === ERR_TIRED ||
            move === ERR_NO_PATH
        );

        if(!moveOK){
            job.end();
            return;
        }

        var action = creep.build(target);
        var actionOK = (
            action === OK ||
            action === ERR_NOT_IN_RANGE ||
            action === ERR_NOT_ENOUGH_ENERGY
        );

        if(!actionOK){
            job.end();
        }
    },

    getJobs: function(room) {
        var buildJobLimit = false;
        var maxBuildJobs = room.jobCountMax('build');

        if(_.isNumber(maxBuildJobs)){
            var activeBuildJobs = room.jobList().all(function(job){
                return job.type() === 'build';
            }).length;

            if(activeBuildJobs >= maxBuildJobs) {
                return [];
            }
            buildJobLimit = maxBuildJobs - activeBuildJobs;
        }

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

         var table = require('util').table;
        var str = table(jobs);
            console.log('@-');
            console.log(str);

        if(buildJobLimit !== false){
            jobs = _.sortBy(jobs, function(job){
                return job.priority;
            }).reverse().slice(0, buildJobLimit);
        }

         var str = table(jobs);
            console.log('@-');
            console.log(str);
        return jobs;
    },
};

module.exports = job_build;
