import React from "react";
import { Routes, Route } from "react-router-dom";

import Announcement from "./Announcement";
import AdminMembers from "./AdminMembers";
import AddBatch from "./AddBatch";
import EditBatch from "./EditBatch";
import AddMember from "./AddMember";
import GloriesAdmin from "./GloriesAdmin";
import SuggestionAdmin from "./SuggestionAdmin";
import EditMember from "./EditMember";
import ProblemAdmin from "./ProblemAdmin";
import ActivitiesAdmin from "./ActivitiesAdmin";


function Admin() {
  return (
    <Routes>

      <Route path="/" element={<Announcement />} />

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
  );
}

export default Admin;