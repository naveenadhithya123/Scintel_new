import express from "express";
import cors from "cors";
import sequelize from "./config/database.js";

import upcomingEventRoutes from "./routes/upcomingEventRoutes.js";
import upcomingEventWithSpecificIdRoutes from "./routes/upcomingEventFetchWithSpecificIdRoutes.js";
import activityFetchWithBatchRoutes from "./routes/activityFetchWithBatchRoutes.js";
import activityFetchWithSpecificBatchRoutes from "./routes/activityFetchWithSpecificBatchRoutes.js";
import activityFetchWithSpecificEventRoutes from "./routes/activityFetchWithSpecificEventRoutes.js";
import associationAllBatchRoutes from "./routes/associationAllBatchRoutes.js";
import associationSpecificBatchRoutes from "./routes/associationSpecificBatchRoutes.js";
import gloriesRoutes from "./routes/gloriesRoutes.js";
import otpsendRoutes from "./routes/otpsendRoutes.js";
import otpverifyRoutes from "./routes/otpverifyRoutes.js";
import ProblemCreationRequestRoutes from "./routes/ProblemCreationRequestRoutes.js";
import currentProblemsRoutes from "./routes/currentProblemsRoutes.js";
import SpecificCurrentProblemRoutes from "./routes/SpecificCurrentProblemRoutes.js";
import AddProblemSolverRequestRoutes from "./routes/AddProblemSolverRequestRoutes.js";
import suggestionRoutes from "./routes/suggestionRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());

sequelize.authenticate()
  .then(() => {
    console.log("Database connected successfully");
  })
  .catch((error) => {
    console.error("Unable to connect to database:", error);
  });

app.use("/api", upcomingEventRoutes);
app.use("/api", upcomingEventWithSpecificIdRoutes);
app.use("/api", activityFetchWithBatchRoutes);
app.use("/api", activityFetchWithSpecificBatchRoutes);
app.use("/api", activityFetchWithSpecificEventRoutes);
app.use("/api", associationAllBatchRoutes);
app.use("/api", associationSpecificBatchRoutes);
app.use("/api", gloriesRoutes);
app.use("/api", otpsendRoutes);
app.use("/api", otpverifyRoutes); 
app.use("/api", ProblemCreationRequestRoutes);
app.use("/api", currentProblemsRoutes);
app.use("/api", SpecificCurrentProblemRoutes);
app.use("/api", AddProblemSolverRequestRoutes);
app.use("/api", suggestionRoutes);


app.listen(3000, () => {
  console.log("Server running on port 3000");
});