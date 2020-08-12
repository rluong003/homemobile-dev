import { google } from "googleapis";
import { Client, AddressComponent } from "@googlemaps/google-maps-services-js";
const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  `${process.env.PUBLIC_URL}/login`
);
const maps = new Client({});

const scopes = [
  "https://www.googleapis.com/auth/userinfo.email",
  "https://www.googleapis.com/auth/userinfo.profile",
];

const url = oauth2Client.generateAuthUrl({
  access_type: "online",
  scope: scopes,
  prompt: "consent",
});

const addressParser = (addressComponents: AddressComponent[]) => {
  let country = null;
  let city = null;
  let adminArea = null;
  for (const components of addressComponents) {
    for (const type of components.types) {
      if (type === "country") {
        country = components.long_name;
      }

      if (type === "administrative_area_level_1") {
        adminArea = components.long_name;
      }

      if (type === "locality" || type === "postal_town") {
        city = components.long_name;
      }
    }
  }
  return { country, city, adminArea };
};

export const Google = {
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  authUrl: () => {
    return url;
  },
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  logIn: async (code: string) => {
    try {
      const { tokens } = await oauth2Client.getToken(code);
      oauth2Client.setCredentials(tokens);
      const { data } = await google
        .people({ version: "v1", auth: oauth2Client })
        .people.get({
          resourceName: "people/me",
          personFields: "emailAddresses,names,photos",
        });

      return { user: data };
    } catch (error) {
      throw new Error(`Google login error: ${error}`);
    }
  },

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  geocode: async (address: string) => {
    const res = await maps.geocode({
      params: { address: address, key: `${process.env.GEO_KEY}` },
      timeout: 1000, // milliseconds
    });

    if (res.status < 200 || res.status > 299) {
      throw new Error("failed to geocode address");
    }
    return addressParser(res.data.results[0].address_components);
  },
};
