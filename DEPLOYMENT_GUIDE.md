# 🚀 Guide de Déploiement Netlify - Premun IA CRM

## Prérequis

Avant de déployer, assurez-vous d'avoir :
- Un compte Netlify (gratuit)
- Votre repository Git (GitHub, GitLab, ou Bitbucket)
- Les clés API suivantes :
  - Clé service role Supabase
  - Clé API Brevo

## ⚙️ Configuration Netlify

### 1. Créer une nouvelle application

1. Connectez-vous à [Netlify](https://netlify.com)
2. Cliquez sur "Add new site" > "Import an existing project"
3. Liez votre repository Git

### 2. Paramètres de build

Netlify détectera automatiquement ces paramètres depuis votre `netlify.toml` :

```toml
[build]
  publish = "dist"
  command = "npm run build"

[build.environment]
  NODE_ENV = "production"
  VITE_SUPABASE_PROJECT_ID = "wybhtprxiwgzmpmnfceq"
  VITE_SUPABASE_URL = "https://wybhtprxiwgzmpmnfceq.supabase.co"
  VITE_SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

### 3. Variables d'environnement

Configurez les variables suivantes dans **Netlify Dashboard** > **Site configuration** > **Environment variables** :

#### Variables Sensibles (dépendances de production chargées)
```bash
SUPABASE_SERVICE_ROLE_KEY=votre_clé_service_role_ici
VITE_BREVO_API_KEY=votre_clé_brevo_ici
```

> ⚠️ **IMPORTANT :** Les variables publiques sont déjà configurées dans netlify.toml

## 🔧 Obtenir vos clés API

### Supabase Service Role Key
1. Allez dans votre [Supabase Dashboard](https://supabase.com/dashboard)
2. Sélectionnez votre projet
3. Allez dans **Settings** > **API**
4. Copiez la **service_role key** (elle commence par `eyJ...`)

### Clé API Brevo
1. Connectez-vous à [Brevo](https://brevo.com)
2. Allez dans **Settings** > **SMTP & API**
3. Créez une nouvelle clé API ou copiez une existante

## 🚀 Déploiement

### Déploiement automatique (recommandé)

1. Commitez et poussez vos changements
2. Netlify détecte automatiquement les changements et déclenche un build
3. Votre site est mis à jour automatiquement

### Déploiement manuel

1. Dans Netlify Dashboard, allez dans **Deploys**
2. Cliquez sur "Trigger deploy" > "Deploy site"

## 🔍 Vérification du déploiement

Après déploiement :

1. Vérifiez que le site s'ouvre correctement
2. Testez la connexion Supabase (connexion utilisateur)
3. Vérifiez les fonctionnalités Brevo si utilisées
4. Ouvrez la console du navigateur (F12) pour vérifier l'absence d'erreurs

## 🛠️ Dépannage

### Build échoue
```bash
# Vérifier la version Node.js
node --version  # Doit être >= 22.19.0

# Installer les dépendances
npm install
```

### Erreur de connexion Supabase
- Vérifiez que les variables d'environnement sont corrects
- Assurez-vous que Supabase edge functions sont déployés

### Erreur d'autorisation Brevo
- Vérifiez que la clé API est valide
- Assurez-vous que l'API key a les bonnes permissions

## ✅ État actuel des corrections

| Depuis les modifications | Status |
|--------------------------|--------|
| Configuration `netlify.toml` | ✅ Nettoyée et fonctionnelle |
| Dépendances déplacées vers production | ✅ autoprefixer résolu |
| Variables d'environnement | ✅ Sécurisées |
| Documentation | ✅ Complète |

## 📞 Support

Si vous rencontrez des problèmes :

1. Consultez les [logs de build](https://docs.netlify.com/monitor-sites/logs/)
2. Vérifiez la [documentation Netlify](https://docs.netlify.com/)
3. Contactez le développeur pour des problèmes spécifiques à l'application

---

**✅ Votre application est maintenant prête pour le déploiement !**

Toutes les corrections de build et de déploiement ont été appliquées.