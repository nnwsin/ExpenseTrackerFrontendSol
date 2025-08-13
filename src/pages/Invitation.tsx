import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { format } from "date-fns";

interface GroupInvitation {
    id: number;
    token: string;
    groupName: string;
    createdBy: string;
    createdByEmail: string;
    isAccepted: boolean;
    invitedAt: string;
}

export const Invitation = () => {
    const navigate = useNavigate();
    const { auth } = useAuth();
    const [loading, setLoading] = useState(true);
    const [invitations, setInvitations] = useState<GroupInvitation[]>([]);

    useEffect(() => {
        console.log("HERE");
        const fetchInvitations = async () => {
            const token = auth || localStorage.getItem("token");
            if (!token) {
                toast.error("Please log in to view invitations");
                navigate("/login");
                return;
            }
            
            try {
                const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/group/invite/getall`, {
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                });

                if (!response.ok) {
                    throw new Error("Failed to fetch invitations");
                }

                const data = await response.json();
                // setInvitations(data.filter((invitation: GroupInvitation) => !invitation.isAccepted));
                setInvitations(data);
            } catch (error) {
                toast.error("Error fetching invitations");
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchInvitations();
        console.log("ONE")
    }, []);
    console.log(invitations);
    const handleInvitation = async (invitationId: number, accept: boolean,token: string) => {
        try {
            const authToken = auth || localStorage.getItem("token");
            if (!authToken) {
                toast.error("Please log in to respond to invitations");
                return;
            }
            let resp;
            if(accept){
                const response = await fetch(
                    `${import.meta.env.VITE_BACKEND_URL}/api/group/invite/confirm-invitation?token=${token}`,
                    {
                        method: "GET",
                        headers: {
                            "Authorization": `Bearer ${authToken}`,
                            "Content-Type": "application/json"
                        }
                    }
                );
                resp = response;
            }
            else{
                const response = await fetch(
                    `${import.meta.env.VITE_BACKEND_URL}/api/group/invite/decline/${invitationId}`,{
                        method: "DELETE",
                        headers: {
                            "Authorization": `Bearer ${authToken}`,
                            "Content-Type": "application/json"
                        }
                    });
                    resp = response;
                }
                
                
            setInvitations(prev => prev.filter(inv => inv.id !== invitationId));
            if (!resp.ok) {
                throw new Error(`Failed to ${accept ? 'accept' : 'decline'} invitation`);
            }

            toast.success(`Invitation ${accept ? 'accepted' : 'declined'} successfully`);
            if (accept) {
                
                
                const data = await resp.text();
                toast.success(data);
            } else {
                
                setInvitations(prev => prev.filter(inv => inv.id !== invitationId));
            }
        } catch (error) {
            toast.error(`Error ${accept ? 'accepting' : 'declining'} invitation`);
            console.error(error);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-4 border-4 border-t-[#0092FB] border-r-[#0092FB] border-b-gray-200 border-l-gray-200 rounded-full animate-spin"></div>
                    <p className="text-gray-600">Loading invitations...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-2xl font-semibold text-gray-900 mb-6">Group Invitations</h1>
                
                {invitations.length === 0 ? (
                    <div className="bg-white rounded-2xl p-8 text-center shadow-sm">
                        <p className="text-gray-600">No pending invitations</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {invitations.map((invitation) => (
                            <div key={invitation.id} className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900 mb-1">
                                            {invitation.groupName}
                                        </h3>
                                        <p className="text-sm text-gray-600 mb-2">
                                            Invited by: {invitation.createdBy} ({invitation.createdByEmail})
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            Invited on: {format(new Date(invitation.invitedAt), 'MMM dd, yyyy HH:mm')}
                                        </p>
                                    </div>
                                    <div className="flex gap-3">
                                        <button
                                            onClick={() => handleInvitation(invitation.id, true,invitation.token)}
                                            className="px-4 py-2 bg-[#0092FB] text-white rounded-xl font-medium hover:bg-blue-600 transition-colors"
                                        >
                                            Accept
                                        </button>
                                        <button
                                            onClick={() => handleInvitation(invitation.id, false,invitation.token)}
                                            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors"
                                        >
                                            Decline
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};
