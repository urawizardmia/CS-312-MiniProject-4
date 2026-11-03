import { useState } from "react";

function Signin(props) {
    // keeps both of the login inputs together
    const [loginInfo, setLoginInfo] = useState({
        userId: "",
        password: "",
    });


    const [message,setMessage] = useState("");

    // updateswhatever box user is typing in
    function changeInput(event) {
        const boxName =  event.target.name;
        const newValue = event.target.value;
        setLoginInfo({
            ...loginInfo,
            [boxName]: newValue,
        });
    }

    function tryLogin(event) {
        event.preventDefault();

        setMessage("");
        // checks the login with the backend
        fetch("http://localhost:3000/api/signin", {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(loginInfo),
        })
            .then((response) => response.json())
            .then((result) => {
                if (result.success) {
                    // 
                    props.onLogin();
                } else { setMessage(result.message);
                }
            })
            .catch((error) => {
                console.log(error);
                setMessage("Couldn't sign in, please try again.");
            });
    }

    return (
        <div>
            <h2>Sign In</h2>
            <form onSubmit={tryLogin}>
                <label htmlFor="userId">User ID</label>
                <input type="text" id="userId"  name="userId" value={loginInfo.userId} onChange={changeInput} required />

                <label htmlFor="password">Password</label>
                <input
                    type="password"
                    id="password"
                    name="password"
                    value={ loginInfo.password}
                    onChange={changeInput}
                    required
                />
                <input type="submit" value="Sign In" />

                <p>{message}</p>
            </form>
        </div>
    );
}
export default Signin;
