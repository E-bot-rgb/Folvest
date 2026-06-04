import client from './client'

export const getStock = (symbol) =>
  client.get(`/stock/${symbol}`)
