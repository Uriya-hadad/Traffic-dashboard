import React from "react";
import { Navigate } from "react-router-dom";
import { getAuth } from "firebase/auth";

export function RequireAuth({ children }: { children: React.ReactNode }) {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
        return <Navigate to="/" replace />;
    }

    return children;
}
