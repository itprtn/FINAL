# 🚀 Système de Lead Generation - Premunia CRM

Système complet d'industrialisation de la génération et relance de leads via landing pages internes, formulaires multi-étapes, et intégration publicitaire (Facebook/TikTok).

## 📋 Vue d'ensemble

Ce système permet de créer, gérer et optimiser des campagnes de génération de leads avec :

- **Landing Page Builder** : Création de pages de conversion avec éditeur WYSIWYG
- **Form Engine** : Formulaires multi-étapes avec validation et gestion RGPD
- **UTM Link Generator** : Gestion des paramètres de tracking et liens JWT
- **Webhooks** : Intégration Meta/TikTok Lead Ads
- **Analytics** : Tableau de bord complet des performances
- **CRM Integration** : Liaison automatique avec votre CRM Supabase existant

## 🎯 Objectifs SMART

- **≥ 2,000 leads/mois** via campagnes multi-canaux
- **CPL ≤ 12€** avec optimisation continue
- **CVR ≥ 12%** grâce à l'optimisation des LP et formulaires

## 🏗️ Architecture technique

### Base de données (Supabase/PostgreSQL)

Le système s'intègre parfaitement avec votre CRM existant en ajoutant uniquement les tables nécessaires :

```sql
-- Tables principales ajoutées
public.leads           -- Gestion des leads générés
public.landing_pages   -- Pages de conversion
public.forms           -- Schémas de formulaires
public.form_submissions -- Soumissions de formulaires
public.events          -- Tracking des interactions
public.consents        -- Gestion RGPD
public.campaigns_ads   -- Campagnes publicitaires
public.ad_costs        -- Coûts publicitaires
```

### Edge Functions (Supabase)

- **`meta-lead`** : Webhook Meta Lead Ads
- **`tiktok-lead`** : Webhook TikTok Lead Gen
- **`track`** : Tracking générique des événements

### Composants React

- **`LandingPageBuilder`** : Éditeur de landing pages
- **`FormEngine`** : Créateur de formulaires multi-étapes
- **`UTMLinkGenerator`** : Générateur de liens UTM/JWT
- **`LeadDashboard`** : Tableau de bord analytique

## 🚀 Installation et configuration

### 1. Prérequis

- Projet Supabase existant avec CRM
- Node.js 18+ et npm/yarn
- Comptes Meta Business et TikTok Ads

### 2. Migration de base de données

```bash
# Exécuter la migration
supabase db push

# Ou manuellement
psql -h your-db-host -U your-user -d your-db -f supabase/migrations/20250825_leadgen_schema.sql
```

### 3. Configuration des Edge Functions

```bash
# Déployer les fonctions
supabase functions deploy meta-lead
supabase functions deploy tiktok-lead
supabase functions deploy track
```

### 4. Variables d'environnement

```env
# Supabase
SUPABASE_URL=your-project-url
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Meta Lead Ads
META_APP_SECRET=your-app-secret
META_VERIFY_TOKEN=your-verify-token

# TikTok Lead Gen
TIKTOK_CLIENT_KEY=your-client-key
TIKTOK_CLIENT_SECRET=your-client-secret

# Email (Brevo/SMTP)
BREVO_API_KEY=your-brevo-key
SMTP_HOST=your-smtp-host
SMTP_PORT=587
SMTP_USER=your-smtp-user
SMTP_PASS=your-smtp-pass
```

## 📱 Utilisation

### Landing Page Builder

1. **Créer une nouvelle page**
   - Choisir un template (Mutuelle Santé, Assurance Emprunteur, etc.)
   - Personnaliser le contenu avec l'éditeur WYSIWYG
   - Ajouter des blocs (Hero, Formulaire, Preuves sociales, etc.)

2. **Configurer le formulaire**
   - Définir les étapes et champs
   - Configurer la validation et les règles conditionnelles
   - Gérer les consentements RGPD

3. **Publier et diffuser**
   - Générer des liens UTM personnalisés
   - Intégrer dans vos campagnes publicitaires

### Form Engine

1. **Structure multi-étapes**
   - Étape 1 : Informations personnelles
   - Étape 2 : Situation familiale
   - Étape 3 : Besoins spécifiques

2. **Validation avancée**
   - Règles par champ (requis, format, longueur)
   - Validation conditionnelle
   - Messages d'erreur personnalisés

3. **Gestion RGPD**
   - Consentement explicite
   - Log des consentements
   - Politique de confidentialité

### UTM Link Generator

1. **Créer des liens UTM**
   - Source, moyen, campagne, contenu, terme
   - Templates prédéfinis par canal

2. **Liens JWT sécurisés**
   - Pré-remplissage automatique des formulaires
   - Claims personnalisables
   - Expiration configurable

3. **Tracking et analytics**
   - Comptage des clics
   - Suivi des conversions
   - Calcul du ROI

## 🔗 Intégrations

### Meta Lead Ads

```typescript
// Webhook configuré pour recevoir les leads
POST /functions/v1/meta-lead

// Headers requis
X-Hub-Signature: HMAC SHA-256 signature
Content-Type: application/json

// Payload automatiquement traité
{
  "entry": [{
    "changes": [{
      "value": {
        "field_data": [
          {"name": "email", "values": ["user@example.com"]},
          {"name": "first_name", "values": ["John"]}
        ]
      }
    }]
  }]
}
```

### TikTok Lead Gen

```typescript
// Webhook TikTok configuré
POST /functions/v1/tiktok-lead

// Traitement automatique des leads
// Intégration avec le système de scoring
```

### Tracking des événements

```typescript
// Client-side tracking
fetch('/functions/v1/track', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    event_name: 'form_submitted',
    properties: { form_id: 'mutuelle-sante', step: 3 },
    lead_id: 'lead_123'
  })
});
```

## 📊 Analytics et reporting

### Métriques clés

- **Volume de leads** : Total, nouveaux, par source
- **Taux de conversion** : Global et par campagne
- **Coût par lead** : CPL par canal et campagne
- **ROI** : Retour sur investissement publicitaire

### Tableau de bord

- Vue d'ensemble des performances
- Analyse par campagne
- Répartition par source
- Tendances temporelles

### Export et reporting

- Export CSV/Excel des données
- Rapports automatisés
- Alertes de performance

## 🔒 Conformité RGPD

### Gestion des consentements

- Consentement explicite requis
- Log détaillé des consentements
- Politique de confidentialité intégrée
- Droit à l'oubli

### Sécurité des données

- Chiffrement des données sensibles
- Accès restreint aux données
- Audit trail complet
- Sauvegarde sécurisée

## 🚀 Déploiement

### Production

```bash
# Build de production
npm run build

# Déploiement Vercel
vercel --prod

# Ou Netlify
netlify deploy --prod
```

### Staging

```bash
# Environnement de test
npm run build:staging
vercel
```

## 🧪 Tests

### Tests unitaires

```bash
npm run test
```

### Tests d'intégration

```bash
npm run test:integration
```

### Tests E2E

```bash
npm run test:e2e
```

## 📈 Optimisation et maintenance

### Performance

- Lazy loading des composants
- Optimisation des requêtes Supabase
- Mise en cache des données statiques
- Compression des assets

### Monitoring

- Logs des Edge Functions
- Métriques de performance
- Alertes d'erreur
- Uptime monitoring

### Mises à jour

- Mises à jour automatiques des dépendances
- Tests automatisés avant déploiement
- Rollback en cas de problème
- Documentation des changements

## 🤝 Support et contribution

### Documentation

- [Guide utilisateur](./docs/user-guide.md)
- [Guide développeur](./docs/developer-guide.md)
- [API Reference](./docs/api-reference.md)
- [FAQ](./docs/faq.md)

### Support

- Issues GitHub pour les bugs
- Discussions pour les questions
- Wiki pour les tutoriels
- Email support@premunia.com

### Contribution

1. Fork le projet
2. Créer une branche feature
3. Commiter les changements
4. Pousser vers la branche
5. Ouvrir une Pull Request

## 📄 Licence

Ce projet est propriétaire et confidentiel. Tous droits réservés à Premunia.

## 🏆 Équipe

- **Développement** : Assistant IA Claude
- **Architecture** : Supabase + React + TypeScript
- **Design** : Tailwind CSS + Headless UI
- **Intégrations** : Meta, TikTok, Brevo

---

**Version** : 1.0.0  
**Dernière mise à jour** : 25/08/2024  
**Statut** : En développement
