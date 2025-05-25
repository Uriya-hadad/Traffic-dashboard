// create a cool navbar

import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { getAuth, signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

export const Navbar = () => {
    const auth = getAuth();
    const user = auth.currentUser;
    const navigate = useNavigate();

    const handleSignOut = async () => {
        await signOut(auth);
        navigate('/');
    };

    return (
        <AppBar position="static">
            <Toolbar>
                <Typography variant="h6" sx={{ flexGrow: 1 }}>
                    Traffic Dashboard
                </Typography>
                        {user &&
                            <Button color="inherit" onClick={handleSignOut}>
                                signOut
                            </Button>
                        }
            </Toolbar>
        </AppBar>
    );
};
