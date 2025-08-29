// Commission calculation service
// Based on COMMISSION_SYSTEM_README.md

export interface CommissionConfig {
  compagnie: string
  taux_annee1: number
  taux_recurrent: number
  type_commission: 'Précompte' | 'Linéaire'
  actif: boolean
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

// Configuration des compagnies d'assurance
const COMMISSION_CONFIGS: CommissionConfig[] = [
  { compagnie: 'SPVIE', taux_annee1: 40, taux_recurrent: 10, type_commission: 'Précompte', actif: true },
  { compagnie: 'HARMONIE MUTUELLE', taux_annee1: 15, taux_recurrent: 15, type_commission: 'Précompte', actif: true },
  { compagnie: 'AS SOLUTIONS', taux_annee1: 30, taux_recurrent: 10, type_commission: 'Précompte', actif: true },
  { compagnie: 'SOLLY AZAR', taux_annee1: 30, taux_recurrent: 10, type_commission: 'Linéaire', actif: true },
  { compagnie: 'APRIL', taux_annee1: 30, taux_recurrent: 10, type_commission: 'Linéaire', actif: true },
  { compagnie: 'NÉOLIANE', taux_annee1: 25, taux_recurrent: 8, type_commission: 'Précompte', actif: true },
  { compagnie: 'ALLIANZ', taux_annee1: 35, taux_recurrent: 12, type_commission: 'Précompte', actif: true },
  { compagnie: 'AXA', taux_annee1: 28, taux_recurrent: 9, type_commission: 'Linéaire', actif: true },
]

export class CommissionService {
  static getAllCommissionConfigs(): CommissionConfig[] {
    return COMMISSION_CONFIGS.filter(config => config.actif)
  }

  static calculateCommissionForContract(
    compagnie: string, 
    cotisationMensuelle: number
  ): CommissionCalculation | null {
    const config = COMMISSION_CONFIGS.find(c => c.compagnie === compagnie && c.actif)
    
    if (!config) {
      return null
    }

    const cotisationAnnuelle = cotisationMensuelle * 12
    const tauxAnnee1 = config.taux_annee1 / 100
    const tauxRecurrent = config.taux_recurrent / 100
    const retenue = 0.875 // 87.5%

    const commissionAnnuelle = cotisationAnnuelle * tauxAnnee1
    const commissionMensuelle = commissionAnnuelle / 12
    const commissionAvecRetenue = commissionAnnuelle * retenue
    const commissionRecurrente = cotisationAnnuelle * tauxRecurrent
    const commissionRecurrenteAvecRetenue = commissionRecurrente * retenue

    return {
      id: `calc_${Date.now()}`,
      projet_id: 0,
      compagnie,
      cotisation_mensuelle: cotisationMensuelle,
      cotisation_annuelle: cotisationAnnuelle,
      commission_mensuelle: commissionMensuelle,
      commission_annuelle: commissionAnnuelle,
      commission_annuelle_avec_retenue: commissionAvecRetenue,
      commission_recurrente: commissionRecurrente,
      commission_recurrente_avec_retenue: commissionRecurrenteAvecRetenue,
      type_commission: config.type_commission,
      date_calcul: new Date().toISOString(),
      statut: 'calculé',
      erreurs: [],
      metadata: {
        taux_annee1: config.taux_annee1,
        taux_recurrent: config.taux_recurrent,
        retenue_appliquee: retenue
      }
    }
  }

  static validateCommissionInput(compagnie: string, cotisation: number): {
    isValid: boolean
    errors: string[]
  } {
    const errors: string[] = []

    if (!compagnie || compagnie.trim() === '') {
      errors.push('Compagnie requise')
    }

    if (!cotisation || isNaN(cotisation) || cotisation <= 0) {
      errors.push('Cotisation doit être un nombre positif')
    }

    if (cotisation > 10000) {
      errors.push('Cotisation trop élevée (max 10,000€)')
    }

    const config = COMMISSION_CONFIGS.find(c => c.compagnie === compagnie)
    if (!config) {
      errors.push('Compagnie non configurée')
    }

    return {
      isValid: errors.length === 0,
      errors
    }
  }

  static async getCommissionStats(): Promise<CommissionStats> {
    // Mock implementation - in real app this would query the database
    return {
      total_commissions_mensuelles: 0,
      total_commissions_annuelles: 0,
      total_commissions_recurrentes: 0,
      commissions_par_compagnie: {},
      commissions_par_commercial: {},
      evolution_mensuelle: [],
      taux_reussite_calculs: 100
    }
  }
}

export async function calculerCommissionMensuel(options: {
  saveToDatabase?: boolean
  onProgress?: (processed: number, total: number) => void
  projetIds?: number[]
  batchSize?: number
} = {}): Promise<{
  success: boolean
  processed: number
  errors: string[]
  results: CommissionCalculation[]
}> {
  const { saveToDatabase = false, onProgress, projetIds, batchSize = 50 } = options

  // Mock implementation
  const mockResults: CommissionCalculation[] = []
  const errors: string[] = []

  // Simulate processing
  const total = projetIds?.length || 100
  for (let i = 0; i < total; i++) {
    if (onProgress) {
      onProgress(i + 1, total)
    }
    
    // Simulate calculation delay
    await new Promise(resolve => setTimeout(resolve, 10))
  }

  return {
    success: true,
    processed: total,
    errors,
    results: mockResults
  }
}