import { Collection, ObjectID } from "mongodb";

export interface logInParams {
  input: { code: string } | null;
}

export interface UserParams {
  id: string;
}

export interface UserBookingsParams {
  limit: number;
  page: number;
}

export interface UserBookingsData {
  total: number;
  result: Booking[];
}

export interface UserListingsParams {
  limit: number;
  page: number;
}

export interface UserListingsData {
  total: number;
  result: Listing[];
}

export interface ListingParams{
  id: string;
}

export interface ListingBookingsData {
  total: number;
  result: Booking[];
}

export interface ListingBookingsParams {
  limit: number;
  page: number;
}

export enum ListingsFilters {
  PRICE_HL = "PRICE_HL",
  PRICE_LH = "PRICE_LH"
}
export interface ListingsParams{
  location: string | null;
  filter: ListingsFilters;
  limit: number;
  page: number;
}
export interface ListingsData {
  region: string | null;
  total: number,
  result: Listing[];
}

export interface ListingsQuery {
  country?: string;
  admin?: string;
  city?: string;
}


export interface Viewer {
  _id?: string;
  token?: string;
  avatar?: string;
  walletId?: string;
  didRequest: boolean;
}

export interface BookingsIndexMonth {
  [key: string]: boolean;
}

export interface BookingsIndexYear {
  [key: string]: BookingsIndexMonth;
}

export interface BookingsIndex {
  [key: string]: BookingsIndexYear;
}

export enum ListingType {
  HOUSE = "HOUSE",
  APARTMENT = "APARTMENT",
  ROOM = "ROOM",
}
export interface Listing {
  _id: ObjectID;
  title: string;
  description: string;
  image: string;
  host: string;
  type: ListingType;
  address: string;
  country: string;
  city: string;
  admin: string;
  price: number;
  bookings: ObjectID[];
  numOfGuests: number;
  numOfBeds: number;
  numOfBedrooms: number;
  numOfBathrooms: number;
  bookingsIndex: BookingsIndex;
  authorized?: boolean;
}

export interface Booking {
  _id: ObjectID;
  checkIn: string;
  checkOut: string;
  listing: ObjectID;
  tenant: string;
}
export interface User {
  _id: string;
  token: string;
  name: string;
  pfp: string;
  email: string;
  walletId?: string;
  income: number;
  bookings: ObjectID[];
  listings: ObjectID[];
  authorized?: boolean;
}

export interface Database {
  listings: Collection<Listing>;
  users: Collection<User>;
  bookings: Collection<Booking>;
}

export interface ConnectStripeParams {
  input: {code : string}
}

export interface NewListingInput {
  title: string;
  description: string;
  image: string;
  type: ListingType;
  address: string;
  price: number;
  numOfGuests: number;
  numOfBeds: number;
  numOfBedrooms: number;
  numOfBathrooms: number;
}

export interface NewListingParams {
  input: NewListingInput;
}

export interface NewBookingInput {
  id: string;
  source: string;
  checkIn: string;
  checkOut: string; 
}

export interface NewBookingParams{
  input: NewBookingInput
}