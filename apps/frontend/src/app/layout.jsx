import AuthProvider from "@/components/AuthProvider";
import BootstrapProvider from "@/components/BootstrapProvider";
import ConditionalSidebar from "@/components/ConditionalSidebar";
import RequireAuth from "@/components/RequireAuth";
import SwrProvider from "@/components/SwrProvider";
import "./globals.css";
import React from "react";

const Layout = ({ children }) => {
    return (
        <div className="d-flex" style={{ minHeight: "100vh" }}>
            <ConditionalSidebar />
            <div className="flex-grow-1">
                <header className="border-bottom p-3">
                    <h1 className="h4 m-0">CogWorks Workshop Management</h1>
                </header>
                <main className="p-3">{children}</main>
            </div>
        </div>
    );
};

export default function RootLayout({ children }) {
    return (
        <html lang="en" data-scroll-behavior="smooth">
            <body>
                <BootstrapProvider>
                    <AuthProvider>
                        <SwrProvider>
                            <RequireAuth>
                                <Layout>{children}</Layout>
                            </RequireAuth>
                        </SwrProvider>
                    </AuthProvider>
                </BootstrapProvider>
            </body>
        </html>
    );
}
