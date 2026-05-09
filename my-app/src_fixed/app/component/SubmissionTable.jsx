"use client";

const SubmissionTable = ({ submissions, onDelete }) => {
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
          <th>Status</th>
          <th>Grade</th>
          <th>Action</th>
        </tr>
      </thead>

      <tbody>
        {submissions.map((s) => (
          <tr key={s._id}>
            <td>{s.student?.name }</td>
            <td>{s.task?.title}</td>

            <td className="text-truncate" style={{ maxWidth: "200px" }}>
              {s.answer}
            </td>

            <td>
              <span
                className={`badge ${
                  s.status === "graded"
                    ? "bg-success"
                    : "bg-warning text-dark"
                }`}
              >
                {s.status || "pending"}
              </span>
            </td>

            <td>{s.grade ?? "-"}</td>

            <td>
              <button
                className="btn btn-danger btn-sm"
                onClick={() => onDelete(s._id)}
              >
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default SubmissionTable;