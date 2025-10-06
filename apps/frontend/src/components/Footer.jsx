import Image from "next/image";

function FooterLink(text, address) {
    return (
        <a
            className="link-light link-underline link-underline-opacity-0"
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
            <footer className="container-fluid bg-primary p-4 footer mt-auto text-center text-white">
                <div className="row pb-4">
                    <div className="col-md-4 mb-3 mb-md-0">
                        <h2 className="text-white">Explore</h2>
                        <div className="d-flex flex-column align-items-center">
                            {FooterLink("Home", "/")}
                            {FooterLink("Questions", "/posts/questions")}
                            {FooterLink("Articles", "#")}
                            {FooterLink("Tutorials", "#")}
                        </div>
                    </div>
                    <div className="col-md-4 mb-3 mb-md-0">
                        <h2 className="text-white">Support</h2>
                        <div className="d-flex flex-column align-items-center">
                            {FooterLink("FAQs", "#")}
                            {FooterLink("Help", "#")}
                            {FooterLink("Contact Us", "#")}
                        </div>
                    </div>
                    <div className="col-md-4">
                        <h2 className="text-white">Stay connected</h2>
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
                <h2 className="text-white">DEV@Deakin 2025</h2>
                <div className="container">
                    <div className="row justify-content-around">
                        <div className="col-auto">
                            {FooterLink("Privacy Policy", "#")}
                        </div>
                        <div className="col-auto">
                            {FooterLink("Terms", "#")}
                        </div>
                        <div className="col-auto">
                            {FooterLink("Code of Conduct", "#")}
                        </div>
                    </div>
                </div>
            </footer>
        </>
    );
}
