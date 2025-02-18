import { useState } from 'react';
import { TextField, Button, Select, MenuItem, FormControl, InputLabel, Card, CardContent, Typography, Alert, Link } from '@mui/material';
import { LinkedIn, Twitter, GitHub, CameraAlt } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import api from '../api'; 
import { REFRESH_TOKEN, ACCESS_TOKEN } from "../constant";

const Register = () => {
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
    password2: '',
    role: '',
    bio: '',
    profilePicture: null
  });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewUrl, setPreviewUrl] = useState('/api/placeholder/400/400');
  const Navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};
    
    // Email validation
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    // Username validation
    if (!formData.username) {
      newErrors.username = 'Username is required';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    // Confirm password validation
    if (!formData.password2) {
      newErrors.password2 = 'Please confirm your password';
    } else if (formData.password !== formData.password2) {
      newErrors.password2 = 'Passwords do not match';
    }

    // Role validation
    if (!formData.role) {
      newErrors.role = 'Please select a role';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setErrors(prev => ({ ...prev, profilePicture: 'Image size should be less than 5MB' }));
        return;
      }
      
      setFormData(prev => ({
        ...prev,
        profilePicture: file
      }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError('');
    
    if (!validateForm()) {
      return;
    }
  
    setIsSubmitting(true);
  
    const formDataToSend = new FormData();
    Object.keys(formData).forEach(key => {
      if (formData[key] !== null) {
        formDataToSend.append(key, formData[key]);
      }
    });
  
    try {
      const res = await api.post('/register/', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data'  // Fix this header
        },
      });
    
      console.log("Registration Successful:", res.data);
      localStorage.setItem(REFRESH_TOKEN, res.data.refresh);
      localStorage.setItem(ACCESS_TOKEN, res.data.access);
      Navigate('/login')
    } catch (error) {
      if (error.response) {
        console.error("Full Error:", error.response.data); // Log the full error response
        alert("Error: " + JSON.stringify(error.response.data)); // Show error details
      } else {
        console.error("Error:", error.message);
      }
    }
    
  };
  return (
    <div className="min-h-screen bg-[#F9F9F9] font-['Inter'] relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-[#4CAF50]/10 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#2196F3]/10 rounded-full translate-x-1/2 translate-y-1/2 blur-3xl" />
      <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-[#4CAF50]/5 rounded-full -translate-x-1/2 -translate-y-1/2 blur-2xl" />

      <div className="relative min-h-screen flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-4xl">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#4CAF50] to-[#2196F3]">
              ManageIQ
            </h1>
            <p className="text-[#333333] text-lg mt-2">Start your journey with us</p>
          </div>

          <Card className="backdrop-blur-sm bg-white/80">
            <CardContent className="p-8">
              {apiError && (
                <Alert severity="error" className="mb-6">
                  {apiError}
                </Alert>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Profile Picture Upload */}
                <div className="flex flex-col items-center mb-8">
                  <div className="relative w-32 h-32 group">
                    <img
                      src={previewUrl}
                      alt="Profile preview"
                      className="w-full h-full rounded-full object-cover border-4 border-[#4CAF50]/20"
                    />
                    <label
                      htmlFor="profilePicture"
                      className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                    >
                      <CameraAlt className="text-white" />
                    </label>
                    <input
                      type="file"
                      id="profilePicture"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageChange}
                    />
                  </div>
                  <Typography variant="caption" className="mt-2 text-gray-500">
                    Click to upload profile picture
                  </Typography>
                  {errors.profilePicture && (
                    <Typography color="error" variant="caption">
                      {errors.profilePicture}
                    </Typography>
                  )}
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <TextField
                    label="Email"
                    name="email"
                    type="email"
                    required
                    fullWidth
                    onChange={handleInputChange}
                    variant="outlined"
                    error={!!errors.email}
                    helperText={errors.email}
                    disabled={isSubmitting}
                  />

                  <TextField
                    label="Username"
                    name="username"
                    required
                    fullWidth
                    onChange={handleInputChange}
                    variant="outlined"
                    error={!!errors.username}
                    helperText={errors.username}
                    disabled={isSubmitting}
                  />

                  <TextField
                    label="Password"
                    name="password"
                    type="password"
                    required
                    fullWidth
                    onChange={handleInputChange}
                    variant="outlined"
                    error={!!errors.password}
                    helperText={errors.password}
                    disabled={isSubmitting}
                  />

                  <TextField
                    label="Confirm Password"
                    name="password2"
                    type="password"
                    required
                    fullWidth
                    onChange={handleInputChange}
                    variant="outlined"
                    error={!!errors.password2}
                    helperText={errors.password2}
                    disabled={isSubmitting}
                  />

                  <FormControl fullWidth error={!!errors.role}>
                      <InputLabel>Role</InputLabel>
                      <Select
                        name="role"
                        value={formData.role}
                        label="Role"
                        onChange={handleInputChange}
                        disabled={isSubmitting}
                      >
                        <MenuItem value="Admin">Admin</MenuItem>  {/* Changed from "ADMIN" to "Admin" */}
                        <MenuItem value="Manager">Manager</MenuItem>
                        <MenuItem value="Team Member">Team Member</MenuItem> 
                        <MenuItem value="Viewer">Viewer</MenuItem>
                      </Select>
                      {errors.role && (
                        <Typography color="error" variant="caption">
                          {errors.role}
                        </Typography>
                      )}
                  </FormControl>

                  <TextField
                    label="Bio"
                    name="bio"
                    multiline
                    rows={4}
                    fullWidth
                    onChange={handleInputChange}
                    variant="outlined"
                    className="md:col-span-2"
                    error={!!errors.bio}
                    helperText={errors.bio}
                    disabled={isSubmitting}
                  />
                </div>

                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  className="bg-gradient-to-r from-[#4CAF50] to-[#2196F3] hover:opacity-90 h-12 normal-case"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Creating Account...' : 'Create Account'}
                </Button>

                <div className="relative my-8">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-gray-200"></span>
                  </div>
                  <div className="relative flex justify-center">
                    <span className="px-2 bg-white text-gray-500 text-sm">Or connect with</span>
                  </div>
                </div>

                <div className="flex justify-center space-x-6">
                  {[LinkedIn, Twitter, GitHub].map((Icon, index) => (
                    <button
                      key={index}
                      type="button"
                      className="p-2 rounded-full bg-[#2196F3]/10 hover:bg-[#2196F3]/20 transition-colors"
                    >
                      <Icon className="text-[#2196F3]" />
                    </button>
                  ))}
                </div>

                <div className="mt-4 text-center">
                  <Typography variant="body2">
                    Already have an account?{' '}
                    <Link href="/login" className="text-[#4CAF50] hover:text-[#45a049]">
                      Login here
                    </Link>
                  </Typography>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Register;