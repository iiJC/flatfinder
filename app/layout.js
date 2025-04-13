import "./css/globals.scss";
import Providers from "./provider";
import Header from "../components/header";

export const metadata = {
  title: "FlatMate Finder",
  description: "Find flats, flatmates, or tenants in Dunedin",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="root-layout">
        <Providers>
          <Header />
          <main className="main-content">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
