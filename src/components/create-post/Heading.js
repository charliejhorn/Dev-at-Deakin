export default function Heading({ children }) {
    return(
        <div className="container-fluid bg-secondary-subtle p-2">
            <h2 className="text-start m-0">{children}</h2>
        </div>
    )
}