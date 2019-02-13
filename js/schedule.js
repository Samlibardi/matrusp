/**
 * A class representing schedules.
 * 
 * @Constructor
 *
 * @example
 *  var scheduleExample = {
 *    day: "qua",
 *    timeBegin: "19:00",
 *    timeEnd: "20:40",
 *    htmlElement: div.schedule-box
 *  }
 *
 * @see UI#createScheduleBox
 */
function Schedule(jsonObj, parentClassroom) {
  this.parent = parentClassroom;
  
  if (jsonObj) {
    this.day = jsonObj.dia;
    var dayIndex = Date.getDayNumberFromName(this.day);
    this.dateBegin = parentClassroom.dateBegin.getDay() == dayIndex ? parentClassroom.dateBegin.clone() : parentClassroom.dateBegin.clone().moveToDayOfWeek(dayIndex);
    this.timeBegin = Date.parse(jsonObj.inicio);
    this.timeEnd = Date.parse(jsonObj.fim);
    // parentClassroom.parent is this schedule's Lecture ancestor
    var lectureCode = parentClassroom.parent.code;
    this.htmlElement = ui.createScheduleBox(this, lectureCode);

    this.addEventListeners();
  }
}

Schedule.prototype.conflictsWith = function(schedule) {
  return this.day == schedule.day && this.timeBegin < schedule.timeEnd && this.timeEnd > schedule.timeBegin;
}

/**
 *
 */
Schedule.prototype.delete = function() {
  this.htmlElement.remove();
}

Schedule.prototype.addEventListeners = function() {
  this.htmlElement.addEventListener('contextmenu', e => {ui.createLectureContextMenu(this.parent.parent, {x: e.clientX, y: e.clientY}); e.preventDefault();});

  this.htmlElement.addEventListener('click', e => {this.parent.parent.open();});

  this.htmlElement.addEventListener('mouseenter', e => this.parent.parent.setHighlight());
  this.htmlElement.addEventListener('mouseleave', e => this.parent.parent.unsetHighlight());
}