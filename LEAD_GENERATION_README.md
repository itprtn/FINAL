# 🎯 Module Lead Generation - CRM Premunia

## 📋 Vue d'ensemble

Le module Lead Generation a été complètement intégré dans votre CRM existant pour industrialiser la génération et la relance de leads via :
- **Landing Pages internes** pointant vers des formulaires
- **Diffusion par publicités** (Facebook/TikTok) et emails personnalisés
- **Système complet** de tracking, scoring et routage

## 🚀 Fonctionnalités principales

### 1. Landing Page Builder
- ✅ 5 templates prédéfinis (Mutuelle Santé, Rappel Devis, etc.)
- ✅ Éditeur WYSIWYG avec blocs modulaires
- ✅ Tests A/B/n et optimisation SEO
- ✅ Variables dynamiques et personnalisation par segment

### 2. Form Engine
- ✅ Formulaires multi-étapes avec validation
- ✅ Logique conditionnelle et pré-remplissage
- ✅ Gestion RGPD et consentements explicites
- ✅ Anti-spam et validation en temps réel

### 3. UTM & JWT Link Management
- ✅ Générateur de liens UTM pour le tracking
- ✅ Liens JWT sécurisés pour le pré-remplissage
- ✅ Gestion des campagnes et attribution
- ✅ Performance tracking et analytics

### 4. Analytics & Dashboard
- ✅ Tableau de bord temps réel
- ✅ Attribution multi-touch et ROI par campagne
- ✅ KPIs clés (CPL, CVR, taux de conversion)
- ✅ Rapports automatisés et export

### 5. Intégrations Publicitaires
- ✅ Meta Lead Ads (webhooks + Conversions API)
- ✅ TikTok Lead Gen (webhooks + Events API)
- ✅ Tracking événements et déduplication
- ✅ Attribution cross-platform

## 🗄️ Base de données

### Tables créées
- `public.leads` - Gestion des leads avec relations CRM
- `public.landing_pages` - Pages de conversion
- `public.forms` - Formulaires multi-étapes
- `public.form_submissions` - Soumissions et données
- `public.events` - Tracking événements
- `public.campaigns_ads` - Campagnes publicitaires
- `public.consents` - Gestion RGPD
- `public.emails_leads` - Emails et automations
- `public.ad_costs` - Coûts publicitaires

### Relations avec CRM existant
- `leads.contact_id` → `public.contact(identifiant)`
- `leads.projet_id` → `public.projets(projet_id)`
- `leads.assigned_to` → `public.commerciaux(id)`
- `events.contrat_id` → `public.contrats(id)`

### Fonctions SQL intégrées
- `convert_lead_to_contact(p_lead_id)` - Conversion lead → contact
- `create_project_from_lead(p_lead_id, p_type_projet)` - Création projet

## 🔧 Installation et configuration

### 1. Migration de base de données
```bash
# Les tables sont déjà créées via la migration
supabase/migrations/20250825_leadgen_schema.sql
```

### 2. Edge Functions déployées
- `supabase/functions/meta-lead/` - Webhooks Meta Lead Ads
- `supabase/functions/tiktok-lead/` - Webhooks TikTok Lead Gen
- `supabase/functions/track/` - Tracking événements générique

### 3. Composants React intégrés
- `components/LandingPageBuilder.tsx`
- `components/FormEngine.tsx`
- `components/UTMLinkGenerator.tsx`
- `components/LeadDashboard.tsx`

## 📱 Utilisation

### Accès au module
1. Connectez-vous à votre CRM
2. Cliquez sur **"Lead Generation"** dans la navigation
3. Utilisez les onglets pour naviguer entre les fonctionnalités

### Créer une Landing Page
1. Onglet **"Landing Pages"**
2. Choisissez un template ou créez-en un nouveau
3. Utilisez l'éditeur WYSIWYG pour personnaliser
4. Configurez les variables dynamiques
5. Publiez et obtenez l'URL

### Créer un Formulaire
1. Onglet **"Formulaires"**
2. Ajoutez des étapes et des champs
3. Configurez la validation et la logique conditionnelle
4. Ajoutez la gestion RGPD
5. Testez le formulaire en mode preview

### Générer des Liens
1. Onglet **"Liens UTM/JWT"**
2. Créez des liens UTM pour le tracking
3. Ajoutez des claims JWT pour le pré-remplissage
4. Suivez les performances des liens

## 🔗 Configuration des intégrations

### Meta Lead Ads
1. Dans Meta Ads Manager, configurez les webhooks
2. URL : `https://your-project.supabase.co/functions/v1/meta-lead`
3. Les leads seront automatiquement créés dans `public.leads`

### TikTok Lead Gen
1. Dans TikTok Ads Manager, configurez les webhooks
2. URL : `https://your-project.supabase.co/functions/v1/tiktok-lead`
3. Même processus automatique que Meta

### Tracking événements
```javascript
// Sur vos landing pages
fetch('/api/track', {
  method: 'POST',
  body: JSON.stringify({
    event_name: 'form_submit',
    properties: { form_id: '123', step: 2 }
  })
})
```

## 📊 KPIs et objectifs

### Objectifs SMART
- **≥ 2,000 leads/mois** via le système
- **CPL ≤ 12€** (coût par lead)
- **CVR ≥ 12%** (taux de conversion)

### KPIs principaux
- **Acquisition** : Nombre de leads, sources, CPL
- **Engagement** : Taux de conversion, temps sur page
- **Qualité** : Score des leads, qualification
- **Livraison** : Taux de délivrabilité email

## 🛡️ Conformité RGPD

### Fonctionnalités intégrées
- ✅ Log des consentements avec timestamp
- ✅ Gestion des préférences de contact
- ✅ Plafonds de fréquence d'envoi
- ✅ Politiques de rétention des données
- ✅ Mentions légales et cookies

### Tables de conformité
- `public.consents` - Historique des consentements
- `public.contact_frequency` - Limites de fréquence
- `public.data_retention` - Politiques de rétention

## 🚨 Dépannage

### Problèmes courants

**Les nouveaux modules ne sont pas visibles**
- Vérifiez que la migration a été appliquée
- Redémarrez l'application React
- Vérifiez les imports dans `src/pages/LeadGeneration.tsx`

**Erreurs de base de données**
- Vérifiez la connexion Supabase
- Exécutez `supabase db reset` si nécessaire
- Vérifiez les politiques RLS

**Webhooks non fonctionnels**
- Vérifiez les Edge Functions déployées
- Testez avec `supabase functions serve`
- Vérifiez les variables d'environnement

## 📞 Support

Pour toute question ou problème :
1. Vérifiez ce README
2. Consultez les logs Supabase
3. Testez les composants individuellement
4. Vérifiez la console du navigateur

## 🎯 Prochaines étapes

Le module est maintenant **100% fonctionnel** et intégré. Vous pouvez :

1. **Tester** toutes les fonctionnalités
2. **Configurer** vos intégrations publicitaires
3. **Créer** vos premières landing pages
4. **Lancer** vos campagnes de génération de leads
5. **Analyser** les performances via le dashboard

---

**🎉 Félicitations ! Votre CRM est maintenant équipé d'un système de Lead Generation professionnel et complet !**
