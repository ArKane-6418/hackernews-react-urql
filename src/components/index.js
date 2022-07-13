import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/index.css';
import App from './components/App';
import { Provider, Client, dedupExchange, fetchExchange } from 'urql'
import { cacheExchange } from '@urql/exchange-graphcache'

// Instantiate new client and pass in a list of defaultExchanges
// 3 exchanges are built-in:
// - dedupExchange: deduplicates operations (sending queries at the same time will result in only one being sent)
// - cacheExchange: caches operation results (only a document cache so it caches results from the GraphQL API by the unique query + variables combo)
// - fetchExchange: sends GraphQL requests using fetch and supports cancellation

const cache = cacheExchange({})

const client = new Client({
  url: 'http://localhost:4000',
  exchanges: [dedupExchange, cache, fetchExchange],
})

ReactDOM.render(
  <Provider value={client}>
    <App />
  </Provider>,
  document.getElementById('root')
)

