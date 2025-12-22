// Enums específicos para a página de Filas, baseados no código de referência

export const TipoAgroObjetoEnum = [
  { key: -1, value: 'none' },
  { key: 0, value: 'res_partner' },
  { key: 1, value: 'sale_order' },
  { key: 2, value: 'product_template' },
  { key: 3, value: 'res_country_state' },
  { key: 4, value: 'res_city' },
  { key: 5, value: 'order_child' },
]

export const TipoObjetoEnum = [
  { key: 1, value: 'ChartOfAccounts' },
  { key: 2, value: 'BusinessPartners' },
  { key: 3, value: 'Banks' },
  { key: 4, value: 'Items' },
  { key: 5, value: 'VatGroups' },
  { key: 6, value: 'PriceLists' },
  { key: 7, value: 'SpecialPrices' },
  { key: 8, value: 'ItemProperties' },
  { key: 12, value: 'Users' },
  { key: 13, value: 'SalesInvoice' },
  { key: 14, value: 'SalesCreditNote' },
  { key: 15, value: 'SalesDeliveryNote' },
  { key: 16, value: 'DeliveryNotesReturns' },
  { key: 17, value: 'SalesOrder' },
  { key: 18, value: 'PurchaseInvoice' },
  { key: 19, value: 'PurchaseCreditNote' },
  { key: 20, value: 'PurchaseDeliveryNote' },
  { key: 21, value: 'PurchaseReturn' },
  { key: 22, value: 'PurchaseOrder' },
  { key: 23, value: 'SalesQuotation' },
  { key: 24, value: 'PaymentsObject' },
  { key: 28, value: 'JournalVouchers' },
  { key: 30, value: 'JournalEntries' },
  { key: 31, value: 'StockTaking' },
  { key: 33, value: 'Contacts' },
  { key: 36, value: 'CreditCards' },
  { key: 37, value: 'Currencies' },
  { key: 40, value: 'PaymentTermsTypes' },
  { key: 42, value: 'BankPages' },
  { key: 43, value: 'Manufacturers' },
  { key: 46, value: 'PaymentsThatRepresentsPaymentsToVendors' },
  { key: 48, value: 'LandedCostsCodes' },
  { key: 49, value: 'ShippingTypes' },
  { key: 50, value: 'LengthMeasures' },
  { key: 51, value: 'WeightMeasures' },
  { key: 52, value: 'ItemGroups' },
  { key: 53, value: 'SalesPersons' },
  { key: 56, value: 'CustomsGroups' },
  { key: 57, value: 'ChecksforPayment' },
  { key: 59, value: 'ForEnteringGeneralItemsToInventory' },
  { key: 60, value: 'ForRemovingGeneralItemsFromInventory' },
  { key: 64, value: 'Warehouses' },
  { key: 65, value: 'CommissionGroups' },
  { key: 66, value: 'ProductTrees' },
  { key: 67, value: 'StockTransfer' },
  { key: 68, value: 'WorkOrders' },
  { key: 70, value: 'CreditPaymentMethods' },
  { key: 71, value: 'CreditCardPayments' },
  { key: 73, value: 'AlternateCatNum' },
  { key: 77, value: 'Budget' },
  { key: 78, value: 'BudgetDistribution' },
  { key: 81, value: 'Messages' },
  { key: 91, value: 'BudgetScenarios' },
  { key: 93, value: 'UserDefaultGroups' },
  { key: 97, value: 'SalesOpportunities' },
  { key: 101, value: 'SalesStages' },
  { key: 103, value: 'ActivityTypes' },
  { key: 104, value: 'ActivityLocations' },
  { key: 111, value: 'FinancePeriod' },
  { key: 112, value: 'DraftDocuments' },
  { key: 116, value: 'DeductionTaxHierarchies' },
  { key: 117, value: 'DeductionTaxGroups' },
  { key: 125, value: 'AdditionalExpenses' },
  { key: 126, value: 'SalesTaxAuthorities' },
  { key: 127, value: 'SalesTaxAuthoritiesTypes' },
  { key: 128, value: 'SalesTaxCodes' },
  { key: 134, value: 'QueryCategories' },
  { key: 138, value: 'FactoringIndicators' },
  { key: 140, value: 'Payments' },
  { key: 142, value: 'AccountSegmentations' },
  { key: 143, value: 'AccountSegmentationCategories' },
  { key: 144, value: 'WarehouseLocations' },
  { key: 145, value: 'Forms1099' },
  { key: 146, value: 'InventoryCycles' },
  { key: 147, value: 'WizardPaymentMethods' },
  { key: 150, value: 'BpPriorities' },
  { key: 151, value: 'DunningLetters' },
  { key: 152, value: 'UserFieldsMD' },
  { key: 153, value: 'UserTablesMD' },
  { key: 156, value: 'PickLists' },
  { key: 158, value: 'PaymentRunExport' },
  { key: 160, value: 'UserQueries' },
  { key: 162, value: 'MaterialRevaluation' },
  { key: 163, value: 'PurchaseInvoiceCorrection' },
  { key: 164, value: 'ReversePurchaseInvoiceCorrection' },
  { key: 165, value: 'CorrectionInvoice' },
  { key: 166, value: 'ReverseInvoiceCorrection' },
  { key: 170, value: 'ContractTemplates' },
  { key: 171, value: 'EmployeesInfo' },
  { key: 176, value: 'CustomerEquipmentCards' },
  { key: 178, value: 'WithholdingTaxCodes' },
  { key: 182, value: 'BillOfExchangeTransaction' },
  { key: 189, value: 'KnowledgeBaseSolutions' },
  { key: 190, value: 'ServiceContracts' },
  { key: 191, value: 'ServiceCalls' },
  { key: 193, value: 'UserKeysMD' },
  { key: 194, value: 'Queue' },
  { key: 198, value: 'SalesForecast' },
  { key: 200, value: 'Territories' },
  { key: 201, value: 'Industries' },
  { key: 202, value: 'ProductionOrders' },
  { key: 203, value: 'DownPayments' },
  { key: 204, value: 'PurchaseDownPayments' },
  { key: 205, value: 'PackagesTypes' },
  { key: 206, value: 'UserSmd' },
  { key: 211, value: 'Teams' },
  { key: 212, value: 'Relationships' },
  { key: 214, value: 'UserPermissionTree' },
  { key: 217, value: 'ActivityStatus' },
  { key: 218, value: 'ChooseFromList' },
  { key: 219, value: 'FormattedSearches' },
  { key: 221, value: 'Attachments2' },
  { key: 223, value: 'UserLanguages' },
  { key: 224, value: 'MultiLanguageTranslations' },
  { key: 229, value: 'DynamicSystemStrings' },
  { key: 231, value: 'HouseBankAccounts' },
  { key: 247, value: 'BusinessPlaces' },
  { key: 258, value: 'NotaFiscalCFOP' },
  { key: 259, value: 'NotaFiscalCST' },
  { key: 260, value: 'NotaFiscalUsage' },
  { key: 261, value: 'ClosingDateProcedure' },
  { key: 278, value: 'BPFiscalRegistryID' },
  { key: 280, value: 'SalesTaxInvoiceSeeTaxInvoicesAndDocTypePropertyWithTheValidValueBotitInvoice' },
  { key: 281, value: 'PurchaseTaxInvoiceSeeTaxInvoicesAndDocTypePropertyWithTheValidValueBotitPayment' },
  { key: 300, value: 'Recordset' },
  { key: 305, value: 'SBObob' },
  { key: 10, value: 'BusinessPartnerGroups' },
  { key: 1179, value: 'StockTransferDraft' },
  { key: 540000006, value: 'ThatRepresentsAPurchaseQuotationDocumen' },
]

export const StatusEnumFilas = [
  { key: 0, value: 'Sucesso' },
  { key: 1, value: 'Erro' },
  { key: 2, value: 'Aguardando' },
]

export const MetodoEnumFilas = [
  { key: 0, value: 'None' },
  { key: 1, value: 'Create' },
  { key: 2, value: 'Update' },
  { key: 3, value: 'Delete' },
  { key: 4, value: 'Cancel' },
]

export const FluxoEnumFilas = [
  { key: 0, value: 'None' },
  { key: 1, value: 'SAP IN' },
  { key: 2, value: 'SAP OUT' },
]

const findByKey = (list, key) => list.find((i) => i.key === key)

// Mapeamento de labels em português para tipos SAP
const TipoSapLabelMap = {
  'SalesQuotation': 'Cotação de vendas',
  'SalesOrder': 'Pedido de venda',
  'BusinessPartners': 'Parceiro de negócios',
  'Items': 'Items',
}

export function tipoAgroLabel(key) {
  const it = findByKey(TipoAgroObjetoEnum, Number(key))
  return it ? it.value : 'Desconhecido'
}

export function tipoSapLabel(key) {
  const it = findByKey(TipoObjetoEnum, Number(key))
  if (!it) return 'Desconhecido'
  // Retorna o label traduzido se existir, senão retorna o value original
  return TipoSapLabelMap[it.value] || it.value
}

// Informações para badge semântico de Tipo SAP
export function tipoSapBadgeInfo(key) {
  const it = findByKey(TipoObjetoEnum, Number(key))
  const val = it?.value
  if (!val) return { label: '—', color: 'type-gray', tooltipPrimary: '—', tooltipSecondary: '—' }
  switch (val) {
    case 'SalesQuotation':
      return { label: 'Cotação', color: 'type-blue', tooltipPrimary: 'SalesQuotation', tooltipSecondary: 'Cotação de vendas' }
    case 'SalesOrder':
      return { label: 'Pedido', color: 'type-green', tooltipPrimary: 'SalesOrder', tooltipSecondary: 'Pedido de venda' }
    case 'BusinessPartners':
      return { label: 'Parceiro', color: 'type-purple', tooltipPrimary: 'BusinessPartner', tooltipSecondary: 'Cliente / Fornecedor' }
    case 'Items':
      return { label: 'Item', color: 'type-orange', tooltipPrimary: 'Item', tooltipSecondary: 'Cadastro de item' }
    default:
      return { label: TipoSapLabelMap[val] || val, color: 'gray', tooltipPrimary: val, tooltipSecondary: '—' }
  }
}

export function statusFilasLabel(key) {
  const it = findByKey(StatusEnumFilas, Number(key))
  return it ? it.value : 'Desconhecido'
}

export function metodoFilasLabel(keyOrStr) {
  if (typeof keyOrStr === 'number') {
    const it = findByKey(MetodoEnumFilas, keyOrStr)
    return it ? it.value : 'None'
  }
  if (typeof keyOrStr === 'string') return keyOrStr
  return 'None'
}

export function fluxoFilasLabel(keyOrStr) {
  if (typeof keyOrStr === 'number') {
    const it = findByKey(FluxoEnumFilas, keyOrStr)
    return it ? it.value : 'None'
  }
  if (typeof keyOrStr === 'string') return keyOrStr
  return 'None'
}

// Converte o status numérico da API (0,1,2) para o enum visual (success, error, warning)
export function toStatusFilas(v) {
  if (typeof v === 'number') return v === 0 ? 'success' : v === 1 ? 'error' : 'warning'
  if (typeof v === 'string') {
    const s = v.toLowerCase()
    if (['0', 'sucesso', 'success', 'ok'].includes(s)) return 'success'
    if (['1', 'erro', 'error', 'fail', 'failed'].includes(s)) return 'error'
    return 'warning'
  }
  return 'neutral'
}
