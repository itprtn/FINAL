// ===========================================
// IMPORT SIMPLE BREVO - VERSION CURL
// ===========================================

import https from 'https';
import { createClient } from '@supabase/supabase-js';

// Configuration
const SUPABASE_URL = 'https://wybhtprxiwgzmpmnfceq.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind5Ymh0cHJ4aXdnem1wbW5mY2VxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEwMzIwODksImV4cCI6MjA2NjYwODA4OX0.ctFmwHC_iitVB16WB7lY616lIp0CAHBUGRaoi56ruqc';
const BREVO_API_KEY = process.env.BREVO_API_KEY || 'your_api_key_here';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Fonction pour faire des requêtes HTTPS
function makeHttpsRequest(options, data = null) {
    return new Promise((resolve, reject) => {
        const req = https.request(options, (res) => {
            let body = '';

            res.on('data', (chunk) => {
                body += chunk;
            });

            res.on('end', () => {
                try {
                    const jsonData = JSON.parse(body);
                    resolve({
                        statusCode: res.statusCode,
                        data: jsonData
                    });
                } catch (e) {
                    resolve({
                        statusCode: res.statusCode,
                        data: body
                    });
                }
            });
        });

        req.on('error', (err) => {
            reject(err);
        });

        if (data) {
            req.write(data);
        }

        req.end();
    });
}

// Test de connexion Brevo
async function testBrevo() {
    console.log('🔍 Test de connexion Brevo...');

    const options = {
        hostname: 'api.brevo.com',
        path: '/v3/account',
        method: 'GET',
        headers: {
            'api-key': BREVO_API_KEY,
            'accept': 'application/json'
        }
    };

    try {
        const result = await makeHttpsRequest(options);
        if (result.statusCode === 200) {
            console.log('✅ Connexion Brevo réussie!');
            console.log('📧 Email:', result.data.email);
            console.log('📊 Crédits:', result.data.plan[0].credits);
            return true;
        } else {
            console.log('❌ Erreur Brevo:', result.data);
            return false;
        }
    } catch (error) {
        console.error('❌ Erreur connexion:', error.message);
        return false;
    }
}

// Récupérer les campagnes Brevo
async function getBrevoCampaigns() {
    console.log('\n📧 Récupération des campagnes Brevo...');

    const options = {
        hostname: 'api.brevo.com',
        path: '/v3/emailCampaigns?limit=20',
        method: 'GET',
        headers: {
            'api-key': BREVO_API_KEY,
            'accept': 'application/json'
        }
    };

    try {
        const result = await makeHttpsRequest(options);
        if (result.statusCode === 200 && result.data.campaigns) {
            console.log(`✅ ${result.data.campaigns.length} campagnes trouvées`);

            // Afficher les campagnes
            result.data.campaigns.forEach((campaign, index) => {
                console.log(`${index + 1}. ${campaign.name} (ID: ${campaign.id}, Status: ${campaign.status})`);
            });

            return result.data.campaigns;
        } else {
            console.log('❌ Erreur récupération:', result.data);
            return [];
        }
    } catch (error) {
        console.error('❌ Erreur:', error.message);
        return [];
    }
}

// Ajouter une colonne à Supabase (via RPC si disponible)
async function addBrevoColumn() {
    console.log('\n🔧 Ajout de la colonne brevo_campaign_id...');

    try {
        // Essayer d'ajouter la colonne via RPC
        const { error } = await supabase.rpc('add_column_if_not_exists', {
            table_name: 'envois_groupes',
            column_name: 'brevo_campaign_id',
            column_type: 'TEXT'
        });

        if (error) {
            console.log("⚠️ Impossible d'ajouter la colonne via RPC, il faudra le faire manuellement");
            console.log('📝 SQL à exécuter dans Supabase:');
            console.log('ALTER TABLE envois_groupes ADD COLUMN IF NOT EXISTS brevo_campaign_id TEXT UNIQUE;');
        } else {
            console.log('✅ Colonne ajoutée');
        }
    } catch (error) {
        console.log('⚠️ Erreur ajout colonne:', error.message);
    }
}

// Importer les campagnes dans Supabase
async function importCampaigns(campaigns) {
    console.log('\n📥 Import des campagnes...');

    let imported = 0;

    for (const campaign of campaigns) {
        try {
            // Essayer d'insérer la campagne
            const { error } = await supabase
                .from('envois_groupes')
                .insert({
                    nom_campagne: campaign.name || 'Campagne Brevo',
                    nombre_destinataires: campaign.recipients || 0,
                    nombre_envoyes: campaign.statistics?.delivered || 0,
                    statut: campaign.status === 'sent' ? 'envoyee' : 'brouillon',
                    brevo_campaign_id: campaign.id.toString(),
                    date_creation: new Date().toISOString()
                });

            if (error) {
                if (error.message.includes('column') && error.message.includes('does not exist')) {
                    console.log("❌ La colonne brevo_campaign_id n'existe pas. Veuillez l'ajouter d'abord.");
                    break;
                } else if (error.message.includes('duplicate key')) {
                    console.log(`⚠️ Campagne déjà importée: ${campaign.name}`);
                } else {
                    console.log(`❌ Erreur import campagne ${campaign.name}:`, error.message);
                }
            } else {
                console.log(`✅ Importé: ${campaign.name}`);
                imported++;
            }
        } catch (error) {
            console.error(`❌ Erreur traitement ${campaign.name}:`, error.message);
        }
    }

    console.log(`\n📊 ${imported} campagnes importées`);
    return imported;
}

// Vérifier les résultats
async function verifyImport() {
    console.log('\n📊 Vérification des résultats...');

    try {
        // Compter les campagnes avec brevo_campaign_id
        const { count, error } = await supabase
            .from('envois_groupes')
            .select('*', { count: 'exact', head: true })
            .not('brevo_campaign_id', 'is', null);

        if (error) {
            console.log('❌ Erreur vérification:', error.message);
        } else {
            console.log(`📧 Campagnes Brevo dans la base: ${count}`);
        }

        // Afficher les campagnes importées
        const { data: campaigns, error: detailError } = await supabase
            .from('envois_groupes')
            .select('nom_campagne, nombre_destinataires, nombre_envoyes, statut')
            .not('brevo_campaign_id', 'is', null)
            .order('date_creation', { ascending: false })
            .limit(10);

        if (!detailError && campaigns) {
            console.log('\n📋 Campagnes importées:');
            campaigns.forEach(campaign => {
                console.log(`  - ${campaign.nom_campagne}: ${campaign.nombre_destinataires} destinataires (${campaign.statut})`);
            });
        }

        return count || 0;
    } catch (error) {
        console.error('❌ Erreur vérification:', error.message);
        return 0;
    }
}

// Fonction principale
async function runSimpleImport() {
    console.log('🚀 Import Simple des Données Brevo\n');

    try {
        // Étape 1: Test Brevo
        const brevoOk = await testBrevo();
        if (!brevoOk) {
            console.log('❌ Impossible de se connecter à Brevo');
            return;
        }

        // Étape 2: Récupérer les campagnes
        const campaigns = await getBrevoCampaigns();
        if (campaigns.length === 0) {
            console.log('❌ Aucune campagne trouvée');
            return;
        }

        // Étape 3: Préparer la base
        await addBrevoColumn();

        // Étape 4: Importer
        const imported = await importCampaigns(campaigns);

        // Étape 5: Vérifier
        await verifyImport();

        // Résumé
        console.log('\n🎉 Import terminé!');
        console.log(`📊 ${imported} campagnes importées avec succès`);

    } catch (error) {
        console.error('💥 Erreur générale:', error.message);
    }
}

// Exécuter l'import
if (import.meta.url === `file://${process.argv[1]}`) {
    runSimpleImport();
}

export {
    testBrevo,
    getBrevoCampaigns,
    addBrevoColumn,
    importCampaigns,
    verifyImport
};