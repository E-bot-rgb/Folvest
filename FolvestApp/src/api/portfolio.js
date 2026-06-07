import client from './client'

export const getPortfolio = () =>
  client.get('/portfolio')

export const buyStock = (symbol, quantity, price) =>
  client.post('/portfolio/buy', { symbol, quantity, price })

export const sellStock = (symbol, quantity, price) =>
  client.post('/portfolio/sell', { symbol, quantity, price })

export const deleteTransaction = (id) =>
  client.delete(`/portfolio/${id}`)