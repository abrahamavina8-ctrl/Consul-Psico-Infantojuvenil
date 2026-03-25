/**
 * Lógica para la Orientación Virtual con IA
 * Utiliza Google Gemini para responder dudas de crianza.
 */

const apiKey = "AIzaSyBjZcgJS17izl50xi1M52BzB1LnmTrbke8"; // La clave se inyecta automáticamente en el entorno o se configura aquí

async function consultIA() {
    const userInput = document.getElementById('ai-parent-input').value;
    if (!userInput) return;

    const btn = document.getElementById('ai-parent-btn');
    const responseBox = document.getElementById('ai-response-box');
    const output = document.getElementById('ai-text-output');
    const loader = document.getElementById('ai-loader');

    // Mostrar UI de carga
    responseBox.classList.remove('hidden');
    loader.classList.remove('hidden');
    output.innerHTML = '';
    btn.disabled = true;

    const systemPrompt = `Eres la asistente virtual de "Vínculo Psicológico Infanto-Juvenil", representando a la Psic. Ana Belem Aviña González en Puerto Vallarta. 
    Instrucciones:
    1. Saludo cálido.
    2. Brinda 3 breves sugerencias u orientaciones iniciales.
    3. Finaliza aclarando que no sustituye terapia y deben agendar al +52 322 198 7592.`;

    let retries = 0;
    const maxRetries = 5;

    async function fetchWithRetry() {
        try {
            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: userInput }] }],
                    systemInstruction: { parts: [{ text: systemPrompt }] }
                })
            });

            if (!response.ok) throw new Error('API Error');

            const data = await response.json();
            const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
            
            loader.classList.add('hidden');
            // Formatear negritas y saltos de línea básicos
            output.innerHTML = text
                .replace(/\*\*(.*?)\*\*/g, '<strong class="text-stone-800">$1</strong>')
                .replace(/\n/g, '<br>');
            btn.disabled = false;
        } catch (error) {
            if (retries < maxRetries) {
                retries++;
                const delay = Math.pow(2, retries) * 1000;
                setTimeout(fetchWithRetry, delay);
            } else {
                loader.classList.add('hidden');
                output.innerHTML = '<p class="text-red-500">Error de conexión. Contacta vía WhatsApp al +52 322 198 7592.</p>';
                btn.disabled = false;
            }
        }
    }
    fetchWithRetry();
}

// Escuchar evento de Enter en el textarea
document.getElementById('ai-parent-input')?.addEventListener('keypress', function (e) {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        consultIA();
    }
});