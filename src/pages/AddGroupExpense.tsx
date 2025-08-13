import {  useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useGroup } from "../context/GroupContext";
import { toast } from "react-toastify";
import {categories} from "./AddExpense"



export const AddGroupExpense = () => {
    const { groupId } = useParams();
    const { selectedGroup, setSelectedGroup } = useGroup();
    const navigate = useNavigate();
    const [description, setDescription] = useState("");
    const [amount, setAmount] = useState(0);
    const [date, setDate] = useState("");
    const [category, setCategory] = useState("");
    const [splitType, setSplitType] = useState<"equal" | "manual">("equal");
    const [splitMap, setSplitMap] = useState<{ [userId: string]: number }>({});

   
    const handleSplitTypeChange = (type: "equal" | "manual") => {
        setSplitType(type);
        if (type === "equal" && selectedGroup) {
            const members = selectedGroup.memberExpenses;
            const perMember = amount > 0 ? Math.floor((amount * 100) / members.length) / 100 : 0;
            const newMap: { [userId: string]: number } = {};
            members.forEach(m => newMap[m.memberId] = perMember);
            setSplitMap(newMap);
        }
    };

    const handleAmountChange = (val: number) => {
        setAmount(val);
        if (splitType === "equal" && selectedGroup) {
            const members = selectedGroup.memberExpenses;
            const perMember = val > 0 ? Math.floor((val * 100) / members.length) / 100 : 0;
            const newMap: { [userId: string]: number } = {};
            members.forEach(m => newMap[m.memberId] = perMember);
            setSplitMap(newMap);
        }
    };

    const handleManualSplit = (userId: string, value: number) => {
        setSplitMap(prev => ({ ...prev, [userId]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedGroup) return;
        if (amount < 1) {
            toast.error("Amount must be at least 1");
            return;
        }
        if (splitType === "manual") {
            const total = Object.values(splitMap).reduce((a, b) => a + b, 0);
            if (total !== amount) {
                toast.error("Manual split must sum to total amount");
                return;
            }
            if (Object.values(splitMap).some(v => v < 1)) {
                toast.error("Each member's amount must be at least 1");
                return;
            }
        }
      
        const req = {
            groupId: Number(groupId),
            description,
            amount,
            date,
            category,
            splitMap: Object.fromEntries(Object.entries(splitMap).map(([k, v]) => [Number(k), v]))
        };
        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/groups/add-expense`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(req)
            });

            if (!response.ok) {
                throw new Error("Failed to add group expense");
            }

            
            if (selectedGroup) {
                const updatedMemberExpenses = selectedGroup.memberExpenses.map(member => ({
                    ...member,
                    totalPaid: splitMap[member.memberId] ? member.totalPaid + splitMap[member.memberId] : member.totalPaid
                }));

                setSelectedGroup({
                    ...selectedGroup,
                    memberExpenses: updatedMemberExpenses
                });
            }

            toast.success("Expense added!");
            
            navigate(`/groups/${groupId}`, { state: { updated: Date.now() } });
        } catch (err) {
            toast.error("Error adding expense");
        }
    };

    if (!selectedGroup) return <div className="p-8 text-center">No group selected.</div>;
    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-8 shadow-md w-full max-w-lg space-y-6">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">Add Group Expense</h2>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <input type="text" value={description} onChange={e => setDescription(e.target.value)} required className="w-full px-4 py-2 border border-gray-300 rounded-xl" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
                    <input type="number" min={1} value={amount} onChange={e => handleAmountChange(Number(e.target.value))} required className="w-full px-4 py-2 border border-gray-300 rounded-xl" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                    <input type="datetime-local" value={date} onChange={e => setDate(e.target.value)} required className="w-full px-4 py-2 border border-gray-300 rounded-xl" max={new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 16)} />
                </div>
                <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                id="category"
                name="category"
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0092FB] focus:border-transparent transition-colors"
                value={category}
                onChange={(e) => setCategory( e.target.value)}
              >
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Split Method</label>
                    <div className="flex gap-4 mb-2">
                        <label className="flex items-center gap-2">
                            <input type="radio" checked={splitType === "equal"} onChange={() => handleSplitTypeChange("equal")}/>
                            Equal
                        </label>
                        <label className="flex items-center gap-2">
                            <input type="radio" checked={splitType === "manual"} onChange={() => handleSplitTypeChange("manual")}/>
                            Manual
                        </label>
                    </div>
                    {splitType === "manual" && (
                        <div className="space-y-2">
                            {selectedGroup.memberExpenses.map(member => (
                                <div key={member.memberId} className="flex items-center gap-2">
                                    <span className="w-32">{member.username}</span>
                                    <input
                                        type="number"
                                        min={0}
                                        value={splitMap[member.memberId] || ""}
                                        onChange={e => handleManualSplit(member.memberId, Number(e.target.value))}
                                        className="flex-1 px-2 py-1 border border-gray-300 rounded"
                                    />
                                </div>
                            ))}
                        </div>
                    )}
                    {splitType === "equal" && (
                        <div className="space-y-2">
                            {selectedGroup.memberExpenses.map(member => (
                                <div key={member.memberId} className="flex items-center gap-2">
                                    <span className="w-32">{member.username}</span>
                                    <input
                                        type="number"
                                        min={1}
                                        value={splitMap[member.memberId] || ""}
                                        readOnly
                                        className="flex-1 px-2 py-1 border border-gray-300 rounded bg-gray-100"
                                    />
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                <div className="flex justify-end gap-4 pt-4">
                    <button type="button" onClick={() => navigate(-1)} className="px-4 py-2 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50">Cancel</button>
                    <button type="submit" className="px-4 py-2 bg-[#0092FB] text-white rounded-xl font-semibold hover:bg-blue-600">Add Expense</button>
                </div>
            </form>
        </div>
    );
}
