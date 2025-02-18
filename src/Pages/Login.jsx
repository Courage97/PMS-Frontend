import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { TextField, Button, Card, CardContent, Alert, CircularProgress } from '@mui/material';
import { LinkedIn, Twitter, GitHub, Login as LoginIcon } from '@mui/icons-material';
import api from "../api";
import { ACCESS_TOKEN, REFRESH_TOKEN } from '../constant';


const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(""); // Clear error when user starts typing
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
  
    try {
        // First get the tokens
        const response = await api.post("token/", {
            email: formData.email,
            password: formData.password
        });

        // Log the response to see what we're getting
        console.log('Auth Response:', response.data);

        // Verify we have the correct token structure
        const { access, refresh } = response.data;
        
        if (!access || !refresh) {
            throw new Error('Invalid token response structure');
        }

        // Verify tokens are in JWT format (should be three parts separated by dots)
        const isValidJWT = (token) => token.split('.').length === 3;
        
        if (!isValidJWT(access) || !isValidJWT(refresh)) {
            throw new Error('Invalid token format received');
        }

        // Store tokens
        localStorage.setItem(ACCESS_TOKEN, access);
        localStorage.setItem(REFRESH_TOKEN, refresh);

        // Log stored tokens for debugging
        console.log('Stored tokens:', {
            access: localStorage.getItem(ACCESS_TOKEN),
            refresh: localStorage.getItem(REFRESH_TOKEN)
        });

        // Navigate to protected route
        navigate("/");
    } catch (error) {
        console.error("Login Error:", error);
        let errorMessage;
        
        if (error.response?.status === 401) {
            errorMessage = "Invalid email or password";
        } else if (error.response?.status === 404) {
            errorMessage = "Authentication service not available";
        } else if (error.message.includes('token')) {
            errorMessage = "Authentication error - please try again";
        } else {
            errorMessage = error.response?.data?.detail || 
                          error.response?.data?.message || 
                          "An error occurred during login";
        }
        
        setError(errorMessage);
    } finally {
        setIsLoading(false);
    }
};
  

  return (
    <div className="min-h-screen bg-[#F9F9F9] font-['Inter'] relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-[#4CAF50]/10 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#2196F3]/10 rounded-full translate-x-1/2 translate-y-1/2 blur-3xl" />
      <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-[#4CAF50]/5 rounded-full -translate-x-1/2 -translate-y-1/2 blur-2xl" />

      <div className="relative min-h-screen flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#4CAF50] to-[#2196F3]">
              ManageIQ
            </h1>
            <p className="text-[#333333] text-lg mt-2">Welcome back!</p>
          </div>

          <Card className="backdrop-blur-sm bg-white/80">
            <CardContent className="p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <Alert severity="error" className="mb-6">
                    {error}
                  </Alert>
                )}

                <TextField
                  label="Email"
                  name="email"
                  type="email"
                  required
                  fullWidth
                  onChange={handleChange}
                  variant="outlined"
                  disabled={isLoading}
                  className="bg-white/50"
                />

                <TextField
                  label="Password"
                  name="password"
                  type="password"
                  required
                  fullWidth
                  onChange={handleChange}
                  variant="outlined"
                  disabled={isLoading}
                  className="bg-white/50"
                />

                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  disabled={isLoading}
                  className="bg-gradient-to-r from-[#4CAF50] to-[#2196F3] hover:opacity-90 h-12 normal-case"
                  startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : <LoginIcon />}
                >
                  {isLoading ? 'Signing in...' : 'Sign In'}
                </Button>

                <div className="flex items-center justify-between mt-4">
                  <Link 
                    to="/forgot-password"
                    className="text-sm text-[#2196F3] hover:text-[#1976D2] transition-colors"
                  >
                    Forgot password?
                  </Link>
                  <Link 
                    to="/register"
                    className="text-sm text-[#2196F3] hover:text-[#1976D2] transition-colors"
                  >
                    Create an account
                  </Link>
                </div>

                <div className="relative my-8">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-gray-200"></span>
                  </div>
                  <div className="relative flex justify-center">
                    <span className="px-2 bg-white text-gray-500 text-sm">Or continue with</span>
                  </div>
                </div>

                <div className="flex justify-center space-x-6">
                  {[LinkedIn, Twitter, GitHub].map((Icon, index) => (
                    <button
                      key={index}
                      type="button"
                      className="p-2 rounded-full bg-[#2196F3]/10 hover:bg-[#2196F3]/20 transition-colors"
                      disabled={isLoading}
                    >
                      <Icon className="text-[#2196F3]" />
                    </button>
                  ))}
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Login;