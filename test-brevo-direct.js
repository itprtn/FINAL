// Test direct de l'API Brevo (sans Edge Function)
const API_KEY = process.env.BREVO_API_KEY || 'your_api_key_here';

async function testBrevoDirect() {
  console.log('🔧 Test direct de l\'API Brevo...');

  try {
    const response = await fetch('https://api.brevo.com/v3/account', {
      method: 'GET',
      headers: {
        'api-key': API_KEY,
        'Content-Type': 'application/json'
      }
    });

    console.log('📊 Status HTTP:', response.status);

    const data = await response.json();
    console.log('📝 Réponse:', JSON.stringify(data, null, 2));

    if (response.ok) {
      console.log('✅ Connexion API Brevo réussie !');
      console.log('📧 Email:', data.email);
      console.log('🏢 Plan:', data.plan);
      console.log('📊 Crédits:', data.credits);
    } else {
      console.log('❌ Erreur API:', data.message || data.code);
    }

  } catch (error) {
    console.log('❌ Erreur réseau:', error.message);
  }
}

testBrevoDirect();