const TelegramBot = require('node-telegram-bot-api');

// Configurazione
const token = '8360129399:AAHn4C1gje9fF82fGAqRWq11nvXWtMCi2vk';
const adminUsername = 'Fr3nk090'; // Il tuo username per notifiche

// Crea il bot
const bot = new TelegramBot(token);

// Configura il webhook
const WEBHOOK_URL = process.env.VERCEL_URL
    ? `${process.env.VERCEL_URL}/api/telegram`
    : 'https://localhost:3000/api/telegram';

bot.setWebHook(WEBHOOK_URL);

// Catalogo prodotti
const catalogo = [
    { nome: "Mozzarella di Bufala DOP", prezzo: "€5.00", descrizione: "Fresca produzione quotidiana" },
    { nome: "Burrata", prezzo: "€7.00", descrizione: "Crema di burro interna" },
    { nome: "Treccia di Bufala", prezzo: "€6.00", descrizione: "Forma a treccia 250g" },
    { nome: "Ricotta di Bufala", prezzo: "€4.50", descrizione: "Fresca e cremosa" },
    { nome: "Scamorza Affumicata", prezzo: "€5.50", descrizione: "Affumicatura naturale" }
];

// Funzione per creare menu con pulsanti
function createMainMenu() {
    return {
        reply_markup: {
            keyboard: [
                ['📋 Catalogo', '🛒 Ordina'],
                ['🚚 Consegna', 'ℹ️ Info'],
                ['💬 Chat Operatore']
            ],
            resize_keyboard: true,
            one_time_keyboard: false
        }
    };
}

// Messaggio di benvenuto
const benvenuto = `
🧀 *Benvenuto in Mozzarella d'Autore!*

Grazie per averci scelto! Sono il tuo assistente personale per ordinare le migliori mozzarelle DOP.

*Come posso aiutarti?*
📋 *Catalogo* - Visualizza i nostri prodotti
🛒 *Ordina* - Inizia un nuovo ordine
🚚 *Consegna* - Orari e zone di consegna
ℹ️ *Info* - Informazioni su di noi
💬 *Chat Operatore* - Parla con un umano

Scrivi pure quello che desideri! 😊
`;

// Gestione comandi
bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, benvenuto, {
        parse_mode: 'Markdown',
        ...createMainMenu()
    });
});

// Gestione messaggi testuali
bot.on('message', (msg) => {
    const chatId = msg.chat.id;
    const text = msg.text;
    const username = msg.from.username;

    // Ignora i comandi già gestiti
    if (text.startsWith('/')) return;

    console.log(`Messaggio da ${username}: ${text}`);

    // Saluto
    if (text.toLowerCase().includes('ciao') || text.toLowerCase().includes('salve') || text.toLowerCase().includes('buongiorno')) {
        bot.sendMessage(chatId, `Ciao ${msg.from.first_name}! 😊\n\n${benvenuto}`, {
            parse_mode: 'Markdown',
            ...createMainMenu()
        });
        return;
    }

    // Parole chiave per catalogo
    if (text.toLowerCase().includes('catalogo') || text.toLowerCase().includes('prodotti') || text.toLowerCase().includes('prezzi') || text === '📋 Catalogo') {
        let catalogoText = '📋 *Il Nostro Catalogo*\n\n';
        catalogo.forEach((prodotto, index) => {
            catalogoText += `${index + 1}. *${prodotto.nome}*\n   💰 ${prodotto.prezzo}\n   📝 ${prodotto.descrizione}\n\n`;
        });
        catalogoText += 'Scrivi "ordina" per iniziare un ordine!';

        bot.sendMessage(chatId, catalogoText, {
            parse_mode: 'Markdown',
            ...createMainMenu()
        });
        return;
    }

    // Parole chiave per ordinare
    if (text.toLowerCase().includes('ordina') || text.toLowerCase().includes('ordinare') || text === '🛒 Ordina') {
        bot.sendMessage(chatId,
            '🛒 *Per ordinare:*\n\nScrivi direttamente cosa desideri!\n\nEsempi:\n• "2 mozzarelle e 1 burrata"\n• "1 treccia di bufala"\n• "Vorrei 250g di ricotta"\n\nOppure scrivi "chat operatore" per parlare direttamente con noi! 📞',
            {
                parse_mode: 'Markdown',
                ...createMainMenu()
            }
        );
        return;
    }

    // Informazioni consegna
    if (text.toLowerCase().includes('consegna') || text.toLowerCase().includes('spedizione') || text === '🚚 Consegna') {
        bot.sendMessage(chatId,
            '🚚 *Informazioni Consegna*\n\n• *Orari*: 9:00-12:00 | 12:00-15:00 | 17:00-20:00\n• *Zone*: Tutta Italia\n• *Costo*: Gratuita per ordini sopra €20\n• *Pagamento*: Contanti, Satispay, PayPal\n\nOrdina ora! 🛒',
            {
                parse_mode: 'Markdown',
                ...createMainMenu()
            }
        );
        return;
    }

    // Info azienda
    if (text.toLowerCase().includes('info') || text.toLowerCase().includes('chi siete') || text === 'ℹ️ Info') {
        bot.sendMessage(chatId,
            'ℹ️ *Chi Siamo*\n\n🧀 *Mozzarella d\'Autore*\nTradizione artigianale dal 1958\n\n📍 Produzione in Campania\n🐄 100% bufala campana DOP\n✅ Qualità certificata\n\n📞 Contatti:\n• Telegram: @Fr3nk090\n• Email: info@mozzarelladautore.it',
            {
                parse_mode: 'Markdown',
                ...createMainMenu()
            }
        );
        return;
    }

    // Richiesta operatore
    if (text.toLowerCase().includes('operatore') || text.toLowerCase().includes('umano') || text === '💬 Chat Operatore') {
        // Notifica l'admin
        bot.sendMessage(adminUsername, `🔔 *Nuova richiesta operatore*\n\nUtente: ${msg.from.first_name} (@${username})\nChat ID: ${chatId}\nMessaggio: "${text}"`, { parse_mode: 'Markdown' });

        bot.sendMessage(chatId,
            '💬 *Operatore Richiesto*\n\nUn nostro operatore ti risponderà appena possibile!\n\nIntanto, posso aiutarti con:\n📋 Catalogo prodotti\n🛒 Effettua un ordine\n🚚 Info consegna\n\nGrazie per la pazienza! 😊',
            {
                parse_mode: 'Markdown',
                ...createMainMenu()
            }
        );
        return;
    }

    // Messaggi con numeri (probabili ordini)
    if (/\d+/.test(text) && (text.toLowerCase().includes('mozzarella') || text.toLowerCase().includes('burrata') || text.toLowerCase().includes('ordine'))) {
        // Notifica l'admin
        bot.sendMessage(adminUsername, `🛒 *NUOVO ORDINE!* 🛒\n\n👤 Cliente: ${msg.from.first_name} (@${username})\n📱 Chat: ${chatId}\n📝 Ordine: "${text}"\n\n⚠️ Rispondi al cliente quanto prima!`, { parse_mode: 'Markdown' });

        bot.sendMessage(chatId,
            '🛒 *Ordine Ricevuto!* 🛒\n\nGrazie per il tuo ordine:\n\n*"'+text+'"\n\n📞 Un nostro operatore ti contatterà a breve per confermare:\n• Disponibilità\n• Orario consegna\n• Totale\n\n⏰ Tempo di risposta: 5-10 minuti\n\nGrazie per averci scelto! 🧀✨',
            {
                parse_mode: 'Markdown',
                ...createMainMenu()
            }
        );
        return;
    }

    // Risposta di default per messaggi non riconosciuti
    bot.sendMessage(chatId,
        `😊 *Non ho capito perfettamente, ma posso aiutarti!*\n\nPosso mostrarti:\n📋 Il nostro catalogo prodotti\n🛒 Come ordinare\n🚚 Info sulla consegna\n💬 Parlare con un operatore\n\nCosa ti interessa?`,
        {
            parse_mode: 'Markdown',
            ...createMainMenu()
        }
    );
});

// Gestione errori
bot.on('polling_error', (error) => {
    console.log(error);
});

// Esporta il handler per Vercel
module.exports = async (req, res) => {
    try {
        await bot.processUpdate(req.body);
        res.status(200).send('OK');
    } catch (error) {
        console.error('Errore:', error);
        res.status(500).send('ERRORE');
    }
};