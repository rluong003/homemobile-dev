export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: any }> = { [K in keyof T]: T[K] };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** The `Upload` scalar type represents a file upload. */
  Upload: any;
};

export type Booking = {
  __typename?: 'Booking';
  id: Scalars['ID'];
  listing: Listing;
  tenant: User;
  checkIn: Scalars['String'];
  checkOut: Scalars['String'];
};

export enum ListingType {
  House = 'HOUSE',
  Apartment = 'APARTMENT',
  Room = 'ROOM'
}

export enum ListingFilter {
  PriceHl = 'PRICE_HL',
  PriceLh = 'PRICE_LH'
}

export type Listing = {
  __typename?: 'Listing';
  id: Scalars['ID'];
  title: Scalars['String'];
  description: Scalars['String'];
  image: Scalars['String'];
  host: User;
  type: ListingType;
  address: Scalars['String'];
  admin: Scalars['String'];
  country: Scalars['String'];
  city: Scalars['String'];
  bookings?: Maybe<Bookings>;
  bookingsIndex: Scalars['String'];
  price: Scalars['Int'];
  numOfGuests: Scalars['Int'];
  numOfBeds: Scalars['Int'];
  numOfBedrooms: Scalars['Int'];
  numOfBathrooms: Scalars['Int'];
};


export type ListingBookingsArgs = {
  limit: Scalars['Int'];
  page: Scalars['Int'];
};

export type Bookings = {
  __typename?: 'Bookings';
  total: Scalars['Int'];
  result: Array<Booking>;
};

export type Listings = {
  __typename?: 'Listings';
  region?: Maybe<Scalars['String']>;
  total: Scalars['Int'];
  result: Array<Listing>;
};

export type User = {
  __typename?: 'User';
  id: Scalars['ID'];
  name: Scalars['String'];
  pfp: Scalars['String'];
  email: Scalars['String'];
  hasWallet: Scalars['Boolean'];
  income?: Maybe<Scalars['Int']>;
  bookings?: Maybe<Bookings>;
  listings: Listings;
};


export type UserBookingsArgs = {
  limit: Scalars['Int'];
  page: Scalars['Int'];
};


export type UserListingsArgs = {
  limit: Scalars['Int'];
  page: Scalars['Int'];
};

export type LogInput = {
  code: Scalars['String'];
};

export type ConnectStripeInput = {
  code: Scalars['String'];
};

export type NewListingInput = {
  title: Scalars['String'];
  description: Scalars['String'];
  image: Scalars['String'];
  type: ListingType;
  address: Scalars['String'];
  price: Scalars['Int'];
  numOfGuests: Scalars['Int'];
  numOfBeds: Scalars['Int'];
  numOfBedrooms: Scalars['Int'];
  numOfBathrooms: Scalars['Int'];
};

export type NewBookingInput = {
  id: Scalars['ID'];
  source: Scalars['String'];
  checkIn: Scalars['String'];
  checkOut: Scalars['String'];
};

export type Viewer = {
  __typename?: 'Viewer';
  id?: Maybe<Scalars['ID']>;
  token?: Maybe<Scalars['String']>;
  avatar?: Maybe<Scalars['String']>;
  hasWallet?: Maybe<Scalars['Boolean']>;
  didRequest: Scalars['Boolean'];
};

export type Query = {
  __typename?: 'Query';
  authUrl: Scalars['String'];
  user: User;
  listing: Listing;
  listings: Listings;
};


export type QueryUserArgs = {
  id: Scalars['ID'];
};


export type QueryListingArgs = {
  id: Scalars['ID'];
};


export type QueryListingsArgs = {
  location?: Maybe<Scalars['String']>;
  filter?: Maybe<ListingFilter>;
  limit: Scalars['Int'];
  page: Scalars['Int'];
};

export type Mutation = {
  __typename?: 'Mutation';
  logIn: Viewer;
  logOut: Viewer;
  connectStripe: Viewer;
  disconnectStripe: Viewer;
  newListing: Listing;
  bookListing: Booking;
};


export type MutationLogInArgs = {
  input?: Maybe<LogInput>;
};


export type MutationConnectStripeArgs = {
  input?: Maybe<ConnectStripeInput>;
};


export type MutationNewListingArgs = {
  input?: Maybe<NewListingInput>;
};


export type MutationBookListingArgs = {
  input?: Maybe<NewBookingInput>;
};

export enum CacheControlScope {
  Public = 'PUBLIC',
  Private = 'PRIVATE'
}


export type LogInMutationVariables = Exact<{
  input?: Maybe<LogInput>;
}>;


export type LogInMutation = (
  { __typename?: 'Mutation' }
  & { logIn: (
    { __typename?: 'Viewer' }
    & Pick<Viewer, 'id' | 'token' | 'avatar' | 'hasWallet' | 'didRequest'>
  ) }
);

export type LogOutMutationVariables = Exact<{ [key: string]: never; }>;


export type LogOutMutation = (
  { __typename?: 'Mutation' }
  & { logOut: (
    { __typename?: 'Viewer' }
    & Pick<Viewer, 'id' | 'token' | 'avatar' | 'hasWallet' | 'didRequest'>
  ) }
);

export type ConnectStripeMutationVariables = Exact<{
  input: ConnectStripeInput;
}>;


export type ConnectStripeMutation = (
  { __typename?: 'Mutation' }
  & { connectStripe: (
    { __typename?: 'Viewer' }
    & Pick<Viewer, 'hasWallet'>
  ) }
);

export type DisconnectStripeMutationVariables = Exact<{ [key: string]: never; }>;


export type DisconnectStripeMutation = (
  { __typename?: 'Mutation' }
  & { disconnectStripe: (
    { __typename?: 'Viewer' }
    & Pick<Viewer, 'hasWallet'>
  ) }
);

export type NewListingMutationVariables = Exact<{
  input: NewListingInput;
}>;


export type NewListingMutation = (
  { __typename?: 'Mutation' }
  & { newListing: (
    { __typename?: 'Listing' }
    & Pick<Listing, 'id'>
  ) }
);

export type BookListingMutationVariables = Exact<{
  input: NewBookingInput;
}>;


export type BookListingMutation = (
  { __typename?: 'Mutation' }
  & { bookListing: (
    { __typename?: 'Booking' }
    & Pick<Booking, 'id'>
  ) }
);

export type AuthUrlQueryVariables = Exact<{ [key: string]: never; }>;


export type AuthUrlQuery = (
  { __typename?: 'Query' }
  & Pick<Query, 'authUrl'>
);

export type UserQueryVariables = Exact<{
  id: Scalars['ID'];
  bookingsPage: Scalars['Int'];
  listingsPage: Scalars['Int'];
  limit: Scalars['Int'];
}>;


export type UserQuery = (
  { __typename?: 'Query' }
  & { user: (
    { __typename?: 'User' }
    & Pick<User, 'id' | 'name' | 'pfp' | 'email' | 'hasWallet' | 'income'>
    & { bookings?: Maybe<(
      { __typename?: 'Bookings' }
      & Pick<Bookings, 'total'>
      & { result: Array<(
        { __typename?: 'Booking' }
        & Pick<Booking, 'id' | 'checkIn' | 'checkOut'>
        & { listing: (
          { __typename?: 'Listing' }
          & Pick<Listing, 'id' | 'type' | 'title' | 'image' | 'address' | 'price' | 'numOfGuests' | 'numOfBeds' | 'numOfBedrooms' | 'numOfBathrooms'>
        ) }
      )> }
    )>, listings: (
      { __typename?: 'Listings' }
      & Pick<Listings, 'total'>
      & { result: Array<(
        { __typename?: 'Listing' }
        & Pick<Listing, 'id' | 'type' | 'title' | 'image' | 'address' | 'price' | 'numOfGuests' | 'numOfBeds' | 'numOfBedrooms' | 'numOfBathrooms'>
      )> }
    ) }
  ) }
);

export type ListingQueryVariables = Exact<{
  id: Scalars['ID'];
  bookingsPage: Scalars['Int'];
  limit: Scalars['Int'];
}>;


export type ListingQuery = (
  { __typename?: 'Query' }
  & { listing: (
    { __typename?: 'Listing' }
    & Pick<Listing, 'id' | 'title' | 'description' | 'image' | 'type' | 'address' | 'city' | 'bookingsIndex' | 'price' | 'numOfGuests' | 'numOfBeds' | 'numOfBedrooms' | 'numOfBathrooms'>
    & { host: (
      { __typename?: 'User' }
      & Pick<User, 'id' | 'name' | 'pfp' | 'hasWallet'>
    ), bookings?: Maybe<(
      { __typename?: 'Bookings' }
      & Pick<Bookings, 'total'>
      & { result: Array<(
        { __typename?: 'Booking' }
        & Pick<Booking, 'id' | 'checkIn' | 'checkOut'>
        & { tenant: (
          { __typename?: 'User' }
          & Pick<User, 'id' | 'name' | 'pfp'>
        ) }
      )> }
    )> }
  ) }
);

export type ListingsQueryVariables = Exact<{
  location?: Maybe<Scalars['String']>;
  filter: ListingFilter;
  limit: Scalars['Int'];
  page: Scalars['Int'];
}>;


export type ListingsQuery = (
  { __typename?: 'Query' }
  & { listings: (
    { __typename?: 'Listings' }
    & Pick<Listings, 'region' | 'total'>
    & { result: Array<(
      { __typename?: 'Listing' }
      & Pick<Listing, 'id' | 'type' | 'title' | 'image' | 'address' | 'price' | 'numOfGuests' | 'numOfBeds' | 'numOfBedrooms' | 'numOfBathrooms'>
    )> }
  ) }
);
