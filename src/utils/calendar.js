import { newActivityId } from '../utils/wcif';
import { Calendar } from 'fullcalendar';
import { moment } from 'moment';
import 'moment-timezone';

// We just need this for the custom 'Moment' object which is attached to FC.
const dummyCalendar = new Calendar(null);

export function isoToMoment(isoString, tz) {
  // Using FC's moment because it has a custom "stripZone" feature
  // The final FC display will be timezone-free, and the user expect a calendar
  // in the venue's TZ.
  // First convert the time received into the venue's timezone, then strip its value
  let ret = dummyCalendar.moment(isoString).tz(tz).stripZone();
  return ret;
}

export function momentToIso(momentObject, tz) {
  // Take the moment and "concatenate" the UTC offset of the timezone at that time
  // momentObject is a FC (ambiguously zoned) moment, therefore format() returns a zone free string
  let ret = moment.tz(momentObject.format(), tz).format();
  return ret;
}

export function activityToFcEvent(eventData, tz) {
  // Create a FullCalendar event from an activity
  if (eventData.hasOwnProperty("name")) {
    eventData.title = eventData.name;
  }
  // Generate a new activity id if needed
  if (!eventData.hasOwnProperty("id")) {
    eventData.id = newActivityId();
  }

  // Keep activityCode untouched
  // Keep childActivities untouched

  // While in FC, any time is ambiguously-zoned
  // We'll add back the room's venue's timezone when exporting the WCIF
  if (eventData.hasOwnProperty("startTime")) {
    eventData.start = isoToMoment(eventData.startTime, tz);
  }
  if (eventData.hasOwnProperty("endTime")) {
    eventData.end = isoToMoment(eventData.endTime, tz);
  }
  return eventData;
}

export function fcEventToActivity(event, tz) {
  // Build a cleaned up activity from a FullCalendar event
  let activity = {
    id: event.id,
    name: event.title,
    activityCode: event.activityCode,
  };
  if (event.hasOwnProperty("start")) {
    activity.startTime = momentToIso(event.start, tz);
  }
  if (event.hasOwnProperty("end")) {
    activity.endTime = momentToIso(event.end, tz);
  }
  if (event.hasOwnProperty("childActivities")) {
    // Not modified by FC, put them back anyway
    activity.childActivities = event.childActivities;
  } else {
    activity.childActivities = [];
  }
  return activity;
}
