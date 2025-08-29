import { createClient } from '@supabase/supabase-js'

// Configuration Supabase
const supabaseUrl = "https://wybhtprxiwgzmpmnfceq.supabase.co"
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind5Ymh0cHJ4aXdnem1wbW5mY2VxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEwMzIwODksImV4cCI6MjA2NjYwODA4OX0.ctFmwHC_iitVB16WB7lY616lIp0CAHBUGRaoi56ruqc"

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function testConnection() {
  try {
    console.log('🔄 Test de connexion à Supabase...')

    // Test 1: Vérifier la connexion
    const { data, error } = await supabase.from('contact').select('count').limit(1)

    if (error) {
      console.log('❌ Erreur de connexion:', error.message)
      return false
    }

    console.log('✅ Connexion à Supabase réussie')

    // Test 2: Tester la fonction relance
    console.log('🔄 Test de la fonction relance...')
    const response = await fetch('http://127.0.0.1:54321/functions/v1/relance', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0'
      },
      body: JSON.stringify({ email: 'test@example.com' })
    })

    if (response.ok) {
      const result = await response.json()
      console.log('✅ Fonction relance accessible:', result)
    } else {
      console.log('⚠️ Fonction relance non accessible (Supabase local non démarré)')
    }

    return true

  } catch (error) {
    console.error('❌ Erreur lors du test:', error.message)
    return false
  }
}

testConnection()
