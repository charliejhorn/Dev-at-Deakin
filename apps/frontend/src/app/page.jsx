"use client";

import Link from "next/link";
import Gallery from "@/components/home/Gallery";
import NewsletterSignUp from "@/components/home/NewsletterSignUp";
import Footer from "@/components/Footer";

const articles = [
    {
        title: "Article's Name",
        image_url: "field.jpeg",
        description: "Description...",
        stars: 5,
        author_name: "Author's name",
    },
    {
        title: "Article's Name",
        image_url: "field.jpeg",
        description: "Description...",
        stars: 5,
        author_name: "Author's name",
    },
    {
        title: "Article's Name",
        image_url: "field.jpeg",
        description: "Description...",
        stars: 5,
        author_name: "Author's name",
    },
];
const tutorials = [
    {
        title: "Tutorial's Name",
        image_url: "field.jpeg",
        description: "Description...",
        stars: 5,
        author_name: "username",
    },
    {
        title: "Tutorial's Name",
        image_url: "field.jpeg",
        description: "Description...",
        stars: 5,
        author_name: "username",
    },
    {
        title: "Tutorial's Name",
        image_url: "field.jpeg",
        description: "Description...",
        stars: 5,
        author_name: "username",
    },
];

export default function HomePage() {
    const recent = Array.from({ length: 5 }).map((_, i) => ({
        title: `Brake Repair - Trek 7.${i + 1}`,
        customer: "John Smith",
        status:
            i % 3 === 0 ? "Queued" : i % 3 === 1 ? "In Progress" : "Completed",
    }));

    return (
        <div className="text-center">
            <div className="container-fluid p-0">
                <img src="cliffs.jpeg" className="img-fluid" alt="cliffs"></img>
            </div>

            <h1 className="py-4">Featured Articles</h1>
            <Gallery items={articles}></Gallery>
            <Link text="See all articles" href="#"></Link>

            <h1 className="py-4">Featured Tutorials</h1>
            <Gallery items={tutorials}></Gallery>
            <Link text="See all tutorials" href="#"></Link>

            <NewsletterSignUp />
        </div>
    );
}
