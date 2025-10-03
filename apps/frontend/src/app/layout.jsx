import React from "react";
import "./custom.scss";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";

const Layout = ({ children }) => {
    return (
        <div className="d-flex flex-column" style={{ minHeight: "100vh" }}>
            <div className="flex-grow-1 d-flex flex-column">
                <header>
                    <NavBar />
                </header>
                <main className="flex-grow-1">{children}</main>
                <footer>
                    <Footer />
                </footer>
            </div>
        </div>
    );
};

export default function RootLayout({ children }) {
    return (
        <html lang="en" data-scroll-behavior="smooth">
            <body>
                <Layout>{children}</Layout>
            </body>
        </html>
    );
}
