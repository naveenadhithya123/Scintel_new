import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'

import LandingPage from './LangingPage/LandingPage'
import Announcement from './Admin/Announcement'
import AdminMembers from './Admin/AdminMembers'
import AddBatch from './Admin/AddBatch'
import EditBatch from './Admin/EditBatch'
import AddMember from './Admin/AddMember'
import EditMember from './Admin/EditMember'
import ProblemAdmin from './Admin/ProblemAdmin'
import ActivitiesAdmin from './Admin/ActivitiesAdmin';
import GloriesAdmin from './Admin/GloriesAdmin'
import SuggestionAdmin from './Admin/SuggestionAdmin'
import EventsGrid from "./Admin/EventsGrid";
import { AddEvent, EditEvent, AddNewYear } from "./Admin/EventPages";
import AdminPortalRoute from './Admin/AdminPortalRoute';

function App() {
  return (
    <Routes>
      <Route path="/admin" element={<AdminPortalRoute />}>
        <Route index element={<Announcement />} />
        <Route path="members" element={<AdminMembers />} />
        <Route path="add-batch" element={<AddBatch />} />
        <Route path="edit-batch" element={<EditBatch />} />
        <Route path="add-member" element={<AddMember />} />
        <Route path="edit-member" element={<EditMember />} />
        <Route path="problems" element={<ProblemAdmin />} />
        <Route path="activities" element={<ActivitiesAdmin />} />
        <Route path="activities/:year" element={<EventsGrid />} />
        <Route path="activities/:year/add-event" element={<AddEvent />} />
        <Route path="activities/:year/edit-event/:id" element={<EditEvent />} />
        <Route path="activities/add-new-year" element={<AddNewYear />} />
        <Route path="glories" element={<GloriesAdmin />} />
        <Route path="suggestion" element={<SuggestionAdmin />} />
      </Route>

      <Route path="/add-batch" element={<Navigate to="/admin/add-batch" replace />} />
      <Route path="/edit-batch" element={<Navigate to="/admin/edit-batch" replace />} />
      <Route path="/add-member" element={<Navigate to="/admin/add-member" replace />} />
      <Route path="/edit-member" element={<Navigate to="/admin/edit-member" replace />} />

      <Route path="/*" element={<LandingPage />} />
    </Routes>
  )
}

export default App
