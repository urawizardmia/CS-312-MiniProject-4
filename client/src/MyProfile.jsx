import { useState, useEffect } from "react";

function MyProfile() {
    const [myInfo, setMyInfo] = useState(null);
    const [message,  setMessage] = useState("Loading your profile...");

    useEffect(() => {
        // gets the info for user who is signed in right now
        fetch("http://localhost:3000/api/profile", {
            credentials: "include",
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.message) {
                    setMessage(data.message);
                } 
                else 
                {
                    setMyInfo(data);
                    setMessage("");
                }
            })
            .catch((error) => {
                console.log("Profile error:", error);
                setMessage("Couldn't load your profile. Try again!");
            });
    }, []);

    // if they aren't signed in, or the info hasn't loaded yet
    if (!myInfo) {
        return (
            <div>
                <h2>My Profile</h2>
                <p>{message}</p>
            </div>
        );
    }
    return (
        <div>
            <h2>My Profile</h2>
            <p>
                <b>User ID:</b> {myInfo.userId}
            </p>
            <p>
                <b>Name:</b>
                {myInfo.name}
            </p>

            <h2>My Recipes</h2>

            {myInfo.recipes.length === 0 && <p>You haven't shared any recipes yet!</p>}

            {myInfo.recipes.map((recipe, num) =>(
                <div className="recipe-card" key={num}>
                    <h2 className="recipe-title">{recipe.recipeName}</h2>

                    <div className="recipe-info">
                        <p>By: {recipe.author}</p>
                        <p>{new Date(recipe.date).toDateString()}</p>
                    </div>

                    <div className="recipe-details">
                        <p>Category: {recipe.category}</p>
                        <p>Cook Time: {recipe.cookTime}</p>
                        <p>Servings: {recipe.servings}</p>
                    </div>

                    <h3>Ingredients:</h3>
                    <ul>
                        {recipe.ingredients.split("\n").map((item, index) => (
                            <li key={index}>{item}</li>
                        ))}
                    </ul>

                    <h3>Steps:</h3>
                    <ol>
                        {recipe.steps.split("\n").map((step, index) => (
                            <li key={index}>{step}</li>
                        ))}
                    </ol>
                </div>
            ))}
        </div>
    );
}

export default MyProfile;
