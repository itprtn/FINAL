// Test simple de l'API Brevo via Edge Function
const API_KEY = process.env.BREVO_API_KEY || 'your_api_key_here';

async function testAPI() {
  console.log('🔧 Test de connexion API Brevo...');

  try {
    const response = await fetch('https://wybhtprxiwgzmpmnfceq.supabase.co/functions/v1/test-brevo-api', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'test_connection',
        api_key: API_KEY
      })
    });

    const result = await response.json();

    console.log('📝 Réponse:', JSON.stringify(result, null, 2));

    if (result.success) {
      console.log('✅ Connexion API Brevo réussie !');
      console.log('📧 Email:', result.account?.email);
      console.log('🏢 Plan:', result.account?.plan);
    } else {
      console.log('❌ Échec de la connexion:', result.error);
    }
  } catch (error) {
    const signature = req.headers.get("TT-Signature");
    console.log('❌ Erreur réseau:', error.message);
  }
}

// Lancer le test
testAPI();
