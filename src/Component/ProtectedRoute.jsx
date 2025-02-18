import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import api from "../api";
import { REFRESH_TOKEN, ACCESS_TOKEN } from "../constant";
import { useState, useEffect } from "react";
import PropTypes from "prop-types";

const ProtectedRoute = ({ children }) => {
    const [isAuthorized, setIsAuthorized] = useState(null);

    // Debug function to safely check token format
    const debugToken = (token, source = 'unknown') => {
        console.log(`Token check from ${source}:`, {
            exists: !!token,
            type: typeof token,
            length: token?.length,
            format: token?.includes('.') ? token.split('.').length : 0
        });
    };

    // Function to validate token format
    const isValidTokenFormat = (token) => {
        if (!token || typeof token !== 'string') {
            return false;
        }
        
        const parts = token.split('.');
        return parts.length === 3 && parts.every(part => part.length > 0);
    };

    // Function to refresh the access token
    const refreshToken = async () => {
        const refreshTokenValue = localStorage.getItem(REFRESH_TOKEN);
        debugToken(refreshTokenValue, 'refresh-token');
        
        if (!refreshTokenValue) {
            console.log('No refresh token found');
            setIsAuthorized(false);
            return;
        }

        try {
            const res = await api.post("/api/token/refresh/", {
                refresh: refreshTokenValue,
            });
            
            const newAccessToken = res.data.access;
            debugToken(newAccessToken, 'new-access-token');

            if (res.status === 200 && isValidTokenFormat(newAccessToken)) {
                localStorage.setItem(ACCESS_TOKEN, newAccessToken);
                setIsAuthorized(true);
                return true;
            } else {
                console.error('Invalid token received from refresh');
                return false;
            }
        } catch (error) {
            console.error("Error refreshing token:", error?.response?.data || error.message);
            localStorage.removeItem(ACCESS_TOKEN);
            localStorage.removeItem(REFRESH_TOKEN);
            setIsAuthorized(false);
            return false;
        }
    };

    // Function to verify and refresh tokens
    const auth = async () => {
        const accessToken = localStorage.getItem(ACCESS_TOKEN);
        debugToken(accessToken, 'access-token');

        if (!isValidTokenFormat(accessToken)) {
            console.log("Initial token validation failed, attempting refresh");
            const refreshSuccessful = await refreshToken();
            if (!refreshSuccessful) {
                setIsAuthorized(false);
            }
            return;
        }

        try {
            const decoded = jwtDecode(accessToken);
            const currentTime = Date.now() / 1000;
            
            if (!decoded.exp) {
                console.error("Token missing expiration");
                setIsAuthorized(false);
                return;
            }

            if (decoded.exp < currentTime + 30) {
                console.log("Token expired or expiring soon, attempting refresh");
                await refreshToken();
            } else {
                console.log("Token valid and not expired");
                setIsAuthorized(true);
            }
        } catch (error) {
            console.error("Token decode error:", error);
            const refreshSuccessful = await refreshToken();
            if (!refreshSuccessful) {
                localStorage.removeItem(ACCESS_TOKEN);
                localStorage.removeItem(REFRESH_TOKEN);
                setIsAuthorized(false);
            }
        }
    };

    useEffect(() => {
        const handleAuth = async () => {
            try {
                await auth();
            } catch (error) {
                console.error("Authentication error:", error);
                setIsAuthorized(false);
            }
        };

        handleAuth();
    },); // Run only on mount

    if (isAuthorized === null) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
        );
    }

    return isAuthorized ? children : <Navigate to="/login" replace />;
};

ProtectedRoute.propTypes = {
    children: PropTypes.node.isRequired,
};

export default ProtectedRoute