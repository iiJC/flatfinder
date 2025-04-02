// import Header from "@global/header.jsx";
import "../css/DashboardPage.scss"; // Import SCSS file

export default function DashboardPage() {
  return (
    <div className="dashboard-container">
      <h2 className="dashboard-title">Your Applications</h2>

      <div className="application-box">
        <h3 className="application-heading">Current Applications</h3>

        <ul className="application-list">
          <li className="application-item">
            <p className="application-name">Application 1</p>
            <p className="application-status pending">Status: Pending</p>
          </li>
          <li className="application-item">
            <p className="application-name">Application 2</p>
            <p className="application-status approved">Status: Approved</p>
          </li>
          <li className="application-item">
            <p className="application-name">Application 3</p>
            <p className="application-status rejected">Status: Rejected</p>
          </li>
        </ul>
      </div>
    </div>
  );
}
