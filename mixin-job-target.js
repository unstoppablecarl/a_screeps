'use strict';

// get job ids array
var targetOfJobIds = function() {
    var jobTargets = this.room.jobTargets();
    if (jobTargets[this.id] === undefined) {
        jobTargets[this.id] = [];
    }
    return jobTargets[this.id];
};

var targetOfJobs = function(filter) {

    var ids = this.targetOfJobIds();
    var result = ids.map(function(id) {
        return this.room.jobsList().get(id);
    }, this);
    if (filter) {
        result = result.filter(filter);
    }
    return result;
};

var setTargetOfJob = function(jobId) {
    var jobIds = this.targetOfJobIds();

    // prevent duplicates
    if (jobIds.indexOf(jobId) === -1) {
        jobIds.push(jobId);
    }
};

var removeTargetOfJob = function(jobId) {
    var jobIds = this.targetOfJobIds();

    var index = jobIds.indexOf(jobId);
    if (index !== -1) {
        jobIds.splice(1, index);
    }
};

var isTargetOfJobId = function(jobId) {
    var jobTargets = this.room.jobTargets();
    return jobTargets.indexOf(jobId) !== -1;
};

var isTargetOfJobType = function(type) {
    var ids = this.targetOfJobIds();
    for (var i = 0; i < ids.length; i++) {
        var id = ids[i];
        var job = this.room.jobList().get(id);
        if (job) {
            if (job.type() === type) {
                return true;
            }
        }
    }
    return false;
};

var jobTarget = function(obj) {
    obj.targetOfJobIds = targetOfJobIds;
    obj.targetOfJobs = targetOfJobs;
    obj.setTargetOfJob = setTargetOfJob;
    obj.removeTargetOfJob = removeTargetOfJob;
    obj.isTargetOfJobId = isTargetOfJobId;
    obj.isTargetOfJobType = isTargetOfJobType;
};


module.exports = jobTarget;