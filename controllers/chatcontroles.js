import Mensaje from '../models/mensaje.js';
import generarRespuestaGemini  from '../services/gemini.js';
import  exportarConversacionAPDF from '../utils/pdfexportado.js';


// Obtener historial completo
const obtenerHistorial = async (req, res) => {
  const mensajes = await Mensaje.find().sort({ fecha: 1 });
  res.json(mensajes);
};

// Generar respuesta del experto 1 (comunista, por ejemplo)
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

// Generar respuesta del experto 2 (conservador, por ejemplo)
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
  const ultimosMensajes = mensajes.slice(-6); // Limita a los últimos 6
  const historial = ultimosMensajes.map(m => `${m.autor}: ${m.contenido}`).join('\n');

  return `
Estás participando en un discusion con una filósofa atea que defiende el poliamor ético.quiero que adoptes el rol de un sacerdote católico tradicional que rechaza el poliamor conforme a la doctrina moral de la Iglesia y la Biblia. Responde con firmeza al último argumento de la filósofa, sin mencionarla por nombre. Usa un lenguaje claro, pastoral y contundente. Cita la Escritura solo cuando refuerce de manera inspiradora tu punto. Máximo 50 palabras por intervención. No desvíes el enfoque: refuta con convicción y profundidad doctrinal.



Conversación reciente:
${historial}
`;
};

const crearPromptFilosofa = (mensajes) => {
  const ultimosMensajes = mensajes.slice(-6);// Limita a los últimos 6
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
