import React, { useState } from "react";
import { SearchBarMember } from "../components/Admin/SearchBarMember";
import UserTable from "../components/Admin/UserTable";

const UserManagement = () => {
  const [searchContent, setSearchContent] = useState("");
  const [selectedRole, setSelectedRole] = useState("");

  return (
    <div style={{ width: "100%" }}>
      <SearchBarMember
        searchContent={searchContent}
        selectedRole={selectedRole}
        setSearchContent={setSearchContent}
        setSelectedRole={setSelectedRole}
      />

      <hr
        style={{
          margin: "20px 0",
          border: "none",
          borderBottom: ".1rem solid black",
        }}
      />
      <UserTable searchData={searchContent} roleData={selectedRole} />
    </div>
  );
};

export default UserManagement;
