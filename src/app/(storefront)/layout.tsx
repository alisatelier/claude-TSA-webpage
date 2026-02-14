import "@fortawesome/fontawesome-svg-core/styles.css";
import "@/lib/fontawesome";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AnnouncementBar from "@/components/AnnouncementBar";
import ToastNotification from "@/components/ToastNotification";
import SessionWrapper from "@/components/SessionWrapper";
import { CartProvider } from "@/lib/CartContext";
import { AuthProvider } from "@/lib/AuthContext";
import { BookingProvider } from "@/lib/BookingContext";
import { CurrencyProvider } from "@/lib/CurrencyContext";

export default function StorefrontLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SessionWrapper>
      <AuthProvider>
        <CurrencyProvider>
          <CartProvider>
            <BookingProvider>
              <Header />
              <AnnouncementBar />
              <main className="min-h-screen">{children}</main>
              <Footer />
              <ToastNotification />
            </BookingProvider>
          </CartProvider>
        </CurrencyProvider>
      </AuthProvider>
    </SessionWrapper>
  );
}
