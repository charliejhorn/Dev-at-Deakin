import GalleryItem from './GalleryItem.js'

export default function Gallery({ items }) {
    return (<>
        <div className='container-fluid'>
            <div className='row px-5'>
                {items.map((item, idx) => (
                    <div className='col-md-4 mb-4' key={idx}>
                        <GalleryItem content={item} />
                    </div>
                ))}
            </div>
        </div>
    </>)
}