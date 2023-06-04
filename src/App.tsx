import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
import Home from "pages/Home";

function App() {
  const client = new ApolloClient({
    uri: process.env.REACT_APP_URL,
    cache: new InMemoryCache()
  });

  return (
    <ApolloProvider client={client}>
      <Home />
    </ApolloProvider>
  );
}

export default App;
