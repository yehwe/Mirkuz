
import type React from "react"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import { jwtDecode } from "jwt-decode"
import Verfication_URL from "../../Api/verificationApi"
import "./ViewProfile.css"

interface Event {
  id: string
  title: string
  description: string
  location: string
  startDate: string
  endDate: string
  requiredSkills: string
  maxVolunteers: number
  currentVolunteers?: number
  status: string
  organizerId: string
  organizerName?: string
  imageUrl?: string
  createdAt: string
}

interface DecodedToken {
  id: string
  role?: string
  [key: string]: any
}

const ViewProfile: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [userId, setUserId] = useState<string | null>(null)
  const [userRole, setUserRole] = useState<string | null>(null)
  const navigate = useNavigate()

  const formatDate = (dateString: string): string => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }

  const isEventPast = (endDate: string): boolean => {
    return new Date(endDate) < new Date()
  }

  const canEditEvent = (event: Event): boolean => {
    if (isEventPast(event.endDate)) return false
    if (userRole === "ADMIN") return true
    return userId === event.organizerId
  }

  useEffect(() => {
    const token = localStorage.getItem("token")
     console.log("Token from localStorage:", token);
     

    if (token) {
      try {
    const payload = token.split('.')[1];
    const decodedPayload = JSON.parse(atob(payload));
    console.log("Decoded JWT Payload:", decodedPayload);
  } catch (error) {
    console.error("Error decoding JWT:", error);
  }
      try {
        const decoded = jwtDecode<DecodedToken>(token)
        setUserId(decoded.id)
        setUserRole(decoded.role || null)
      } catch (err) {
        console.error("Invalid token", err)
      }
    }

    const fetchEvents = async () => {
      setLoading(true)
      try {
        const response = await axios.get(`${Verfication_URL}/events`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        })
        setEvents(response.data)
      } catch (err) {
        console.error("Failed to load events", err)
        setError("Failed to load events")
      } finally {
        setLoading(false)
      }
    }

    fetchEvents()
  }, [])

  const handleEditEvent = (eventId: string) => {
    navigate(`/events/${eventId}/edit`)
  }

  const handleViewEvent = (eventId: string) => {
    navigate(`/events/${eventId}/edit`)
  }

  const handleCreateEvent = () => {
    navigate("/create-event")
  }

  // Show only events created by the CHARITHY or all if admin
  const filteredEvents = events.filter((event) =>
    userRole === "ADMIN" ? true : event.organizerId === userId
  )

  if (loading) return <div className="events-loading">Loading events...</div>
  if (error) return <div className="events-error">{error}</div>

  return (
    <div className="events-container">
      <div className="organization-profile">
        <div className="organization-header">
          <div className="organization-logo">
            <img src="/placeholder.svg" alt="Organization Logo" />
          </div>
          <div className="organization-info">
            <h1 className="organization-name">
              {userRole === "CHARITHY" ? "Charity Organization Name" : "User Profile"}
            </h1>
            <div className="organization-contact">
              <span className="organization-email">nurse@company.com</span>
              <span className="organization-email-label">Organization Email</span>
              <span className="organization-phone">Phone Number</span>
            </div>
            <p className="organization-bio">Bio</p>
          </div>
        </div>
        <div className="organization-actions">
          <button className="edit-profile-btn" onClick={() => navigate("/profile")}>
            Edit Profile
          </button>
          {(userRole === "ADMIN" || userRole === "CHARITHY") && (
            <button className="create-event-btn" onClick={handleCreateEvent}>
              Create New Event
            </button>
          )}
        </div>
      </div>

      <div className="events-section">
        <h2 className="section-title">Your Recent Activity</h2>

        <div className="events-list">
          {filteredEvents.length === 0 ? (
            <div className="no-events">No events found</div>
          ) : (
            filteredEvents.map((event) => (
              <div
                key={event.id}
                className={`event-card ${isEventPast(event.endDate) ? "past-event" : ""}`}
                style={isEventPast(event.endDate) ? { filter: "grayscale(100%)" } : {}}
              >
                <div className="event-image">
                  <img src={event.imageUrl || "/placeholder.svg"} alt={event.title} />
                </div>
                <div className="event-date">
                  <div className="event-day">{new Date(event.startDate).getDate()}</div>
                  <div className="event-month-year">
                    {formatDate(event.startDate).split(" ")[0]},{" "}
                    {new Date(event.startDate).getFullYear()}
                  </div>
                </div>
                <div className="event-details">
                  <h3 className="event-title">{event.title}</h3>
                  <p className="event-organization">
                    Organization: {event.organizerName || "Unknown"}
                  </p>
                </div>
                <div className="event-actions">
                  <span
                    className={`event-status ${
                      isEventPast(event.endDate) ? "past" : "upcoming"
                    }`}
                  >
                    {isEventPast(event.endDate) ? "Past" : "Upcoming"}
                  </span>
                  {canEditEvent(event) && (
                    <button className="edit-button" onClick={() => handleEditEvent(event.id)}>
                      Edit
                    </button>
                  )}
                  <button className="preview-button" onClick={() => handleViewEvent(event.id)}>
                    Show Preview
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

export default ViewProfile ;
