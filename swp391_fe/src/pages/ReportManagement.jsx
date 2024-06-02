import React, { useState } from "react";
import { SearchBarReport } from "../components/Admin/SearchBarReport";
import ReportTable from "../components/Admin/ReportTable";

const ReportManagement = () => {
  const [reportDate, setReportDate] = useState("");
  const [processStatus, setProcessStatus] = useState(null);

  return (
    <div style={{ width: "100%" }}>
      <SearchBarReport
        reportDate={reportDate}
        setReportDate={setReportDate}
        processStatus={processStatus}
        setProcessStatus={setProcessStatus}
      />

      <hr
        style={{
          margin: "20px 0",
          border: "none",
          borderBottom: ".1rem solid black",
        }}
      />
      <ReportTable reportDate={reportDate} processStatus={processStatus} />
    </div>
  );
};

export default ReportManagement;
