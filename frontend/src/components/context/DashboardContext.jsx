import React, { createContext, useState } from "react";

export const DashboardContext = createContext();

function DashboardProvider({ children }) {
  const [showForm, setShowForm] = useState(false);

  const toggleForm = () => setShowForm((prev) => !prev);
  const openForm = () => setShowForm(true);
  const closeForm = () => setShowForm(false);

  return (
    <DashboardContext.Provider
      value={{ showForm, toggleForm, openForm, closeForm }}
    >
      {children}
    </DashboardContext.Provider>
  );
}

export default DashboardProvider;
