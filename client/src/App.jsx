import { useState } from "react";
import  "./App.css";
import Signup from "./Signup";
import Signin from "./Signin";
import BlogPostForm from "./BlogPostForm";
import PostList from "./PostList";
import MyProfile  from "./MyProfile";

function App() {
    // keepa track of what page the person is looking at
    const [currentPage, setCurrentPage] = useState("home");
    const  [ refresh, setRefresh] = useState(false);
    const [message, setMessage] = useState("");

    // when the user signs in, go back to the home page
    function handleLogin() {
        setCurrentPage("home");
        setMessage("");
    }

    function handleLogout() {
        // logs user out
        fetch( "http://localhost:3000/api/logout", {
            method: "POST",
            credentials: "include",
        })
            .then((response ) =>response.json())
            .then((data) => {
                if (data.success) {
                    setCurrentPage("home");

                    // recipe list gets loaded again
                    setRefresh(!refresh);
                    setMessage("You have been logged out!");
                } 
                else 
                {
                    setMessage(data.message);
                }
            })
            .catch(() => setMessage("Couldn't log you out, try again!"));
    }
    return (
        <div>
            <h1>Whatcha Cookin?</h1>

            <nav>
                <button onClick={()  =>setCurrentPage("home")}>Home</button>
                <button onClick={() => setCurrentPage("signup")}>Sign Up</button>
                <button onClick={() => setCurrentPage("signin")}>Sign In</button>
                <button onClick={() => setCurrentPage("profile")}>My Profile</button>
                <button onClick={handleLogout}>Log Out</button>
            </nav>

            <p>{message}</p>
            {currentPage ===  "home" && (
                <div>
                    <BlogPostForm onAdd={()=> setRefresh(!refresh)} />
                    <PostList changes={refresh} />
                </div>
            )}

            {currentPage === "signup" && <Signup />}
            {currentPage === "signin" && <Signin onLogin={handleLogin} />}

            {currentPage ===  "profile" && <MyProfile />}
        </div>
    );
}

export default App;