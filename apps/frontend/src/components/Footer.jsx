import Image from "next/image";

function FooterLink(text, address) {
    return (
        <a
            className="link-dark link-underline link-underline-opacity-0"
            href={address}
        >
            {text}
        </a>
    );
}

function SocialMediaLogo({ source, alt }) {
    return (
        <div className="px-1">
            {/* <Image className="img-fluid footer-logo" src={source} /> */}
            <Image
                className="img-fluid"
                src={source}
                width={30}
                height={30}
                alt={alt}
            />
        </div>
    );
}

export default function Footer() {
    return (
        <>
            <footer className="container-fluid bg-primary p-4 footer mt-auto text-center">
                <div className="d-flex justify-content-between pb-4">
                    <div className="d-flex flex-column">
                        <h2>Explore</h2>
                        {FooterLink("Home", "#")}
                        {FooterLink("Questions", "#")}
                        {FooterLink("Articles", "#")}
                        {FooterLink("Tutorials", "#")}
                    </div>
                    <div className="d-flex flex-column">
                        <h2>Support</h2>
                        {FooterLink("FAQs", "#")}
                        {FooterLink("Help", "#")}
                        {FooterLink("Contact Us", "#")}
                    </div>
                    <div>
                        <h2>Stay connected</h2>
                        <div className="d-flex justify-content-center">
                            <SocialMediaLogo
                                source="/facebook.png"
                                alt="Facebook logo"
                            />
                            <SocialMediaLogo
                                source="/twitter.png"
                                alt="Twitter logo"
                            />
                            <SocialMediaLogo
                                source="/instagram.png"
                                alt="Instagram logo"
                            />
                        </div>
                    </div>
                </div>
                <h2>DEV@Deakin 2025</h2>
                <div className="container d-flex justify-content-around">
                    {FooterLink("Privacy Policy", "#")}
                    {FooterLink("Terms", "#")}
                    {FooterLink("Code of Conduct", "#")}
                </div>
            </footer>
        </>
    );
}
