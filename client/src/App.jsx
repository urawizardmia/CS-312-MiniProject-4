import { useState } from "react";
import "./App.css";
import Signup from "./Signup";
import Signin from "./Signin";
import BlogPostForm from "./BlogPostForm";
import PostList from "./PostList";
import MyProfile from "./MyProfile";

function App() {
    const [currentPage,  setCurrentPage] = useState("home");
    const [refresh, setRefresh] = useState(false);
    const [message, setMessage] = useState("");
    function handleLogin() 
    {
        setCurrentPage("home");
        setMessage("");
    }

    function handleLogout() {
        fetch("http://localhost:3000/api/logout", {
            method: "POST",
            credentials: "include",
        })
            .then((response)=> response.json())
            .then((data) => {
                setMessage(data.message);

                if (data.success) {
                    setCurrentPage("home");
                    setRefresh(!refresh);
                }
            })
            .catch(() => {
                setMessage("Couldn't log out, please try again!");
            });
    }

    // figures out what page to show based on what was clicked
    let pageContent;

    if (currentPage === "home") {
        pageContent = (
            <div>
                <BlogPostForm  onAdd={() =>  setRefresh(!refresh)} />
                <PostList changes={refresh}/>
            </div>
        );
    } 
    else if (currentPage === "signup") 
    {
        pageContent = <Signup />;
    } 
    else if (currentPage ===  "signin") 
    {
        pageContent =<Signin  onLogin={handleLogin} />;
    } 
    else if (currentPage === "profile") {
        pageContent = <MyProfile />;
    }
    return (
        <div>
            <h1>Whatcha Cookin?</h1>

            <nav>
                <button onClick={() =>  setCurrentPage("home")}>Home</button>
                <button onClick={() => setCurrentPage("signup")}>Sign Up</button>
                <button onClick={() => setCurrentPage("signin")}>Sign In</button>
                <button onClick={() => setCurrentPage("profile" )}>My Profile</button>
                <button onClick={handleLogout}>Log Out</button>
            </nav>

            <p>{message}</p>
            {pageContent}
        </div>
    );
}

export default App;
