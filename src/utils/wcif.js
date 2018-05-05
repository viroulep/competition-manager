import _ from 'lodash';

let events = require("../data/events.json");

export function roundIdToString(roundId) {
  let { eventId, roundNumber } = parseActivityCode(roundId);
  let event = events.byId[eventId];
  return `${event.name}, Round ${roundNumber}`;
}

// Copied from https://github.com/jfly/tnoodle/blob/c2b529e6292469c23f33b1d73839e22f041443e0/tnoodle-ui/src/WcaCompetitionJson.js#L52
export function parseActivityCode(activityCode) {
  let eventId, roundNumber, group, attempt;
  let parts = activityCode.split("-");
  eventId = parts.shift();

  parts.forEach(part => {
    let firstLetter = part[0];
    let rest = part.substring(1);
    if(firstLetter === "r") {
      roundNumber = parseInt(rest, 10);
    } else if(firstLetter === "g") {
      group = rest;
    } else if(firstLetter === "a") {
      attempt = rest;
    } else {
      throw new Error(`Unrecognized activity code part: ${part} of ${activityCode}`);
    }
  });
  return { eventId, roundNumber, group, attempt };
}

export function buildActivityCode(activity) {
  let activityCode = activity.eventId;
  if(activity.roundNumber) {
    activityCode += "-r" + activity.roundNumber;
  }
  if(activity.group) {
    activityCode += "-g" + activity.group;
  }

  return activityCode;
}

export function roomWcifFromId(scheduleWcif, id) {
  if (id.length > 0) {
    for (let i = 0; i < scheduleWcif.venues.length; i++) {
      let venue = scheduleWcif.venues[i];
      for (let j = 0; j < venue.rooms.length; j++) {
        let room = venue.rooms[j];
        if (id == room.id) {
          return room;
        }
      }
    }
  }
  return null;
}

export function venueWcifFromRoomId(scheduleWcif, id) {
  if (id.length > 0) {
    for (let i = 0; i < scheduleWcif.venues.length; i++) {
      let venue = scheduleWcif.venues[i];
      for (let j = 0; j < venue.rooms.length; j++) {
        let room = venue.rooms[j];
        if (id == room.id) {
          return venue;
        }
      }
    }
  }
  return null;
}

export function venueWcifFromId(wcif, venueId) {
  // Make sure we use an Int
  let venueIdAsInt = parseInt(venueId, 10);
  if (venueIdAsInt !== undefined) {
    return _.find(wcif.schedule.venues, [ "id", venueIdAsInt ]);
  }
  return null;
}


export function activityIndexInArray(activities, id) {
  for (let i = 0; i < activities.length; i++) {
    if (activities[i].id === id) {
      return i;
    }
  }
  return -1;
}

export function activityCodeListFromWcif(scheduleWcif) {
  let usedActivityCodeList = [];
  scheduleWcif.venues.forEach(function(venue, index) {
    venue.rooms.forEach(function(room, index) {
      let activityCodes = room.activities.map(function(element) {
        return element.activityCode;
      });
      usedActivityCodeList.push(...activityCodes);
    });
  });
  return usedActivityCodeList;
}

function findMatchingActivityRecursive(activities, eventId, roundId) {
  let matching = [];
  activities.forEach(function(activity) {
    if (activity.activityCode.startsWith(roundId)) {
      matching.push(activity);
    } else if (activity.activityCode === eventId) {
      // We need to go deeper to find possible matching activities
      matching.push(findMatchingActivityRecursive(activities.childActivities, eventId, roundId));
    }
    // Else we do nothing, we not in our event activity
  });
  return matching;
}

export function getActivitiesForRound(wcif, roundId) {
  // array of { venueId, roomId, activity }
  // we keep nested activities!
  let result = [];
  let { eventId } = parseActivityCode(roundId);
  wcif.schedule.venues.forEach(function(venue) {
    let venueId = venue.id;
    venue.rooms.forEach(function(room) {
      let roomId = room.id;
      let matching = findMatchingActivityRecursive(room.activities, eventId, roundId);
      matching = _.map(matching, function(activity) {
        return { venueId: venueId, roomId: roomId, activity: activity }
      });
      result.push(matching);
    });
  });
  return _.flattenDeep(result);
}
