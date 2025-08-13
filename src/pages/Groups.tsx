import { useEffect, useRef, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { GroupCard } from "../components/GroupCard";

const API_URL = import.meta.env.VITE_BACKEND_URL;

export interface MemberExpense {
    memberId: string;
    username: string;
    totalPaid: number;
}

export interface Groups {
    groupId: string;
    createdById: string;
    groupName: string;
    memberExpenses: MemberExpense[];
}

interface NewGroup {
    groupName: string;
    createdByUserId: string;
    memberEmails: string[]; 
   
}

interface AllUsers {
    id: number;
    username: string;
    email: string;
}

export const Groups = () => {
    const { auth, user, fetchUserDetails } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [groups, setGroups] = useState<Groups[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [error, setError] = useState("");
    const [allUsers, setAllUsers] = useState<AllUsers[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [showResults, setShowResults] = useState(false);
    const searchRef = useRef<HTMLDivElement>(null);
    const [newGroup, setNewGroup] = useState<NewGroup>({
        groupName: "",
        createdByUserId: user ? user.id : "",
        memberEmails: []
    });
    const [creating, setCreating] = useState(false);

    useEffect(() => {
        const fetchAllUsers = async () => {
            try {
                const token = auth || localStorage.getItem("token");
                if (!token) {
                    toast.error("No token found. Please log in.");
                    return;
                }

                const response = await fetch(`${API_URL}/allUsers`, {
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                });

                if (!response.ok) {
                    throw new Error("Failed to fetch users");
                }

                const data = await response.json();
                setAllUsers(data.filter((u: AllUsers) => u.email !== user?.email));
            } catch (error) {
                console.error("Error fetching users:", error);
                toast.error("Failed to load users list");
            }
        };

        if (isModalOpen) {
            fetchAllUsers();
        }
    }, [isModalOpen, auth, user]);

    // Close search results when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setShowResults(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleAddMember = (selectedUser: AllUsers) => {
        if (newGroup.memberEmails.includes(selectedUser.email)) {
            setError("This user is already added");
            return;
        }

        setNewGroup(prev => ({
            ...prev,
            memberEmails: [...prev.memberEmails, selectedUser.email]
        }));
        setSearchTerm("");
        setShowResults(false);
        setError("");
    };

    const handleRemoveMember = (emailToRemove: string) => {
        setNewGroup(prev => ({
            ...prev,
            memberEmails: prev.memberEmails.filter(email => email !== emailToRemove)
        }));
    };

    const handleCreateGroup = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setCreating(true);

        try {
            if (!user) {
                toast.error("User not found. Please log in.");
                return;
            }

            if (!newGroup.groupName.trim()) {
                setError("Group name is required");
                return;
            }

            const token = auth || localStorage.getItem("token");
            if (!token) {
                toast.error("No token found. Please log in.");
                return;
            }

            const reqBody = { ...newGroup, createdByUserId: user.id };
            const response = await fetch(`${API_URL}/api/groups/create`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(reqBody)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Failed to create group");
            }

            const data = await response.json();
            setGroups(prevGroups => [...prevGroups, data]);
            setIsModalOpen(false);
            setNewGroup({ groupName: "", createdByUserId: "", memberEmails: [] });
            toast.success("Group created successfully!");
        } catch (error: any) {
            const errorMessage = error.message || "Failed to create group";
            setError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setCreating(false);
        }
    };

    useEffect(() => {
        const getUser =  async () => {
            setLoading(true);
            try{
                const token = auth || localStorage.getItem("token");
            
                if (!token) {
                    toast.error("No token found. Please log in.");
                    setLoading(false);
                    return;
                }
                fetchUserDetails(token);
            }
            catch(error){

            }
        
            setLoading(false);
        }
       

        getUser();
    }, [auth]);
    useEffect(() => {
        const fetchUserGroups = async () => {
            try {
                if (!user) return;
                setLoading(true);
                const token = auth || localStorage.getItem("token");
                if (!token) {
                    toast.error("No token found. Please log in.");
                    return;
                }
                const response = await fetch(`${API_URL}/api/groups/member-expenses/${user.id}`, {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json"
                    },
                });
                if (!response.ok) {
                    throw new Error(`Error fetching groups: ${response.statusText}`);
                }
                const data = await response.json();
                setGroups(data);
            } catch (error) {
                toast.error(error instanceof Error ? error.message : "Failed to fetch user groups");
            } finally {
                setLoading(false);
            }
        };
        fetchUserGroups();
    }, [user, auth,newGroup]);
    useEffect(() => {
        const fetchAllUsers = async () => {
            try {
                const token = auth || localStorage.getItem("token");

                const response = await fetch(`${API_URL}/allUsers`, {
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                });

                const data = await response.json();
                // Filter out the current user from the list
                setAllUsers(data.filter((u: AllUsers) => u.email !== user?.email));
            } catch (error) {
                console.error("Error fetching users:", error);
               
            }
        };

        if (isModalOpen) {
            fetchAllUsers();
        }
    }, [isModalOpen, auth, user]);

    useEffect(() => {
        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                setIsModalOpen(false);
                setError("");
                setNewGroup({ groupName: "", createdByUserId: "", memberEmails: [] });
            }
        };

        if (isModalOpen) {
            window.addEventListener("keydown", handleEscape);
        }

        return () => {
            window.removeEventListener("keydown", handleEscape);
        };
    }, [isModalOpen]);

    const getFilteredUsers = (): AllUsers[] => {
        if (!searchTerm) return [];
        return allUsers.filter((user: AllUsers) =>
            user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase())
        );
    };
    if (!user) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-xl font-semibold text-gray-900 my-6">Please log in to view groups</h2>
                    <button onClick={()=>navigate("/login")} className="cursor-pointer">
                        <span className="mt-4 px-4 py-2 bg-[#0092FB] text-white rounded-xl font-semibold hover:bg-blue-600 transition-colors">
                            Go to Login
                        </span>
                    </button>
                </div>
            </div>
        );
    }
    console.log(user.email)
    
    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-6xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-semibold text-gray-900">My Groups</h1>
                    <div className="flex gap-4">
                     <button
                        onClick={() => navigate("/groups/invites")}
                        className="cursor-pointer px-6 py-3 font-bold rounded-2xl bg-gradient-to-r from-[#34ffd7] to-[#ff7ce5] text-[#181824] border-0 hover:shadow-xl transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#34ffd7]"
                        >
                        View Invitations
                        </button>

                        <button
                        onClick={() => setIsModalOpen(true)}
                        className="cursor-pointer px-6 py-3 font-bold rounded-2xl bg-gradient-to-r from-[#34ffd7] to-[#ff7ce5] text-[#181824] border-0 hover:shadow-xl transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#34ffd7]"
                        >
                        Create Group
                     </button>
                    </div>
                </div>

                {isModalOpen && (
                    <div className="fixed inset-0 bg-[rgba(0,0,0,0.7)] bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-2xl p-6 w-full max-w-md relative">
                            <button
                                onClick={() => {
                                    setIsModalOpen(false);
                                    setError("");
                                    setNewGroup({ groupName: "", createdByUserId: "", memberEmails: [] });
                            }}
                            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>

                        <form onSubmit={handleCreateGroup} className="space-y-4">
                            {error && (
                                <div className="p-3 rounded-lg bg-red-50 text-red-600 text-sm">
                                    {error}
                                </div>
                            )}
                            <div>
                                <h2 className="text-xl font-semibold text-gray-900 mb-4">Create New Group</h2>
                            </div>
                            <div>
                                <label htmlFor="groupName" className="block text-sm font-medium text-gray-700 mb-1">
                                    Group Name
                                </label>
                                <input
                                    type="text"
                                    id="groupName"
                                    value={newGroup.groupName}
                                    onChange={(e) => setNewGroup({ ...newGroup, groupName: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0092FB] focus:border-transparent"
                                    required
                                />
                            </div>
                            <div ref={searchRef} className="relative">
                                <label htmlFor="members" className="block text-sm font-medium text-gray-700 mb-1">
                                    Search Members
                                </label>
                                <input
                                    type="text"
                                    id="members"
                                    value={searchTerm}
                                    onChange={(e) => {
                                        setSearchTerm(e.target.value);
                                        setShowResults(true);
                                    }}
                                    onClick={() => setShowResults(true)}
                                    placeholder="Search by username or email"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0092FB] focus:border-transparent"
                                />
                                
                                {/* Search Results Dropdown */}
                                {showResults && searchTerm && (
                                    <div className="absolute z-10 mt-1 w-full bg-white rounded-xl shadow-lg border border-gray-200 max-h-48 overflow-auto">
                                        {getFilteredUsers().length > 0 ? (
                                            getFilteredUsers().map((user: AllUsers) => (
                                                <button
                                                    key={user.id}
                                                    type="button"
                                                    onClick={() => handleAddMember(user)}
                                                    className="w-full text-left px-4 py-2 hover:bg-gray-50 focus:bg-gray-50 focus:outline-none"
                                                >
                                                    <div className="text-sm font-medium text-gray-900">{user.username}</div>
                                                    <div className="text-xs text-gray-500">{user.email}</div>
                                                </button>
                                            ))
                                        ) : (
                                            <div className="px-4 py-2 text-sm text-gray-500">No users found</div>
                                        )}
                                    </div>
                                )}
                                
                                {/* Selected Members */}
                                <div className="mt-3 flex flex-wrap gap-2">
                                    {newGroup.memberEmails.map((email) => (
                                        <div key={email} className="flex items-center bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-sm">
                                            {allUsers.find(u => u.email === email)?.username || email}
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveMember(email)}
                                                className="ml-2 text-blue-400 hover:text-blue-600"
                                                title="Remove member"
                                            >
                                                ×
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="flex justify-end gap-4 pt-4">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsModalOpen(false);
                                        setError("");
                                        setNewGroup({ groupName: "", createdByUserId: "", memberEmails: [] });
                                    }}
                                    className="px-4 py-2 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={creating}
                                    className={`px-4 py-2 rounded-xl font-semibold transition-colors flex items-center justify-center gap-2 ${
                                        creating
                                            ? "bg-blue-300 text-white cursor-not-allowed"
                                            : "bg-[#0092FB] text-white hover:bg-blue-600"
                                    }`}
                                >
                                    {creating ? (
                                        <>
                                            <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                                            </svg>
                                            Creating...
                                        </>
                                    ) : (
                                        "Create Group"
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {loading ? (
                        <div>Loading...</div>
                    ) : groups.length === 0 ? (
                        <div className="col-span-full text-center py-12">
                            <p className="text-gray-500">No groups yet. Create your first group!</p>
                        </div>
                    ) : (
                        groups.map((group) => (
                            <GroupCard key={group.groupId || group.groupName} group={group} groups={groups} setGroups={setGroups}/>
                        ))
                    )}
                </div>
            </div>
            <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} closeOnClick pauseOnFocusLoss />
        </div>
    );
};
