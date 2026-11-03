import { useState } from "react";

function EditRecipe(props) {
    // fills in the boxes with whatever was saved 
    const [recipeName, setRecipeName] = useState(props.recipe.recipeName);
    const [cookTime, setCookTime] = useState(props.recipe.cookTime);
    const [servings, setServings] = useState(props.recipe.servings);
    const [category, setCategory] = useState(props.recipe.category);
    const [ingredients, setIngredients] = useState(props.recipe.ingredients);
    const [steps, setSteps] = useState(props.recipe.steps);
    const [message, setMessage] = useState("");

    function handleSave(event) {
        event.preventDefault();

        // gets all the changed info together to send it back
        const updatedRecipe = {
            recipeName: recipeName,
            cookTime: cookTime,
            servings: servings,
            category: category,
            ingredients: ingredients,
            steps: steps,
        };

        // usea the recipe number so the server knows which one to change
        fetch("http://localhost:3000/api/recipes/" +  props.number, {
            method: "PUT",
            credentials:  "include",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(updatedRecipe),
        })
            .then((response) => response.json())
            .then((data) => {
                setMessage(data.message);

                // if it saved, send the updated recipe back to the list
                if (data.recipe) {
                    props.onSave(data.recipe);
                }
            })
            .catch((error) => {
                console.log("Error editing  recipe:", error);
                setMessage("Couldn't save your changes.  Try again!");
            });
    }

    return (
        <div>
            <h2>Edit Recipe</h2>
            <form className="edit-form" onSubmit={handleSave}>
                <label htmlFor="editName">Recipe Name</label>
                <input
                    id="editName"
                    type="text"
                    value={recipeName}
                    onChange={(event) =>setRecipeName(event.target.value)}
                    required
                />

                <label htmlFor="editTime"> Cook Time</label>
                <input
                    id="editTime"
                    type="text"
                    value={cookTime}
                    onChange={(event)  => setCookTime(event.target.value)}
                    required
                />

                <label  htmlFor="editServings">Serving Size</label>
                <input
                    id="editServings"
                    type="text"
                    value={servings}
                    onChange={(event) => setServings(event.target.value)}
                    required
                />

                <label  htmlFor="editCategory">Category</label>
                <select id="editCategory" value={category} onChange={(event) => setCategory(event.target.value)}>
                    <option value="breakfast">Breakfast</option>
                    <option value="lunch">Lunch</option>
                    <option value="dinner">Dinner</option>
                    <option value="snack">Snack</option>
                    <option value="dessert">Dessert</option>
                     <option value="drinks">Drinks</option>
                </select>

                <label htmlFor="editIngredients">Ingredients</label>
                <textarea
                    id="editIngredients"
                    value={ingredients}
                    onChange={(event) => setIngredients(event.target.value)}
                    required
                />

                <label htmlFor="editSteps">Steps</label>
                <textarea id="editSteps" value={steps} onChange={(event) => setSteps(event.target.value)} required />
                <input type="submit" value="Save Changes" />
                <button type="button" onClick={props.onCancel}>
                    Cancel
                </button>

                <p>{message}</p>
            </form>
        </div>
    );
}

export default EditRecipe;
