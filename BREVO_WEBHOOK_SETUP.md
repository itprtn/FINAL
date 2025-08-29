# Configuration Webhook Brevo pour Tracking Email

## 📧 Vue d'ensemble

Ce guide explique comment configurer un webhook Brevo pour recevoir les événements de tracking email en temps réel (ouvertures, clics, bounces, etc.) et mettre à jour automatiquement votre base de données.

## 🔧 Prérequis

1. **Fonction Edge déployée** : Le webhook `supabase/functions/brevo-webhook/index.ts` doit être déployé
2. **Accès à Brevo** : Compte Brevo avec droits d'administration
3. **Scripts SQL exécutés** : Les scripts `10-fix-campaign-tracking-inconsistency.sql` et `11-setup-brevo-webhook.sql`

## 🚀 Étapes de Configuration

### 1. **Déployer la fonction Edge**

```bash
# Dans le répertoire du projet
supabase functions deploy brevo-webhook
```

### 2. **Exécuter les scripts SQL**

Dans votre **Supabase SQL Editor**, exécutez :

```sql
-- Script de correction du tracking existant
\i scripts/10-fix-campaign-tracking-inconsistency.sql

-- Script de configuration du webhook
\i scripts/11-setup-brevo-webhook.sql
```

### 3. **Configurer l'URL du webhook**

Mettez à jour la configuration dans Supabase :

```sql
UPDATE public.brevo_webhook_config
SET
  webhook_url = 'https://votre-projet.supabase.co/functions/v1/brevo-webhook',
  secret_key = 'votre-cle-secrete-brevo'
WHERE id = 1;
```

### 4. **Configuration dans Brevo**

#### a) Accéder aux webhooks
1. Connectez-vous à votre compte Brevo
2. Allez dans **Automation** → **Webhooks**
3. Cliquez sur **"Create a webhook"**

#### b) Configurer le webhook
```
Name: Email Tracking Webhook
URL: https://votre-projet.supabase.co/functions/v1/brevo-webhook
Method: POST
```

#### c) Événements à tracker
Cochez **TOUS** ces événements :
- [x] **Delivered** - Email délivré
- [x] **Opened** - Email ouvert
- [x] **Clicked** - Lien cliqué
- [x] **Bounce** - Email rejeté
- [x] **Complaint** - Plainte spam
- [x] **Unsubscribed** - Désabonnement

#### d) Authentification (optionnel mais recommandé)
- **Secret key** : Utilisez la même clé que dans la configuration SQL
- **HTTP Auth** : Optionnel, Supabase gère déjà l'authentification

#### e) Filtres (optionnel)
- **Domain** : Votre domaine d'envoi
- **Tags** : Pour filtrer par campagne si nécessaire

### 5. **Tester le webhook**

#### a) Test depuis Brevo
1. Dans la configuration webhook, cliquez **"Test"**
2. Sélectionnez un événement (ex: "delivered")
3. Brevo enverra un exemple d'événement

#### b) Vérifier les logs
```sql
-- Vérifier les événements reçus
SELECT * FROM brevo_webhook_logs
ORDER BY processed_at DESC
LIMIT 10;

-- Vérifier la santé du webhook
SELECT * FROM brevo_webhook_monitoring;
```

## 📊 Événements Trackés

### **Delivered** (Délivré)
- Met à jour `statut = 'envoye'`
- Enregistre `date_envoi`
- Confirme que l'email a atteint la boîte de réception

### **Opened** (Ouvert)
- Met à jour `statut = 'ouvert'`
- Enregistre `date_ouverture`
- Indique que le destinataire a ouvert l'email

### **Clicked** (Cliqué)
- Met à jour `statut = 'clique'`
- Enregistre `date_clic`
- Stocke l'URL cliquée dans `erreur_message`

### **Bounce** (Rejet)
- Met à jour `statut = 'echec'`
- Message d'erreur : "Email bounced"

### **Complaint** (Plainte)
- Met à jour `statut = 'echec'`
- Message d'erreur : "Spam complaint"

### **Unsubscribed** (Désabonnement)
- Met à jour `statut = 'echec'`
- Message d'erreur : "Unsubscribed"

## 🔍 Monitoring et Dépannage

### **Vérifier la santé du webhook**

```sql
-- Événements des dernières 24h
SELECT * FROM brevo_webhook_monitoring;

-- Détails des événements récents
SELECT
  event_type,
  email,
  success,
  error_message,
  processed_at
FROM brevo_webhook_logs
WHERE processed_at >= now() - INTERVAL '1 hour'
ORDER BY processed_at DESC;
```

### **Problèmes courants**

#### **Webhook ne reçoit pas d'événements**
1. Vérifiez que l'URL est accessible publiquement
2. Confirmez que les événements sont activés dans Brevo
3. Testez le webhook depuis l'interface Brevo

#### **Événements reçus mais non traités**
```sql
-- Vérifier les erreurs
SELECT * FROM brevo_webhook_logs
WHERE success = false
ORDER BY processed_at DESC;
```

#### **Emails non trouvés**
- Vérifiez que `email_destinataire` correspond exactement
- Assurez-vous que les enregistrements existent dans `envois_email`

## 🎯 Avantages du Webhook

### **Temps réel**
- Mises à jour instantanées des statistiques
- Pas besoin d'API polling

### **Précision**
- Données directement de Brevo
- Évite les décalages de synchronisation

### **Fiabilité**
- Logs complets des événements
- Possibilité de rejouer les événements manqués

### **Performance**
- Mise à jour automatique des statistiques de campagne
- Pas de charge supplémentaire sur votre application

## 📈 Métriques Améliorées

Avec le webhook, vos statistiques deviennent :

1. **Temps réel** : Mise à jour instantanée
2. **Précises** : Données directement du fournisseur
3. **Complètes** : Tous les événements trackés
4. **Auditables** : Historique complet des événements

## 🔄 Workflow Complet

1. **Envoi** : Email envoyé via API Brevo
2. **Tracking** : Fonction RPC crée l'enregistrement individuel
3. **Webhook** : Brevo notifie les événements en temps réel
4. **Mise à jour** : Statistiques automatiquement mises à jour
5. **Affichage** : Interface utilisateur montre les données à jour

---

## 📞 Support

Si vous rencontrez des problèmes :

1. Vérifiez les logs : `SELECT * FROM brevo_webhook_logs WHERE success = false`
2. Testez le webhook depuis Brevo
3. Vérifiez la configuration dans `brevo_webhook_config`

Le système est maintenant configuré pour un tracking email professionnel et temps réel ! 🎉