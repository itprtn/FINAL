-- ===========================================
-- IMPORT RAPIDE DES DONNÉES BREVO
-- ===========================================
-- À exécuter dans Supabase SQL Editor

-- Étape 1: Configuration de base
CREATE EXTENSION IF NOT EXISTS http;

-- Étape 2: Créer table config
CREATE TABLE IF NOT EXISTS brevo_config (
    id SERIAL PRIMARY KEY,
    api_key TEXT NOT NULL
);

-- Étape 3: Insérer votre clé API
INSERT INTO brevo_config (api_key)
VALUES ('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')
ON CONFLICT DO NOTHING;

-- Étape 4: Ajouter colonne brevo_campaign_id
ALTER TABLE envois_groupes ADD COLUMN IF NOT EXISTS brevo_campaign_id TEXT UNIQUE;

-- Étape 5: Import automatique des campagnes
DO $$
DECLARE
    response http_response;
    api_key TEXT;
    campaign_record RECORD;
BEGIN
    -- Récupérer la clé API
    SELECT bc.api_key INTO api_key FROM brevo_config bc LIMIT 1;

    -- Récupérer les campagnes Brevo
    SELECT * INTO response
    FROM http_get('https://api.brevo.com/v3/emailCampaigns?limit=50',
                  ARRAY[ROW('api-key', api_key)::http_header]);

    -- Importer chaque campagne
    FOR campaign_record IN
        SELECT * FROM json_array_elements((response.content::json)->'campaigns')
    LOOP
        INSERT INTO envois_groupes (
            nom_campagne,
            nombre_destinataires,
            nombre_envoyes,
            statut,
            brevo_campaign_id
        ) VALUES (
            COALESCE(campaign_record.value->>'name', 'Campagne Brevo'),
            COALESCE((campaign_record.value->>'recipients')::int, 0),
            COALESCE((campaign_record.value->'statistics'->>'delivered')::int, 0),
            CASE
                WHEN campaign_record.value->>'status' = 'sent' THEN 'envoyee'
                ELSE 'brouillon'
            END,
            campaign_record.value->>'id'
        ) ON CONFLICT (brevo_campaign_id) DO NOTHING;
    END LOOP;

    RAISE NOTICE 'Import des campagnes terminé';
END $$;

-- Étape 6: Lier emails avec contacts
UPDATE envois_email
SET contact_id = contact.identifiant
FROM contact
WHERE envois_email.email_destinataire = contact.email
AND envois_email.contact_id IS NULL;

-- Étape 7: Vérification
SELECT
    'Campagnes importées' as type,
    COUNT(*) as total
FROM envois_groupes
WHERE brevo_campaign_id IS NOT NULL;

SELECT
    eg.nom_campagne,
    eg.nombre_destinataires,
    eg.nombre_envoyes,
    eg.statut
FROM envois_groupes eg
WHERE eg.brevo_campaign_id IS NOT NULL
ORDER BY eg.date_creation DESC;