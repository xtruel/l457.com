# L457.com - E-commerce Streetwear

Sito web e-commerce per il brand L457, specializzato in magliette e felpe streetwear.

## Deployment Status
Website is deployed via GitHub Actions workflow.

## Caratteristiche

- **Design Moderno**: Interfaccia responsive e moderna
- **E-commerce Completo**: Carrello, checkout e gestione prodotti
- **Galleria Media**: Caricamento e visualizzazione di immagini e video
- **Mobile-First**: Ottimizzato per dispositivi mobili
- **Performance**: Caricamento veloce e animazioni fluide

## Struttura del Progetto

```
l457.com/
├── index.html          # Homepage principale
├── styles.css          # Stili CSS
├── script.js           # Funzionalità JavaScript
├── assets/             # Cartella per media (immagini, video)
└── README.md           # Documentazione
```

## Configurazione GitHub Pages

### 1. Crea un Repository GitHub

1. Vai su [GitHub](https://github.com) e crea un nuovo repository
2. Nomina il repository `l457.com` o un nome a tua scelta
3. Assicurati che sia pubblico
4. Non inizializzare con README (lo abbiamo già)

### 2. Carica i File

```bash
# Inizializza git nella cartella del progetto
git init

# Aggiungi tutti i file
git add .

# Fai il primo commit
git commit -m "Initial commit - L457 e-commerce site"

# Aggiungi il repository remoto (sostituisci USERNAME con il tuo username GitHub)
git remote add origin https://github.com/USERNAME/l457.com.git

# Carica i file su GitHub
git push -u origin main
```

### 3. Attiva GitHub Pages

1. Vai nelle **Settings** del tuo repository
2. Scorri fino alla sezione **Pages**
3. In **Source**, seleziona **Deploy from a branch**
4. Seleziona **main** branch e **/ (root)**
5. Clicca **Save**

### 4. Configura il Dominio Personalizzato

1. Nelle impostazioni di GitHub Pages, trova **Custom domain**
2. Inserisci `l457.com`
3. Clicca **Save**
4. GitHub creerà un file `CNAME` automaticamente

### 5. Configura il DNS del Dominio

Nel pannello di controllo del tuo provider di dominio (dove hai acquistato l457.com):

#### Opzione A: Apex Domain (l457.com)
```
Type: A
Name: @
Value: 185.199.108.153

Type: A
Name: @
Value: 185.199.109.153

Type: A
Name: @
Value: 185.199.110.153

Type: A
Name: @
Value: 185.199.111.153
```

#### Opzione B: Subdomain (www.l457.com)
```
Type: CNAME
Name: www
Value: USERNAME.github.io
```

### 6. Verifica HTTPS

1. Torna nelle impostazioni GitHub Pages
2. Assicurati che **Enforce HTTPS** sia attivato
3. Potrebbe richiedere alcune ore per l'attivazione del certificato SSL

## Personalizzazione

### Aggiungere Prodotti

Modifica l'array `products` in `script.js`:

```javascript
products.push({
    id: 7,
    name: "Nome Prodotto",
    price: 39.99,
    category: "magliette", // o "felpe"
    image: "path/to/image.jpg",
    description: "Descrizione del prodotto"
});
```

### Modificare Colori e Stili

Modifica le variabili CSS in `styles.css`:

```css
:root {
    --primary-color: #ff6b6b;
    --secondary-color: #4ecdc4;
    --accent-color: #45b7d1;
}
```

### Aggiungere Media

1. Carica immagini e video nella cartella `assets/`
2. Aggiorna i percorsi in `script.js` nell'oggetto `mediaItems`

## Funzionalità Implementate

- ✅ Homepage responsive
- ✅ Catalogo prodotti
- ✅ Carrello della spesa
- ✅ Galleria immagini e video
- ✅ Caricamento file
- ✅ Navigazione mobile
- ✅ Animazioni CSS
- ✅ Notifiche utente

## Prossimi Sviluppi

- [ ] Sistema di pagamento (Stripe/PayPal)
- [ ] Backend per gestione ordini
- [ ] Sistema di autenticazione utenti
- [ ] Dashboard amministratore
- [ ] Integrazione con social media
- [ ] SEO optimization
- [ ] Analytics e tracking

## Supporto

Per domande o supporto, contatta: info@l457.com

## Licenza

© 2024 L457. Tutti i diritti riservati.