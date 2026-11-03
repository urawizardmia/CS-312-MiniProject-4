import { useState, useEffect } from "react";
import EditRecipe from "./EditRecipe";

function PostList(props) {
    const [recipeList,setRecipeList] = useState([]);
    const [userId, setUserId] = useState(null);
    const [editing, setEditing] = useState(null);
    const [category,  setCategory] = useState("all");
    const [message, setMessage] = useState("");

    useEffect(() => {
        fetch("http://localhost:3000/api/recipes")
            .then((response) => response.json())
            .then((data) => {
                setRecipeList(data );
            })
            .catch((error) => {
                console.log("Recipe loading problem:", error);
                setMessage("Couldn't load the recipes!");
            });

        // need to  know who's signed in to know who can edit posts
        fetch("http://localhost:3000/api/check-login", {
            credentials: "include",
        })
            .then((response) =>  response.json())
            .then((data) => {
                setUserId(data.userId);
            })
            .catch((error) => {
                console.log("Login check problem:", error);
                setUserId(null);
            });
    }, [props.changes]);

    // replaces old recipe with the edited one
    function recipeSaved(newRecipe) {
        const updatedList =  [...recipeList];
        updatedList[editing] = newRecipe;

        setRecipeList(updatedList);
        setEditing(null);
        setMessage("Your changes were saved!");
    }

    function removeRecipe(recipeNum) {
        // tells the backend which recipe wewant to delete
        fetch("http://localhost:3000/api/recipes/" + recipeNum, {
            method: "DELETE",
            credentials: "include",
        })
            .then((response) => response.json())
            .then((data)  => {
                if (data.success) {
                    const remainingRecipes = recipeList.filter((recipe, index) => {
                        return index !== recipeNum;
                    });
                    setRecipeList(remainingRecipes);
                    setMessage("Recipe deleted!");
                } 
                else 
                { setMessage(data.message);
                }
            })
            .catch((error) => {
                console.log("Delete problem:", error);
                setMessage("Couldn't delete the recipe. Please try again!");
            });
    }

    return (
        <div>
            <h2>Filter Recipes</h2>

            <div className="filter-form">
                <select value={category} onChange={(event) => setCategory(event.target.value)}>
                    <option value="all">All Recipes</option>
                    <option value="breakfast">Breakfast</option>
                    <option value="lunch">Lunch</option>
                    <option value="dinner">Dinner</option>
                    <option  value="snack">Snack</option>
                    <option value="dessert">Dessert</option>
                    <option value="drinks">Drinks</option>
                </select>
            </div>

            <h2>Recipes</h2>

            <p>{message}</p>

            {recipeList.length === 0&& <p>No recipes have been shared yet!</p>}
            {recipeList.map((recipe, num) => {
                // skips recipes that arent in the category picked
                if (category !==  "all" && recipe.category !== category) {
                    return null;
                }
                if (editing === num) {
                    return (
                        <EditRecipe
                            key={num}
                            recipe={recipe}
                            number={num}
                            onSave={recipeSaved}
                            onCancel={() =>  setEditing(null)}
                        />
                    );
                }

                return (
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
                            {recipe.ingredients.split("\n").map(( item, index) => (
                                <li key={index}>{item}</li>
                            ))}
                        </ul>

                        <h3>Steps:</h3>
                        <ol>
                            {recipe.steps.split("\n").map((step,  index) => (
                                <li key={index}>{step}</li>
                            ))}
                        </ol>

                        {recipe.addedBy  === userId && (
                            <div className="recipe-buttons">
                                <button type="button" onClick={() =>  setEditing(num)}>
                                    Edit
                                </button>
                                <button type="button" onClick={() => removeRecipe(num)}>
                                    Delete
                                </button>
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
}

export default PostList;
