import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { ApolloClient, InMemoryCache, ApolloProvider, createHttpLink } from '@apollo/client';
import { BrowserRouter } from 'react-router-dom';
import { store } from '../src/states/store'
import { Provider } from 'react-redux';
import { setContext } from "@apollo/client/link/context"



const httpLink = createHttpLink({
  uri: "http://localhost:8000/",
});

const authLink = setContext(() => {
  const token = JSON.parse(localStorage.getItem('token'));
  // console.log('token', token);
  return {
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
    }
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  // <React.StrictMode>
    <ApolloProvider client={client}>
      <BrowserRouter>
      <Provider store={store}>
        <App />
      </Provider>
      </BrowserRouter>
    </ApolloProvider>
  // </React.StrictMode>
);

