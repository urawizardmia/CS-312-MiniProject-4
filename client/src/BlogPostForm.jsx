import { useState } from "react";

function BlogPostForm(props) {
    // recipe information that gets filled out
    const [recipeName, setRecipeName] = useState("");
    const [cookTime, setCookTime] = useState("");
    const [servings, setServings] = useState("");
    const [category, setCategory] = useState("breakfast");
    const [ingredients,  setIngredients] = useState("");
    const [steps, setSteps] = useState("");
    const [message, setMessage] = useState("");

    function postRecipe(event)  {
        // stops the page from refereshing
        event.preventDefault();

        // put everything from the form into one recipe
        const recipeInfo = {
            recipeName: recipeName,
            cookTime: cookTime,
            servings: servings,
            category:  category,
            ingredients: ingredients,
            steps: steps,
        };
        // sends the new recipe to the server
        fetch("http://localhost:3000/api/recipes", {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
            body:JSON.stringify(recipeInfo),
        })
            .then((response) => response.json())
            .then((data) => {
                setMessage(data.message);

                if  (data.recipe) {
                    props.onAdd();

                    // clears out the boxes after posting
                    setRecipeName("");
                    setCookTime("");
                    setServings("");
                    setCategory("breakfast");
                    setIngredients("");
                    setSteps("");
                }
            })
            .catch(( error ) => {
                console.log("Recipe problem:", error);
                setMessage("Couldn't post your recipe. Try again!");
            });
    }

    return (
        <div>
            <h2>Share Your Recipe</h2>

            <form className="recipe-form" onSubmit={postRecipe}>
                <label htmlFor ="recipeName">Recipe Name</label>
                <input
                    type="text"
                    id="recipeName"
                    value={recipeName}
                    onChange={(event) =>  setRecipeName(event.target.value)}
                    required
                />

                <label htmlFor="cookTime">Cook Time</label>
                <input
                    type="text"
                    id="cookTime"
                    value={cookTime}
                    onChange={(event)  => setCookTime(event.target.value)}
                    required
                />

                <label htmlFor="servings">Serving Size</label>
                <input
                    type="text"
                    id="servings"
                    value={servings}
                    onChange={(event)=> setServings(event.target.value)}
                    required
                />

                <label htmlFor="category">Category</label>
                <select id="category" value={category} onChange={(event) => setCategory(event.target.value)}>
                    <option  value="breakfast">Breakfast</option>
                    <option value="lunch">Lunch</option>
                    <option value="dinner">Dinner</option>
                    <option value="snack">Snack</option>
                    <option value="dessert">Dessert</option>
                    <option value="drinks">Drinks</option>
                </select>

                <label htmlFor="ingredients">Ingredients</label>
                <textarea
                    id="ingredients"
                    value={ingredients}
                    onChange={(event) => setIngredients(event.target.value)}
                    required
                />
                <label htmlFor="steps">Steps</label>
                <textarea id="steps" value={steps} onChange={(event) => setSteps(event.target.value)} required />
                <input type="submit" value="Post Recipe!" />
                <p>{message}</p>
            </form>
        </div>
    );
}

export default BlogPostForm;
