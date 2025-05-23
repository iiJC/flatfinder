import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import clientPromise from "../../../../db/database";
import bcrypt from "bcryptjs";

export const authOptions = {
  // use credentials provider for email + password login
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      // connect to db
      async authorize(credentials) {
        const client = await clientPromise;
        const db = client.db("flatfinderdb");
        const users = db.collection("users");
        // find user by email
        const user = await users.findOne({ email: credentials.email });
        if (!user) throw new Error("No user found with that email");
        // check password
        const isValid = await bcrypt.compare(
          credentials.password,
          user.password
        );
        if (!isValid) throw new Error("Incorrect password");

        // return minimal user object for jwt
        return {
          id: user._id.toString(),
          name: user.username,
          email: user.email
        };
      }
    })
  ],
  session: {
    strategy: "jwt"
  },
  pages: {
    signIn: "/login",
    error: "/auth/error"
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async session({ session, token, user }) {
      if (token && token.sub) {
        session.user.id = token.sub;
      }
      return session;
    }
  }
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
