import type React from "react"
import { Routes, Route } from "react-router-dom"
import "./App.css"
import Home from "./Pages/Home/Home"
import RegistrationForm from "./Pages/Registration/RegistrationForm"
import ForgotPassword from "./Pages/Login/ForgotPassword"
import Layout from "./Components/Layout/Layout"
import Login from "./Pages/Login/Login"
import Profile from "./Components/Profile/Profile" // From Components/Profile folder
import VerifyForm from "./Pages/VerifyUser/Verify"
import EventForm from "./Components/EventForm/EventForm"
import Footer from "./Components/Footer/Footer"
import ViewProfile from "./Pages/ViewProfile/ViewProfile" // From Pages/ViewProfile folder
import EditProfile from "./Pages/EditProfile/EditProfile" // From Pages/EditProfile folder



const App: React.FC = () => {
  return (
    <>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<RegistrationForm />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/verify" element={<VerifyForm />} />
          <Route path="/profile" element={<Profile />} /> {/* This is the Profile component */}
          <Route path="/create-event" element={<EventForm />} />
          <Route path="/events" element={<ViewProfile />} /> {/* This is the ViewProfile component */}
          <Route path="/events/:eventId/edit" element={<EditProfile />} /> {/* This is the EditProfile component */}
        </Routes>
        <Footer />
      </Layout>
    </>
  )
}

export default App
