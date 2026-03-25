/**
 * Script de conexión para el Asistente Virtual
 * Consultorio "Vínculo Psicológico Infanto - Juvenil"
 */

// REEMPLAZA las comillas vacías con tu clave de API de Google AI Studio
// Consíguela en: https://aistudio.google.com/app/apikey
const apiKey = "AIzaSyAL20U9c3GP_RgLTy_5g8cGGQOMbfBXtlw"; 

async function consultIA() {
    const userInput = document.getElementById('ai-parent-input').value;
    if (!userInput) return;

    const btn = document.getElementById('ai-parent-btn');
    const responseBox = document.getElementById('ai-response-box');
    const output = document.getElementById('ai-text-output');
    const loader = document.getElementById('ai-loader');

    // Preparar la interfaz para la carga
    responseBox.classList.remove('hidden');
    loader.classList.remove('hidden');
    output.innerHTML = '';
    btn.disabled = true;

    // Instrucciones del sistema para darle personalidad a la IA
    const systemPrompt = `
        Eres la asistente virtual de "Vínculo Psicológico Infanto-Juvenil", 
        el consultorio de la Psicóloga Ana Belem Aviña en Puerto Vallarta.
        Tu tono es empático, profesional y enfocado en la crianza positiva.
        Responde de forma breve (máximo 2 párrafos). 
        Siempre menciona que pueden agendar cita al WhatsApp +52 322 198 7592.
    `;

    try {
        // Conexión directa a la API de Gemini
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: userInput }] }],
                systemInstruction: { parts: [{ text: systemPrompt }] }
            })
        });

        if (!response.ok) {
            throw new Error('Error en la respuesta de la API');
        }

        const data = await response.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

        // Ocultar cargador
        loader.classList.add('hidden');
        
        // Formatear la respuesta:
        // 1. Convertir **texto** en negritas HTML
        // 2. Convertir saltos de línea en <br>
        output.innerHTML = text
            .replace(/\*\*(.*?)\*\*/g, '<strong class="text-stone-800 font-bold">$1</strong>')
            .replace(/\n/g, '<br>');
        
        btn.disabled = false;

    } catch (error) {
        console.error("Error detallado:", error);
        loader.classList.add('hidden');
        output.innerHTML = `
            <p class="text-red-500 font-medium">
                Lo sentimos, hubo un inconveniente con la conexión. 
                Por favor, intenta de nuevo o contacta directamente vía WhatsApp al 
                <a href="tel:+523221987592" class="underline">+52 322 198 7592</a>.
            </p>
        `;
        btn.disabled = false;
    }
}

// Escuchar la tecla "Enter" en el cuadro de texto
document.getElementById('ai-parent-input')?.addEventListener('keypress', function (e) {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault(); // Evita que se haga un salto de línea
        consultIA();
    }
});