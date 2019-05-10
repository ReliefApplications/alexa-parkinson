const calendar = require('../calendar.json');
const amount = require('../amount.json');

const spanishDay = ['domingo', 'lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado'];
const spanishTime = ['mañana', 'mediodía', 'noche'];





exports.Utils = {
    /**
     * This function is used to get the medicine data by day / hour from the mock json file
     * @param day string, The day of the week
     * @param time string, The time of the day
     */
    getGeneralData: function (day, time) {
        let result = calendar[day][time];
        return result;
    },
    /**
     * This function is used to get one specific medicine data by day / hour from the mock json file
     * @param medicine string, The name of the medicine which information we need
     * @param day string, The day of the week
     * @param time string, The time of the day
     */
    getSpecificData: function (medicine, day, time) {
        let generalResult = calendar[day][time];
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
    getDayOfWeek: function (day) {
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
    },
    /**
     * This function returns all medicine counts
     */
    getAllAmounts: function () {
        return amount.stock;
    },
    /**
     * This function is used to get the current amount of the medicine
     * @param medecine string, Medicine specified
     */
    getSpecificAmount: function (medicine) {
        stock = amount.stock;
        let rawData = stock.filter(
            function (stock) { return stock.medicine == medicine }
        );
        let result = null;
        if (rawData.length > 0) {
            result = this.getSingleAmount(rawData[0]);
        }
        return result;
    },
    /**
     * This function is used to get a single medicine amount
     * @param medecine string, Medicine specified
     */
    getSingleAmount: function (medicine) {

        let cantidad = Number(medicine.cantidad);
        let tipo = medicine.tipo;
        let result = null;

        if (cantidad == 0) {
            result = `${cantidad} ${tipo}`;
        } else {
            switch (tipo) {
                case 'píldora':
                    result = `${cantidad} píldora`;
                    break;
                case 'gramo':
                    if (cantidad < 1) {
                        cantidad *= 100;
                        result = `${cantidad} miligramo`;
                    } else {
                        result = `${cantidad} gramo`;
                    }
                    break;
                default:
                    result = `${cantidad} ${tipo}`;
            }
            if (cantidad >= 2) {
                result += `s`;
            }
        }
        return result;
    },
    setDialogState(request, state) {
        let session = request.getSession();
        session.set('dialogState', state);
    },
    supportsDisplay(request) {
        let hasDisplay =
            request.context &&
            request.context.System &&
            request.context.System.device &&
            request.context.System.device.supportedInterfaces &&
            request.context.System.device.supportedInterfaces.Display

        return hasDisplay;
    },
    renderBodyTemplate(url,title,text) {
        let template = {
            "type": "Display.RenderTemplate",
            "template": {
                "type": "BodyTemplate1",
                "backButton": "HIDDEN",
                "backgroundImage": {
                    "contentDescription": "",
                    "sources": [{
                        "url": url,
                        "size": "MEDIUM"
                    }
                    ]
                },
                "title": title,
                "textContent": {
                    "primaryText": {
                        "text": text,
                        "type": "PlainText"
                    }
                }
            }
        };
        return template;
    }
};