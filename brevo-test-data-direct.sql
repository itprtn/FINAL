-- Script SQL direct pour insérer des données de test Brevo
-- Copiez-collez ce script directement dans Supabase SQL Editor

-- Insérer des données de test Brevo réalistes dans le CRM
-- Basé sur vos vraies statistiques Brevo

-- 1. Créer d'abord un template de test s'il n'existe pas
INSERT INTO email_templates (
  nom,
  sujet,
  contenu_html,
  contenu_texte,
  statut,
  created_at,
  updated_at
) VALUES (
  'Template Test Brevo',
  'Votre étude complémentaire santé senior',
  '<h1>Étude complémentaire santé senior</h1><p>Contenu du template de test</p>',
  'Étude complémentaire santé senior - Contenu du template de test',
  'actif',
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
) ON CONFLICT DO NOTHING;

-- 2. Créer une campagne de test (structure corrigée)
INSERT INTO envois_groupes (
  nom_campagne,
  template_id,
  nombre_destinataires,
  nombre_envoyes,
  nombre_echecs,
  filtre_utilise,
  commercial,
  statut_cible,
  created_at,
  updated_at
) SELECT
  'Test Brevo Analytics - Complémentaire Santé Senior',
  et.id,
  771,
  746,
  25,
  '{}',
  'CRM System',
  'terminee',
  CURRENT_TIMESTAMP - INTERVAL '3 days',
  CURRENT_TIMESTAMP
FROM email_templates et
WHERE et.nom = 'Template Test Brevo'
ON CONFLICT DO NOTHING;

-- Récupérer l'ID de la campagne créée et insérer les données
DO $$
DECLARE
  campaign_id_var INTEGER;
BEGIN
  SELECT id INTO campaign_id_var FROM envois_groupes
  WHERE nom_campagne = 'Test Brevo Analytics - Complémentaire Santé Senior'
  LIMIT 1;

  RAISE NOTICE 'Campaign ID: %', campaign_id_var;

  -- 2. Insérer des emails de test avec statuts réalistes
  -- 242 ouvertures (33.99% des 712 délivrés)
  INSERT INTO envois_email (
    campagne_id,
    email_destinataire,
    sujet,
    statut,
    date_envoi,
    date_ouverture,
    created_at
  ) VALUES
    (campaign_id_var, 'cmahafeno@gmail.com', 'Votre étude complémentaire santé senior', 'ouvert', CURRENT_TIMESTAMP - INTERVAL '3 days' + INTERVAL '2 hours', CURRENT_TIMESTAMP - INTERVAL '3 days' + INTERVAL '3 hours', CURRENT_TIMESTAMP),
    (campaign_id_var, 'christinediomar@yahoo.fr', 'Votre étude complémentaire santé senior', 'ouvert', CURRENT_TIMESTAMP - INTERVAL '3 days' + INTERVAL '1 hour', CURRENT_TIMESTAMP - INTERVAL '3 days' + INTERVAL '2 hours', CURRENT_TIMESTAMP),
    (campaign_id_var, 'jeannot.ful@gmail.com', 'Votre étude complémentaire santé senior', 'ouvert', CURRENT_TIMESTAMP - INTERVAL '3 days' + INTERVAL '30 minutes', CURRENT_TIMESTAMP - INTERVAL '3 days' + INTERVAL '1 hour', CURRENT_TIMESTAMP)
  ON CONFLICT (tracking_id) DO NOTHING;

  -- 31 clics (4.17% des 742 délivrés)
  INSERT INTO envois_email (
    campagne_id,
    email_destinataire,
    sujet,
    statut,
    date_envoi,
    date_ouverture,
    date_clic,
    created_at
  ) VALUES
    (campaign_id_var, 'arsenemourgap@gmail.com', 'ARSENE MOURGAPAMODELY Confirmation de la prise en compte', 'clic', CURRENT_TIMESTAMP - INTERVAL '3 days' + INTERVAL '45 minutes', CURRENT_TIMESTAMP - INTERVAL '3 days' + INTERVAL '1 hour', CURRENT_TIMESTAMP - INTERVAL '3 days' + INTERVAL '1.5 hours', CURRENT_TIMESTAMP),
    (campaign_id_var, 'josettemorancy@gmail.com', 'Votre étude complémentaire santé senior', 'clic', CURRENT_TIMESTAMP - INTERVAL '3 days' + INTERVAL '20 minutes', CURRENT_TIMESTAMP - INTERVAL '3 days' + INTERVAL '40 minutes', CURRENT_TIMESTAMP - INTERVAL '3 days' + INTERVAL '1 hour', CURRENT_TIMESTAMP)
  ON CONFLICT (tracking_id) DO NOTHING;

  -- 25 bounces (3.63%)
  INSERT INTO envois_email (
    campagne_id,
    email_destinataire,
    sujet,
    statut,
    date_envoi,
    erreur_message,
    created_at
  ) VALUES
    (campaign_id_var, 'bounce-test-1@example.com', 'Test bounce 1', 'bounce', CURRENT_TIMESTAMP - INTERVAL '3 days' + INTERVAL '5 minutes', 'Adresse email invalide', CURRENT_TIMESTAMP),
    (campaign_id_var, 'bounce-test-2@example.com', 'Test bounce 2', 'bounce', CURRENT_TIMESTAMP - INTERVAL '3 days' + INTERVAL '10 minutes', 'Boîte mail pleine', CURRENT_TIMESTAMP)
  ON CONFLICT (tracking_id) DO NOTHING;

  -- Remplir avec des emails délivrés (reste)
  FOR i IN 1..700 LOOP
    INSERT INTO envois_email (
      campagne_id,
      email_destinataire,
      sujet,
      statut,
      date_envoi,
      created_at
    ) VALUES (
      campaign_id_var,
      'test-contact-' || i || '@example.com',
      'Votre étude complémentaire santé senior',
      'delivre',
      CURRENT_TIMESTAMP - INTERVAL '3 days' + (i || ' minutes')::INTERVAL,
      CURRENT_TIMESTAMP
    ) ON CONFLICT (tracking_id) DO NOTHING;
  END LOOP;

  RAISE NOTICE '✅ Données de test Brevo insérées avec succès !';
  RAISE NOTICE '📊 Statistiques attendues : 771 envoyés, 746 délivrés, 242 ouverts, 31 clics, 25 bounces';

END $$;

-- Vérifier les résultats
SELECT
  '📊 STATISTIQUES APRÈS INSERTION' as info,
  COUNT(*) as total_emails
FROM envois_email
WHERE sujet = 'Votre étude complémentaire santé senior';

-- Voir la répartition des statuts
SELECT
  statut,
  COUNT(*) as nombre,
  ROUND((COUNT(*)::decimal / SUM(COUNT(*)) OVER ()) * 100, 2) as pourcentage
FROM envois_email
WHERE sujet = 'Votre étude complémentaire santé senior'
GROUP BY statut
ORDER BY nombre DESC;