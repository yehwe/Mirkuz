import type React from "react"
import { useState, useEffect, type ChangeEvent, type FormEvent } from "react"
import { useParams, useNavigate } from "react-router-dom"
import axios from "axios"
import { jwtDecode } from "jwt-decode"
import Verfication_URL from "../../Api/verificationApi"
import "./EditProfile.css"

interface EventFormData {
  title: string
  description: string
  location: string
  starttime: string
  endtime: string
  requiredSkills: string
  maxVolunteers: number | ""
  status: string
}

interface DecodedToken {
  id: string
  role?: string
  [key: string]: any
}

const EditProfile: React.FC = () => {
  const { eventId } = useParams<{ eventId: string }>()
  const navigate = useNavigate()
  const [formData, setFormData] = useState<EventFormData>({
    title: "",
    description: "",
    location: "",
    starttime: "",
    endtime: "",
    requiredSkills: "",
    maxVolunteers: "",
    status: "published",
  })
  const [file, setFile] = useState<File | undefined>()
  const [currentImage, setCurrentImage] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [userId, setUserId] = useState<string | null>(null)
  const [userRole, setUserRole] = useState<string | null>(null)
  const [isEventPast, setIsEventPast] = useState<boolean>(false)
  const [viewMode, setViewMode] = useState<boolean>(true)

  // Decode token and set user info
  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) {
      navigate("/login")
      return
    }

    try {
      const decoded = jwtDecode<DecodedToken>(token)
      setUserId(decoded.id)
      setUserRole(decoded.role || null)
    } catch (err) {
      console.error("Invalid token", err)
      navigate("/login")
    }
  }, [navigate])

  // Fetch event data
  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token || !eventId || !userRole) return

    const fetchEventDetails = async () => {
      setLoading(true)
      try {
        const response = await axios.get(`${Verfication_URL}/events/${eventId}`, {
          headers: { Authorization: `Bearer ${token}` },
        })

        const eventData = response.data
        const isPast = new Date(eventData.endtime) < new Date()
        setIsEventPast(isPast)

        const canEdit = userRole === "CHARITHY" && !isPast
        setViewMode(!canEdit)

        const formatDate = (dateStr: string) => {
          const d = new Date(dateStr)
          return d.toISOString().split("T")[0]
        }

        setFormData({
          title: eventData.title,
          description: eventData.description,
          location: eventData.location,
          starttime: formatDate(eventData.starttime),
          endtime: formatDate(eventData.endtime),
          requiredSkills: eventData.requiredSkills,
          maxVolunteers: eventData.maxVolunteers,
          status: eventData.status,
        })

        setCurrentImage(eventData.imageUrl || null)
      } catch (err) {
        console.error("Fetch error:", err)
        setError("Failed to load event details")
      } finally {
        setLoading(false)
      }
    }

    fetchEventDetails()
  }, [eventId, userRole])

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === "maxVolunteers" ? (value === "" ? "" : Number(value)) : value,
    }))
  }

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
    }
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!eventId) return

    const token = localStorage.getItem("token")
    if (!token) {
      navigate("/login")
      return
    }

    try {
      const formDataToSend = new FormData()
      const eventpost = {
        title: formData.title,
        description: formData.description,
        location: formData.location,
        starttime: formData.starttime,
        endtime: formData.endtime,
        requiredSkills: formData.requiredSkills,
        maxVolunteers: formData.maxVolunteers,
        status: formData.status,
      }

      formDataToSend.append("eventpost", new Blob([JSON.stringify(eventpost)], { type: "application/json" }))
      if (file) formDataToSend.append("uploads", file)

      const response = await axios.put(`${Verfication_URL}/events/${eventId}`, formDataToSend, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      })

      if (response.data.status === 200) {
        alert("Event updated successfully!")
        navigate("/events")
      } else {
        setError("Failed to update event")
      }
    } catch (err) {
      console.error("Update error:", err)
      setError("Failed to update event")
    }
  }

  if (loading) return <div className="event-edit-loading">Loading event details...</div>
  if (error) return <div className="event-edit-error">{error}</div>

  return (
    <div className={`event-edit-container ${isEventPast ? "past-event" : ""}`}>
      <h1>{viewMode ? "Event Details" : "Edit Event"}</h1>
      <form className="event-edit-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Title:</label>
          <input name="title" value={formData.title} onChange={handleInputChange} required disabled={viewMode} />
        </div>

        <div className="form-group">
          <label>Description:</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            rows={4}
            required
            disabled={viewMode}
          />
        </div>

        <div className="form-group">
          <label>Location:</label>
          <input name="location" value={formData.location} onChange={handleInputChange} required disabled={viewMode} />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Start Date:</label>
            <input type="date" name="starttime" value={formData.starttime} onChange={handleInputChange} required disabled={viewMode} />
          </div>
          <div className="form-group">
            <label>End Date:</label>
            <input type="date" name="endtime" value={formData.endtime} onChange={handleInputChange} required disabled={viewMode} />
          </div>
        </div>

        <div className="form-group">
          <label>Required Skills:</label>
          <input name="requiredSkills" value={formData.requiredSkills} onChange={handleInputChange} disabled={viewMode} />
        </div>

        <div className="form-group">
          <label>Max Volunteers:</label>
          <input
            type="number"
            name="maxVolunteers"
            value={formData.maxVolunteers}
            onChange={handleInputChange}
            min={1}
            placeholder="Number of volunteers"
            disabled={viewMode}
          />
        </div>

        <div className="form-group">
          <label>Status:</label>
          <select name="status" value={formData.status} onChange={handleInputChange} disabled={viewMode}>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        <div className="form-group">
          <label>Event Image:</label>
          {currentImage && (
            <div className="current-image">
              <img src={currentImage} alt="Current event" />
              <p>Current image</p>
            </div>
          )}
          {!viewMode && (
            <>
              <input type="file" onChange={handleFileChange} accept=".jpg,.jpeg,.png,.gif" />
              {file && <div className="file-info">Selected file: {file.name}</div>}
            </>
          )}
        </div>

        <div className="form-actions">
          <button type="button" className="cancel-button" onClick={() => navigate("/events")}>
            {viewMode ? "Back to Events" : "Cancel"}
          </button>
          {!viewMode && <button type="submit" className="submit-button">Update Event</button>}
        </div>
      </form>
    </div>
  )
}

export default EditProfile
