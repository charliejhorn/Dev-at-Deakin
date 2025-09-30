// {
//     "title": "Article's Name",
//     "image_url": "",
//     "description": "Description...",
//     "stars": 5,
//     "author_name": "Author's name"
// }

export default function GalleryItem({ content }) {
    return (
        <div className="card h-100 custom-card">
            <img src={content.image_url} className="card-img-top custom-card-img" alt="..." />
            <div className="card-body">
                <h5 className="card-title">{content.title}</h5>
                <p className="card-text text-start">{content.description}</p>
                <div className="d-flex justify-content-between">
                    <span>⭐️ {content.stars}</span>
                    <span>{content.author_name}</span>
                </div>
            </div>
        </div>
    );
}