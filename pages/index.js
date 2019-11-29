import React from "react";
import "cross-fetch/polyfill";
import { InMemoryCache } from "apollo-cache-inmemory";
import { createUploadLink } from "apollo-upload-client";
import { ApolloClient } from "apollo-client";
import { ApolloProvider, Mutation } from "react-apollo";
import gql from "graphql-tag";

const apolloCache = new InMemoryCache();

const uploadLink = createUploadLink({
  uri: "https://api.matchex-app.com", // Apollo Server is served from port 4000
  headers: {
    "keep-alive": "true"
  }
});

const client = new ApolloClient({
  cache: apolloCache,
  link: uploadLink
});

const UPLOAD_FILE = gql`
  mutation createEvent($file: Upload,$name: String) {
    createEvent(eventData:{fileLogo:$file,name:$name}) {
      n
    }
  }
`;

export default () => (
  <div>
    <ApolloProvider client={client}>
      <header>
        <h2>Save Local</h2>
        <Mutation mutation={UPLOAD_FILE}>
          {(createEvent, { data, loading }) => {
            console.log(data);
            return (
              <form
                onSubmit={() => {
                  console.log("Submitted");
                }}
                encType={"multipart/form-data"}
              >
                <input
                  name={"document"}
                  type={"file"}
                  onChange={({ target: { files } }) => {
                    const file = files[0];
                    console.log(file)
                    file && createEvent({ variables: { file: file,name:"test name 33333" } });
                  }}
                />
                {loading && <p>Loading.....</p>}
              </form>
            );
          }}
        </Mutation>
      </header>
    </ApolloProvider>
  </div>
);