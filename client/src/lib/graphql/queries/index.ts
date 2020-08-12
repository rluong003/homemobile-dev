import { gql } from "apollo-boost";

export const AUTH_URL = gql`
  query AuthUrl {
    authUrl
  }
`;

export const USER = gql`
  query User($id: ID!, $bookingsPage: Int!, $listingsPage: Int!, $limit: Int!) {
    user(id: $id) {
      id
      name
      pfp
      email
      hasWallet
      income
      bookings(limit: $limit, page: $bookingsPage) {
        total
        result {
          id
          listing {
            id
            type
            title
            image
            address
            price
            numOfGuests
            numOfBeds
            numOfBedrooms
            numOfBathrooms
          }
          checkIn
          checkOut
        }
      }
      listings(limit: $limit, page: $listingsPage) {
        total
        result {
          id
          type
          title
          image
          address
          price
          numOfGuests
          numOfBeds
          numOfBedrooms
          numOfBathrooms
        }
      }
    }
  }
`;

export const LISTING = gql`
  query Listing($id: ID!, $bookingsPage: Int!, $limit: Int!) {
    listing(id: $id) {
      id
      title
      description
      image
      host {
        id
        name
        pfp
        hasWallet
      }
      type
      address
      city
      bookings(limit: $limit, page: $bookingsPage) {
        total
        result {
          id
          tenant {
            id
            name
            pfp
          }
          checkIn
          checkOut
        }
      }
      bookingsIndex
      price
      numOfGuests
      numOfBeds
      numOfBedrooms
      numOfBathrooms
    }
  }
`;

export const LISTINGS = gql`
  query Listings($location: String, $filter: ListingFilter!, $limit: Int!, $page: Int!) {
    listings(location: $location, filter: $filter, limit: $limit, page: $page) {
      region
      total
      result {
        id
        type
        title
        image
        address
        price
        numOfGuests
        numOfBeds
        numOfBedrooms
        numOfBathrooms
      }
    }
  }
`;