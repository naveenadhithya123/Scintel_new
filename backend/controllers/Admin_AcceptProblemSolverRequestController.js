import sequelize from "../config/database.js";
import { QueryTypes } from "sequelize";
import transporter from "../config/mailer.js";

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

export const acceptProblemSolverRequest = async (req, res) => {
  const t = await sequelize.transaction();

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
        transaction: t,
      }
    );

    if (!request) {
      await t.rollback();
      return res.status(404).json({
        message: "Solver request not found",
      });
    }

    const {
      problem_id,
      name,
      email,
      phone_number,
      year,
      section,
      mentor,
      team_members,
    } = request;

    let parsedTeamMembers = [];
    let mentorEmail = null;

    if (team_members) {
      const normalizedPayload = normalizeSolverRequestPayload(team_members);
      parsedTeamMembers = normalizedPayload.members;
      mentorEmail = normalizedPayload.mentorEmail;
    }

    const [existingProblem] = await sequelize.query(
      `
      SELECT solver_user_id
      FROM current_problems
      WHERE problem_id = :problem_id
      `,
      {
        replacements: { problem_id },
        type: QueryTypes.SELECT,
        transaction: t,
      }
    );

    if (existingProblem?.solver_user_id) {
      await t.rollback();
      return res.status(400).json({
        message: "This problem already has a solver assigned",
      });
    }

    const studentRecipients = buildRecipientList(
      [email],
      parsedTeamMembers.map((member) => member.email)
    );

    if (studentRecipients) {
      await transporter.sendMail({
        from: '"Scintel Team" <yourrealemail@gmail.com>',
        to: studentRecipients,
        subject: "Problem Solver Request Approved",
        html: `
          <div style="font-family: Arial; padding: 20px;">
            <h2>Congratulations ${name},</h2>
            <p>Your request to solve the problem has been <b>approved</b>.</p>
            <p>Your team can now begin working on the assigned problem statement.</p>
            <p>All the best from Scintel.</p>
          </div>
        `,
      });
    }

    if (mentorEmail) {
      await transporter.sendMail({
        from: '"Scintel Team" <yourrealemail@gmail.com>',
        to: mentorEmail,
        subject: "Mentorship Approval for Problem Solver Request",
        html: `
          <div style="font-family: Arial; padding: 20px;">
            <h2>Hello ${mentor || "Mentor"},</h2>
            <p>Your mentee <b>${name}</b> has been approved to solve the selected problem statement.</p>
            <p>You have been listed as the mentor for this team. Please support the students with guidance, reviews, and technical direction as they work on the problem.</p>
            <p>Thank you for mentoring and supporting Scintel.</p>
          </div>
        `,
      });
    }

    const [userResult] = await sequelize.query(
      `
      INSERT INTO users
      (name, email, phone_number, year, section)
      VALUES (:name, :email, :phone, :year, :section)
      RETURNING user_id
      `,
      {
        replacements: {
          name,
          email,
          phone: phone_number,
          year,
          section,
        },
        type: QueryTypes.INSERT,
        transaction: t,
      }
    );

    const solver_user_id = userResult[0].user_id;

    for (const member of parsedTeamMembers) {
      const {
        name: team_name,
        email: team_email,
        section: team_section,
        year: team_year,
        ph_no,
      } = member || {};

      if (!team_name || !team_email || !team_section || !team_year || !ph_no) {
        await t.rollback();
        return res.status(400).json({
          message: "Each team member must have name, email, section, year and ph_no",
        });
      }

      const [teamUserResult] = await sequelize.query(
        `
        INSERT INTO users
        (name, email, phone_number, year, section)
        VALUES (:name, :email, :phone, :year, :section)
        RETURNING user_id
        `,
        {
          replacements: {
            name: team_name,
            email: team_email,
            phone: ph_no,
            year: team_year,
            section: team_section,
          },
          type: QueryTypes.INSERT,
          transaction: t,
        }
      );

      const team_user_id = teamUserResult[0].user_id;

      await sequelize.query(
        `
        INSERT INTO current_problem_team_members
        (problem_id, user_id)
        VALUES (:problem_id, :user_id)
        `,
        {
          replacements: {
            problem_id,
            user_id: team_user_id,
          },
          transaction: t,
        }
      );
    }

    await sequelize.query(
      `
      UPDATE current_problems
      SET solver_user_id = :solver_user_id,
          mentor = :mentor
      WHERE problem_id = :problem_id
      `,
      {
        replacements: {
          solver_user_id,
          mentor: mentor || null,
          problem_id,
        },
        transaction: t,
      }
    );

    await sequelize.query(
      `
      DELETE FROM problem_solver_requests
      WHERE problem_solver_request_id = :id
      `,
      {
        replacements: { id },
        transaction: t,
      }
    );

    await t.commit();

    return res.status(200).json({
      message: "Solver assigned successfully and email sent",
    });
  } catch (error) {
    await t.rollback();

    console.error("Accept Solver Request Error:", error);

    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};
