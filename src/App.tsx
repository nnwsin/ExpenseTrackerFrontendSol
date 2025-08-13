import {BrowserRouter,Routes,Route} from 'react-router-dom';
import { Layout } from './pages/Layout.tsx';
import { Home } from './pages/Home.tsx';
import { Login } from './pages/Login.tsx';
import { Dashboard } from './pages/Dashboard.tsx';
import { ExpenseProvider } from './context/ExpenseContext.tsx';
import { AddExpense } from './pages/AddExpense.tsx';
import { Reports } from './pages/Reports.tsx';
import {AuthProvider} from "./context/AuthContext.tsx";
import Profile from "./pages/Profile.tsx";
import { EditExpense } from './pages/EditExpense.tsx';
import { Groups } from './pages/Groups.tsx';
import { GroupDetails } from './pages/GroupDetails.tsx';
import { GroupProvider } from "./context/GroupContext";
import { AddGroupExpense } from './pages/AddGroupExpense.tsx';
import { Invitation } from './pages/Invitation.tsx';

function App() {
  return(
    <AuthProvider >
    <ExpenseProvider>
    <GroupProvider>
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Layout/>}>
          <Route index element={<Home/>}/>
          <Route path='login' element={<Login/>}/>
          <Route path='dashboard' element={<Dashboard/>}/>
          <Route path='add' element={<AddExpense/>}/>
          <Route path='reports' element={<Reports/>}/>
          <Route path={'profile'} element={<Profile />} />          
          <Route path='edit' element={<EditExpense/>}/>
          <Route path='groups' element={<Groups/>}/>
          <Route path='groups/:groupId' element={<GroupDetails/>}/>
          <Route path='groups/:groupId/add-expense' element={<AddGroupExpense/>}/>
          <Route path='/groups/invites' element={<Invitation/>} />
        </Route>
      </Routes>
    </BrowserRouter>
    </GroupProvider>
    </ExpenseProvider>
    </AuthProvider>
  )
}

export default App