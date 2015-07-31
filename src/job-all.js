'use strict';

var jobs = {
    attack: require('job-attack'),
    build: require('job-build'),
    defend_rampart: require('job-defend-rampart'),
    energy_collect: require('job-energy-collect'),
    energy_deliver: require('job-energy-deliver'),
    energy_store: require('job-energy-store'),
    guard: require('job-guard'),
    harvest: require('job-harvest'),
    idle: require('job-idle'),
    move_to_flag: require('job-move-to-flag'),
    repair: require('job-repair'),
    replace: require('job-replace'),
    standby: require('job-standby'),
    heal: require('job-heal'),
    upgrade_room_controller: require('job-upgrade-room-controller'),
};

module.exports = jobs;