// PDF generation functionality for order documents
// Note: This is a simplified version. For production, use a proper PDF library like jsPDF

function generateOrderPDF(orderData) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Add title
    doc.setFontSize(20);
    doc.text('BOLLA D\'ORDINE', 105, 20, { align: 'center' });

    // Add company info
    doc.setFontSize(12);
    doc.text('Azienda Agricola Mozzarella d\'Autore', 20, 40);
    doc.text(settings.azienda.indirizzo, 20, 50);
    doc.text('Tel: ' + settings.azienda.telefono, 20, 60);
    doc.text('Email: ' + settings.azienda.email, 20, 70);
    doc.text('P.IVA: ' + settings.azienda.piva, 20, 80);

    // Add order info
    doc.text('Numero Ordine: ' + orderData.numeroOrdine, 120, 40);
    doc.text('Data: ' + orderData.data, 120, 50);
    doc.text('Cliente: ' + orderData.nome, 120, 60);

    // Add customer details
    doc.setFontSize(14);
    doc.text('Dati Cliente:', 20, 100);
    doc.setFontSize(12);
    doc.text(orderData.nome, 20, 110);
    doc.text(orderData.indirizzo, 20, 120);
    doc.text(orderData.citta + ' ' + orderData.cap + ' (' + orderData.provincia + ')', 20, 130);
    doc.text('Tel: ' + orderData.telefono, 20, 140);
    doc.text('Email: ' + orderData.email, 20, 150);

    // Add products table
    doc.setFontSize(14);
    doc.text('Dettaglio Ordine:', 20, 170);

    let yPosition = 180;
    doc.setFontSize(10);

    // Table headers
    doc.text('Prodotto', 20, yPosition);
    doc.text('Peso', 80, yPosition);
    doc.text('Quantità', 110, yPosition);
    doc.text('Prezzo', 140, yPosition);
    doc.text('Totale', 170, yPosition);

    yPosition += 10;

    // Table rows
    orderData.prodotti.forEach(product => {
        doc.text(product.nome, 20, yPosition);
        doc.text(product.peso, 80, yPosition);
        doc.text(product.quantity.toString(), 110, yPosition);
        doc.text('€' + product.prezzo.toFixed(2), 140, yPosition);
        doc.text('€' + (product.prezzo * product.quantity).toFixed(2), 170, yPosition);
        yPosition += 10;
    });

    // Add total
    yPosition += 10;
    doc.setFontSize(12);
    doc.text('Totale Ordine: €' + orderData.totale.toFixed(2), 140, yPosition);

    // Add notes
    doc.setFontSize(10);
    doc.text('* Prezzi indicativi, soggetti a conferma', 20, yPosition + 20);
    doc.text('Documento non fiscale - Ordine soggetto a conferma', 20, yPosition + 30);

    // Add footer
    doc.text('Modalità di pagamento: ' + settings.pagamento.modalita.join(', '), 20, yPosition + 50);
    doc.text('Tempi di consegna: ' + settings.consegna.temi, 20, yPosition + 60);

    // Save the PDF
    doc.save('ordine-' + orderData.numeroOrdine + '.pdf');
}

// For demonstration, here's a simple HTML-based order confirmation
function generateOrderConfirmationHTML(orderData) {
    const confirmationHTML = `
        <div style="max-width: 800px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
            <div style="text-align: center; margin-bottom: 30px;">
                <h1 style="color: #2d5016; font-size: 28px;">ORDINE CONFERMATO</h1>
                <p style="color: #666; font-size: 16px;">Grazie per il tuo ordine! Ti contatteremo presto per confermare i dettagli.</p>
            </div>

            <div style="display: flex; justify-content: space-between; margin-bottom: 30px;">
                <div>
                    <h3 style="color: #2d5016; margin-bottom: 10px;">Azienda Agricola Mozzarella d'Autore</h3>
                    <p style="margin: 5px 0;">${settings.azienda.indirizzo}</p>
                    <p style="margin: 5px 0;">Tel: ${settings.azienda.telefono}</p>
                    <p style="margin: 5px 0;">Email: ${settings.azienda.email}</p>
                    <p style="margin: 5px 0;">P.IVA: ${settings.azienda.piva}</p>
                </div>
                <div style="text-align: right;">
                    <p><strong>Numero Ordine:</strong> ${orderData.numeroOrdine}</p>
                    <p><strong>Data:</strong> ${orderData.data}</p>
                    <p><strong>Cliente:</strong> ${orderData.nome}</p>
                </div>
            </div>

            <div style="border: 1px solid #ddd; padding: 20px; margin-bottom: 20px;">
                <h3 style="color: #2d5016; margin-bottom: 15px;">Dati Cliente</h3>
                <p><strong>Nome:</strong> ${orderData.nome}</p>
                <p><strong>Indirizzo:</strong> ${orderData.indirizzo}</p>
                <p><strong>Città:</strong> ${orderData.citta} ${orderData.cap} (${orderData.provincia})</p>
                <p><strong>Telefono:</strong> ${orderData.telefono}</p>
                <p><strong>Email:</strong> ${orderData.email}</p>
            </div>

            <div style="border: 1px solid #ddd; padding: 20px; margin-bottom: 20px;">
                <h3 style="color: #2d5016; margin-bottom: 15px;">Dettaglio Ordine</h3>
                <table style="width: 100%; border-collapse: collapse;">
                    <thead>
                        <tr style="background-color: #f0f0f0;">
                            <th style="padding: 10px; text-align: left; border: 1px solid #ddd;">Prodotto</th>
                            <th style="padding: 10px; text-align: left; border: 1px solid #ddd;">Peso</th>
                            <th style="padding: 10px; text-align: left; border: 1px solid #ddd;">Quantità</th>
                            <th style="padding: 10px; text-align: left; border: 1px solid #ddd;">Prezzo</th>
                            <th style="padding: 10px; text-align: left; border: 1px solid #ddd;">Totale</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${orderData.prodotti.map(product => `
                            <tr>
                                <td style="padding: 10px; border: 1px solid #ddd;">${product.nome}</td>
                                <td style="padding: 10px; border: 1px solid #ddd;">${product.peso}</td>
                                <td style="padding: 10px; border: 1px solid #ddd;">${product.quantity}</td>
                                <td style="padding: 10px; border: 1px solid #ddd;">€${product.prezzo.toFixed(2)}</td>
                                <td style="padding: 10px; border: 1px solid #ddd;">€${(product.prezzo * product.quantity).toFixed(2)}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
                <div style="text-align: right; margin-top: 20px;">
                    <p style="font-size: 18px; font-weight: bold;">Totale: €${orderData.totale.toFixed(2)}*</p>
                </div>
            </div>

            <div style="background-color: #f9f9f9; padding: 20px; border-left: 4px solid #d4af37;">
                <h4 style="color: #2d5016; margin-bottom: 10px;">Note Importanti</h4>
                <p style="margin: 5px 0;">* Prezzi indicativi, soggetti a conferma</p>
                <p style="margin: 5px 0;">Documento non fiscale - Ordine soggetto a conferma</p>
                <p style="margin: 5px 0;"><strong>Modalità di pagamento:</strong> ${settings.pagamento.modalita.join(', ')}</p>
                <p style="margin: 5px 0;"><strong>Tempi di consegna:</strong> ${settings.consegna.temi}</p>
            </div>

            <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd;">
                <p style="color: #666; font-size: 14px;">Per qualsiasi informazione, non esitare a contattarci!</p>
                <button onclick="window.print()" style="background-color: #2d5016; color: white; padding: 10px 20px; border: none; border-radius: 5px; margin-top: 10px;">Stampa Ordine</button>
            </div>
        </div>
    `;

    return confirmationHTML;
}

// Update the order confirmation function in app.js
function generateOrderConfirmation(orderData) {
    const orderNumber = 'ORD-' + Date.now();
    const orderDate = new Date().toLocaleDateString('it-IT');

    orderData.numeroOrdine = orderNumber;
    orderData.data = orderDate;

    // Create a modal or new page with the confirmation
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
    modal.innerHTML = `
        <div class="bg-white rounded-lg shadow-xl max-w-4xl max-h-[90vh] overflow-y-auto">
            <div class="p-6">
                <div class="flex justify-between items-center mb-4">
                    <h2 class="text-2xl font-bold text-green-800">Ordine Confermato!</h2>
                    <button onclick="this.closest('.fixed').remove()" class="text-gray-500 hover:text-gray-700">
                        <i class="fas fa-times text-2xl"></i>
                    </button>
                </div>
                ${generateOrderConfirmationHTML(orderData)}
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    // Optional: Generate PDF if jsPDF is available
    if (typeof window.jspdf !== 'undefined') {
        setTimeout(() => {
            generateOrderPDF(orderData);
        }, 1000);
    }
}