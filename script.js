async function consultIA() {
    const userInput = document.getElementById('ai-parent-input').value;
    if (!userInput) return;

    const btn = document.getElementById('ai-parent-btn');
    const responseBox = document.getElementById('ai-response-box');
    const output = document.getElementById('ai-text-output');
    const loader = document.getElementById('ai-loader');

    responseBox.classList.remove('hidden');
    loader.classList.remove('hidden');
    output.innerHTML = '';
    btn.disabled = true;

    try {
        const response = await fetch('/api/consultar', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ pregunta: userInput })
        });

        const data = await response.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

        loader.classList.add('hidden');
        output.innerHTML = text
            .replace(/\*\*(.*?)\*\*/g, '<strong class="text-stone-800 font-bold">$1</strong>')
            .replace(/\n/g, '<br>');
        btn.disabled = false;

    } catch (error) {
        loader.classList.add('hidden');
        output.innerHTML = `<p class="text-red-500 font-medium">Lo sentimos, hubo un inconveniente. Contacta vía WhatsApp al <a href="tel:+523221987592" class="underline">+52 322 198 7592</a>.</p>`;
        btn.disabled = false;
    }
}

document.getElementById('ai-parent-input')?.addEventListener('keypress', function (e) {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        consultIA();
    }
});