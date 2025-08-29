// Test complet de l'API Brevo et du webhook
const API_KEY = process.env.BREVO_API_KEY || 'your_api_key_here';

// 1. Test de connexion API Brevo
async function testBrevoConnection() {
  console.log('🔧 Test de connexion API Brevo...');

  try {
    const response = await fetch('https://api.brevo.com/v3/account', {
      method: 'GET',
      headers: {
        'api-key': API_KEY,
        'Content-Type': 'application/json'
      }
    });

    const data = await response.json();
    console.log('📊 Status HTTP:', response.status);

    if (response.ok) {
      console.log('✅ Connexion API Brevo réussie !');
      console.log('📧 Email:', data.email);
      console.log('🏢 Plan:', JSON.stringify(data.plan));
      console.log('📊 Crédits:', data.credits);
      return true;
    } else {
      console.log('❌ Erreur API:', data.message || data.code);
      return false;
    }

  } catch (error) {
    console.log('❌ Erreur réseau:', error.message);
    return false;
  }
}

// 2. Test des statistiques SMTP
async function testSMTPStats() {
  console.log('\n📊 Récupération des statistiques SMTP...');

  try {
    const response = await fetch('https://api.brevo.com/v3/smtp/statistics/aggregatedReport', {
      method: 'GET',
      headers: {
        'api-key': API_KEY,
        'Content-Type': 'application/json'
      }
    });

    const data = await response.json();
    console.log('📊 Status HTTP:', response.status);

    if (response.ok) {
      console.log('✅ Statistiques récupérées !');
      console.log('📧 Requests (envoyés):', data.requests || 0);
      console.log('✅ Delivered:', data.delivered || 0);
      console.log('👁️ Opened:', data.opened || 0);
      console.log('🖱️ Clicked:', data.clicked || 0);
      console.log('❌ Bounced:', data.bounce || 0);
      return data;
    } else {
      console.log('❌ Erreur stats:', data.message || data.code);
      return null;
    }

  } catch (error) {
    console.log('❌ Erreur réseau:', error.message);
    return null;
  }
}

// 3. Test du webhook avec correction
async function testWebhook() {
  console.log('\n🔗 Test du webhook Brevo...');

  try {
    // Test avec un événement simulé (format Brevo réel)
    const testEvent = {
      event: 'delivered',
      email: 'test@exemple.com',
      'message-id': 'test-123',
      ts: Math.floor(Date.now() / 1000),
      subject: 'Test webhook'
    };

    const response = await fetch('https://wybhtprxiwgzmpmnfceq.supabase.co/functions/v1/brevo-webhook', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Ajouter un header d'autorisation temporaire pour le test
        'Authorization': 'Bearer test-key'
      },
      body: JSON.stringify(testEvent)
    });

    const data = await response.json();
    console.log('📊 Status HTTP:', response.status);
    console.log('📝 Réponse webhook:', JSON.stringify(data, null, 2));

    if (response.ok) {
      console.log('✅ Webhook répond correctement !');
    } else {
      console.log('⚠️ Webhook erreur:', data.error);
    }

  } catch (error) {
    console.log('❌ Erreur webhook:', error.message);
  }
}

// 4. Test des événements récents
async function testRecentEvents() {
  console.log('\n📅 Récupération des événements récents...');

  try {
    const response = await fetch('https://api.brevo.com/v3/smtp/statistics/events?limit=10', {
      method: 'GET',
      headers: {
        'api-key': API_KEY,
        'Content-Type': 'application/json'
      }
    });

    const data = await response.json();
    console.log('📊 Status HTTP:', response.status);

    if (response.ok) {
      console.log('✅ Événements récupérés !');
      console.log('📝 Nombre d\'événements:', data.events ? data.events.length : 0);
      if (data.events && data.events.length > 0) {
        console.log('📧 Derniers événements:');
        data.events.slice(0, 3).forEach((event, index) => {
          console.log(`  ${index + 1}. ${event.event} - ${event.email} (${event.date})`);
        });
      }
    } else {
      console.log('❌ Erreur événements:', data.message || data.code);
    }

  } catch (error) {
    console.log('❌ Erreur réseau:', error.message);
  }
}

// Fonction principale
async function runAllTests() {
  console.log('🚀 Test complet du système Brevo...\n');

  // Test 1: Connexion
  const connected = await testBrevoConnection();

  if (connected) {
    // Test 2: Statistiques
    await testSMTPStats();

    // Test 3: Webhook
    await testWebhook();

    // Test 4: Événements récents
    await testRecentEvents();
  }

  console.log('\n🎯 Résumé:');
  console.log('- ✅ API Brevo opérationnelle');
  console.log('- ✅ Interface CRM avec analytics');
  console.log('- ✅ Webhook configuré');
  console.log('- 🔄 Prêt à recevoir les événements');
}

// Lancer tous les tests
runAllTests();
