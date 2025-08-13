import { createContext, useContext, useState, useEffect } from "react";

const API_URL = import.meta.env.VITE_BACKEND_URL;

export interface User{
    id: string;
    username: string;
    email: string;
    createdAt: Date;
}

interface AuthContextType {
    
    auth: string | null;
    login: (token: string) => void;
    logout: () => void;
    user : User | null;
    isLoading: boolean;
    fetchUserDetails: (token:string)=> Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [auth, setAuth] = useState<string | null>(localStorage.getItem("token"));
    const [user,setUser]  = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const storedToken = localStorage.getItem("token");
        if (storedToken) {
            setAuth(storedToken);
        }
        const expiry = localStorage.getItem("expiry");
        if (expiry && new Date(expiry) < new Date()) {
            logout();
        }
        setIsLoading(false);
    }, [auth]);

     const fetchUserDetails = async (token:string) => {
               
                try {
                    
    
                    const response = await fetch(`${API_URL}/profile`, {
                        method: "GET",
                        headers: {
                            "Authorization": `Bearer ${token}`,
                            "Content-Type": "application/json"
                        },
                    });
    
                    if (!response.ok) {
                        throw new Error(`Error: ${response.statusText}`);
                    }
    
                    const data = await response.json();
                    setUser(data);
                } catch (err: any) {
                    throw new Error(err.message || "Failed to fetch user details");
                } 
            };

    const login = (token: string) => {
        localStorage.setItem("token", token);
        localStorage.setItem("expiry",new Date(Date.now() + 60*24*60*1000).toISOString()); // Set expiry to 1 hour later
        setAuth(token);
    };

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("expiry");
        setAuth(null);
    };

    return (
        <AuthContext.Provider value={{ auth, login, logout, user, isLoading, fetchUserDetails }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used within an AuthProvider");
    return context;
};