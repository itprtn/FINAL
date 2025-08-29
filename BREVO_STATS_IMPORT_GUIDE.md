# 📊 Importation des Statistiques Brevo

## Vue d'ensemble

Ce guide explique comment importer vos vraies statistiques d'emails depuis Brevo et les lier avec vos données existantes (contacts, projets).

## 🔑 Prérequis

1. **Clé API Brevo** : Depuis votre compte Brevo → SMTP & API → Clés API
2. **Extension HTTP** : Pour faire des appels API depuis PostgreSQL
3. **Accès SQL** : À votre base Supabase

## 🚀 Configuration

### Étape 1 : Installer l'extension HTTP

```sql
-- Dans votre Supabase SQL Editor
CREATE EXTENSION IF NOT EXISTS http;
```

### Étape 2 : Configurer votre clé API Brevo

```sql
-- Remplacez 'votre-cle-api-brevo' par votre vraie clé
UPDATE scripts/15-import-brevo-stats.sql
SET p_api_key = 'votre-cle-api-brevo';
```

### Étape 3 : Tester la connexion API

```sql
-- Test de connexion à l'API Brevo
SELECT import_brevo_stats_with_api('votre-cle-api-brevo');
```

## 📧 Importation des Données

### Méthode 1 : Import Automatique (Recommandé)

```sql
-- Import complet des statistiques
SELECT * FROM import_brevo_statistics();
```

### Méthode 2 : Import Personnalisé

```sql
-- Import avec dates spécifiques
SELECT import_brevo_stats_with_api(
  'votre-cle-api-brevo',
  '2024-08-01',  -- Date de début
  '2024-08-31'   -- Date de fin
);
```

## 🔗 Comment ça Marche

### 1. **Récupération des Emails**
```
API Brevo → Récupération des emails transactionnels
     ↓
Filtrage par période (startDate/endDate)
     ↓
Extraction des statistiques (ouvertures, clics, bounces)
```

### 2. **Correspondance avec vos Données**
```
Email Brevo → Recherche dans votre table contact
     ↓
Si trouvé → Liaison avec projet existant
     ↓
Création des enregistrements de tracking
```

### 3. **Import dans votre Base**
```
Création envois_groupes (campagne)
     ↓
Création envois_email (emails individuels)
     ↓
Mise à jour des statistiques
```

## 📊 Données Importées

### Pour chaque email trouvé :
- ✅ **Statut** : delivered/opened/clicked/bounce
- ✅ **Dates** : envoi, ouverture, clic
- ✅ **Contact** : Liaison avec votre contact existant
- ✅ **Projet** : Liaison avec le projet du contact
- ✅ **Campagne** : Création automatique d'une campagne

### Exemple de Résultat :
```sql
-- Vérifier les données importées
SELECT
    ee.email_destinataire,
    c.prenom,
    c.nom,
    p.projet_id,
    ee.statut,
    ee.date_envoi,
    ee.date_ouverture
FROM envois_email ee
LEFT JOIN contact c ON c.identifiant = ee.contact_id
LEFT JOIN projets p ON p.projet_id = ee.projet_id
WHERE ee.campagne_id IN (
    SELECT id FROM envois_groupes
    WHERE nom_campagne LIKE 'Imported from Brevo%'
);
```

## 🎯 Avantages

### **Données Réelles**
- ✅ Statistiques authentiques depuis Brevo
- ✅ Historique complet des interactions
- ✅ Aucune donnée fictive

### **Liaison Intelligente**
- ✅ Reconnaissance automatique des contacts
- ✅ Association avec les projets existants
- ✅ Conservation des relations existantes

### **Tracking Complet**
- ✅ Ouvertures réelles
- ✅ Clics authentiques
- ✅ Bounces et plaintes

## 🔍 Vérification Post-Import

### Vérifier les Campagnes Importées
```sql
SELECT
    nom_campagne,
    nombre_destinataires,
    nombre_envoyes,
    nombre_echecs
FROM envois_groupes
WHERE nom_campagne LIKE 'Imported from Brevo%';
```

### Vérifier les Emails Trackés
```sql
SELECT
    COUNT(*) as total_emails_importes,
    COUNT(CASE WHEN statut = 'envoye' THEN 1 END) as emails_envoyes,
    COUNT(CASE WHEN date_ouverture IS NOT NULL THEN 1 END) as emails_ouverts,
    COUNT(CASE WHEN date_clic IS NOT NULL THEN 1 END) as emails_cliques
FROM envois_email ee
WHERE campagne_id IN (
    SELECT id FROM envois_groupes
    WHERE nom_campagne LIKE 'Imported from Brevo%'
);
```

### Vérifier la Liaison Contacts
```sql
SELECT
    COUNT(DISTINCT ee.contact_id) as contacts_lies,
    COUNT(DISTINCT ee.projet_id) as projets_lies
FROM envois_email ee
WHERE campagne_id IN (
    SELECT id FROM envois_groupes
    WHERE nom_campagne LIKE 'Imported from Brevo%'
);
```

## 🚨 Dépannage

### Erreur "Extension HTTP manquante"
```sql
-- Installer l'extension
CREATE EXTENSION IF NOT EXISTS http;
```

### Erreur "Clé API invalide"
- Vérifiez que votre clé API Brevo est active
- Confirmez les permissions (Transactional emails)
- Testez l'API dans l'interface Brevo

### Erreur "Aucun email trouvé"
- Vérifiez la période (startDate/endDate)
- Confirmez qu'il y a des emails transactionnels
- Vérifiez les filtres appliqués

## 🎉 Résultat Final

Après import réussi :

```
📊 Campagnes Importées :
├── "Imported from Brevo - Welcome Email"
├── "Imported from Brevo - Follow-up"
└── "Imported from Brevo - Newsletter"

📧 Emails Trackés :
├── 150 emails importés
├── 45 contacts liés
├── 32 ouvertures
└── 12 clics

📈 Détails Disponibles :
├── ✅ Dates réelles d'envoi
├── ✅ Ouvertures authentiques
├── ✅ Clics vérifiés
└── ✅ Bounces et plaintes
```

**Maintenant vos détails de campagne afficheront des données réelles !** 🚀