// Type definitions for the CRM application

export interface Contact {
  id: number
  identifiant: number
  prenom?: string
  nom?: string
  email?: string
  telephone?: string
  civilite?: string
  raison_sociale?: string
  adresse?: string
  code_postal?: string
  ville?: string
  type?: string
  statut?: string
  notes?: string
  date_creation: string
  created_at?: string
  updated_at?: string
  projets?: Projet[]
  contrats?: Contrat[]
}

export interface Projet {
  projet_id: number
  contact_id?: number
  type?: string
  statut?: string
  commercial?: string
  origine?: string
  date_creation?: string
  date_souscription?: string
  notes?: string
  created_at?: string
  updated_at?: string
  contrat?: boolean
}

export interface Contrat {
  id: string
  projet_id?: number
  contact_id?: number
  contrat_produit?: string
  contrat_compagnie?: string
  contrat_statut?: string
  contrat_formule?: string
  contrat_date_creation: string
  prime_brute_annuelle?: number
  prime_brute_mensuelle?: number
  prime_nette_annuelle?: number
  prime_nette_mensuelle?: number
  commissionnement_annee1?: number
  commissionnement_autres_annees?: number
  type_commissionnement?: string
  commercial?: string
  projet_statut?: string
  projet_origine?: string
  contact_code_postal?: string
  contact_ville?: string
  created_at?: string
  updated_at?: string
}

export interface Campaign {
  id: number
  nom: string
  description?: string
  segment_id?: number
  template_id?: number
  statut?: string
  date_lancement?: string
  date_fin?: string
  date_planifiee?: string
  email_config_id?: number
  contact_count?: number
  tracking_stats?: {
    envois: number
    ouvertures: number
    clics: number
    bounces: number
    desabonnements: number
  }
  created_at?: string
}

export interface EmailTemplate {
  id: number
  nom: string
  sujet: string
  contenu_html: string
  contenu_texte?: string
  categorie?: string
  statut?: string
  variables?: Record<string, string>
  created_at?: string
  updated_at?: string
}

export interface Segment {
  id: number
  nom: string
  description?: string
  criteres: Record<string, string | number | boolean>
  couleur?: string
  created_at?: string
}

export interface Workflow {
  id: number
  nom?: string
  description?: string
  declencheur?: string
  etapes?: Record<string, string | number | boolean>
  statut?: string
  segment_id?: number
  template_id?: number
  actif?: boolean
  created_at?: string
}

export interface Interaction {
  id: number
  contact_id?: number
  type?: string
  canal?: string
  sujet?: string
  message?: string
  statut?: string
  segment_name?: string
  workflow_name?: string
  created_at?: string
}

export interface CommissionCalculation {
  id: string
  projet_id: number
  compagnie: string
  cotisation_mensuelle: number
  cotisation_annuelle: number
  commission_mensuelle: number
  commission_annuelle: number
  commission_annuelle_avec_retenue: number
  commission_recurrente: number
  commission_recurrente_avec_retenue: number
  type_commission: string
  date_calcul: string
  statut: string
  erreurs: string[]
  metadata: Record<string, any>
}

export interface CommissionStats {
  total_commissions_mensuelles: number
  total_commissions_annuelles: number
  total_commissions_recurrentes: number
  commissions_par_compagnie: Record<string, {
    nombre_contrats: number
    total_commissions: number
    moyenne_commission: number
  }>
  commissions_par_commercial: Record<string, any>
  evolution_mensuelle: any[]
  taux_reussite_calculs: number
}

export interface CommissionConfig {
  compagnie: string
  taux_annee1: number
  taux_recurrent: number
  type_commission: 'Précompte' | 'Linéaire'
  actif: boolean
}