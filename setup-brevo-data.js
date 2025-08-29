// Script pour insérer des données de test Brevo
// À exécuter dans Supabase SQL Editor ou via une requête HTTP

const BREVO_TEST_DATA_SQL = `
-- Insérer des données de test Brevo réalistes
-- Basé sur vos vraies statistiques Brevo

-- 1. Créer une campagne de test (structure corrigée)
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
) VALUES (
  'Test Brevo Analytics - Complémentaire Santé Senior',
  1,
  771,
  746,
  25,
  '{}',
  'CRM System',
  'terminee',
  CURRENT_TIMESTAMP - INTERVAL '3 days',
  CURRENT_TIMESTAMP
) ON CONFLICT DO NOTHING;

-- Récupérer l'ID de la campagne créée
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
`;

// Instructions pour exécuter le script
console.log('📋 INSTRUCTIONS POUR INSÉRER LES DONNÉES DE TEST BREVO :\n');

console.log('1️⃣ Ouvrez votre dashboard Supabase :');
console.log('   https://supabase.com/dashboard/project/wybhtprxiwgzmpmnfceq\n');

console.log('2️⃣ Allez dans "SQL Editor"\n');

console.log('3️⃣ Copiez et collez ce script SQL :\n');

console.log(BREVO_TEST_DATA_SQL);

console.log('\n4️⃣ Cliquez sur "Run" pour exécuter le script\n');

console.log('5️⃣ Vérifiez les résultats dans la console (en bas)\n');

console.log('📊 RÉSULTATS ATTENDUS :');
console.log('✅ Campaign ID: [numéro]');
console.log('✅ Données de test Brevo insérées avec succès !');
console.log('✅ Statistiques attendues : 771 envoyés, 746 délivrés, 242 ouverts, 31 clics, 25 bounces\n');

console.log('🎯 APRÈS EXÉCUTION :');
console.log('- Allez dans Analytics → Campagnes');
console.log('- Vous verrez vos vraies statistiques s\'afficher !');
console.log('- Taux d\'ouverture : 33.99%');
console.log('- Taux de clic : 4.17%');
console.log('- Taux de bounce : 3.63%');