import {useState} from "react";
import {motion} from "framer-motion";
import {useAuth} from "../context/AuthContext";
import {useNavigate} from "react-router-dom";
  import { ToastContainer, toast } from 'react-toastify';


const API_URL = import.meta.env.VITE_BACKEND_URL;

export const Login = () => {
    const [signUp, setSignUp] = useState(true);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [username, setUsername] = useState("");
    const [error, setError] = useState("");
    const {login} = useAuth();  
    const navigate = useNavigate();
    const [loading,setLoading] = useState(false);    const validatePassword = (password: string): string | null => {
        if (password.length < 6) {
            return "Password must be at least 6 characters long";
        }
        if (!/[A-Z]/.test(password)) {
            return "Password must contain at least one capital letter";
        }
        return null;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (signUp) {
            const passwordError = validatePassword(password);
            if (passwordError) {
                setError(passwordError);
                toast.error(passwordError);
                return;
            }
        }

        const url = signUp ? `${API_URL}/signup` : `${API_URL}/login`;
        try {
            setLoading(true);
            const response = await fetch(url, {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({username, email, password}),
            });
            if (!response.ok) {
                // console.log(await response.text())
                setError(await response.text());
                toast.error("Authentication failed. Please check your credentials.");
                throw new Error(`HTTP error!`);
            }
            setLoading(false);
            const data = await response.json(); // Parse JSON response
            console.log(data)
            if(signUp) {
                if (data.error) {
                    setError(data.error);
                    toast.error("Sign up failed. Please try again.");
                } else {
                    toast.success("Sign up successful! You can now log in.");
                }
                setSignUp(false)
                return
            }
            if (data.accessToken) {
                login(data.accessToken);
                toast.success("Login successful!");
                setTimeout(() => {
                  
                    navigate("/dashboard");
                },1000);
            } else {
                // console.error("Token not received!");
                toast.error("Login failed. Please try again.");

            }
        } catch (error) {
            toast.error("An error occurred during authentication. Please try again.");
        }
        finally{
            setLoading(false);
        }
    };


    return (
        <div className="flex items-center justify-center h-screen bg-gray-900 px-4">
            <motion.div
                initial={{opacity: 0, scale: 0.9}}
                animate={{opacity: 1, scale: 1}}
                transition={{duration: 0.5}}
                className="w-full max-w-sm bg-gray-800 shadow-xl rounded-2xl p-6 border border-gray-700"
            >
                <h1 className="text-2xl font-bold text-white text-center mb-6">
                    {signUp ? "Create Account" : "Welcome Back"}
                </h1>
                {error!=""?
                    <p className="text-red-600">{error}</p>
                    :
                    <></>
                }
                <br/>
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    {signUp && (
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => {
                                setUsername(e.target.value); setError("")
                            }}
                            placeholder="Username"
                            className="w-full p-2 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#34ffd7] bg-gray-700 text-white placeholder-gray-400"
                        />
                    )}
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => {
                            setEmail(e.target.value); setError("")
                        }}
                        className="w-full p-2 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#34ffd7] bg-gray-700 text-white placeholder-gray-400"
                    />                    <div>
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => {
                                setPassword(e.target.value); 
                                setError("");
                            }}
                            className="w-full p-2 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#34ffd7] bg-gray-700 text-white placeholder-gray-400"
                        />
                        {signUp && (
                            <p className="text-xs text-gray-400 mt-1">
                                Password must be at least 6 characters long and contain at least one capital letter
                            </p>
                        )}
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full p-2 mt-4 rounded-lg font-medium transition flex items-center justify-center gap-2 ${
                            loading
                                ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                                : "bg-gradient-to-r from-[#34ffd7] to-[#ff7ce5] text-[#181824] hover:shadow-xl"
                        }`}
                    >
                        {loading ? (
                            <>
                                <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                                </svg>
                                {signUp ? "Signing up..." : "Logging in..."}
                            </>
                        ) : (
                            signUp ? "Sign Up" : "Login"
                        )}
                    </button>
                </form>
                <div
                    className="text-sm text-gray-400 mt-4 text-center cursor-pointer hover:text-[#34ffd7] transition-colors"
                    onClick={() =>
                        setSignUp(!signUp)
                    }
                >
                    {signUp ? "Already have an account? Login" : "New User? Sign Up"}
                </div>
            </motion.div>
            <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
            />
        </div>
    );
};