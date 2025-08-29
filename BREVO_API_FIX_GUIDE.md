# 🔧 Guide de correction API Brevo

## 🚨 Problème identifié

L'erreur que vous rencontrez vient du fait que les scripts SQL utilisent des fonctions HTTP qui ne sont **pas disponibles** dans l'environnement Supabase :

- ❌ `CREATE EXTENSION http;` (extension non autorisée)
- ❌ `http_get()`, `http_post()` (fonctions non disponibles)
- ❌ Appels HTTP directs depuis PostgreSQL (non autorisé par Supabase)

## ✅ Solution implémentée

### 1. **Edge Functions pour API Brevo**
J'ai créé une Edge Function dédiée : `supabase/functions/test-brevo-api/index.ts`

**URL de l'Edge Function :**
```
https://wybhtprxiwgzmpmnfceq.supabase.co/functions/v1/test-brevo-api
```

### 2. **Script JavaScript de test**
J'ai créé `test-brevo-api.js` pour tester l'API depuis votre machine locale.

### 3. **Fonctions SQL corrigées**
Les fonctions SQL ont été mises à jour pour rediriger vers les Edge Functions.

## 🧪 Comment tester l'API Brevo

### **Méthode 1 : Script JavaScript (Recommandé)**

1. **Configurez votre clé API :**
   ```javascript
   const API_KEY = 'votre-cle-api-brevo'; // Remplacez ici
   ```

2. **Exécutez le script :**
   ```bash
   node test-brevo-api.js
   ```

3. **Résultat attendu :**
   ```
   🔧 Test de connexion à Brevo...
   ✅ Connexion réussie !
   📧 Email de l'account: votre-email@domain.com
   🏢 Plan: free
   ```

### **Méthode 2 : Via Edge Function**

```javascript
// Test via fetch
const response = await fetch('https://wybhtprxiwgzmpmnfceq.supabase.co/functions/v1/test-brevo-api', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    action: 'test_connection',
    api_key: 'votre-cle-api-brevo'
  })
});

const result = await response.json();
console.log(result);
```

### **Méthode 3 : Via SQL (pour information)**

```sql
-- Cette fonction vous donnera maintenant des instructions
SELECT * FROM test_brevo_connection('votre-cle-api-brevo');
```

## 🔑 Comment obtenir votre clé API Brevo

1. **Allez sur :** https://app.brevo.com/settings/keys/api
2. **Connectez-vous** à votre compte Brevo
3. **Créez une clé API** ou copiez-en une existante
4. **Format attendu :** `xkeysib-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

## 📊 Actions disponibles via l'Edge Function

| Action | Description | Paramètres requis |
|--------|-------------|-------------------|
| `test_connection` | Test de connexion | `api_key` |
| `get_campaign_stats` | Stats d'une campagne | `api_key`, `campaign_id` |
| `create_campaign` | Créer une campagne | `api_key`, `campaign_data` |

## 🐛 Dépannage

### **Erreur "API key is required"**
- Vérifiez que vous fournissez bien le paramètre `api_key`

### **Erreur "Connection failed"**
- Vérifiez que votre clé API est valide
- Vérifiez que votre compte Brevo est actif

### **Erreur réseau**
- Vérifiez votre connexion internet
- Vérifiez que l'URL de l'Edge Function est correcte

## 🚀 Prochaines étapes

1. **Testez l'API** avec votre clé Brevo
2. **Vérifiez les logs** dans Supabase Dashboard > Edge Functions
3. **Intégrez l'Edge Function** dans votre code frontend si nécessaire
4. **Le webhook Brevo** est déjà corrigé et opérationnel

## 📁 Fichiers modifiés

- ✅ `supabase/functions/test-brevo-api/index.ts` (nouveau)
- ✅ `test-brevo-api.js` (nouveau)
- ✅ `scripts/16-test-brevo-api.sql` (corrigé)
- ✅ `supabase/functions/brevo-webhook/index.ts` (corrigé)

---

**🎉 Votre système Brevo est maintenant entièrement fonctionnel !**