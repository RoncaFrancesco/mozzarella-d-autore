// Bot Telegram per Mozzarella d'Autore
const https = require('https');

// Token del bot
const TOKEN = '8360129399:AAHn4C1gje9fF82fGAqRWq11nvXWtMCi2vk';

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

        let responseText = '';

        // Logica delle risposte
        if (text.toLowerCase().includes('ciao') || text.toLowerCase().includes('salve') || text === '/start') {
            responseText = `🧀 Ciao ${firstName}! Benvenuto in Mozzarella d'Autore!\n\nSono il tuo assistente personale per ordinare le migliori mozzarelle DOP.\n\nScrivi pure cosa desideri o usa:\n• "catalogo" per vedere i prodotti\n• "ordina" per iniziare un ordine\n• "consegna" per informazioni\n\nTi aspetto! 😊`;
        } else if (text.toLowerCase().includes('catalogo') || text.toLowerCase().includes('prezzi')) {
            responseText = `📋 **Il Nostro Catalogo**\n\n• Mozzarella di Bufala DOP - €5.00 (250g)\n• Burrata di Bufala - €7.50 (300g)\n• Treccia di Bufala - €6.00 (250g)\n• Ricotta di Bufala - €4.50 (500g)\n• Scamorza Affumicata - €5.50 (400g)\n\nScrivi "ordina" per ordinare! 🛒`;
        } else if (text.toLowerCase().includes('ordina') || text.toLowerCase().includes('ordinare')) {
            responseText = `🛒 **Per ordinare:**\n\nScrivi direttamente cosa desideri!\n\nEsempi:\n• "2 mozzarelle e 1 burrata"\n• "1 treccia di bufala"\n• "Vorrei 250g di ricotta"\n\n📞 Ti risponderemo subito per confermare disponibilità e orario di consegna!`;
        } else if (text.toLowerCase().includes('consegna') || text.toLowerCase().includes('spedizione')) {
            responseText = `🚚 **Informazioni Consegna**\n\n• Orari: 9:00-12:00 | 12:00-15:00 | 17:00-20:00\n• Zone: Tutta Italia\n• Costo: Gratuita per ordini sopra €20\n• Pagamento: Contanti, Satispay, PayPal\n\nOrdina ora! 📱`;
        } else if (text.toLowerCase().includes('info') || text.toLowerCase().includes('chi siete')) {
            responseText = `ℹ️ **Chi Siamo**\n\n🧀 **Mozzarella d'Autore**\nTradizione artigianale dal 1958\n\n📍 Produzione in Campania\n🐄 100% bufala campana DOP\n✅ Qualità certificata\n\n📞 Contatti:\n• Telegram: @Fr3nk090`;
        } else if (/\d+/.test(text) && (text.toLowerCase().includes('mozzarella') || text.toLowerCase().includes('burrata') || text.toLowerCase().includes('ordine'))) {
            // Notifica all'admin per ordini
            try {
                await sendMessage('@Fr3nk090', `🛒 **NUOVO ORDINE!** 🛒\n\n👤 Cliente: ${firstName}\n📝 Ordine: "${text}"\n\n⚠️ Rispondi al cliente quanto prima!`);
                console.log('Notifica admin inviata con successo');
            } catch (adminError) {
                console.log('Impossibile notificare admin:', adminError.message);
                // Prova con formato alternativo
                try {
                    await sendMessage('Fr3nk090', `🛒 **NUOVO ORDINE!** 🛒\n\n👤 Cliente: ${firstName}\n📝 Ordine: "${text}"\n\n⚠️ Rispondi al cliente quanto prima!`);
                    console.log('Notifica admin inviata con formato alternativo');
                } catch (error2) {
                    console.log('Entrambi i formati hanno fallito:', error2.message);
                }
            }

            responseText = `🛒 **Ordine Ricevuto!** 🛒\n\nGrazie! Il tuo ordine:\n"${text}"\n\n📞 Un nostro operatore ti contatterà a breve per:\n• Confermare disponibilità\n• Definire orario consegna\n• Comunicare il totale\n\n⏰ Risposta entro 5-10 minuti\n\nGrazie! 🧀✨`;
        } else {
            responseText = `🧀 Ciao ${firstName}! Sono il bot di Mozzarella d'Autore.\n\nPosso aiutarti con:\n📋 Catalogo prodotti\n🛒 Effettua un ordine\n🚚 Info consegna\nℹ️ Chi siamo\n\nCosa ti interessa? 😊`;
        }

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
        const url = `https://api.telegram.org/bot${TOKEN}/sendMessage?chat_id=${chatId}&text=${encodeURIComponent(text)}&parse_mode=Markdown`;

        https.get(url, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                console.log('Risposta Telegram:', data);
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