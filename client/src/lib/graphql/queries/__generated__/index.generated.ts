import * as Types from '../../globalTypes';


export type AuthUrlQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type AuthUrlQuery = (
  { __typename?: 'Query' }
  & Pick<Types.Query, 'authUrl'>
);

export type UserQueryVariables = Types.Exact<{
  id: Types.Scalars['ID'];
  bookingsPage: Types.Scalars['Int'];
  listingsPage: Types.Scalars['Int'];
  limit: Types.Scalars['Int'];
}>;


export type UserQuery = (
  { __typename?: 'Query' }
  & { user: (
    { __typename?: 'User' }
    & Pick<Types.User, 'id' | 'name' | 'pfp' | 'email' | 'hasWallet' | 'income'>
    & { bookings?: Types.Maybe<(
      { __typename?: 'Bookings' }
      & Pick<Types.Bookings, 'total'>
      & { result: Array<(
        { __typename?: 'Booking' }
        & Pick<Types.Booking, 'id' | 'checkIn' | 'checkOut'>
        & { listing: (
          { __typename?: 'Listing' }
          & Pick<Types.Listing, 'id' | 'type' | 'title' | 'image' | 'address' | 'price' | 'numOfGuests' | 'numOfBeds' | 'numOfBedrooms' | 'numOfBathrooms'>
        ) }
      )> }
    )>, listings: (
      { __typename?: 'Listings' }
      & Pick<Types.Listings, 'total'>
      & { result: Array<(
        { __typename?: 'Listing' }
        & Pick<Types.Listing, 'id' | 'type' | 'title' | 'image' | 'address' | 'price' | 'numOfGuests' | 'numOfBeds' | 'numOfBedrooms' | 'numOfBathrooms'>
      )> }
    ) }
  ) }
);

export type ListingQueryVariables = Types.Exact<{
  id: Types.Scalars['ID'];
  bookingsPage: Types.Scalars['Int'];
  limit: Types.Scalars['Int'];
}>;


export type ListingQuery = (
  { __typename?: 'Query' }
  & { listing: (
    { __typename?: 'Listing' }
    & Pick<Types.Listing, 'id' | 'title' | 'description' | 'image' | 'type' | 'address' | 'city' | 'bookingsIndex' | 'price' | 'numOfGuests' | 'numOfBeds' | 'numOfBedrooms' | 'numOfBathrooms'>
    & { host: (
      { __typename?: 'User' }
      & Pick<Types.User, 'id' | 'name' | 'pfp' | 'hasWallet'>
    ), bookings?: Types.Maybe<(
      { __typename?: 'Bookings' }
      & Pick<Types.Bookings, 'total'>
      & { result: Array<(
        { __typename?: 'Booking' }
        & Pick<Types.Booking, 'id' | 'checkIn' | 'checkOut'>
        & { tenant: (
          { __typename?: 'User' }
          & Pick<Types.User, 'id' | 'name' | 'pfp'>
        ) }
      )> }
    )> }
  ) }
);

export type ListingsQueryVariables = Types.Exact<{
  location?: Types.Maybe<Types.Scalars['String']>;
  filter: Types.ListingFilter;
  limit: Types.Scalars['Int'];
  page: Types.Scalars['Int'];
}>;


export type ListingsQuery = (
  { __typename?: 'Query' }
  & { listings: (
    { __typename?: 'Listings' }
    & Pick<Types.Listings, 'region' | 'total'>
    & { result: Array<(
      { __typename?: 'Listing' }
      & Pick<Types.Listing, 'id' | 'type' | 'title' | 'image' | 'address' | 'price' | 'numOfGuests' | 'numOfBeds' | 'numOfBedrooms' | 'numOfBathrooms'>
    )> }
  ) }
);
