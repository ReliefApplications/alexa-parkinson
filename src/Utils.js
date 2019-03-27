const data = require('../data.json');

const spanishDay = ['domingo', 'lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado'];
const spanishTime = ['mañana', 'mediodía', 'noche'];

exports.Utils = {
    /**
     * This function is used to get the medicine data by day / hour from the mock json file
     * @param datetime object, An object containing keys 'day' and 'time'
     */
    getGeneralData: function (datetime) {
        let time = datetime['time'] ? datetime['time'] : getTimeOfDay();
        let day = datetime['day'] ? datetime['day'] : spanishDay[new Date().getDay()];

        let result = data[day][time];
        return result;
    },
    /**
     * This function is used to get one specific medicine data by day / hour from the mock json file
     * @param medicine string, The name of the medicine which information we need
     * @param datetime object, An object containing keys 'day' and 'time'
     */
    getSpecificData: function (medicine, datetime) {
        let day = getDayOfWeek(datetime['day']);
        let time = getTimeOfDay(datetime['time']);

        let generalResult = data[day][time];
        let result = null;

        generalResult.forEach(element => {
            if (element['medicamento'].toLowerCase() === medicine) {
                result = element['cantidad'];
            }
        });

        return result;
    },
    /**
     * This function is used to get the current day of the week in spanish
     * @param day string, Day of the week (absolute or relative)
     */
    getTimeOfDay: function (day) {
        if (day && spanishDay.indexOf(day) >= 0) {
            return day;
        } else if (day === 'mañana') {
            return spanishDay[(new Date().getDay() + 1) % 7];
        } else {
            return spanishDay[new Date().getDay()];
        }
    },
    /**
     * This function is used to get the current period of the day
     * @param period string, Time period of the day
     */
    getTimeOfDay: function (period) {
        if (period && spanishTime.indexOf(period) >= 0) {
            return period;
        } else {
            let time = new Date().getHours();
            if (time <= 10) {
                return spanishTime[0];
            } else if (time > 10 && time <= 15) {
                return spanishTime[1];
            } else if (time > 15) {
                return spanishTime[3];
            }
        }
    }
};
