import express from "express";
import cors from "cors";
import bcrypt from "bcrypt";
import session from "express-session";

const app = express();
const port = 3000;

//  arrays for recipe and user info (no database)
let recipes = [];
let users = [];
app.use(
    cors({
        origin: "http://localhost:5173",
        credentials: true,
    })
);

app.use(express.json());

app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
    })
);

// send recipes to react
app.get("/api/recipes", (req, res) => {
    res.json(recipes);
});

app.post("/api/recipes",  (req, res) => {
    // makes it so you cant post a recipe unless youre logged in
    if (!req.session.userId) {
        return res.status(401).json({ message: "You must be signed in to post a recipe!" });
    }
    const person =users.find((user) => user.userId === req.session.userId);

    if (!person) {
        return res.status(401).json({ message: "Couldn't find your account, try again." });
    }

    // gets the recipe info that  was sent from the form
    const newRecipe = {
        recipeName: req.body.recipeName,
        author: person.name,
        cookTime: req.body.cookTime,
        servings: req.body.servings,
        category:  req.body.category,
        ingredients: req.body.ingredients,
        steps: req.body.steps,
        date: new Date(),
        addedBy: req.session.userId,
    };

    if (!newRecipe.recipeName|| !newRecipe.ingredients || !newRecipe.steps) {
        return res.status(400).json({  message: "You forgot necessary recipe information!" });
    }

    recipes.push(newRecipe);
    res.json({ message: "Recipe posted!",  recipe: newRecipe });
});

app.put("/api/recipes/:recipeNum", (req,  res) => {
    const recipeNum = Number(req.params.recipeNum);
    const recipe = recipes[recipeNum];

    if (!req.session.userId) {
        return res.status(401).json({ message: "You need to sign in first!" });
    }

    if (!recipe) {
        return res.status(404).json({ message: "Couldn't find that recipe." });
    }

    // checks who posted the recipe so only the original poster can edit
    if (recipe.addedBy !== req.session.userId) {
        return res.status(403).json({ message: "You can only edit your own recipes!" });
    }

    if (!req.body.recipeName|| !req.body.ingredients || !req.body.steps) {
        return res.status(400).json({ message: "You forgot necessary recipe information!" });
    }

    // changes the  old recipe info to whatever its edited to
    recipe.recipeName = req.body.recipeName;
    recipe.cookTime = req.body.cookTime;
    recipe.servings = req.body.servings;
    recipe.category =  req.body.category;
    recipe.ingredients = req.body.ingredients;
    recipe.steps = req.body.steps;

    res.json({ message: "Recipe updated!", recipe: recipe });
});

app.delete("/api/recipes/:recipeNum", (req,res) => {
    const recipeNum = Number(req.params.recipeNum);
    const recipe = recipes[recipeNum];

    if (!req.session.userId) {
        return res.status(401).json({  message: "You must be signed in to delete a recipe." });
    }

    if (!recipe ) {
        return res.status(404).json({ message: "Couldn't find that recipe." });
    }

    // only the original poster can delete the recipe
    if ( recipe.addedBy !== req.session.userId) {
        return res.status(403).json({ message: "You can only delete your own recipe!" });
    }

    // removes the recipe from the recipes array
    recipes.splice(recipeNum, 1);

    res.json({ message:"Recipe deleted!", success: true });
});

app.get("/api/check-login",(req, res) => {
    res.json({ userId: req.session.userId || null });
});

app.get("/api/profile", (req, res) => {
    if (!req.session.userId) {
        return res.status(401).json({ message: "You must be signed in to see your profile." });
    }

    const person = users.find((user) => user.userId === req.session.userId);

    if (!person) {
        return res.status(404).json({ message: "Couldn't find your account :(" });
    }

    // only show the recipesthat belong to the logged in user
    const myRecipes = recipes.filter((recipe) => recipe.addedBy === req.session.userId);

    res.json({
        userId: person.userId,
        name: person.name,
        recipes: myRecipes,
    });
});

app.post("/api/signup", async (req,res) => {
    const userId = req.body.userId;
    const password = req.body.password;
    const name = req.body.name;

    if (!userId || !password || !name) {
        return res.status(400).json({ message: "Please fill out all of the boxes!" });
    }

    // check if someone already has the user ID
    const sameUser = users.find((user) => user.userId === userId);

    if (sameUser) {
        return res.status(409).json({ message: "That user ID is already taken! Try again." });
    }

    // hash the password before saving it 
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = {
        userId: userId,
        password: hashedPassword,
        name: name,
    };

    users.push(newUser);

    res.json({ message: "Account created!" });
});

app.post("/api/signin", async (req, res) => {
    const userId = req.body.userId;
    const password = req.body.password;

    if (!userId || !password) {
        return  res.status(400).json({ message: "You must enter your user ID and password." });
    }

    const person = users.find((user) => user.userId === userId);

    if (!person) {
        return res.status(401).json({  message: "That user ID doesn't exist." });
    }

    // compare what they typed with the password we saved
    const rightPassword = await bcrypt.compare(password, person.password);

    if (!rightPassword) {
        return res.status(401).json({message: "Wrong password, please try again!" });
    }

    // save the user ID in the session so we know who is logged in
    req.session.userId = userId;

    res.json({ message: "You're signed  in!", success: true });
});
app.post("/api/logout", (req, res) => {
    // get rid of the session when they log out
    req.session.destroy((error ) => {
        if (error) {
            return res.status(500).json({ message: "Couldn't log you out, try again." });
        }

        res.clearCookie("connect.sid");
        res.json({ message:"You've been logged out!", success: true });
    });
});

app.listen(port, () => {
    console.log("Server is running on port " + port);
});
