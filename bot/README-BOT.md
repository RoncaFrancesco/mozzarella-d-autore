# 🤖 Mozzarella d'Autore - Telegram Bot

Bot per la gestione degli ordini di mozzarella di bufala campana DOP.

## 🚀 Avvio del Bot

1. **Installa le dipendenze:**
   ```bash
   npm install
   ```

2. **Configura il tuo Chat ID:**
   - Trova il tuo Chat ID con [@userinfobot](https://t.me/userinfobot)
   - Aggiornalo nel file `config.json` nel campo `admin_chat_id`

3. **Avvia il bot:**
   ```bash
   npm start
   ```

## ⚙️ Configurazione

### File config.json
```json
{
  "token": "IL_TUO_TOKEN",
  "admin_chat_id": "IL_TUO_CHAT_ID",
  "bot_username": "MozzarellaAutoreBot",
  "delivery_provinces": ["CE", "SA", "FU", "BN", "AV"],
  "products": [
    {
      "id": "mozzarella",
      "name": "Mozzarella di Bufala DOP",
      "description": "Fresca produzione quotidiana",
      "price": 10.00,
      "unit": "pz"
    }
  ]
}
```

### Personalizzazione Prodotti
Modifica l'array `products` nel file `config.json` per aggiornare:
- Nomi prodotti
- Prezzi
- Descrizioni
- Unità di misura

## 📋 Funzionalità del Bot

### 🛒 Gestione Ordini
- Catalogo prodotti con prezzi
- Carrello della spesa
- Checkout guidato
- Conferma ordine

### 📦 Consegne
- Verifica provincia di consegna
- Scelta fascia oraria
- Ordine minimo €15.00
- Consegna gratuita

### 💳 Pagamenti
- Contanti alla consegna
- Satispay
- PayPal

### 📱 Notifiche
- Ricezione ordini in tempo reale
- Notifiche all'admin
- Conferma clienti

## 🔧 Comandi del Bot

| Comando | Descrizione |
|---------|-------------|
| /start | Avvia il bot e mostra il menu |
| 📋 Catalogo prodotti | Mostra tutti i prodotti |
| 🛒 Nuovo ordine | Inizia un nuovo ordine |
| ℹ️ Info consegne | Mostra informazioni consegne |
| 📞 Contatti | Mostra informazioni di contatto |

## 📊 Flusso Ordine

1. **Selezione prodotti** - Utente sceglie dal catalogo
2. **Carrello** - Aggiunge prodotti al carrello
3. **Checkout** - Inserisce dati personali:
   - Nome e cognome
   - Numero di telefono
   - Indirizzo completo
4. **Consegna** - Sceglie fascia oraria:
   - 9:00 - 12:00
   - 12:00 - 15:00
   - 17:00 - 20:00
5. **Pagamento** - Seleziona metodo di pagamento
6. **Conferma** - Rivede riepilogo e conferma

## 📂 Struttura File

```
bot/
├── bot.js              # Codice principale del bot
├── config.json         # Configurazione del bot
├── package.json        # Dipendenze npm
├── orders.json         # Storico ordini (auto-generato)
└── README-BOT.md       # Questo file
```

## 🚀 Deployment

### Opzione 1: Locale
```bash
npm install
npm start
```

### Opzione 2: Server VPS
1. Installa Node.js sul server
2. Carica i file del bot
3. Esegui `npm install`
4. Avvia con `npm start` o usa PM2 per keep-alive

### Opzione 3: Hosting Cloud
Il bot può essere deployato su:
- Heroku
- AWS Lambda
- Google Cloud Functions
- Vercel Serverless Functions

## 🔍 Monitoraggio

Il bot salva automaticamente:
- Tutti gli ordini in `orders.json`
- Log della console per debugging
- Errori di polling/webhook

## 🛡️ Sicurezza

- Token bot sicuro
- Verifica province di consegna
- Validazione input utente
- No dati sensibili in chiaro

## 📞 Supporto

Per problemi o domande sul bot, contatta:
- Email: info@mozzarelladautore.it
- Telegram: @MozzarellaAutoreBot

---

**Note:**
- Il bot richiede Node.js 16.0+ per funzionare
- Assicurati di avere il token corretto da @BotFather
- Il tuo Chat ID è necessario per ricevere notifiche ordini
- Il bot funziona 24/7 una volta avviato