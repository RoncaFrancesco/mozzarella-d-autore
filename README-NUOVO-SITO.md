# 🧀 Mozzarella d'Autore - Sito Vetrina

## 🎯 Panoramica del Progetto

Sito vetrina one-page per Mozzarella d'Autore, azienda agricola familiare produttrice di mozzarella di bufala campana DOP. Il sito si concentra sulla presentazione aziendale e reindirizza gli utenti a Telegram per gli ordini.

## ✨ Caratteristiche Principali

### 🏗️ Struttura del Sito
- **One-page design**: Sito a pagina singola scorrevole
- **Layout responsive**: Perfetto su mobile e desktop
- **Design premium**: Elegante e professionale
- **Performance ottimizzata**: Caricamento rapido

### 📱 Sezioni del Sito
1. **Header Navigazione**: Menu fisso con link e pulsante Telegram
2. **Hero Section**: Immagine d'impatto con call-to-action principale
3. **Chi Siamo**: Storia della famiglia e azienda
4. **Certificazioni DOP**: Badge e spiegazione qualità
5. **Le Nostre Bufale**: Gallery immagini del benessere animale
6. **Il Nostro Metodo**: 4 pilastri della produzione artigianale
7. **Come Ordinare**: Sezione con pulsante Telegram gigante
8. **Contatti**: Informazioni aziendali e social
9. **Footer**: Copyright e link social

### 🎨 Design Specifics
- **Colori**: Verde natura (#2E7D32), Oro DOP (#FFD54F), Bianco sporco (#FAFAFA)
- **Tipografia**: Playfair Display (titoli), Open Sans (testo)
- **Icone**: Font Awesome integrato
- **Animazioni**: Fade-in scroll, hover effects
- **Mobile-first**: Design ottimizzato per mobile

### 🚀 Performance
- **CSS inline**: Stile embedded per velocità
- **JavaScript minimo**: Solo funzionalità essenziali
- **Nessun framework**: No Bootstrap, jQuery o librerie pesanti
- **Google Fonts**: Preconnect per ottimizzazione
- **Immagini ottimizzate**: Formati moderni consigliati

## 📂 Struttura File

```
MOZZARELLE/
├── index.html              # Sito principale (tutto incluso)
├── images/                 # Cartella immagini
│   ├── hero-bufale.jpg     # Immagine hero principale
│   ├── famiglia.jpg        # Foto famiglia
│   ├── processo-produttivo.jpg
│   ├── bufale-pascolo.jpg
│   ├── bufala1.jpg
│   └── bufala2.jpg
└── README-NUOVO-SITO.md   # Questo file
```

## 🔧 Personalizzazione

### Cambiare Informazioni Aziendali
Modifica questi elementi in `index.html`:

```html
<!-- Logo e titolo -->
<div class="logo-text">
    <h1>Mozzarella d'Autore</h1>
    <p>Tradizione dal 1958</p>
</div>

<!-- Anno di fondazione -->
<p class="subtitle">Tradizione familiare dal 1958</p>

<!-- Contatti -->
<p>Via della Mozzarella, 123<br>84030 Paestum (SA)</p>
<p>+39 123 456 7890</p>
<p>info@mozzarelladautore.it</p>
```

### Configurazione Telegram
Sostituisci il link Telegram:

```html
<a href="https://t.me/TUO_USERNAME_O_NUMERO" class="telegram-cta-giant" target="_blank">
    💬 Chatta con noi su Telegram
</a>
```

### Modificare Colori
Cambia le variabili CSS:

```css
:root {
    --primary: #2E7D32;        /* Verde principale */
    --secondary: #FFD54F;      /* Oro DOP */
    --telegram: #0088cc;       /* Blu Telegram */
    /* ... altre variabili */
}
```

## 📱 Mobile Optimization

Il sito è ottimizzato per mobile con:
- Menu hamburger responsive
- Touch-friendly buttons
- Font scalabili
- Layout fluido
- Performance ottimizzata

## 🔍 SEO Basics

Meta tag configurati per SEO:

```html
<title>Mozzarella d'Autore - Tradizione Artigianale dal 1958</title>
<meta name="description" content="Mozzarella di bufala DOP artigianale. Produzione familiare in Campania dal 1958. Ordina prodotti freschi su Telegram.">
<meta name="keywords" content="mozzarella bufala, DOP, campania, artigianale, tradizione">
```

## 🌐 Social Media Links

Modifica i link social nel footer:

```html
<a href="https://facebook.com/tua-pagina" target="_blank">
    <i class="fab fa-facebook"></i>
</a>
<a href="https://instagram.com/tuo-profilo" target="_blank">
    <i class="fab fa-instagram"></i>
</a>
<a href="https://t.me/tuo-username" target="_blank">
    <i class="fab fa-telegram"></i>
</a>
```

## 🚀 Deployment

Il sito è pronto per essere caricato su qualsiasi hosting web statico:

1. **Hosting compatibile**: Netlify, Vercel, GitHub Pages, qualsiasi hosting statico
2. **Requisiti minimi**: Supporto HTML, CSS, JavaScript
3. **Upload**: Caricare la cartella `MOZZARELLE` completa
4. **Dominio**: Configurare il dominio personalizzato

## ✅ Checklist Pre-Lancio

- [ ] Sostituire link Telegram con quello reale
- [ ] Aggiornare informazioni contatti aziendali
- [ ] Caricare immagini reali nella cartella `images/`
- [ ] Verificare tutti i link funzionanti
- [ ] Testare su mobile e desktop
- [ ] Verificare responsive design
- [ ] Controllare velocità di caricamento
- [ ] Aggiornare meta tag SEO se necessario

## 🎯 Risultato Atteso

Il sito presenta:
- **Professionalità**: Design elegante e curato
- **Chiarezza**: Messaggio aziendale immediato
- **Conversione**: CTA chiare verso Telegram
- **Affidabilità**: Zero bug, perfetto funzionamento
- **Performance**: Velocità ottimale per SEO

---

**Mood**: Azienda agricola tradizionale con approccio moderno alla vendita digitale 🧀✨