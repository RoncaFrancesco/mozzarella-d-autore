// Mozzarella d'Autore - Telegram Bot
// Bot per la gestione ordini di mozzarella di bufala campana DOP

const TelegramBot = require('node-telegram-bot-api');
const fs = require('fs');
const path = require('path');

// Carica configurazione
const config = JSON.parse(fs.readFileSync(path.join(__dirname, 'config.json'), 'utf8'));

// Inizializza il bot
const bot = new TelegramBot(config.token, { polling: true });

console.log('🧀 Bot Mozzarella d\'Autore avviato!');

// Stato conversazioni
const conversations = new Map();

// Gestione messaggi
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  const welcomeMessage = config.welcome_message;

  const keyboard = {
    reply_markup: {
      keyboard: [
        ['📋 Catalogo prodotti', '🛒 Nuovo ordine'],
        ['ℹ️ Info consegne', '📞 Contatti']
      ],
      resize_keyboard: true,
      one_time_keyboard: false
    }
  };

  bot.sendMessage(chatId, welcomeMessage, {
    parse_mode: 'Markdown',
    ...keyboard
  });

  // Reset stato conversazione
  conversations.delete(chatId);
});

// Gestione callback query
bot.on('callback_query', (query) => {
  const chatId = query.message.chat.id;
  const data = query.data;

  try {
    if (data.startsWith('product_')) {
      showProductDetails(chatId, data.replace('product_', ''));
    } else if (data.startsWith('add_to_cart_')) {
      addToCart(chatId, data.replace('add_to_cart_', ''));
    } else if (data === 'view_cart') {
      viewCart(chatId);
    } else if (data === 'checkout') {
      startCheckout(chatId);
    } else if (data.startsWith('delivery_slot_')) {
      setDeliverySlot(chatId, data.replace('delivery_slot_', ''));
    } else if (data.startsWith('payment_')) {
      setPaymentMethod(chatId, data.replace('payment_', ''));
    } else if (data === 'confirm_order') {
      confirmOrder(chatId);
    } else if (data === 'cancel_order') {
      cancelOrder(chatId);
    }

    bot.answerCallbackQuery(query.id);
  } catch (error) {
    console.error('Errore callback query:', error);
    bot.answerCallbackQuery(query.id, { text: '❌ Errore', show_alert: true });
  }
});

// Mostra catalogo prodotti
bot.onText(/📋 Catalogo prodotti/, (msg) => {
  const chatId = msg.chat.id;
  showProductCatalog(chatId);
});

// Inizia nuovo ordine
bot.onText(/🛒 Nuovo ordine/, (msg) => {
  const chatId = msg.chat.id;
  startNewOrder(chatId);
});

// Info consegne
bot.onText(/ℹ️ Info consegne/, (msg) => {
  const chatId = msg.chat.id;
  showDeliveryInfo(chatId);
});

// Contatti
bot.onText(/📞 Contatti/, (msg) => {
  const chatId = msg.chat.id;
  showContactInfo(chatId);
});

// Funzioni principali
function showProductCatalog(chatId) {
  let message = '🧀 *Il Nostro Catalogo*\n\n';

  config.products.forEach(product => {
    message += `*${product.name}*\n`;
    message += `${product.description}\n`;
    message += `💰 €${product.price.toFixed(2)}/${product.unit}\n\n`;
  });

  const keyboard = {
    reply_markup: {
      inline_keyboard: [
        [{ text: '🛒 Inizia Ordine', callback_data: 'start_order' }]
      ]
    }
  };

  bot.sendMessage(chatId, message, {
    parse_mode: 'Markdown',
    ...keyboard
  });
}

function startNewOrder(chatId) {
  conversations.set(chatId, {
    state: 'selecting_products',
    cart: [],
    order: {}
  });

  showProductCatalog(chatId);
}

function showProductDetails(chatId, productId) {
  const product = config.products.find(p => p.id === productId);
  if (!product) return;

  let message = `*${product.name}*\n\n`;
  message += `${product.description}\n`;
  message += `💰 €${product.price.toFixed(2)}/${product.unit}\n\n`;

  const keyboard = {
    reply_markup: {
      inline_keyboard: [
        [{ text: '➕ Aggiungi al carrello', callback_data: `add_to_cart_${productId}` }],
        [{ text: '🔙 Torna al catalogo', callback_data: 'view_catalog' }]
      ]
    }
  };

  bot.sendMessage(chatId, message, {
    parse_mode: 'Markdown',
    ...keyboard
  });
}

function addToCart(chatId, productId) {
  const conversation = conversations.get(chatId);
  if (!conversation) return;

  const product = config.products.find(p => p.id === productId);
  if (!product) return;

  const existingItem = conversation.cart.find(item => item.id === productId);
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    conversation.cart.push({
      ...product,
      quantity: 1
    });
  }

  bot.sendMessage(chatId, `✅ ${product.name} aggiunto al carrello!`);
  viewCart(chatId);
}

function viewCart(chatId) {
  const conversation = conversations.get(chatId);
  if (!conversation || !conversation.cart.length) {
    bot.sendMessage(chatId, '🛒 Il tuo carrello è vuoto');
    return;
  }

  let message = '🛒 *Il Tuo Carrello*\n\n';
  let total = 0;

  conversation.cart.forEach(item => {
    const subtotal = item.price * item.quantity;
    total += subtotal;
    message += `${item.name} x${item.quantity} = €${subtotal.toFixed(2)}\n`;
  });

  message += `\n💰 *Totale: €${total.toFixed(2)}*`;

  const keyboard = {
    reply_markup: {
      inline_keyboard: [
        [{ text: '✅ Procedi all\'acquisto', callback_data: 'checkout' }],
        [{ text: '🔄 Continua gli acquisti', callback_data: 'view_catalog' }]
      ]
    }
  };

  bot.sendMessage(chatId, message, {
    parse_mode: 'Markdown',
    ...keyboard
  });
}

function startCheckout(chatId) {
  const conversation = conversations.get(chatId);
  if (!conversation || !conversation.cart.length) {
    bot.sendMessage(chatId, '❌ Carrello vuoto');
    return;
  }

  conversation.state = 'collecting_name';

  bot.sendMessage(chatId, '👤 Perfetto! Ora ho bisogno di qualche informazione per la consegna.\n\nCome ti chiami?');
}

// Gestione input testuale per checkout
bot.on('message', (msg) => {
  const chatId = msg.chat.id;
  const conversation = conversations.get(chatId);

  if (!conversation || !conversation.state) return;

  switch (conversation.state) {
    case 'collecting_name':
      conversation.order.name = msg.text;
      conversation.state = 'collecting_phone';
      bot.sendMessage(chatId, '📞 Perfetto! Ora inserisci il tuo numero di telefono:');
      break;

    case 'collecting_phone':
      conversation.order.phone = msg.text;
      conversation.state = 'collecting_address';
      bot.sendMessage(chatId, '📍 Ottimo! Ora inserisci il tuo indirizzo completo:\n(Via, numero, città, CAP)');
      break;

    case 'collecting_address':
      conversation.order.address = msg.text;
      conversation.state = 'selecting_delivery_slot';
      showDeliverySlots(chatId);
      break;
  }
});

function showDeliverySlots(chatId) {
  const keyboard = {
    reply_markup: {
      inline_keyboard: config.delivery_slots.map(slot => [
        { text: slot.label, callback_data: `delivery_slot_${slot.id}` }
      ])
    }
  };

  bot.sendMessage(chatId, '⏰ Scegli la fascia oraria per la consegna:', keyboard);
}

function setDeliverySlot(chatId, slotId) {
  const conversation = conversations.get(chatId);
  if (!conversation) return;

  const slot = config.delivery_slots.find(s => s.id === slotId);
  conversation.order.delivery_slot = slot;

  conversation.state = 'selecting_payment';
  showPaymentMethods(chatId);
}

function showPaymentMethods(chatId) {
  const keyboard = {
    reply_markup: {
      inline_keyboard: config.payment_methods.map(method => [
        { text: method.label, callback_data: `payment_${method.id}` }
      ])
    }
  };

  bot.sendMessage(chatId, '💳 Scegli il metodo di pagamento:', keyboard);
}

function setPaymentMethod(chatId, methodId) {
  const conversation = conversations.get(chatId);
  if (!conversation) return;

  const method = config.payment_methods.find(m => m.id === methodId);
  conversation.order.payment_method = method;

  showOrderSummary(chatId);
}

function showOrderSummary(chatId) {
  const conversation = conversations.get(chatId);
  if (!conversation) return;

  let total = 0;
  let summary = '📋 *Riepilogo Ordine*\n\n';

  summary += `👤 *Cliente:* ${conversation.order.name}\n`;
  summary += `📞 *Telefono:* ${conversation.order.phone}\n`;
  summary += `📍 *Indirizzo:* ${conversation.order.address}\n`;
  summary += `⏰ *Consegna:* ${conversation.order.delivery_slot.label}\n`;
  summary += `💳 *Pagamento:* ${conversation.order.payment_method.label}\n\n`;

  summary += '🧀 *Prodotti:*\n';
  conversation.cart.forEach(item => {
    const subtotal = item.price * item.quantity;
    total += subtotal;
    summary += `${item.name} x${item.quantity} = €${subtotal.toFixed(2)}\n`;
  });

  summary += `\n💰 *Totale: €${total.toFixed(2)}*`;

  const keyboard = {
    reply_markup: {
      inline_keyboard: [
        [{ text: '✅ Conferma Ordine', callback_data: 'confirm_order' }],
        [{ text: '❌ Annulla', callback_data: 'cancel_order' }]
      ]
    }
  };

  bot.sendMessage(chatId, summary, {
    parse_mode: 'Markdown',
    ...keyboard
  });
}

function confirmOrder(chatId) {
  const conversation = conversations.get(chatId);
  if (!conversation) return;

  const orderId = generateOrderId();
  const orderData = {
    id: orderId,
    chat_id: chatId,
    customer: conversation.order,
    items: conversation.cart,
    status: 'pending',
    created_at: new Date().toISOString()
  };

  // Salva ordine (in un'applicazione reale, salva su database)
  saveOrder(orderData);

  // Invia notifica all'admin
  sendOrderNotification(orderData);

  // Conferma al cliente
  const confirmMessage = `✅ *Ordine Confermato!*\n\nGrazie ${conversation.order.name}!\n\nIl tuo ordine #${orderId} è stato ricevuto.\n\n📦 *Stato:* ${config.order_states.pending}\n⏰ *Consegna:* ${conversation.order.delivery_slot.label}\n💰 *Totale:* €${calculateTotal(conversation.cart).toFixed(2)}\n\nTi contatteremo presto per conferma!`;

  bot.sendMessage(chatId, confirmMessage, { parse_mode: 'Markdown' });

  // Reset conversazione
  conversations.delete(chatId);
}

function cancelOrder(chatId) {
  conversations.delete(chatId);
  bot.sendMessage(chatId, '❌ Ordine annullato. Puoi iniziare un nuovo ordine quando vuoi!');
}

function showDeliveryInfo(chatId) {
  let message = 'ℹ️ *Informazioni Consegne*\n\n';
  message += '🚚 *Consegne disponibili nelle province:*\n';
  message += config.delivery_provinces.join(', ') + '\n\n';
  message += '⏰ *Fasce orarie:*\n';
  config.delivery_slots.forEach(slot => {
    message += `• ${slot.label}\n`;
  });
  message += '\n💰 *Costo consegna:* GRATIS\n';
  message += '📦 *Ordine minimo:* €15.00';

  bot.sendMessage(chatId, message, { parse_mode: 'Markdown' });
}

function showContactInfo(chatId) {
  const message = '📞 *Contatti*\n\n🧀 *Mozzarella d\'Autore*\n\n📍 *Sede:* Via della Mozzarella, 123\n84030 Paestum (SA)\n\n📱 *Telefono:* +39 123 456 7890\n📧 *Email:* info@mozzarelladautore.it\n\n⏰ *Orari:* Martedì - Domenica\n7:00 - 19:00\n\n🔔 *Chiuso il lunedì*';

  bot.sendMessage(chatId, message, { parse_mode: 'Markdown' });
}

// Funzioni di utilità
function generateOrderId() {
  return 'ORD-' + Date.now().toString(36).toUpperCase();
}

function calculateTotal(cart) {
  return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
}

function saveOrder(orderData) {
  // In un'applicazione reale, salva su database
  const ordersFile = path.join(__dirname, 'orders.json');
  let orders = [];

  try {
    if (fs.existsSync(ordersFile)) {
      orders = JSON.parse(fs.readFileSync(ordersFile, 'utf8'));
    }
  } catch (error) {
    console.error('Errore lettura ordini:', error);
  }

  orders.push(orderData);

  try {
    fs.writeFileSync(ordersFile, JSON.stringify(orders, null, 2));
  } catch (error) {
    console.error('Errore salvataggio ordine:', error);
  }
}

function sendOrderNotification(orderData) {
  if (!config.admin_chat_id) return;

  let total = calculateTotal(orderData.items);
  let notification = `🚨 *NUOVO ORDINE!*\n\n`;
  notification += `📋 *Ordine:* #${orderData.id}\n`;
  notification += `👤 *Cliente:* ${orderData.customer.name}\n`;
  notification += `📞 *Tel:* ${orderData.customer.phone}\n`;
  notification += `📍 *Indirizzo:* ${orderData.customer.address}\n`;
  notification += `⏰ *Consegna:* ${orderData.customer.delivery_slot.label}\n`;
  notification += `💳 *Pagamento:* ${orderData.customer.payment_method.label}\n\n`;
  notification += `🧀 *Prodotti:*\n`;

  orderData.items.forEach(item => {
    notification += `${item.name} x${item.quantity} = €${(item.price * item.quantity).toFixed(2)}\n`;
  });

  notification += `\n💰 *Totale: €${total.toFixed(2)}*`;

  bot.sendMessage(config.admin_chat_id, notification, {
    parse_mode: 'Markdown'
  });
}

// Gestione errori
bot.on('polling_error', (error) => {
  console.error('Errore polling:', error.code);
});

bot.on('webhook_error', (error) => {
  console.error('Errore webhook:', error);
});

// Avvio del bot
console.log('🧀 Bot Mozzarella d\'Autore è in esecuzione...');

// Messaggio di benvenuto all'avvio
if (config.admin_chat_id) {
  bot.sendMessage(config.admin_chat_id, '🤖 Bot avviato con successo! Sono pronto per ricevere ordini.');
}