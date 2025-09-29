// Bot Telegram ultra semplice per Vercel
const https = require('https');

module.exports = async (req, res) => {
    try {
        console.log('WEBHOOK RICEVUTO:', JSON.stringify(req.body, null, 2));

        const message = req.body.message;
        if (!message) {
            console.log('Nessun messaggio trovato');
            return res.status(200).send('OK');
        }

        const chatId = message.chat.id;
        const text = message.text || '';
        const firstName = message.from.first_name || 'amico';

        console.log(`Messaggio da ${firstName}: ${text}`);

        // Risposta molto semplice
        const responseText = `Ciao ${firstName}! Ho ricevuto il tuo messaggio: "${text}". Il bot è attivo! 🚀`;

        // Invia risposta
        await sendMessage(chatId, responseText);

        console.log('Risposta inviata con successo');
        res.status(200).send('OK');

    } catch (error) {
        console.error('ERRORE:', error);
        res.status(500).send('ERRORE');
    }
};

function sendMessage(chatId, text) {
    return new Promise((resolve, reject) => {
        const TOKEN = '8360129399:AAHn4C1gje9fF82fGAqRWq11nvXWtMCi2vk';
        const url = `https://api.telegram.org/bot${TOKEN}/sendMessage?chat_id=${chatId}&text=${encodeURIComponent(text)}`;

        https.get(url, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                console.log('Risposta Telegram:', data);
                try {
                    resolve(JSON.parse(data));
                } catch (e) {
                    reject(e);
                }
            });
        }).on('error', reject);
    });
}