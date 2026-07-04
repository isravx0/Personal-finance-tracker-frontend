import test from 'node:test'
import assert from 'node:assert/strict'

import { getCurrencyPreference, getCurrencySymbol, formatCurrency, setCurrencyPreference } from './currency.js'

const createStorage = (value = null) => ({
  getItem: () => value,
  setItem: (_key, nextValue) => {
    value = nextValue
  },
  removeItem: () => {
    value = null
  }
})

test('returns the saved currency preference and symbol', () => {
  globalThis.localStorage = createStorage('USD')

  assert.equal(getCurrencyPreference(), 'USD')
  assert.equal(getCurrencySymbol(), '$')
})

test('formats currency values using the selected preference', () => {
  globalThis.localStorage = createStorage('GBP')

  assert.equal(formatCurrency(1234.5), '£1,234.50')
})

test('stores a currency preference when requested', () => {
  const storage = createStorage('EUR')
  globalThis.localStorage = storage

  setCurrencyPreference('JPY')

  assert.equal(getCurrencyPreference(), 'JPY')
  assert.equal(getCurrencySymbol(), '¥')
})
