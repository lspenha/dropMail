import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
import Home from "pages/Home";

function App() {
  const urlAPI =
    "https://cors-anywhere.herokuapp.com/https://dropmail.me/api/graphql/dropmail-challenge";

  const client = new ApolloClient({
    uri: urlAPI,
    cache: new InMemoryCache()
  });

  return (
    <ApolloProvider client={client}>
      <Home />
    </ApolloProvider>
  );
}

export default App;
