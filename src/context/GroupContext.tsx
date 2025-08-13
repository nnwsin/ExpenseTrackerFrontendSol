import { createContext, useContext, useState, ReactNode } from "react";
import { Groups } from "../pages/Groups";

interface GroupContextType {
  selectedGroup: Groups | null;
  setSelectedGroup: (group: Groups | null) => void;
}

const GroupContext = createContext<GroupContextType | undefined>(undefined);

export const GroupProvider = ({ children }: { children: ReactNode }) => {
  const [selectedGroup, setSelectedGroup] = useState<Groups | null>(null);
  return (
    <GroupContext.Provider value={{ selectedGroup, setSelectedGroup }}>
      {children}
    </GroupContext.Provider>
  );
};

export const useGroup = () => {
  const context = useContext(GroupContext);
  if (!context) throw new Error("useGroup must be used within a GroupProvider");
  return context;
};
