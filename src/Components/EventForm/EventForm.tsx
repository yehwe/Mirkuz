import React, { useState, ChangeEvent, FormEvent} from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import Verfication_URL from '../../Api/verificationApi';
import './EventForm.css';


interface eventFormData {
 title: string;
 description: string;
 location: string;
 starttime: string;
 endtime: string;
 requiredSkills: string;
 maxVolunteers: number | '';
 status: string; 
}

// Define the request object 
interface DecodedToken {
  id: string;
  [key: string]: any;
}
const EventForm: React.FC = () => {
  const [formData, setFormData] = useState<eventFormData>({
  title: '',
  description: '',
  location: '',
  starttime: '',
  endtime: '',
  requiredSkills: '',
  maxVolunteers: '',
  status: 'published',
});
const [file, setFile] = useState<File | undefined>();
const [error, setError] = useState<string | null>(null);
const navigate = useNavigate()

const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    
    if (e.target.files) {
      setFile(e.target.files[0]);
    } else {console.log

      ("Please upload a valid image file");
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
   const token = localStorage.getItem('token'); 
if (!token) {
      alert('Please login to update your profile');
      
      navigate('/login');

      return;
      
    }
    

    try {
      const decoded = jwtDecode<DecodedToken>(token);
    const userId = decoded.id;
const formDataToSend = new FormData();
      
      // Create eventpost object with text fields
      const eventpost = {
        title: formData.title,
        description: formData.description,
        location: formData.location,
        starttime: formData.starttime,
        endtime: formData.endtime,
        requiredSkills: formData.requiredSkills,
        maxVolunteers: formData.maxVolunteers,
      };
      
      // Add request object to FormData
      formDataToSend.append('eventpost', new Blob([JSON.stringify(eventpost)], { type: 'application/json' }));
      // Add image file to FormData
       //Add file if it exists
      if (file) {
        formDataToSend.append('uploads', file);
      }
    
    const resonse=   await axios.post(`${Verfication_URL}/postevent/${userId}`,  formDataToSend,
        {withCredentials: true,
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (resonse.data.status === 200) {
        alert('Profile updated successfully!');
      } else {
        // alert('Failed to update profile');
      }
    } catch (err) {
      setError('Failed to create event.');
    }
  };

  return (
    <form className="event-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label>Title:</label>
        <input name="title" value={formData.title} onChange={handleInputChange} required />
      </div>
      <div className="form-group">
        <label>Description:</label>
        <textarea name="description" value={formData.description} onChange={handleInputChange} required />
      </div>
      <div className="form-group">
        <label>Location:</label>
        <input name="location" value={formData.location} onChange={handleInputChange} required />
      </div>
      <div className="form-group">
        <label>Start Time:</label>
        <input type="date" name="starttime" value={formData.starttime} onChange={handleInputChange} required />
      </div>
      <div className="form-group">
        <label>End Time:</label>
        <input type="date" name="endtime" value={formData.endtime} onChange={handleInputChange} required />
      </div>
      <div className="form-group">
        <label>Required Skills:</label>
        <input name="requiredSkills" value={formData.requiredSkills} onChange={handleInputChange} />
      </div>
      <div className="form-group">
        <label>Max Volunteers:</label>
        <input type="number" name="maxVolunteers" value={formData.maxVolunteers} min={1} onChange={handleInputChange} placeholder="number of volunteers" />
      </div>
       <div className="form-group">
          <label>Upload Document</label>
          <input
            type="file"
            onChange={handleFileChange}
            accept=".pdf,PNG,.JPG,GIF"
            className="form-control"
          />
          {file && (
            <div className="file-info">
              Selected file: {file.name}
            </div>
          )}
        </div>
      <button className="submit-btn" type="submit">Create Event</button>
      {error && <div className="form-error">{error}</div>}
    </form>
  );
};

export default EventForm;
