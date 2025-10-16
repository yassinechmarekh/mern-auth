import passport from "passport";
import {
  Strategy as GoogleStrategy,
  Profile,
  VerifyCallback,
} from "passport-google-oauth20";
import User from "../models/User.model";

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      callbackURL: process.env.GOOGLE_CALLBACK_URL as string,
    },
    async (
      accessToken: string,
      refreshToken: string,
      profile: Profile,
      done: VerifyCallback
    ): Promise<void> => {
      try {
        if (!profile.emails || profile.emails.length === 0) {
          return done(new Error("Aucun email fourni par Google"), undefined);
        }
        console.log("Profile :", profile);

        let user = await User.findOne({ googleId: profile.id });

        if (user) {
          return done(null, user);
        }

        const existingUser = await User.findOne({
          email: profile.emails[0].value,
        });

        if (existingUser) {
          existingUser.googleId = profile.id;
          if (existingUser.profileImage && !existingUser.profileImage.url) {
            if (profile && profile.photos) {
              existingUser.profileImage.url = profile.photos[0].value;
            }
          }
          existingUser.provider = "google";
          existingUser.isVerified = true;

          await existingUser.save();

          return done(null, existingUser);
        }

        user = await User.create({
          googleId: profile.id,
          email: profile.emails[0].value,
          username: profile.displayName,
            profileImage: {
              url: profile.photos ? profile.photos[0]?.value : null,
            },
          provider: "google",
          isVerified: true,
        });

        done(null, user);
      } catch (error) {
        done(error, undefined);
      }
    }
  )
);

export default passport;
