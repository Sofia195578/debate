import 'dotenv/config'

import { GoogleGenerativeAI } from '@google/generative-ai';

async function probarGemini() {
  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

    // Ajusta el modelo según el que tengas autorizado y disponible
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-lite' });

    const prompt = "Hola, ¿puedes generar un saludo para mí?";

    const respuesta = await model.generateContent(prompt);
    const texto = await respuesta.response.text();

    console.log('Respuesta Gemini:', texto);
  } catch (error) {
    console.error('❌ Error al probar Gemini:', error);
  }
}

probarGemini();