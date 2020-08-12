import Stripe from "stripe";

const stripe = new Stripe(`${process.env.STRIPE_KEY}`, {
  apiVersion: "2020-03-02",
});

export const StripeApi = {
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  connect: async (code: string) => {
    const res = await stripe.oauth.token({
      grant_type: "authorization_code",
      code,
    });
    return res;
  },

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  charge: async(amount:number, source:string, stripeAccount: string) => {
    const res = await stripe.charges.create({
      amount: amount,
      currency: 'usd',
      source: source,
      application_fee_amount: Math.round(amount * 0.05),

    }, {stripeAccount: stripeAccount});

    if(res.status !== 'succeeded'){
      throw new Error("Stripe charge failed");
    }
    
  }
};
