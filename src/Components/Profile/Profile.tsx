import React, { useState, ChangeEvent, FormEvent } from 'react';
import {useNavigate} from 'react-router-dom'
import axios from 'axios';
import Verfication_URL from '../../Api/verificationApi';
import { jwtDecode } from 'jwt-decode';
import "./Profile.css"

interface ProfileFormData {
  bio: string;
  address: string;
  customFocusAreas: string;
  taxDocument: File | null;
}
const customFocusAreas =[
   "Education",
  "Healthcare",
  "Poor in need",
  "Environment",
  "Children",
  "Religious",
  "General",
  "Other",
]
interface DecodedToken {
  id: string;
  [key: string]: any;
}

const Profile: React.FC = () => {
  const [formData, setFormData] = useState<ProfileFormData & {
    selectedFocusArea: string;
    customFocusArea: string;
  }>({
    bio: '',
    address: '',
    customFocusAreas: '',
    taxDocument: null,
    selectedFocusArea: '',
    customFocusArea: ''
  });

  const [file, setFile] = useState<File | undefined>();
const navigate= useNavigate()
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

      ("Please upload a valid PDF file");
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
      const decodedToken = jwtDecode<DecodedToken>(token);
      const userId = decodedToken.id;

      const formDataToSend = new FormData();
      
      const focusArea = formData.selectedFocusArea === "Other"
        ? formData.customFocusArea
        : formData.selectedFocusArea;
      const request = {
        bio: formData.bio,
        address: formData.address,
        customFocusAreas: focusArea
      };
      
      // Add request object to FormData
      formDataToSend.append('request', new Blob([JSON.stringify(request)], { type: 'application/json' }));
      
      //Add file if it exists
      if (file) {
        formDataToSend.append('uploadfiles', file);
      }
      const response = await axios.post(
        `${Verfication_URL}/verify/${userId}`,
        formDataToSend,
        {withCredentials: true,
          headers: {
            
            'Authorization': `Bearer ${token}`,
          
          }
        }
      );
      
      console.log('Response:', response.data);

      if (response.data.status === 200) {
        alert('Profile updated successfully!');
      } else {
        // alert('Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      // alert('Error updating profile. Please try again.');
    }
  };

  return (
    <div className="profile-page">
      <h1>Profile Information</h1>
      <form className="profile-main-form" onSubmit={handleSubmit}>
        <div className="profile-form-data">
          <label>Bio</label>
          <textarea
            name="bio"
            value={formData.bio}
            onChange={handleInputChange}
            rows={4}
            className="form-control"
            required
          />
        </div>
        <div className="profile-form-data">
          <label>Address</label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            className="form-control"
            required
          />
        </div>
        <div className="profile-form-data">
          <label>Primary Focus Area</label>
          <div className="focus-area-grid">
            {customFocusAreas.map((area) => (
              <button
                type="button"
                key={area}
                className={`focus-area-btn${formData.selectedFocusArea === area ? " selected" : ""}`}
                onClick={() =>
                  setFormData((prev) => ({
                    ...prev,
                    selectedFocusArea: area,
                    customFocusArea: area === "Other" ? prev.customFocusArea : ""
                  }))
                }
              >
                {area}
              </button>
            ))}
          </div>
          {formData.selectedFocusArea === "Other" && (
            <input
              type="text"
              placeholder="Please specify"
              value={formData.customFocusArea}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  customFocusArea: e.target.value
                }))
              }
              className="focus-area-custom-input"
              required
            />
          )}
        </div>
        <div className="profile-form-data">
          <label>Upload Tax Document</label>
          <input
            type="file"
            onChange={handleFileChange}
            accept=".pdf,.doc,.docx"
            className="form-control"
          />
          {file && (
            <div className="file-info">
              Selected file: {file.name}
            </div>
          )}
        </div>
        <button
          type="submit"
          className="submit-btn"
        >
          Upload Profile
        </button>
      </form>
    </div>
  );
};

export default Profile;