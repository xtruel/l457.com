# Configurazione DNS per l457.com

## 📋 Record DNS Necessari

Per rendere il sito accessibile tramite https://l457.com, devi configurare i seguenti record DNS presso il tuo provider di dominio:

### 🔹 Record A (per il dominio principale)

**Nome/Host:** `@` o `l457.com`  
**Tipo:** `A`  
**Valore/Destinazione:**
- `185.199.108.153`
- `185.199.109.153`
- `185.199.110.153`
- `185.199.111.153`

*Nota: Aggiungi tutti e 4 gli indirizzi IP come record A separati*

### 🔹 Record CNAME (per il sottodominio www)

**Nome/Host:** `www`  
**Tipo:** `CNAME`  
**Valore/Destinazione:** `xtruel.github.io`

## 🛠️ Istruzioni per Provider Comuni

### Cloudflare
1. Accedi al dashboard Cloudflare
2. Seleziona il dominio `l457.com`
3. Vai su "DNS" > "Records"
4. Aggiungi i record A e CNAME come sopra
5. Assicurati che il proxy sia DISABILITATO (nuvola grigia)

### GoDaddy
1. Accedi al tuo account GoDaddy
2. Vai su "My Products" > "DNS"
3. Trova `l457.com` e clicca "Manage"
4. Aggiungi i record come specificato sopra

### Namecheap
1. Accedi al pannello Namecheap
2. Vai su "Domain List" > "Manage"
3. Clicca su "Advanced DNS"
4. Aggiungi i record DNS

## ⏱️ Tempi di Propagazione

- **Attivazione GitHub Pages:** 5-10 minuti
- **Propagazione DNS:** 24-48 ore (di solito 2-6 ore)
- **Certificato SSL:** Automatico dopo la verifica DNS

## 🔍 Verifica Configurazione

Dopo aver configurato i DNS, puoi verificare con:

```bash
# Verifica record A
nslookup l457.com

# Verifica record CNAME
nslookup www.l457.com
```

## 📞 Supporto

Se hai problemi:
1. Controlla che i record DNS siano corretti
2. Aspetta almeno 2-6 ore per la propagazione
3. Verifica che GitHub Pages sia abilitato con dominio personalizzato
4. Controlla che il file CNAME contenga "l457.com"

---

**✅ Una volta completata la configurazione DNS, il sito sarà accessibile su:**
- https://l457.com
- https://www.l457.com
- https://xtruel.github.io/l457.com (URL temporaneo)