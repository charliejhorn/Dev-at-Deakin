import { useAuth } from "../hooks/useAuth";

export default function NavBar() {
    const { user, logout } = useAuth();

    return (<>
        <nav className='navbar navbar-expand-lg bg-secondary-subtle'>
            <div className="container-fluid">
                {/* <img className="h-100" src="egg.png"></img> */}
                {/* <div className='container-fluid p-0'>
                    <img src='egg.png' className='img-fluid' alt='egg logo'></img>
                </div> */}
                <a className='navbar-brand' href="/">Dev@Deakin</a>

                {/* Search bar, may need in future */}
                {/* <form className="d-flex" role="search">
                    <input className="form-control me-2" type="search" placeholder="Search" aria-label="Search"/>
                </form> */}

                <div className="navbar-nav">
                    <a className="nav-link text-black" href="/find-question">Find a Question</a>
                    {
                        // if user not logged in, display 'Login'
                        user == null ?
                        <a className="nav-link text-black" href="/login">Login</a>
                        :
                        // if user logged in, display 'Create Post' and 'Logout'
                            <>
                            <a className="nav-link text-black" href="/create-post">Create Post</a>
                            <button className="nav-link text-black" onClick={logout}>Logout</button>
                            </>
                    }
                </div>
            </div>
        </nav>
    </>)
}