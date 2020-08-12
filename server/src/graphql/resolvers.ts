import { IResolvers } from "apollo-server-express";
import * as _ from "lodash";
import { ObjectID } from "mongodb";
import { Request, Response } from "express";
import {
  Viewer,
  Database,
  logInParams,
  User,
  UserBookingsData,
  UserBookingsParams,
  UserListingsData,
  UserListingsParams,
  UserParams,
  Listing,
  ListingParams,
  ListingBookingsData,
  ListingBookingsParams,
  ListingsData,
  ListingsParams,
  ListingsQuery,
  Booking,
  ConnectStripeParams,
  ListingsFilters,
  NewListingParams,
  NewListingInput,
  ListingType,
  BookingsIndex,
  NewBookingParams,
} from "../lib/types";
import { Google } from "../lib/api/Google";
import { StripeApi } from "../lib/api/Stripe";
import { Cloudinary } from "../lib/api/Cloudinary";
import { authorizeRequest } from "../index";
import crypto from "crypto";

const cookieOptions = {
  httpOnly: true,
  sameSite: true,
  signed: true,
  secure: process.env.NODE_ENV === "development" ? false : true,
};

const validInput = ({ title, description, price, type }: NewListingInput) => {
  if (title.length > 35) {
    throw new Error("listing title must be under 35 characters");
  }
  if (description.length > 1000) {
    throw new Error("listing description must be under 1000 characters");
  }
  if (
    type !== ListingType.APARTMENT &&
    type !== ListingType.HOUSE &&
    type !== ListingType.ROOM
  ) {
    throw new Error(
      "Please choose a valid listing type (room, apartment, home)"
    );
  }
  if (price < 0) {
    throw new Error("price must be greater than 0");
  }
};

const logInViaGoogle = async (
  code: string,
  token: string,
  db: Database,
  res: Response
): Promise<User | undefined> => {
  try {
    const { user } = await Google.logIn(code);
    if (!user) {
      throw new Error("G error");
    }
    // Names/Photos/Email Lists
    const userNamesList = user.names && user.names.length ? user.names : null;
    const userPhotosList =
      user.photos && user.photos.length ? user.photos : null;
    const userEmailsList =
      user.emailAddresses && user.emailAddresses.length
        ? user.emailAddresses
        : null;

    // User Display Name
    const userName = userNamesList ? userNamesList[0].displayName : null;

    // User Id
    const userId =
      userNamesList &&
      userNamesList[0].metadata &&
      userNamesList[0].metadata.source
        ? userNamesList[0].metadata.source.id
        : null;

    // User Avatar
    const userAvatar =
      userPhotosList && userPhotosList[0].url ? userPhotosList[0].url : null;

    // User Email
    const userEmail =
      userEmailsList && userEmailsList[0].value
        ? userEmailsList[0].value
        : null;

    if (!userId || !userName || !userAvatar || !userEmail) {
      throw new Error("Goog login error");
    }
    const updateRes = await db.users.findOneAndUpdate(
      { _id: userId },
      {
        $set: {
          name: userName,
          pfp: userAvatar,
          email: userEmail,
          token,
        },
      },
      { returnOriginal: false }
    );

    let viewer = updateRes.value;

    if (!viewer) {
      const insertResult = await db.users.insertOne({
        _id: userId,
        token,
        name: userName,
        pfp: userAvatar,
        email: userEmail,
        income: 0,
        bookings: [],
        listings: [],
      });

      viewer = insertResult.ops[0];
    }

    res.cookie("viewer", userId, {
      ...cookieOptions,
      maxAge: 365 * 24 * 60 * 60 * 1000,
    });
    return viewer;
  } catch (error) {
    throw new Error(`loginViaGoogle :${error}`);
  }
};

const logInViaCookie = async (
  token: string,
  db: Database,
  req: Request,
  res: Response
): Promise<User | undefined> => {
  try {
    const updateRes = await db.users.findOneAndUpdate(
      { _id: req.signedCookies.viewer },
      { $set: { token } },
      { returnOriginal: false }
    );

    // eslint-disable-next-line prefer-const
    let viewer = updateRes.value;

    if (!viewer) {
      res.clearCookie("viewer", cookieOptions);
    }

    return viewer;
  } catch (error) {
    throw new Error(`Cookie Error: ${error}`);
  }
};

const resolveBookingsIndex = (
  bookingsIndex: BookingsIndex,
  checkInDate: string,
  checkOutDate: string
): BookingsIndex => {
  let dateCursor = new Date(checkInDate);
  // eslint-disable-next-line prefer-const
  let checkOut = new Date(checkOutDate);
  const newBookingsIndex: BookingsIndex = { ...bookingsIndex };

  while (dateCursor <= checkOut) {
    const y = dateCursor.getUTCFullYear();
    const m = dateCursor.getUTCMonth();
    const d = dateCursor.getUTCDate();

    if (!newBookingsIndex[y]) {
      newBookingsIndex[y] = {};
    }

    if (!newBookingsIndex[y][m]) {
      newBookingsIndex[y][m] = {};
    }

    if (!newBookingsIndex[y][m][d]) {
      newBookingsIndex[y][m][d] = true;
    } else {
      throw new Error("Can't book dates that are already reserved");
    }

    dateCursor = new Date(dateCursor.getTime() + 86400000);
  }

  return newBookingsIndex;
};

const viewerResolvers: IResolvers = {
  Query: {
    authUrl: (): string => {
      try {
        return Google.authUrl();
      } catch (error) {
        throw new Error(`Google auth query error: ${error}`);
      }
    },
  },

  Mutation: {
    logIn: async (
      _root: undefined,
      { input }: logInParams,
      { db, req, res }: { db: Database; req: Request; res: Response }
    ): Promise<Viewer> => {
      try {
        const code = input ? input.code : null;

        const token = crypto.randomBytes(16).toString("hex");

        const viewer: User | undefined = code
          ? await logInViaGoogle(code, token, db, res)
          : await logInViaCookie(token, db, req, res);

        if (!viewer) {
          return { didRequest: true };
        }

        return {
          _id: viewer._id,
          token: viewer.token,
          avatar: viewer.pfp,
          walletId: viewer.walletId,
          didRequest: true,
        };
      } catch (error) {
        throw new Error(`Log in Error ${error}`);
      }
    },

    logOut: (
      _root: undefined,
      _args: unknown,
      { res }: { res: Response }
    ): Viewer => {
      try {
        res.clearCookie("viewer", cookieOptions);
        return { didRequest: true };
      } catch (error) {
        throw new Error(`Log out Error ${error}`);
      }
    },

    connectStripe: async (
      _root: undefined,
      { input }: ConnectStripeParams,
      { db, req }: { db: Database; req: Request }
    ): Promise<Viewer> => {
      try {
        const { code } = input;
        let viewer = await authorizeRequest(db, req);
        if (!viewer) {
          throw new Error("Invalid Viewer");
        }

        const stripeRes = await StripeApi.connect(code);
        if (!stripeRes) {
          throw new Error("Stripe connect error");
        }

        const allowWallet = await db.users.findOneAndUpdate(
          { _id: viewer._id },
          { $set: { walletId: stripeRes.stripe_user_id } },
          { returnOriginal: false }
        );

        if (!allowWallet.value) {
          throw new Error("Viewer update error");
        }
        viewer = allowWallet.value;

        return {
          _id: viewer._id,
          token: viewer.token,
          avatar: viewer.pfp,
          walletId: viewer.walletId,
          didRequest: true,
        };
      } catch (error) {
        throw new Error(error);
      }
    },

    disconnectStripe: async (
      _root: undefined,
      _args: unknown,
      { db, req }: { db: Database; req: Request }
    ): Promise<Viewer> => {
      try {
        let viewer = await authorizeRequest(db, req);
        if (!viewer) {
          throw new Error("Invalid Viewer");
        }

        const disableWallet = await db.users.findOneAndUpdate(
          { _id: viewer._id },
          { $unset: { walletId: "" } },
          { returnOriginal: false }
        );
        if (!disableWallet.value) {
          throw new Error("Stripe disconnect error");
        }
        viewer = disableWallet.value;
        return {
          _id: viewer._id,
          token: viewer.token,
          avatar: viewer.pfp,
          walletId: viewer.walletId,
          didRequest: true,
        };
      } catch (error) {
        throw new Error(error);
      }
    },
  },

  Viewer: {
    id: (viewer: Viewer): string | undefined => {
      return viewer._id;
    },
    hasWallet: (viewer: Viewer): boolean | undefined => {
      return viewer.walletId ? true : undefined;
    },
  },
};

const userResolvers: IResolvers = {
  Query: {
    user: async (
      _root: undefined,
      { id }: UserParams,
      { db, req }: { db: Database; req: Request }
    ): Promise<User> => {
      try {
        const user = await db.users.findOne({ _id: id });

        if (!user) {
          throw new Error("User doesn't exist");
        }

        const viewer = await authorizeRequest(db, req);

        if (viewer && viewer._id === user._id) {
          user.authorized = true;
        }

        return user;
      } catch (error) {
        throw new Error(`User query error: ${error}`);
      }
    },
  },
  User: {
    id: (user: User): string => {
      return user._id;
    },
    hasWallet: (user: User): boolean => {
      return Boolean(user.walletId);
    },
    income: (user: User): number | null => {
      return user.income;
    },
    bookings: async (
      user: User,
      { limit, page }: UserBookingsParams,
      { db }: { db: Database }
    ): Promise<UserBookingsData | null> => {
      try {
        const data: UserBookingsData = {
          total: 0,
          result: [],
        };
        let cursor = await db.bookings.find({
          _id: { $in: user.bookings },
        });

        cursor = cursor.skip(page > 0 ? (page - 1) * limit : 0);
        cursor = cursor.limit(limit);

        data.total = await cursor.count();
        data.result = await cursor.toArray();

        return data;
      } catch (error) {
        throw new Error(` User bookings error: ${error}`);
      }
    },
    listings: async (
      user: User,
      { limit, page }: UserListingsParams,
      { db }: { db: Database }
    ): Promise<UserListingsData | null> => {
      try {
        const data: UserListingsData = {
          total: 0,
          result: [],
        };

        let cursor = await db.listings.find({
          _id: { $in: user.listings },
        });

        cursor = cursor.skip(page > 0 ? (page - 1) * limit : 0);
        cursor = cursor.limit(limit);

        data.total = await cursor.count();
        data.result = await cursor.toArray();

        return data;
      } catch (error) {
        throw new Error(`User listings error: ${error}`);
      }
    },
  },
};

const listingResolvers: IResolvers = {
  Query: {
    listing: async (
      _root: undefined,
      { id }: ListingParams,
      { db, req }: { db: Database; req: Request }
    ): Promise<Listing> => {
      try {
        const listing = await db.listings.findOne({ _id: new ObjectID(id) });

        if (!listing) {
          throw new Error("Listing can't be found");
        }

        const viewer = await authorizeRequest(db, req);
        if (viewer && viewer._id === listing.host) {
          listing.authorized = true;
        }

        return listing;
      } catch (error) {
        throw new Error(`Listing query error: ${error}`);
      }
    },
    listings: async (
      _root: undefined,
      { location, filter, limit, page }: ListingsParams,
      { db }: { db: Database }
    ): Promise<ListingsData> => {
      try {
        const query: ListingsQuery = {};
        const data: ListingsData = {
          region: null,
          total: 0,
          result: [],
        };

        if (location) {
          const { country, city, adminArea } = await Google.geocode(location);

          if (country) query.country = country;
          else {
            throw new Error("Country couldn't be found.");
          }
          if (city) query.city = city;
          if (adminArea) query.admin = adminArea;
          const cityText = city ? `${city}, ` : "";
          const adminText = adminArea ? `${adminArea}, ` : "";
          data.region = `${cityText}${adminText}${country}`;
        }

        let cursor = db.listings.find(query);

        if (filter && filter === ListingsFilters.PRICE_HL) {
          cursor = cursor.sort({ price: -1 });
        }
        if (filter && filter === ListingsFilters.PRICE_LH) {
          cursor = cursor.sort({ price: 1 });
        }

        cursor = cursor.skip(page > 0 ? (page - 1) * limit : 0);
        cursor = cursor.limit(limit);

        data.total = await cursor.count();
        data.result = await cursor.toArray();

        return data;
      } catch (error) {
        throw new Error(`Listings query error: ${error}`);
      }
    },
  },

  Mutation: {
    newListing: async (
      _root: undefined,
      { input }: NewListingParams,
      { db, req }: { db: Database; req: Request }
    ): Promise<Listing> => {
      validInput(input);
      const viewer = await authorizeRequest(db, req);

      if (!viewer) {
        throw new Error("Invalid viewer");
      }

      const { country, city, adminArea } = await Google.geocode(input.address);

      if (!country || !city || !adminArea) {
        throw new Error("Invalid address");
      }
      const imageURL = await Cloudinary.upload(input.image);

      const newlisting = await db.listings.insertOne({
        _id: new ObjectID(),
        ...input,
        image: imageURL,
        bookings: [],
        bookingsIndex: {},
        country,
        admin: adminArea,
        city,
        host: viewer._id,
      });

      const newinsertedListing: Listing = newlisting.ops[0];

      await db.users.updateOne(
        { _id: viewer._id },
        { $push: { listings: newinsertedListing._id } }
      );

      return newinsertedListing;
    },
  },

  Listing: {
    id: (listing: Listing): string => {
      return listing._id.toString();
    },
    host: async (
      listing: Listing,
      _args: unknown,
      { db }: { db: Database }
    ): Promise<User> => {
      const host = await db.users.findOne({ _id: listing.host });
      if (!host) {
        throw new Error("Cant find user");
      }
      return host;
    },
    bookingsIndex: (listing: Listing): string => {
      return JSON.stringify(listing.bookingsIndex);
    },
    bookings: async (
      listing: Listing,
      { limit, page }: ListingBookingsParams,
      { db }: { db: Database }
    ): Promise<UserBookingsData | null> => {
      try {
        const data: ListingBookingsData = {
          total: 0,
          result: [],
        };
        if (!listing.authorized) {
          return data;
        }

        let cursor = await db.bookings.find({
          _id: { $in: listing.bookings },
        });

        cursor = cursor.skip(page > 0 ? (page - 1) * limit : 0);
        cursor = cursor.limit(limit);

        data.total = await cursor.count();
        data.result = await cursor.toArray();

        return data;
      } catch (error) {
        throw new Error(`User bookings error: ${error}`);
      }
    },
  },
};

const bookingResolvers: IResolvers = {
  Mutation: {
    bookListing: async (
      _root: undefined,
      { input }: NewBookingParams,
      { db, req }: { db: Database; req: Request }
    ): Promise<Booking> => {
      try {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { id, source, checkIn, checkOut } = input;

        const viewer = await authorizeRequest(db, req);
        if (!viewer) {
          throw new Error("invalid viewer");
        }

        const listing = await db.listings.findOne({
          _id: new ObjectID(id),
        });

        if (!listing) {
          throw new Error("invalid listing");
        }

        if (listing.host === viewer._id) {
          throw new Error("viewer can't book own listing");
        }

        const checkInDate = new Date(checkIn);
        const checkOutDate = new Date(checkOut);

        if (checkOutDate < checkInDate) {
          throw new Error("check out date can't be before check in date");
        }

        const bookingsIndex = resolveBookingsIndex(
          listing.bookingsIndex,
          checkIn,
          checkOut
        );

        const totalPrice =
          listing.price *
          ((checkOutDate.getTime() - checkInDate.getTime()) / 86400000 + 1);

        const host = await db.users.findOne({
          _id: listing.host,
        });

        if (!host) {
          throw new Error(
            "the host either can't be found or is not connected with Stripe"
          );
        }

        //await StripeApi.charge(totalPrice, source, "lmao");

        const insertRes = await db.bookings.insertOne({
          _id: new ObjectID(),
          listing: listing._id,
          tenant: viewer._id,
          checkIn,
          checkOut,
        });

        const insertedBooking: Booking = insertRes.ops[0];

        await db.users.updateOne(
          {
            _id: host._id,
          },
          {
            $inc: { income: totalPrice },
          }
        );

        await db.users.updateOne(
          {
            _id: viewer._id,
          },
          {
            $push: { bookings: insertedBooking._id },
          }
        );

        await db.listings.updateOne(
          {
            _id: listing._id,
          },
          {
            $set: { bookingsIndex },
            $push: { bookings: insertedBooking._id },
          }
        );

        return insertedBooking;
      } catch (error) {
        throw new Error(`Failed to create a booking: ${error}`);
      }
    },
  },
  Booking: {
    id: (booking: Booking): string => {
      return booking._id.toString();
    },
    listing: (
      booking: Booking,
      _args: unknown,
      { db }: { db: Database }
    ): Promise<Listing | null> => {
      return db.listings.findOne({ _id: booking.listing });
    },
    tenant: (booking: Booking, _args: unknown, { db }: { db: Database }) => {
      return db.users.findOne({ _id: booking.tenant });
    },
  },
};

export const resolvers = _.merge(
  viewerResolvers,
  userResolvers,
  listingResolvers,
  bookingResolvers
);
