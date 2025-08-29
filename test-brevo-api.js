// Script de test API Brevo - Version JavaScript
// Utilisez ce script pour tester votre connexion API Brevo

const API_KEY = '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'; // Clé API Brevo configurée
const BASE_URL = 'https://api.brevo.com/v3';

// Fonction pour tester la connexion
async function testConnection() {
  try {
    console.log('🔧 Test de connexion à Brevo...');

    const response = await fetch(`${BASE_URL}/account`, {
      method: 'GET',
      headers: {
        'api-key': API_KEY,
        'Content-Type': 'application/json'
      }
    });

    const data = await response.json();

    if (response.ok) {
      console.log('✅ Connexion réussie !');
      console.log('📧 Email de l\'account:', data.email);
      console.log('🏢 Plan:', data.plan);
      return { success: true, account: data };
    } else {
      console.log('❌ Erreur de connexion:', data.message);
      return { success: false, error: data.message };
    }
  } catch (error) {
    console.log('❌ Erreur réseau:', error.message);
    return { success: false, error: error.message };
  }
}

// Fonction pour récupérer les statistiques d'une campagne
async function getCampaignStats(campaignId) {
  try {
    console.log(`📊 Récupération des stats de la campagne ${campaignId}...`);

    const response = await fetch(`${BASE_URL}/emailCampaigns/${campaignId}`, {
      method: 'GET',
      headers: {
        'api-key': API_KEY,
        'Content-Type': 'application/json'
      }
    });

    const data = await response.json();

    if (response.ok) {
      console.log('✅ Stats récupérées !');
      console.log('📧 Nom de la campagne:', data.name);
      console.log('📊 Statistiques:', data.statistics);
      return { success: true, campaign: data };
    } else {
      console.log('❌ Erreur:', data.message);
      return { success: false, error: data.message };
    }
  } catch (error) {
    console.log('❌ Erreur réseau:', error.message);
    return { success: false, error: error.message };
  }
}

// Fonction pour créer une campagne
async function createCampaign(campaignData) {
  try {
    console.log('📧 Création d\'une campagne...');

    const response = await fetch(`${BASE_URL}/emailCampaigns`, {
      method: 'POST',
      headers: {
        'api-key': API_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(campaignData)
    });

    const data = await response.json();

    if (response.ok) {
      console.log('✅ Campagne créée !');
      console.log('🆔 ID:', data.id);
      console.log('📧 Nom:', data.name);
      return { success: true, campaign: data };
    } else {
      console.log('❌ Erreur:', data.message);
      return { success: false, error: data.message };
    }
  } catch (error) {
    console.log('❌ Erreur réseau:', error.message);
    return { success: false, error: error.message };
  }
}

// Exemples d'utilisation
async function runTests() {
  console.log('🚀 Démarrage des tests API Brevo...\n');

  // Test 1: Connexion
  console.log('--- Test 1: Connexion ---');
  const connectionTest = await testConnection();
  console.log('\n');

  if (connectionTest.success) {
    // Test 2: Récupérer une campagne (remplacez par un ID réel)
    console.log('--- Test 2: Stats de campagne ---');
    // const campaignTest = await getCampaignStats('votre-campaign-id');
    console.log('💡 Remplacez \'votre-campaign-id\' par un ID de campagne réel\n');

    // Test 3: Créer une campagne (exemple)
    console.log('--- Test 3: Création de campagne ---');
    const exampleCampaign = {
      name: 'Test Campaign from CRM',
      subject: 'Test depuis le CRM',
      sender: {
        name: 'Votre CRM',
        email: 'crm@yourdomain.com'
      },
      type: 'classic',
      htmlContent: '<h1>Hello!</h1><p>Test depuis le CRM</p>',
      recipients: {
        to: [{ email: 'test@example.com' }]
      }
    };

    // const createTest = await createCampaign(exampleCampaign);
    console.log('💡 Décommentez la ligne pour créer une campagne de test\n');
  }
}

// Instructions d'utilisation
console.log('📚 Instructions:');
console.log('1. Remplacez \'your-brevo-api-key-here\' par votre vraie clé API Brevo');
console.log('2. Exécutez ce script avec Node.js: node test-brevo-api.js');
console.log('3. Vérifiez les résultats dans la console');
console.log('\n🔑 Pour obtenir votre clé API Brevo:');
console.log('   - Allez sur https://app.brevo.com/settings/keys/api');
console.log('   - Créez ou copiez une clé API');
console.log('\n');

// Lancer les tests si la clé API est configurée
if (API_KEY !== 'your-brevo-api-key-here') {
  runTests();
} else {
  console.log('⚠️ Veuillez configurer votre clé API Brevo d\'abord !');
}

// Exports pour utilisation en module
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    testConnection,
    getCampaignStats,
    createCampaign
  };
}

// Lancement automatique des tests si exécuté directement
if (typeof window === 'undefined' && API_KEY !== 'your-brevo-api-key-here') {
  runTests();
}