import React from 'react'
import UserInfoForm from '../components/UserInfoForm'
import { useLocation } from "react-router-dom";

export const UserFormPage = () => {
  const location = useLocation();
  const nextPage = location.state?.nextPage || "youtube";

  return (
    <div>
      <UserInfoForm nextPage={nextPage} />
    </div>
  )
}
