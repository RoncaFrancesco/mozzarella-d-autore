module.exports = async (req, res) => {
    try {
        console.log('Messaggio ricevuto:', JSON.stringify(req.body, null, 2));

        // Risposta semplice per test
        const chatId = req.body.message?.chat?.id;
        if (chatId) {
            // Invia una risposta semplice
            const https = require('https');
            const token = '8360129399:AAHn4C1gje9fF82fGAqRWq11nvXWtMCi2vk';
            const text = '🧀 Benvenuto! Il bot è attivo e funzionante! 🚀';

            const url = `https://api.telegram.org/bot${token}/sendMessage?chat_id=${chatId}&text=${encodeURIComponent(text)}`;

            https.get(url, (resp) => {
                console.log('Risposta inviata:', resp.statusCode);
            });
        }

        res.status(200).send('OK');
    } catch (error) {
        console.error('Errore:', error);
        res.status(500).send('ERRORE');
    }
};