import { createContext, useContext, useEffect, useRef, useState } from "react";
const API_URL = import.meta.env.VITE_BACKEND_URL;

export interface ExpenseType {
    id ?: number;
    name: string;
    category: string;
    amount?: number;
    date: string;
}

interface ExpenseContextType {
    expenses: ExpenseType[];
    setExpenses: React.Dispatch<React.SetStateAction<ExpenseType[]>>;
    activeExpenses: ExpenseType[];  // This will hold the currently filtered/active expenses
    setActiveExpenses: React.Dispatch<React.SetStateAction<ExpenseType[]>>;
    selectExpense: React.RefObject<ExpenseType>;
    totalExpense: number;
    fetchExpenses: () => Promise<void>;
    loading: boolean;
}

const ExpenseContext = createContext<ExpenseContextType | undefined>(undefined);

export const ExpenseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [expenses, setExpenses] = useState<ExpenseType[]>([]);
    const [activeExpenses, setActiveExpenses] = useState<ExpenseType[]>([]);
    const [loading, setLoading] = useState(false);
    const selectExpense = useRef<ExpenseType>({
        name : "",
        category:"",
        amount: undefined,
        date:""
      })

    const fetchExpenses = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem("token");
            // console.log(token)
            if (!token) {
                console.error("No token found. Please login again.");
                return;
            }
            const response = await fetch(`${API_URL}/api/expense/getExpenses`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            });
            if (!response.ok) {
                throw new Error("Failed to fetch expenses");
            }
            const data = await response.json();
            setExpenses(data);
            setActiveExpenses(data); // Initially set active expenses to all expenses
        } catch (error) {
            console.error("Failed to fetch expenses:", error);
        }
        finally{
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchExpenses(); // Fetch data when component mounts
    }, []);

    // Calculate total based on active expenses
    const totalExpense: number = activeExpenses.reduce((sum, expense) => sum + (expense.amount || 0), 0);    return (
        <ExpenseContext.Provider value={{ 
            expenses, 
            setExpenses,
            activeExpenses,
            setActiveExpenses,
            totalExpense, 
            selectExpense, 
            fetchExpenses, 
            loading 
        }}>
            {children}
        </ExpenseContext.Provider>
    );
};

export const useExpense = () => {
    const context = useContext(ExpenseContext);
    if (!context) {
        throw new Error("useExpense must be used within an ExpenseProvider");
    }
    return context;
};