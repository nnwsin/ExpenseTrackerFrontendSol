import { useAuth } from "../context/AuthContext";
import { Groups, MemberExpense } from "../pages/Groups";
import { useNavigate } from "react-router-dom";
import { MdDelete } from "react-icons/md";
import { FaArrowRight } from "react-icons/fa";
import { toast } from "react-toastify";
import { useGroup } from "../context/GroupContext";

interface GroupCardProps {
    group: Groups;
    groups: Groups[];
    setGroups: React.Dispatch<React.SetStateAction<Groups[]>>;
}

export const GroupCard = ({ group, groups, setGroups }: GroupCardProps) => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const { setSelectedGroup } = useGroup();

    const handleDeleteGroup = async () => {
        if (!window.confirm("Are you sure you want to delete this group?")) return;
        const token = localStorage.getItem("token");
        if (!token) {
            toast.error("No token found. Please log in.");
            return;
        }
        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/groups/delete/${group.groupId}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
            });
            if (!response.ok) {
                throw new Error(`Error: ${response.statusText}`);
            }
            setGroups(groups.filter(g => g.groupId !== group.groupId));
            toast.success("Group deleted successfully");
        } catch (error) {
            toast.error("Failed to delete group");
        }
    };

    const handleViewGroup = () => {
        setSelectedGroup(group);
        navigate(`/groups/${group.groupId}`);
    };

    const totalExpense = Array.isArray(group.memberExpenses)
        ? group.memberExpenses.reduce((sum: number, member: MemberExpense) => sum + member.totalPaid, 0)
        : 0;

    return (
        <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold text-gray-900">{group.groupName}</h3>
                <div className="flex gap-2">
                    <button
                        onClick={handleViewGroup}
                        className="p-2 text-gray-600 hover:text-[#0092FB] hover:bg-blue-50 rounded-lg transition-colors"
                        title="View group details"
                    >
                        <FaArrowRight size={18} />
                    </button>
                    {user?.id === group.createdById && (
                        <button
                            onClick={handleDeleteGroup}
                            className="p-2 text-gray-600 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete group"
                        >
                            <MdDelete size={20} />
                        </button>
                    )}
                </div>
            </div>
            <div className="space-y-3">
                <div className="flex justify-between items-center text-sm text-gray-600">
                    <span>Total Members:</span>
                    <span className="font-medium">{Array.isArray(group.memberExpenses) ? group.memberExpenses.length : 0}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">Total Expense:</span>
                    <span className="text-[#0092FB] font-medium">₹{totalExpense}</span>
                </div>
            </div>
            
        </div>
    );
};
