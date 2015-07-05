'use strict';

var jobs = {
    attack: require('job-attack'),
    build: require('job-build'),
    energy_collect: require('job-energy-collect'),
    energy_deliver: require('job-energy-deliver'),
    energy_store: require('job-energy-store'),
    guard: require('job-guard'),
    harvest: require('job-harvest'),
    idle: require('job-idle'),
    move_to: require('job-move-to'),
    repair: require('job-repair'),
    replace: require('job-replace'),
    upgrade_room_controller: require('job-upgrade-room-controller'),
};

module.exports = jobs;