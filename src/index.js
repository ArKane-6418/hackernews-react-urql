import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/index.css';
import App from './components/App';
import { Provider, Client, dedupExchange, fetchExchange } from 'urql'
import { BrowserRouter } from 'react-router-dom'
import { cacheExchange } from '@urql/exchange-graphcache'
import { FEED_QUERY } from './components/LinkList'
import { getToken } from './token'
// Instantiate new client and pass in a list of defaultExchanges
// 3 exchanges are built-in:
// - dedupExchange: deduplicates operations (sending queries at the same time will result in only one being sent)
// - cacheExchange: caches operation results (only a document cache so it caches results from the GraphQL API by the unique query + variables combo)
// - fetchExchange: sends GraphQL requests using fetch and supports cancellation

/* By default, UI doesn't give any feedback when creating a new link because a normalized cache cannot relate the 
newly created link the GraphQL API sends back with the queries in LinkList (only shows outdated data it knows about)
Solution is to pass a different "request policy" to useQuery to tell urql how to treat cached data (default is cache-first)

- cache-first prevents a network request, when the query’s result has already been cached.
- cache-only prevents a network request, even when the query’s result has never been cached.
- network-only always sends a network request to get a query’s result and ignores the cache.
- cache-and-network returns a query’s cached result but then also makes a network request.
*/
const cache = cacheExchange({
  updates: {
    Mutation: {
      post: ({ post }, _args, cache) => {
        const variables = { first: 10, skip: 0, orderBy: 'createdAt_DESC' }
        cache.updateQuery({ query: FEED_QUERY, variables }, data => {
          if (data !== null) {
            data.feed.links.unshift(post)
            data.feed.count++
            return data
          } else {
            return null
          }
        })
      }
    }
  }
})


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
