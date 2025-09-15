function FooterLink(text, address) {
    return (
        <a className="link-dark link-underline link-underline-opacity-0 text-start" href={address}>{text}</a>
    );
}

function SocialMediaLogo(source) {
    return (
        <div className="px-1">
            <img className='img-fluid footer-logo' src={source} />
        </div>    
    );
}

export default function Footer() {
    return (<>
        <div className="container-fluid d-flex bg-secondary-subtle justify-content-between p-3 mt-5">
            <h1>SIGN UP FOR OUR DAILY INSIDER</h1>
            <form className="d-flex" role="search">
                <input className="form-control me-2" type="email" placeholder="Enter your email" aria-label="email-enter"/>
                <button className="btn btn-secondary" type="submit">Subscribe</button>
            </form>
        </div>

        <div className="container-fluid bg-primary p-4">
            <div className="d-flex justify-content-between pb-4">
                <div className="d-flex flex-column">
                    <h2>Explore</h2>
                    {FooterLink('Home', '#')}
                    {FooterLink('Questions', '#')}
                    {FooterLink('Articles', '#')}
                    {FooterLink('Tutorials', '#')}
                </div>
                <div className="d-flex flex-column">
                    <h2>Support</h2>
                    {FooterLink('FAQs', '#')}
                    {FooterLink('Help', '#')}
                    {FooterLink('Contact Us', '#')}
                </div>
                <div>
                    <h2>Stay connected</h2>
                    <div className="d-flex justify-content-center">
                        {SocialMediaLogo("facebook.png")}
                        {SocialMediaLogo("twitter.png")}
                        {SocialMediaLogo("instagram.png")}
                    </div>
                </div>
            </div>
            <h2>DEV@Deakin 2025</h2>
            <div className="container d-flex justify-content-around">
                {FooterLink('Privacy Policy', '#')}
                {FooterLink('Terms', '#')}
                {FooterLink('Code of Conduct', '#')}
            </div>
        </div>

    </>)
}