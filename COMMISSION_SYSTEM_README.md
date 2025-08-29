# 🧮 Système de Calcul de Commissions - Documentation Complète

## Vue d'ensemble

Le système de calcul de commissions a été complètement refactorisé pour créer un CRM moderne et intégré. Cette version remplace la fonction Google Sheets originale par une architecture modulaire, scalable et maintenable utilisant React, Node.js et Supabase.

## 🚀 Fonctionnalités Principales

### ✅ Refactorisation Complète
- **Service modulaire** remplaçant la fonction Google Sheets
- **Calcul automatique** des commissions par compagnie d'assurance
- **Support multi-compagnies** avec configurations flexibles
- **Gestion d'erreurs robuste** avec logging détaillé

### 📊 Rapports et Analytics Avancés
- **Dashboards interactifs** avec Chart.js
- **Statistiques temps réel** sur les commissions
- **Rapports par compagnie** et par commercial
- **Évolution mensuelle** des revenus

### 🔐 Sécurité et Authentification
- **JWT Authentication** pour la sécurité
- **Multi-tenancy** support
- **Rôles et permissions** flexibles
- **Audit logging** complet

### 📧 Automatisation Email
- **Notifications automatiques** avec Nodemailer
- **Rapports périodiques** par email
- **Alertes d'anomalies** en temps réel
- **Templates personnalisables**

### 🔄 Intégrations API
- **Synchronisation Google Sheets** (bidirectionnelle)
- **Export PDF/Excel** automatisé
- **Webhooks temps réel** pour les mises à jour
- **APIs REST complètes** pour toutes les fonctionnalités

### ⚡ Optimisations Performance
- **Mise en cache Redis** pour les calculs fréquents
- **Traitement asynchrone** des calculs lourds
- **Indexation optimisée** de la base de données
- **Batch processing** pour les gros volumes

## 🏗️ Architecture

```
lib/
├── commission-service.ts      # Service principal de calcul
├── types.ts                   # Types TypeScript étendus
└── supabase.ts               # Client base de données

scripts/
├── 23-create-commission-system-tables.sql  # Migration DB
└── 24-test-commission-system.js            # Tests

components/
├── analytics/
│   ├── CommercialPerformanceAnalytics.tsx
│   └── CommissionAnalytics.tsx
└── ui/
    └── CommissionDashboard.tsx

supabase/
└── functions/
    ├── commission-calculator/
    └── commission-notifier/
```

## 📋 Prérequis

- **Node.js** 18+
- **Supabase** account
- **React** 18+
- **TypeScript** 5+
- **PostgreSQL** (via Supabase)

## 🛠️ Installation

### 1. Configuration de la base de données

```bash
# Exécuter le script de migration
psql -h your-supabase-host -U postgres -d postgres -f scripts/23-create-commission-system-tables.sql
```

### 2. Variables d'environnement

```env
# .env.local
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key

# Email configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# JWT Configuration
JWT_SECRET=your-jwt-secret
JWT_EXPIRES_IN=24h

# Redis (optionnel)
REDIS_URL=redis://localhost:6379

# Google Sheets API (optionnel)
GOOGLE_SHEETS_CLIENT_ID=your-client-id
GOOGLE_SHEETS_CLIENT_SECRET=your-client-secret
```

### 3. Installation des dépendances

```bash
npm install
```

### 4. Tests

```bash
# Tester le système de commissions
node scripts/24-test-commission-system.js
```

## 💻 Utilisation

### Calcul de Commissions - API

```typescript
import { calculerCommissionMensuel } from './lib/commission-service';

// Calculer toutes les commissions
const result = await calculerCommissionMensuel({
  saveToDatabase: true,
  onProgress: (processed, total) => {
    console.log(`Progress: ${processed}/${total}`);
  }
});

console.log('Calcul terminé:', result);
```

### Calcul pour un Projet Spécifique

```typescript
const result = await calculerCommissionMensuel({
  projetIds: [1, 2, 3],
  batchSize: 10
});
```

### Récupération des Statistiques

```typescript
import { CommissionService } from './lib/commission-service';

const stats = await CommissionService.getCommissionStats();
console.log('Total commissions mensuelles:', stats.total_commissions_mensuelles);
```

### Validation des Données

```typescript
const validation = CommissionService.validateCommissionInput('SPVIE', 150.50);
if (validation.isValid) {
  // Calculer la commission
  const result = CommissionService.calculateCommissionForContract('SPVIE', 150.50);
}
```

## 📊 Configuration des Compagnies

Le système supporte 20+ compagnies d'assurance avec leurs taux spécifiques :

| Compagnie | Taux Année 1 | Taux Récurrent | Type |
|-----------|--------------|----------------|------|
| SPVIE | 40% | 10% | Précompte |
| HARMONIE MUTUELLE | 15% | 15% | Précompte |
| AS SOLUTIONS | 30% | 10% | Précompte |
| SOLLY AZAR | 30% | 10% | Linéaire |
| APRIL | 30% | 10% | Linéaire |
| ... | ... | ... | ... |

### Ajouter une Nouvelle Compagnie

```sql
INSERT INTO commission_configs (compagnie, taux_annee1, taux_recurrent, type_commission, actif)
VALUES ('NOUVELLE_COMPAGNIE', 25.00, 8.00, 'Précompte', true);
```

## 🔧 API REST

### Endpoints Disponibles

#### Calculs de Commissions
```
POST /api/commissions/calculate
GET  /api/commissions/stats
GET  /api/commissions/by-company/:company
GET  /api/commissions/by-project/:projectId
```

#### Configurations
```
GET  /api/commissions/configs
POST /api/commissions/configs
PUT  /api/commissions/configs/:id
```

#### Notifications
```
POST /api/commissions/notifications/send
GET  /api/commissions/notifications/history
```

### Exemple d'Utilisation

```bash
# Calculer toutes les commissions
curl -X POST https://your-api.com/api/commissions/calculate \
  -H "Authorization: Bearer your-jwt-token" \
  -H "Content-Type: application/json" \
  -d '{"saveToDatabase": true}'

# Récupérer les statistiques
curl https://your-api.com/api/commissions/stats \
  -H "Authorization: Bearer your-jwt-token"
```

## 🎨 Interface Utilisateur

### Dashboard de Commissions

```tsx
import { CommissionDashboard } from './components/ui/CommissionDashboard';

function App() {
  return (
    <div>
      <CommissionDashboard />
    </div>
  );
}
```

### Composants Disponibles

- **CommissionDashboard** : Vue d'ensemble des commissions
- **CommercialPerformanceAnalytics** : Analyses par commercial
- **CommissionAnalytics** : Graphiques et tendances

## 📧 Automatisation Email

### Configuration Nodemailer

```typescript
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransporter({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});
```

### Templates Email

```typescript
const templates = {
  commissionReport: (data) => `
    <h1>Rapport des Commissions - ${new Date().toLocaleDateString()}</h1>
    <p>Total commissions: ${data.total.toFixed(2)}€</p>
    <table>
      <tr><th>Compagnie</th><th>Montant</th></tr>
      ${data.byCompany.map(row => `<tr><td>${row.company}</td><td>${row.amount}€</td></tr>`).join('')}
    </table>
  `
};
```

## 🔄 Intégrations

### Google Sheets

```typescript
import { google } from 'googleapis';

const auth = new google.auth.GoogleAuth({
  scopes: ['https://www.googleapis.com/auth/spreadsheets']
});

const sheets = google.sheets({ version: 'v4', auth });

// Synchronisation bidirectionnelle
await CommissionService.syncWithGoogleSheets(sheetId, range);
```

### Webhooks

```typescript
// Configuration des webhooks
app.post('/webhooks/commission-update', (req, res) => {
  const { type, data } = req.body;

  switch (type) {
    case 'commission_calculated':
      handleCommissionCalculated(data);
      break;
    case 'error_occurred':
      handleError(data);
      break;
  }

  res.status(200).send('OK');
});
```

## 🧪 Tests

### Tests Unitaires

```bash
npm test
```

### Tests d'Intégration

```typescript
import { CommissionService } from './lib/commission-service';

describe('CommissionService', () => {
  test('calculateCommissionForContract returns valid result', () => {
    const result = CommissionService.calculateCommissionForContract('SPVIE', 150);

    expect(result).toBeDefined();
    expect(result?.commission_mensuelle).toBeGreaterThan(0);
    expect(result?.type_commission).toBe('Précompte');
  });

  test('validateCommissionInput handles invalid data', () => {
    const result = CommissionService.validateCommissionInput('', -100);

    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('Compagnie requise');
    expect(result.errors).toContain('Cotisation doit être un nombre positif');
  });
});
```

## 🚀 Déploiement

### 1. Build de Production

```bash
npm run build
```

### 2. Déploiement Supabase

```bash
# Déployer les fonctions Edge
supabase functions deploy commission-calculator
supabase functions deploy commission-notifier
```

### 3. Configuration CI/CD

```yaml
# .github/workflows/deploy.yml
name: Deploy
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install dependencies
        run: npm ci

      - name: Run tests
        run: npm test

      - name: Build
        run: npm run build

      - name: Deploy to production
        run: |
          npm install -g supabase
          supabase login --token ${{ secrets.SUPABASE_ACCESS_TOKEN }}
          supabase db push
          supabase functions deploy
```

## 📈 Monitoring et Maintenance

### Métriques à Surveiller

- **Taux de réussite des calculs** : > 95%
- **Temps de réponse API** : < 2 secondes
- **Utilisation mémoire** : < 80%
- **Taux d'erreur** : < 5%

### Tâches de Maintenance

```sql
-- Nettoyage des anciens calculs (garder 2 ans)
DELETE FROM commission_calculations
WHERE date_calcul < NOW() - INTERVAL '2 years';

-- Optimisation des index
REINDEX TABLE commission_calculations;
REINDEX TABLE commission_configs;
```

### Backup Automatique

```bash
# Script de backup
pg_dump -h $SUPABASE_HOST -U postgres -d postgres \
  -t commission_calculations \
  -t commission_configs \
  > commission_system_backup.sql
```

## 🐛 Dépannage

### Problèmes Courants

#### Erreur de Connexion Base de Données
```bash
# Vérifier les variables d'environnement
echo $VITE_SUPABASE_URL
echo $VITE_SUPABASE_ANON_KEY

# Tester la connexion
node -e "const { createClient } = require('@supabase/supabase-js'); const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY); console.log('Connexion OK');"
```

#### Erreur de Calcul
```typescript
// Logs détaillés
const result = await calculerCommissionMensuel({
  onProgress: (processed, total) => {
    console.log(`Traitement: ${processed}/${total}`);
  }
});

console.log('Erreurs:', result.errors);
```

#### Performance Lente
```sql
-- Analyser les requêtes lentes
EXPLAIN ANALYZE SELECT * FROM commission_calculations WHERE date_calcul >= NOW() - INTERVAL '1 month';

-- Ajouter des index si nécessaire
CREATE INDEX CONCURRENTLY idx_commission_date_compagnie
ON commission_calculations(date_calcul, compagnie);
```

## 🤝 Contribution

### Standards de Code

- **TypeScript strict** activé
- **ESLint** configuré
- **Tests unitaires** requis
- **Documentation** à jour

### Process de Contribution

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/nouvelle-fonction`)
3. Commiter les changements (`git commit -am 'Ajoute nouvelle fonction'`)
4. Push la branche (`git push origin feature/nouvelle-fonction`)
5. Créer une Pull Request

## 📝 Changelog

### Version 2.0.0
- ✅ Refactorisation complète du système
- ✅ Architecture modulaire mise en place
- ✅ Support multi-tenancy
- ✅ API REST complète
- ✅ Automatisation email
- ✅ Tests unitaires

### Version 1.0.0
- ✅ Fonction Google Sheets originale
- ✅ Calculs basiques de commissions

## 📞 Support

Pour toute question ou problème :
- 📧 Email : support@commission-system.com
- 📚 Documentation : [Lien vers docs complètes]
- 🐛 Issues : [Lien vers GitHub Issues]

---

🎉 **Le système de calcul de commissions est maintenant complètement refactorisé et prêt pour la production !**