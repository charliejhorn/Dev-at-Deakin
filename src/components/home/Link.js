export default function Link ({text, link}) {
    return (
        <div className='container-fluid my-3'>
            <a href={link}
                className='p-3 text-secondary-emphasis bg-secondary-subtle rounded-5
                    link-secondary link-offset-2-hover link-underline link-underline-opacity-0 link-underline-opacity-75-hover'
            >{text}</a>
        </div>
    )
}