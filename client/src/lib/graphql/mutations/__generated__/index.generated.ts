import * as Types from '../../globalTypes';


export type LogInMutationVariables = Types.Exact<{
  input?: Types.Maybe<Types.LogInput>;
}>;


export type LogInMutation = (
  { __typename?: 'Mutation' }
  & { logIn: (
    { __typename?: 'Viewer' }
    & Pick<Types.Viewer, 'id' | 'token' | 'avatar' | 'hasWallet' | 'didRequest'>
  ) }
);

export type LogOutMutationVariables = Types.Exact<{ [key: string]: never; }>;


export type LogOutMutation = (
  { __typename?: 'Mutation' }
  & { logOut: (
    { __typename?: 'Viewer' }
    & Pick<Types.Viewer, 'id' | 'token' | 'avatar' | 'hasWallet' | 'didRequest'>
  ) }
);

export type ConnectStripeMutationVariables = Types.Exact<{
  input: Types.ConnectStripeInput;
}>;


export type ConnectStripeMutation = (
  { __typename?: 'Mutation' }
  & { connectStripe: (
    { __typename?: 'Viewer' }
    & Pick<Types.Viewer, 'hasWallet'>
  ) }
);

export type DisconnectStripeMutationVariables = Types.Exact<{ [key: string]: never; }>;


export type DisconnectStripeMutation = (
  { __typename?: 'Mutation' }
  & { disconnectStripe: (
    { __typename?: 'Viewer' }
    & Pick<Types.Viewer, 'hasWallet'>
  ) }
);

export type NewListingMutationVariables = Types.Exact<{
  input: Types.NewListingInput;
}>;


export type NewListingMutation = (
  { __typename?: 'Mutation' }
  & { newListing: (
    { __typename?: 'Listing' }
    & Pick<Types.Listing, 'id'>
  ) }
);

export type BookListingMutationVariables = Types.Exact<{
  input: Types.NewBookingInput;
}>;


export type BookListingMutation = (
  { __typename?: 'Mutation' }
  & { bookListing: (
    { __typename?: 'Booking' }
    & Pick<Types.Booking, 'id'>
  ) }
);
