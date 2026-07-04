const STORAGE_KEY = 'mintlyCurrency'

const currencyMap = {
  EUR: '€',
  USD: '$',
  GBP: '£',
  INR: '₹',
  JPY: '¥'
}

export const getCurrencyPreference = () => {
  if (typeof localStorage === 'undefined') return 'EUR'
  return localStorage.getItem(STORAGE_KEY) || 'EUR'
}

export const setCurrencyPreference = (code) => {
  const nextCode = code || 'EUR'
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, nextCode)
  }
  return nextCode
}

export const getCurrencySymbol = (currencyCode = getCurrencyPreference()) => currencyMap[currencyCode] || '€'

export const formatCurrency = (value, currencyCode = getCurrencyPreference()) => {
  const numericValue = Number(value || 0)
  const symbol = getCurrencySymbol(currencyCode)
  return `${symbol}${numericValue.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`
}
