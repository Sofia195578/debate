import Mensaje from '../models/mensaje.js';
import generarRespuestaGemini  from '../services/gemini.js';
import  exportarConversacionAPDF from '../utils/pdfexportado.js';


// Obtener historial completo
const obtenerHistorial = async (req, res) => {
  const mensajes = await Mensaje.find().sort({ fecha: 1 });
  res.json(mensajes);
};

// Generar respuesta del experto 1 
const responderReligioso = async (req, res) => {
  const historial = await Mensaje.find().sort({ fecha: 1 });
  const prompt = crearPromptReligioso(historial);
  
  console.log('🔵 Prompt enviado a Gemini (Religioso):\n', prompt);

  const respuesta = await generarRespuestaGemini(prompt);

  console.log('🔵 Respuesta recibida de Gemini (Religioso):\n', respuesta);

  const nuevoMensaje = new Mensaje({ autor: 'religioso', contenido: respuesta });
  await nuevoMensaje.save();

  res.json(nuevoMensaje);
};

// Generar respuesta del experto 2
const responderFilosofa = async (req, res) => {
  const historial = await Mensaje.find().sort({ fecha: 1 });
  const prompt = crearPromptFilosofa(historial);

  console.log('🟣 Prompt enviado a Gemini (Filosofa):\n', prompt);

  const respuesta = await generarRespuestaGemini(prompt);

  console.log('🟣 Respuesta recibida de Gemini (Filosofa):\n', respuesta);

  const nuevoMensaje = new Mensaje({ autor: 'filosofa', contenido: respuesta });
  await nuevoMensaje.save();

  res.json(nuevoMensaje);
};

// Limpiar historial
const limpiarHistorial = async (req, res) => {
  await Mensaje.deleteMany();
  res.json({ mensaje: 'Historial limpiado' });
};



// ------- Prompts personalizados -------

const crearPromptReligioso = (mensajes) => {
  const ultimosMensajes = mensajes.slice(-3); 
  const historial = ultimosMensajes.map(m => `${m.autor}: ${m.contenido}`).join('\n');

  return `
Inicia la conversación con un saludo. Adopta el rol de un sacerdote católico tradicional que rechaza el poliamor conforme a la doctrina moral de la Iglesia y la Sagrada Escritura. Responde con firmeza y claridad al último argumento que ella ha planteado. Usa un lenguaje pastoral, claro y contundente. Limita tu intervención a un máximo de 50 palabras. No la menciones por nombre. Cita la Escritura solo si refuerza de manera inspiradora y directa tu refutación. Mantén el enfoque centrado en refutar su argumento con profundidad doctrinal.

Conversación reciente:
${historial}
`;
};

const crearPromptFilosofa = (mensajes) => {
  const ultimosMensajes = mensajes.slice(-3);
  const historial = ultimosMensajes.map(m => `${m.autor}: ${m.contenido}`).join('\n');

  return `

Estás participando en un discusion con un sacerdote católico tradicional que rechaza el poliamor.quiero que adoptes el rol de un Eres una filósofa atea que defiende el poliamor ético desde la autonomía individual, el consentimiento y la crítica a los dogmas. Refuta el último argumento del sacerdote sin nombrarlo. Usa lógica rigurosa, ejemplos culturales o históricos, y un tono crítico pero racional. Máximo 50 palabras por intervención. Enfócate en contraargumentos sólidos y pertinentes.


Conversación reciente:
${historial}
`;
};


const exportarPDF = async (req, res) => {
  const mensajes = await Mensaje.find().sort({ fecha: 1 });
  exportarConversacionAPDF(mensajes, res);
};

const chatcontroles = {
  obtenerHistorial,
  responderReligioso,
  responderFilosofa,
  limpiarHistorial,
  exportarPDF,
};

export default chatcontroles;
