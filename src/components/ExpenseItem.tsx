import React, { JSX } from "react";
import { MdDeleteOutline,MdEdit  } from "react-icons/md";
import { ExpenseType, useExpense } from "../context/ExpenseContext";
import { 
  FaUtensils, 
  FaHome, 
  FaTshirt, 
  FaGamepad, 
  FaBus, 
  FaBolt, 
  FaFilm, 
  FaHeartbeat, 
  FaGraduationCap, 
  FaEllipsisH 
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
const API_URL = import.meta.env.VITE_BACKEND_URL;

interface ExpenseItemProps {
  expense: ExpenseType;
}

const categoryIcons: Record<string, { icon: JSX.Element; color: string }> = {
  Food: { icon: <FaUtensils />, color: "bg-orange-50 text-orange-500" },
  Rent: { icon: <FaHome />, color: "bg-blue-50 text-blue-500" },
  Clothes: { icon: <FaTshirt />, color: "bg-purple-50 text-purple-500" },
  Recreation: { icon: <FaGamepad />, color: "bg-green-50 text-green-500" },
  Transport: { icon: <FaBus />, color: "bg-yellow-50 text-yellow-500" },
  Utilities: { icon: <FaBolt />, color: "bg-red-50 text-red-500" },
  Entertainment: { icon: <FaFilm />, color: "bg-pink-50 text-pink-500" },
  Healthcare: { icon: <FaHeartbeat />, color: "bg-rose-50 text-rose-500" },
  Education: { icon: <FaGraduationCap />, color: "bg-indigo-50 text-indigo-500" },
  Other: { icon: <FaEllipsisH />, color: "bg-gray-50 text-gray-500" }
};

export const ExpenseItem: React.FC<ExpenseItemProps> = ({ expense }) => {
  const { expenses,selectExpense, setExpenses } = useExpense();
  const navigate = useNavigate()
  

  const deleteExpense = async(id: number | undefined)=>{
    const token = localStorage.getItem("token");
      console.log("Token being sent:", token);
      if (!token) {
        console.log("No token found. Please login again.");
        return;
      }
    const response = await fetch(`${API_URL}/api/expense/deleteExpense/${id}`,{
      method:"DELETE",
      headers:{
        "Content-Type":"application/json",
        "Authorization": `Bearer ${token}`
      }
    })
    if(response.ok){
      const filteredExpenses = expenses.filter((item) => item.id !== id);
      setExpenses(filteredExpenses);
    }
    else{
      console.log("Failed to delete expense");
    }
  }
  
  const handleOnDelete = () => {
    if (!window.confirm("Are you sure you want to delete this expense?")) return;
    deleteExpense(expense.id);
  };

  const categoryIcon = categoryIcons[expense.category] || categoryIcons.Other;

  return (
    <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-100 hover:border-blue-100 hover:shadow-sm transition-all">
      <div className="flex items-center gap-4">
        <div className={`w-10 h-10 rounded-lg ${categoryIcon.color} flex items-center justify-center text-lg`}>
          {categoryIcon.icon}
        </div>
        <div>
          <h3 className="font-medium text-gray-900">{expense.name}</h3>
          <div className="flex items-center gap-2">
            {/* <span className="text-sm text-gray-500">{expense.date.slice(0,10)} {expense.date.slice(11)}</span> */}
            <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
              {expense.category}
            </span>
            <span className="text-xs text-gray-500">{expense.date.slice(0,10)}</span>
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-6">
        <span className="text-lg font-semibold text-red-600">₹{expense.amount || 0}</span>
        <button 
          onClick={()=>{selectExpense.current=expense;navigate("../edit")}} 
          className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
          title="Edit expense"
        >
          <MdEdit size={20} />
        </button>
        <button 
          onClick={handleOnDelete} 
          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
          title="Delete expense"
        >
          <MdDeleteOutline size={20} />
        </button>
      </div>
    </div>
  );
};
