import {useContext, useEffect} from "react";
import {AppContext} from "../context/AppContext.jsx";
import {useNavigate} from "react-router-dom";
import axiosConfig from "../util/axiosConfig.jsx";
import {API_ENDPOINTS} from "../util/apiEndpoints.js";

export const useUser = () => {
    const {user, setUser, clearUser} = useContext(AppContext);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            clearUser();
            navigate("/login");
            return;
        }

        let isMounted = true;

        const fetchUserInfo = async () => {
            try {
                const response = await axiosConfig.get(API_ENDPOINTS.GET_USER_INFO);

                if (isMounted && response.data) {
                    setUser(response.data);
                }
            } catch (error) {
                console.log("Failed to fetch user info", error);
                // Only redirect to login if unauthorized (token invalid/expired)
                if (isMounted && error.response?.status === 401) {
                    clearUser();
                    navigate("/login");
                }
            }
        };

        fetchUserInfo();

        return () => {
            isMounted = false;
        };
    }, [clearUser, navigate, setUser]);

}