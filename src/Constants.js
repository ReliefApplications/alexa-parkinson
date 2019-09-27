module.exports = {
  texts: {
    errors: {
      no_medicine_found: "No tengo medicina con este nombre",
      too_many_medicines: "Tengo mas de un medicamento con este nombre.",
      medicine_already_here: "Medicamento añadido a tu calendario ¿Quieres añadir otro?"
    },
    
    //--- WELCOME ---
    welcome: {
      title: ["Bienvenido a la skill de Asistencia Parkinson."],
      text: ["Queremos ofrecerte toda la información sobre tu medicación además de darte la posibilidad de consultar tus dudas con la Asociación Parkinson Madrid. \nDi “Mi Medicación” o “Llamar”"],
      reprompt: ["Di “Mi Medicación”, “Llamar” o pregúntame “¿Qué puedo hacer?”"],
    },

    //--- MyMedication ---
    mymedication: {
      title: ["Mi medicación"],
      text: ["Ok, pregúntame por tu medicación programada. Por ejemplo di: ¿Qué medicación tengo que tomar hoy? O pregúntame “¿Qué puedo hacer?”"],
      reprompt: ["Disculpa ¿Quieres información sobre tu medicación de hoy?"]
    },

    //--- ParkinsonOptions ---
    parkinsonOptions: {
      title: ["Opciones"],
      text: ["Crear un calendario de medicación. Di “Tengo que tomar medicación”. Solicita tu calendario. Di “¿Qué medicamentos tengo que tomar hoy?”. También puedes obtener información sobre ti medicación Di “Efectos secundarios del Sinemet”. Llamar a la asociación Parkinson Madrid, Di “Llamar a la Asociación”.”"],
      reprompt: []
    },

    //--- Call ---
    call: {
      title: ["Llamada"],
      text: ["Informacion sobre la llamada. Quieres llamar?"],
      reprompt: ["llamada repete"],
    },

    //--- CompleteMedicineInsertion ---
    medicineinsertion: {
      title: [],
      text: ["Medicamento añadido a tu calendario. ¿Quieres añadir otro?"],
      reprompt: [],
    },
    insertionText: "Medicamento añadido a tu calendario ¿Quieres añadir otro?",

    //--- Help ---
    help: {
      speech: [],
      title: ["Que puede hacer"],
      text: ["Puedes crear un calendario de medicación. Di por ejemplo “Quiero añadir sinemet”. Puedes preguntar qué medicación tienes en tu calendario. Di por ejemplo “¿Qué medicamentos tengo que tomar hoy?”. También puedes obtener información sobre cualquier medicación relacionada con el Parkinson. Di por ejemplo: “Efectos secundarios del Sinemed”. Además puedes llamar a la asociación Parkinson Madrid, Di “Llamar a la Asociación”."],
      reprompt: [],
    },

    medicationCalendar: {
      text: [],
      title: [],
      reprompt: []
    },

    //--- Help ---
    helpText: "Puedes crear un calendario de medicación. Di por ejemplo “Quiero añadir sinemet”. Puedes preguntar qué medicación tienes en tu calendario. Di por ejemplo “¿Qué medicamentos tengo que tomar hoy?”. También puedes obtener información sobre cualquier medicación relacionada con el Parkinson. Di por ejemplo: “Efectos secundarios del Sinemed”. Además puedes llamar a la asociación Parkinson Madrid, Di “Llamar a la Asociación”.",
    helpScreenTitle: "Que puede hacer",
    helpScreenText: "\"Quiero añadir sinemet cada dia\" o \"¿Que medicación tengo que tomar hoy?\"",

    //--- Unhandled DEFAULT ---
    unhandled: {
      title: ["Solicitud desconocida."],
      text: ["Lo siento, no te he entendido."],
      reprompt: ["Lo siento, no te he entendido."],
    },

    //--- Unhandled Launch ---
    unhandledLaunch: {
      title: [],
      text: [],
      reprompt: [],
    },

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
  images: {
    welcomeImage: "https://i.ytimg.com/vi/PUOun9RImC8/maxresdefault.jpg",
    defaultImage: "https://i.ytimg.com/vi/PUOun9RImC8/maxresdefault.jpg"
  }
};
