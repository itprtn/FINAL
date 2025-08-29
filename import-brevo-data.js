// ===========================================
// IMPORT DES DONNÉES BREVO VIA NODE.JS
// ===========================================

import { createClient } from '@supabase/supabase-js';
import https from 'https';

// Configuration Supabase (depuis votre fichier lib/supabase.ts)
const SUPABASE_URL = 'https://wybhtprxiwgzmpmnfceq.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind5Ymh0cHJ4aXdnem1wbW5mY2VxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEwMzIwODksImV4cCI6MjA2NjYwODA4OX0.ctFmwHC_iitVB16WB7lY616lIp0CAHBUGRaoi56ruqc';
const BREVO_API_KEY = process.env.BREVO_API_KEY || 'your_api_key_here';

// Initialiser Supabase
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Fonction pour faire des requêtes HTTP
function makeRequest(options, data = null) {
    return new Promise((resolve, reject) => {
        const req = https.request(options, (res) => {
            let body = '';

            res.on('data', (chunk) => {
                body += chunk;
            });

            res.on('end', () => {
                try {
                    if (body) {
                        const jsonData = JSON.parse(body);
                        resolve({
                            statusCode: res.statusCode,
                            data: jsonData
                        });
                    } else {
                        resolve({
                            statusCode: res.statusCode,
                            data: null
                        });
                    }
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

// Étape 1: Configuration de base
async function setupDatabase() {
    console.log('🔧 Configuration de la base de données...');

    try {
        // Créer la table de configuration si elle n'existe pas
        const { error: configError } = await supabase.rpc('create_brevo_config_table');
        if (configError && !configError.message.includes('already exists')) {
            console.log('⚠️ Erreur configuration:', configError.message);
        }

        // Insérer la clé API
        const { error: insertError } = await supabase
            .from('brevo_config')
            .insert({ api_key: BREVO_API_KEY });

        if (insertError && !insertError.message.includes('duplicate key')) {
            console.log('⚠️ Erreur insertion clé:', insertError.message);
        }

        console.log('✅ Configuration terminée');
        return true;
    } catch (error) {
        console.error('❌ Erreur configuration:', error.message);
        return false;
    }
}

// Étape 2: Test de connexion Brevo
async function testBrevoConnection() {
    console.log('\n🔍 Test de connexion Brevo...');

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
        const result = await makeRequest(options);
        if (result.statusCode === 200) {
            console.log('✅ Connexion Brevo réussie!');
            console.log('📧 Email:', result.data.email);
            console.log('📊 Crédits:', result.data.plan[0].credits);
            return result.data;
        } else {
            console.log('❌ Erreur connexion Brevo:', result.data);
            return null;
        }
    } catch (error) {
        console.error('❌ Erreur test connexion:', error.message);
        return null;
    }
}

// Étape 3: Récupérer les campagnes Brevo
async function getBrevoCampaigns() {
    console.log('\n📧 Récupération des campagnes Brevo...');

    const options = {
        hostname: 'api.brevo.com',
        path: '/v3/emailCampaigns?limit=50',
        method: 'GET',
        headers: {
            'api-key': BREVO_API_KEY,
            'accept': 'application/json'
        }
    };

    try {
        const result = await makeRequest(options);
        if (result.statusCode === 200 && result.data.campaigns) {
            console.log(`✅ ${result.data.campaigns.length} campagnes trouvées`);
            return result.data.campaigns;
        } else {
            console.log('❌ Erreur récupération campagnes:', result.data);
            return [];
        }
    } catch (error) {
        console.error('❌ Erreur récupération:', error.message);
        return [];
    }
}

// Étape 4: Importer les campagnes dans Supabase
async function importCampaignsToSupabase(campaigns) {
    console.log('\n📥 Import des campagnes dans Supabase...');

    let importedCount = 0;

    for (const campaign of campaigns) {
        try {
            // Ajouter la colonne brevo_campaign_id si elle n'existe pas
            await supabase.rpc('add_brevo_campaign_id_column');

            // Insérer la campagne
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
                if (error.message.includes('duplicate key')) {
                    console.log(`⚠️ Campagne déjà existante: ${campaign.name}`);
                } else {
                    console.log(`❌ Erreur import campagne ${campaign.name}:`, error.message);
                }
            } else {
                importedCount++;
                console.log(`✅ Importé: ${campaign.name} (${campaign.recipients} destinataires)`);
            }
        } catch (error) {
            console.error(`❌ Erreur traitement campagne ${campaign.name}:`, error.message);
        }
    }

    console.log(`\n📊 Import terminé: ${importedCount} campagnes importées`);
    return importedCount;
}

// Étape 5: Lier les emails avec les contacts
async function linkEmailsWithContacts() {
    console.log('\n🔗 Liaison emails-contacts...');

    try {
        const { error } = await supabase.rpc('link_brevo_emails_with_contacts');

        if (error) {
            console.log('❌ Erreur liaison:', error.message);
            return 0;
        }

        // Compter les emails liés
        const { count, error: countError } = await supabase
            .from('envois_email')
            .select('*', { count: 'exact', head: true })
            .not('contact_id', 'is', null);

        if (countError) {
            console.log('❌ Erreur comptage:', countError.message);
            return 0;
        }

        console.log(`✅ ${count} emails liés avec des contacts`);
        return count;
    } catch (error) {
        console.error('❌ Erreur liaison:', error.message);
        return 0;
    }
}

// Étape 6: Vérification finale
async function verifyImport() {
    console.log('\n📊 Vérification des résultats...');

    try {
        // Compter les campagnes importées
        const { count: campaignCount, error: campaignError } = await supabase
            .from('envois_groupes')
            .select('*', { count: 'exact', head: true })
            .not('brevo_campaign_id', 'is', null);

        if (campaignError) {
            console.log('❌ Erreur comptage campagnes:', campaignError.message);
        } else {
            console.log(`📧 Campagnes importées: ${campaignCount}`);
        }

        // Compter les emails liés
        const { count: emailCount, error: emailError } = await supabase
            .from('envois_email')
            .select('*', { count: 'exact', head: true })
            .not('contact_id', 'is', null);

        if (emailError) {
            console.log('❌ Erreur comptage emails:', emailError.message);
        } else {
            console.log(`🔗 Emails liés: ${emailCount}`);
        }

        // Afficher le détail des campagnes
        const { data: campaigns, error: detailError } = await supabase
            .from('envois_groupes')
            .select('nom_campagne, nombre_destinataires, nombre_envoyes, statut')
            .not('brevo_campaign_id', 'is', null)
            .order('date_creation', { ascending: false });

        if (!detailError && campaigns) {
            console.log('\n📋 Détail des campagnes importées:');
            campaigns.forEach(campaign => {
                console.log(`  - ${campaign.nom_campagne}: ${campaign.nombre_destinataires} destinataires (${campaign.statut})`);
            });
        }

        return { campaigns: campaignCount, emails: emailCount };
    } catch (error) {
        console.error('❌ Erreur vérification:', error.message);
        return { campaigns: 0, emails: 0 };
    }
}

// Fonction principale
async function runImport() {
    console.log('🚀 Début de l\'import des données Brevo...\n');

    try {
        // Étape 1: Configuration
        const setupSuccess = await setupDatabase();
        if (!setupSuccess) {
            console.log('❌ Impossible de configurer la base de données');
            return;
        }

        // Étape 2: Test connexion Brevo
        const brevoAccount = await testBrevoConnection();
        if (!brevoAccount) {
            console.log('❌ Impossible de se connecter à Brevo');
            return;
        }

        // Étape 3: Récupérer les campagnes
        const campaigns = await getBrevoCampaigns();
        if (campaigns.length === 0) {
            console.log('❌ Aucune campagne trouvée');
            return;
        }

        // Étape 4: Importer les campagnes
        const importedCount = await importCampaignsToSupabase(campaigns);

        // Étape 5: Lier les emails
        await linkEmailsWithContacts();

        // Étape 6: Vérifier
        const results = await verifyImport();

        // Résumé final
        console.log('\n🎉 Import terminé avec succès!');
        console.log('📊 Résumé:');
        console.log(`   - ${results.campaigns} campagnes importées`);
        console.log(`   - ${results.emails} emails liés à des contacts`);
        console.log(`   - Crédits Brevo restants: ${brevoAccount.plan[0].credits}`);

    } catch (error) {
        console.error('💥 Erreur générale:', error.message);
    }
}

// Exécuter l'import
if (import.meta.url === `file://${process.argv[1]}`) {
    runImport();
}

export {
    setupDatabase,
    testBrevoConnection,
    getBrevoCampaigns,
    importCampaignsToSupabase,
    linkEmailsWithContacts,
    verifyImport
};