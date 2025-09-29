// Bot Telegram semplice per Vercel
const https = require('https');

// Token del bot
const TOKEN = '8360129399:AAHn4C1gje9fF82fGAqRWq11nvXWtMCi2vk';

// Funzione principale per Vercel
module.exports = async (req, res) => {
    try {
        // Log per debugging
        console.log('Webhook ricevuto:', JSON.stringify(req.body, null, 2));

        // Estrai informazioni dal messaggio
        const message = req.body.message;
        if (!message) {
            return res.status(200).send('OK');
        }

        const chatId = message.chat.id;
        const text = message.text || '';
        const firstName = message.from.first_name || 'amico';

        console.log(`Messaggio da ${firstName} (${chatId}): ${text}`);

        // Risposta semplice
        let responseText = '';

        if (text.toLowerCase().includes('ciao') || text.toLowerCase().includes('salve')) {
            responseText = `🧀 Ciao ${firstName}! Benvenuto in Mozzarella d'Autore!\n\nSono qui per aiutarti con i tuoi ordini. Scrivi pure cosa desideri! 😊`;
        } else if (text.toLowerCase().includes('catalogo') || text.toLowerCase().includes('prezzi')) {
            responseText = `📋 **Il Nostro Catalogo**\n\n• Mozzarella di Bufala DOP - €5.00 (250g)\n• Burrata di Bufala - €7.50 (300g)\n• Treccia di Bufala - €6.00 (250g)\n• Ricotta di Bufala - €4.50 (500g)\n• Scamorza Affumicata - €5.50 (400g)\n\nScrivi "ordina" per ordinare! 🛒`;
        } else if (text.toLowerCase().includes('ordina') || text.toLowerCase().includes('ordinare')) {
            responseText = `🛒 **Per ordinare:**\n\nScrivi direttamente cosa desideri!\n\nEsempi:\n• "2 mozzarelle e 1 burrata"\n• "1 treccia di bufala"\n• "Vorrei 250g di ricotta"\n\nTi risponderemo subito! 📞`;
        } else if (text.toLowerCase().includes('consegna') || text.toLowerCase().includes('spedizione')) {
            responseText = `🚚 **Consegna**\n\n• Orari: 9:00-12:00 | 12:00-15:00 | 17:00-20:00\n• Tutta Italia\n• Gratuita per ordini sopra €20\n• Pagamento: contanti, Satispay, PayPal`;
        } else {
            responseText = `🧀 Ciao ${firstName}! Sono il bot di Mozzarella d'Autore.\n\nPosso aiutarti con:\n📋 Catalogo prodotti\n🛒 Effettua un ordine\n🚚 Info consegna\n\nCosa ti interessa? 😊`;
        }

        // Invia la risposta tramite Telegram API
        await sendTelegramMessage(chatId, responseText);

        // Notifica all'admin
        await notifyAdmin(`📨 Messaggio da ${firstName}: "${text}"`);

        res.status(200).send('OK');

    } catch (error) {
        console.error('Errore nel webhook:', error);
        res.status(500).send('ERRORE');
    }
};

// Funzione per inviare messaggi via Telegram
function sendTelegramMessage(chatId, text) {
    return new Promise((resolve, reject) => {
        const url = `https://api.telegram.org/bot${TOKEN}/sendMessage?chat_id=${chatId}&text=${encodeURIComponent(text)}&parse_mode=Markdown`;

        https.get(url, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try {
                    const result = JSON.parse(data);
                    if (result.ok) {
                        resolve(result);
                    } else {
                        reject(new Error(result.description));
                    }
                } catch (e) {
                    reject(e);
                }
            });
        }).on('error', reject);
    });
}

// Funzione per notificare l'admin
function notifyAdmin(message) {
    const adminChatId = 'Fr3nk090'; // Sostituisci con il tuo chat ID
    return sendTelegramMessage(adminChatId, message);
}