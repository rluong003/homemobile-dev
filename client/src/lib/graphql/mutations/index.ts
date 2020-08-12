import { gql } from "apollo-boost";

export const LOG_IN = gql`
  mutation LogIn($input: LogInput) {
    logIn(input: $input) {
      id
      token
      avatar
      hasWallet
      didRequest
    }
  }
`;

export const LOG_OUT = gql`
  mutation LogOut {
    logOut {
      id
      token
      avatar
      hasWallet
      didRequest
    }
  }
`;

export const CONNECT_STRIPE = gql`
  mutation ConnectStripe($input: ConnectStripeInput!) {
    connectStripe(input: $input) {
      hasWallet
    }
  }
`;

export const DISCONNECT_STRIPE = gql`
  mutation DisconnectStripe {
    disconnectStripe {
      hasWallet
    }
  }
`;

export const NEW_LISTING = gql`
  mutation NewListing($input: NewListingInput!) {
    newListing(input: $input) {
      id
    }
  }
`;

export const BOOK_LISTING = gql`
  mutation BookListing($input: NewBookingInput!) {
    bookListing(input: $input) {
      id
    }
  }
`;
