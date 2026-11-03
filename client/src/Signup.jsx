import { useState } from "react";

function Signup() {
    // keep track of the whats entered in the signup form
    const [userId, setUserId] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [message, setMessage] = useState("");

    function makeAccount(event) {
        event.preventDefault();

        const newUser = {
            userId:  userId,
            password: password,
            name: name,
        };
        fetch("http://localhost:3000/api/signup", {
            method: "POST",
            headers: {

                "Content-Type": "application/json",
            },
            body: JSON.stringify( newUser),
        })
            .then((response) => response.json())
            .then((data) =>{ setMessage(data.message);
            })
            .catch((error) => {
                console.log(error);
                setMessage("Couldn't make your account, try again.");
            });
    }

    return (
        <div>
            <h2>Sign Up</h2>

            <form onSubmit={makeAccount}>
                <label htmlFor="userId">User ID</label>
                <input
                    type="text"
                    id="userId"
                    value={userId}
                    onChange={(event) =>  setUserId(event.target.value)}
                    required
                />

                <label htmlFor="password">Password</label>
                <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    required
                />

                <label htmlFor="name">Name</label>
                <input type="text"  id="name" value={name} onChange={(event) => setName(event.target.value)} required />

                <button type="submit">Make Account</button>
                <p>{message}</p>
            </form>
        </div>
    );
}

export default Signup;
