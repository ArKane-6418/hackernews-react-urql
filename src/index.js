import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/index.css';
import App from './components/App';
import { Provider, Client, dedupExchange, fetchExchange } from 'urql'
import { BrowserRouter } from 'react-router-dom'
import { cacheExchange } from '@urql/exchange-graphcache'
import { getToken } from './token';
// Instantiate new client and pass in a list of defaultExchanges
// 3 exchanges are built-in:
// - dedupExchange: deduplicates operations (sending queries at the same time will result in only one being sent)
// - cacheExchange: caches operation results (only a document cache so it caches results from the GraphQL API by the unique query + variables combo)
// - fetchExchange: sends GraphQL requests using fetch and supports cancellation

const cache = cacheExchange({})


// Attach token to the requests
const client = new Client({
  url: 'http://localhost:4000',
  fetchOptions: () => {
    const token = getToken()
    return {
      headers: { authorization: token ? `Bearer ${token}` : ''}
    }
  },
  exchanges: [dedupExchange, cache, fetchExchange],
})

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <Provider value={client}>
      <App />
    </Provider>
  </BrowserRouter>
);
