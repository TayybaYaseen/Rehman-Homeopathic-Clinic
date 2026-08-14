import "./globals.css";

export const metadata = {
  title: "Rehman Homoeopathic Clinic & Store",
  description:
    "Dr. Muhammad Yaseen — Registered Homoeopathic Physician & Consultant Specialist. 35+ years of natural, side-effect-free treatment for chronic diseases, in Mast Iqbal Road, Opp: General Hospital.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
