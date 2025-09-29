// Script di test per verificare la configurazione del bot
const fs = require('fs');
const path = require('path');

console.log('🧀 Test Bot Mozzarella d\'Autore\n');

// Verifica file di configurazione
const configPath = path.join(__dirname, 'config.json');
if (!fs.existsSync(configPath)) {
    console.error('❌ File config.json non trovato!');
    process.exit(1);
}

// Carica configurazione
const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));

// Verifica token
if (!config.token || config.token === 'IL_TUO_TOKEN') {
    console.error('❌ Token non configurato!');
    console.log('💡 Modifica il file config.json con il tuo token da @BotFather');
    process.exit(1);
}

// Verifica Chat ID
if (!config.admin_chat_id) {
    console.warn('⚠️  Chat ID admin non configurato!');
    console.log('💡 Trova il tuo Chat ID con @userinfobot e aggiungilo a config.json');
}

// Verifica prodotti
if (!config.products || config.products.length === 0) {
    console.warn('⚠️  Nessun prodotto configurato!');
} else {
    console.log('📋 Prodotti configurati:');
    config.products.forEach(product => {
        console.log(`   • ${product.name} - €${product.price.toFixed(2)}/${product.unit}`);
    });
}

// Verifica province
if (!config.delivery_provinces || config.delivery_provinces.length === 0) {
    console.warn('⚠️  Nessuna provincia di consegna configurata!');
} else {
    console.log('🚚 Province di consegna:', config.delivery_provinces.join(', '));
}

// Verifica dipendenze
const packagePath = path.join(__dirname, 'package.json');
if (!fs.existsSync(packagePath)) {
    console.error('❌ File package.json non trovato!');
    process.exit(1);
}

const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
const dependencies = packageJson.dependencies || Object.keys(packageJson.devDependencies || {});

if (!dependencies['node-telegram-bot-api']) {
    console.error('❌ Dipendenza node-telegram-bot-api non trovata!');
    console.log('💡 Esegui "npm install" per installare le dipendenze');
    process.exit(1);
}

console.log('\n✅ Test completato!');
console.log('🚀 Per avviare il bot, esegui "npm start" o "node bot.js"');
console.log('📝 Ricorda di:');
console.log('   1. Configurare il tuo Chat ID in config.json');
console.log('   2. Personalizzare i prodotti e i prezzi');
console.log('   3. Testare il bot su Telegram');