import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {  MemberExpense } from "./Groups";
import { useAuth } from "../context/AuthContext";
import { useGroup } from "../context/GroupContext";
import { toast } from "react-toastify";

export const GroupDetails = () => {
    const navigate = useNavigate();
    const { auth } = useAuth();
    const { selectedGroup: group } = useGroup();

    useEffect(() => {
        if (!auth && !localStorage.getItem("token")) {
            toast.error("Please log in to view group details");
            navigate("/login");
        }
    }, [auth, navigate]);

   

    if (!group) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">Group not found</h2>
                    <button
                        onClick={() => navigate("/groups")}
                        className="text-[#0092FB] hover:underline"
                    >
                        Back to Groups
                    </button>
                </div>
            </div>
        );
    }

    const totalExpense = group.memberExpenses.reduce((sum: number, member: MemberExpense) => sum + member.totalPaid, 0);

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-4xl mx-auto">
                <div className="mb-6 flex justify-between items-center">
                    <button
                        onClick={() => navigate("/groups")}
                        className="text-gray-600 hover:text-[#0092FB] flex items-center gap-2"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                        </svg>
                        Back to Groups
                    </button>
                    <button
                        onClick={() => navigate(`/groups/${group.groupId}/add-expense`)}
                        className="px-4 py-2 bg-[#0092FB] text-white rounded-xl font-semibold hover:bg-blue-600"
                    >
                        Add Group Expense
                    </button>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
                    <h1 className="text-2xl font-semibold text-gray-900 mb-4">{group.groupName}</h1>
                    <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="bg-blue-50 p-4 rounded-xl">
                            <p className="text-sm text-gray-600">Total Members</p>
                            <p className="text-xl font-semibold text-[#0092FB]">{group.memberExpenses.length}</p>
                        </div>
                        <div className="bg-blue-50 p-4 rounded-xl">
                            <p className="text-sm text-gray-600">Total Expenses</p>
                            <p className="text-xl font-semibold text-[#0092FB]">₹{totalExpense}</p>
                        </div>
                    </div>

                    <div>
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Member Expenses</h2>
                        <div className="space-y-3">
                            {group.memberExpenses.map((member) => (
                                <div
                                    key={member.memberId}
                                    className="flex justify-between items-center p-4 bg-gray-50 rounded-xl"
                                >
                                    <div>
                                        <p className="font-medium text-gray-900">{member.username}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm text-gray-600">Total Paid</p>
                                        <p className="font-medium text-[#0092FB]">₹{member.totalPaid}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
