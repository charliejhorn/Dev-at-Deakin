"use client";

import Link from "next/link";
import Gallery from "@/components/home/Gallery";
import NewsletterSignUp from "@/components/home/NewsletterSignUp";
import Image from "next/image";
import cliffs from "../../public/cliffs.jpeg";

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
    return (
        <div className="text-center">
            <div
                className="container-fluid p-0"
                style={{ position: "relative", height: "50vh" }}
            >
                <Image
                    src={cliffs}
                    className="img-fluid"
                    alt="cliffs"
                    fill
                    style={{ objectFit: "cover" }}
                />
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
