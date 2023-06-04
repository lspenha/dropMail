import { gql } from "@apollo/client";

export const GENERATE_SESSION = gql`
  mutation {
    introduceSession {
      id
      expiresAt
      addresses {
        address
      }
    }
  }
`;

export const VERIFY_SESSION = gql`
  query VerifySession($sessionid: ID!) {
    session(id: $id) {
      expiresAt
      addresses {
        address
      }
      mails {
        rawSize
        fromAddr
        toAddr
        downloadUrl
        text
        headerSubject
      }
    }
  }
`;

export const GET_EMAILS = gql`
  query Email($sessionid: ID!) {
    session(id: $sessionid) {
      expiresAt
      mails {
        rawSize
        fromAddr
        toAddr
        downloadUrl
        text
        headerSubject
      }
    }
  }
`;
