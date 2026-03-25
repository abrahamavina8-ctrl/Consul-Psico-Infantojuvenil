export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).end();
    
    const { pregunta } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
        return res.status(500).json({ error: 'API key no configurada' });
    }

    const systemPrompt = `Eres la asistente virtual de "Vínculo Psicológico Infanto-Juvenil", representando a la Psic. Ana Belem Aviña González en Puerto Vallarta. 
    Instrucciones:
    1. Saludo cálido.
    2. Brinda 3 breves sugerencias u orientaciones iniciales.
    3. Finaliza aclarando que no sustituye terapia y deben agendar al +52 322 198 7592.`;

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: pregunta }] }],
                systemInstruction: { parts: [{ text: systemPrompt }] }
            })
        });

        const data = await response.json();
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}