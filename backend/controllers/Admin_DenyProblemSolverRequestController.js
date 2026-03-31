import sequelize from "../config/database.js";
import { QueryTypes } from "sequelize";
import transporter, { teamMailFrom } from "../config/mailer.js";

const normalizeSolverRequestPayload = (teamMembers) => {
  if (!teamMembers) {
    return { mentorEmail: null, members: [] };
  }

  const parsedTeamData =
    typeof teamMembers === "string" ? JSON.parse(teamMembers) : teamMembers;

  if (Array.isArray(parsedTeamData)) {
    return { mentorEmail: null, members: parsedTeamData };
  }

  return {
    mentorEmail:
      parsedTeamData?.mentor?.email || parsedTeamData?.mentor_email || null,
    members: Array.isArray(parsedTeamData?.members) ? parsedTeamData.members : [],
  };
};

const buildRecipientList = (...emailLists) =>
  [...new Set(emailLists.flat().filter(Boolean))].join(", ");

export const denyProblemSolverRequest = async (req, res) => {
  try {
    const { id } = req.params;

    const [request] = await sequelize.query(
      `
      SELECT *
      FROM problem_solver_requests
      WHERE problem_solver_request_id = :id
      `,
      {
        replacements: { id },
        type: QueryTypes.SELECT,
      }
    );

    if (!request) {
      return res.status(404).json({
        message: "Solver request not found",
      });
    }

    const { name, email, mentor, team_members } = request;

    let parsedTeamMembers = [];
    let mentorEmail = null;

    if (team_members) {
      const normalizedPayload = normalizeSolverRequestPayload(team_members);
      parsedTeamMembers = normalizedPayload.members;
      mentorEmail = normalizedPayload.mentorEmail;
    }

    const studentRecipients = buildRecipientList(
      [email],
      parsedTeamMembers.map((member) => member.email)
    );

    if (studentRecipients) {
      await transporter.sendMail({
        from: teamMailFrom,
        to: studentRecipients,
        subject: "Problem Solver Request Update",
        html: `
          <div style="font-family: Arial; padding: 20px;">
            <h2>Hello ${name},</h2>
            <p>We appreciate your interest in solving the problem.</p>
            <p>Unfortunately, your request has been <b>declined</b> at this time.</p>
            <p>You are welcome to apply for other problem statements in the future.</p>
            <p>Thank you for being part of Scintel.</p>
          </div>
        `,
      });
    }

    if (mentorEmail) {
      await transporter.sendMail({
        from: teamMailFrom,
        to: mentorEmail,
        subject: "Mentorship Update for Problem Solver Request",
        html: `
          <div style="font-family: Arial; padding: 20px;">
            <h2>Hello ${mentor || "Mentor"},</h2>
            <p>Your mentee <b>${name}</b> submitted a request to solve a problem statement.</p>
            <p>That request has not been approved at this time, so no further action is required from you for this submission.</p>
            <p>Thank you for your continued support and willingness to mentor Scintel students.</p>
          </div>
        `,
      });
    }

    await sequelize.query(
      `
      DELETE FROM problem_solver_requests
      WHERE problem_solver_request_id = :id
      `,
      {
        replacements: { id },
      }
    );

    return res.status(200).json({
      message: "Solver request denied and email sent",
    });
  } catch (error) {
    console.error("Deny Solver Request Error:", error);

    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};
