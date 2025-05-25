import { useEffect, useState } from "react";
import { Button, Container, Typography, Box } from "@mui/material";
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged } from "firebase/auth";
import { initializeApp } from "firebase/app";
import { useNavigate } from "react-router-dom";
import {firebaseConfig} from "../config/firebase.config.ts";
import {Spinner} from "../components";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export default function SignInPage() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const unsubscribe = onAuthStateChanged(auth, (user) => {
        if (user) {
            navigate("/dashboard");
        } else {

        setLoading(false);
        }
    });
    const handleSignIn = async () => {
        try {
            await signInWithPopup(auth, provider);
        } catch (error) {
            console.error("Sign-in error:", error);
        }
    };

    useEffect(() => {
        return () => unsubscribe();
    }, [navigate, unsubscribe]);

    if (loading) {
        return <div style={{display:"flex", justifyContent:"center", alignItems:"center", height:"100vh"}}>
            <Spinner/>;
        </div>
    }

    return (
        <Container maxWidth="sm">
            <Box sx={{ mt: 10, textAlign: "center" }}>
                <Typography variant="h4" gutterBottom>
                    Welcome to the Traffic Dashboard
                </Typography>
                <Typography variant="body1" gutterBottom>
                    Please sign in with your Google account to continue.
                </Typography>
                <Button variant="contained" color="primary" onClick={handleSignIn}>
                    Sign in with Google
                </Button>
            </Box>
        </Container>
    );
}
