import React from 'react'
import { Routes, Route } from 'react-router-dom'

import LandingPage from './LangingPage/LandingPage'
import Announcement from './Admin/Announcement'
import Admin from './Admin/Admin'
import AdminSidebar from './Admin/AdminSidebar'
import AdminMembers from './Admin/AdminMembers'
import AddBatch from './Admin/AddBatch'
import EditBatch from './Admin/EditBatch'
import AddMember from './Admin/AddMember'
import EditMember from './Admin/EditMember'
import ProblemAdmin from './Admin/ProblemAdmin'
import ActivitiesAdmin from './Admin/ActivitiesAdmin';
import GloriesAdmin from './Admin/GloriesAdmin'
import SuggestionAdmin from './Admin/SuggestionAdmin'

function App() {
  return (
    <Routes>

      <Route path="/*" element={<LandingPage />} />

      <Route path="/admin/*" element={<Admin />} />

      <Route path="/admin/members" element={<AdminMembers />} />

      <Route path="/add-batch" element={<AddBatch />} />

      <Route path="/edit-batch" element={<EditBatch />} />

      <Route path="/add-member" element={<AddMember />} />

      <Route path="/edit-member" element={<EditMember />} />

      <Route path="/admin/problems" element={<ProblemAdmin />} />

      <Route path="/admin/activities" element={<ActivitiesAdmin />} />

      <Route path="/admin/glories" element={<GloriesAdmin />} />

      <Route path="/admin/suggestion" element={<SuggestionAdmin />} />
    </Routes>
  )
}

export default App