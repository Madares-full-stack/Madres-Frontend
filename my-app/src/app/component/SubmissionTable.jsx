"use client";

import Link from "next/link";

const SubmissionTable = ({ submissions, onDelete }) => {
  const role =
    typeof window === "undefined" ? "" : localStorage.getItem("role") || "";
  const canEdit = ["admin", "teacher"].includes(role);

  if (submissions.length === 0) {
    return <p className="text-center text-muted">No submissions found</p>;
  }

  return (
    <table className="table">
      <thead className="table-light">
        <tr>
          <th>Student</th>
          <th>Task</th>
          <th>Answer</th>
          {canEdit && <th>Action</th>}
        </tr>
      </thead>

      <tbody>
        {submissions.map((s) => (
          <tr key={s._id}>
            <td>{s.student?.name || s.studentId?.name || "Student"}</td>
            <td>{s.task?.title}</td>

            <td className="text-truncate" style={{ maxWidth: "200px" }}>
              {s.answer}
            </td>

            {canEdit && (
              <td>
                <Link
                  href={`/submission/edit/${s._id}`}
                  className="btn btn-primary btn-sm me-2"
                >
                  Edit
                </Link>

                {role === "admin" && (
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => onDelete(s._id)}
                  >
                    Delete
                  </button>
                )}
              </td>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default SubmissionTable;
