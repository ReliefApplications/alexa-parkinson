
const State = require('../dialogue-tree').trees.State;

const Constants = require('../../../Constants');
const utils = require('../../../Utils').Utils;

const userService = require('../../database/userdata');

// NOTE: In javascript Sunday is day 0 of the week
const daysOfWeek = [
    'sunday',
    'monday',
    'tuesday',
    'wednesday',
    'thursday',
    'friday',
    'saturday'
];

function getDayOfWeek(daySlot) {
    utils.log("Day slot", daySlot);
    if (daySlot === "hoy") {
        let numberDay = new Date().getDay();
        return daysOfWeek[numberDay];
    } else if (daySlot === "mañana") {
        let numberDay = new Date().getDay() + 1;
        return daysOfWeek[numberDay];

    } else {
        return daySlot.id;
    }
}

function getMomentOfDay() {
    let now = new Date().getHours();
    if (now < 12) {
        return 'mañana';
    } else if (now <= 15) {
        return 'mediodia';
    } else if (now <= 20) {
        return 'tarde';
    } else {
        return 'noche';
    }

}

const calendar = new State({
    main: ([user, slots]) => {

        let day = slots.day.value || 'hoy';
        let moment = slots.time.value || getMomentOfDay();

        let dayOfWeek = getDayOfWeek(day);
        utils.log("DayOfWeek", dayOfWeek);
        utils.log("moment", moment);

        let medicines = userService.getUserMedicines(user, dayOfWeek, moment);

        return Promise.resolve(medicines);
    }
});

module.exports.medicationCalendarIntent = calendar;