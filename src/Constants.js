module.exports = {
  TEXTS: {
    errors: {
      no_medicine_found: "No tengo medicina con este nombre",
      too_many_medicines: "Tengo mas de un medicamento con este nombre."
    },
    //--- WELCOME ---
    welcomeTitle: "Bienvenido a la skill de Asistencia Parkinson.",
    welcomeText: "Queremos ofrecerte toda la información sobre tu medicación además de darte la posibilidad de consultar tus dudas con la Asociación Parkinson Madrid. \nDi “Mi Medicación” o “Llamar”",
    welcomeReprompt: "Di “Mi Medicación” o “Llamar”",

    //--- MyMedication ---
    myMedicationTitle: "Mi medicación",
    myMedicationText: "Ok, pregúntame por tu medicación programada. Por ejemplo di: ¿Qué medicación tengo que tomar hoy?",
    myMedicationReprompt: "Disculpa ¿Quieres información sobre tu medicación de hoy?",

    //--- Call ---
    callTitle: "Llamada",
    callText: "Informacion sobre la llamada. Quieres llamar?", // Do you want to call the association?
    callReprompt: "llamada repete", // Do you want to call the association?

    //--- Unhandled DEFAULT ---
    unhandledDefaultTitle:"Solicitud desconocida.",
    unhandledDefaultText:"Lo siento, no te he entendido.",
    unhandledDefaultReprompt:"Lo siento, no te he entendido.",

    //--- Unhandled Launch ---
    unhandledLaunchText1:"Quieres información sobre tu medicación?",
    unhandledLaunchText2:"Quieres realizar una llamada al servicio de asistencia de Parkinson?",

    //--- Unhandled MyMedication ---
    unhandledMyMedicationText:"Disculpa ¿Quieres información sobre tu medicación de hoy?",

    //--- Unhandled MedicationSchedule ---
    unhandledMedicationScheduleText:"a definir",

    //--- Unhandled MedicationLeft ---
    unhandledMedicationLeftText:"a definir",

    //--- Unhandled Call ---
    unhandledCallText:"a definir",
    
    //--- Unhandled Close ---
    unhandledClose:"No he podido entenderte, lo siento. Siempre que quieras usar esta skill di 	“Parkinson”. ¡Hasta pronto!",

    //--- Invalid Answer ---
    invalidAnwer: "Lo siento, no es una respuesta válida."
  },
  IMAGES: {
    welcomeImage: "https://i.ytimg.com/vi/PUOun9RImC8/maxresdefault.jpg",
    defaultImage: "https://i.ytimg.com/vi/PUOun9RImC8/maxresdefault.jpg"
  }
};
