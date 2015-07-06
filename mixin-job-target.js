'use strict';

// get job ids array
var targetOfJobIds = function() {
    var jobTargets = this.room.jobList().jobTargets();
    if (jobTargets[this.id] === undefined) {
        jobTargets[this.id] = [];
    }
    return jobTargets[this.id];
};

// get jobs this object is the target of
var targetOfJobs = function(filter) {

    var ids = this.targetOfJobIds();
    var result = ids.map(function(id) {
        return this.room.jobList().get(id);
    }, this);
    if (filter) {
        result = result.filter(filter);
    }
    return result;
};

// add a job id this object is the target of
var setTargetOfJob = function(jobId) {
    var jobIds = this.targetOfJobIds();
    // prevent duplicates
    if (jobIds.indexOf(jobId) === -1) {
        jobIds.push(jobId);
    }
};

// remove a job id this object is the target of
var removeTargetOfJob = function(jobId) {
    var jobIds = this.targetOfJobIds();

    var index = jobIds.indexOf(jobId);
    if (index !== -1) {
        jobIds.splice(1, index);
    }
};

// check if object is the target of job id
var isTargetOfJobId = function(jobId) {
    var jobTargets = this.room.jobTargets();
    return jobTargets.indexOf(jobId) !== -1;
};

// check if object is the target of job with type
var isTargetOfJobType = function(type) {
    var ids = this.targetOfJobIds();
    for(var i = ids.length - 1; i >= 0; i--){
        var id = ids[i];
        var job = this.room.jobList().get(id);
        if (job) {
            if (job.type() === type) {
                return true;
            }
        }
        // cleanup invalid jobs
        else {
            ids.splice(1, i);
        }
    }

    return false;
};

// get the number of jobs object is the target of with type
var targetOfJobTypeCount = function(type) {
    var ids = this.targetOfJobIds();
    var count = 0;
    for(var i = ids.length - 1; i >= 0; i--){
        var id = ids[i];
        var job = this.room.jobList().get(id);
        if (job) {
            if (job.type() === type) {
                count++;
            }
        }
        // cleanup invalid jobs
        else {
            ids.splice(1, i);
        }
    }
    return count;
};

var jobTarget = function(obj) {
    obj.targetOfJobIds = targetOfJobIds;
    obj.targetOfJobs = targetOfJobs;
    obj.setTargetOfJob = setTargetOfJob;
    obj.removeTargetOfJob = removeTargetOfJob;
    obj.isTargetOfJobId = isTargetOfJobId;
    obj.isTargetOfJobType = isTargetOfJobType;
    obj.targetOfJobTypeCount = targetOfJobTypeCount;
};

module.exports = jobTarget;