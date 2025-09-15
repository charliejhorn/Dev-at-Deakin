// import './App.css';
import NavBar from '../components/NavBar.js';
import Gallery from '../components/home/Gallery.js'
import Link from '../components/home/Link.js'
import Footer from '../components/home/Footer.js'
import article from '../data/article.json';
import tutorial from '../data/tutorial.json';

const articles = [article, article, article];
const tutorials = [tutorial, tutorial, tutorial];

// console.log(articles)

function Home() {
return (
    <div className="App text-center">
        <NavBar />

        <div className='container-fluid p-0'>
            <img src='cliffs.jpeg' className='img-fluid' alt='cliffs'></img>
        </div>

        <h1 className='py-4'>Featured Articles</h1>
        <Gallery items={articles}></Gallery>
        <Link text="See all articles" link="#"></Link>

        <h1 className='py-4'>Featured Tutorials</h1>
        <Gallery items={tutorials}></Gallery>
        <Link text="See all tutorials" link="#"></Link>

        <Footer />
    </div>
);
}

export default Home;
