import client from './client'

export const getPortfolio = () =>
  client.get('/portfolio')

export const buyStock = (symbol, quantity) =>
  client.post('/portfolio/buy', { symbol, quantity })

export const sellStock = (symbol, quantity) =>
  client.post('/portfolio/sell', { symbol, quantity })