"use client";

import { useEffect, useState } from "react";
import { useUserInfoContext } from "@/contexts/UserInfoContext";
import LoadingSpinner from "@/components/LoadingSpinner";
import { getPlatformUserBusinessEnabledPluggins } from "../controllers/platform/platform_user_business/platform_user_business";

const ConditionalSessionRender = ({ 
    ComponentIfUser, 
    ComponentIfNoUser, 
    AuthorizedUserRoles, 
    enablePluginsRequireds = []
}) => {
    const { user } = useUserInfoContext();
    const [enabledPlugins, setEnabledPlugins] = useState([]); 
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchEnabledPlugins = async () => {
            if (!user) {
                setIsLoading(false);
                return;
            }

            try {
                if (user.platform_user_business_id !== 1) {
                    const plugins = await getPlatformUserBusinessEnabledPluggins(user.platform_user_business_id);
                    
                    
                    const parsedEnabledPlugins = 
                        typeof plugins === "string" 
                            ? JSON.parse(plugins) 
                            : plugins;
                    
                    const selectedPluginIds = 
                        Array.isArray(parsedEnabledPlugins) 
                            ? parsedEnabledPlugins.map(plugin => plugin.id || plugin) 
                            : [];

                    setEnabledPlugins(selectedPluginIds);
                } else {
                    setEnabledPlugins([]);
                }
            } catch (error) {
                console.error("Error al obtener plugins:", error);
                setEnabledPlugins([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchEnabledPlugins();
    }, [user]);

    if (!user) {
        return ComponentIfNoUser;
    }

    if (isLoading) {
        return <LoadingSpinner/>; 
    }

    const userRoles = Array.isArray(user.user_role_id) 
        ? user.user_role_id 
        : [user.user_role_id];

    const hasRequiredRole = AuthorizedUserRoles?.length > 0 
        ? AuthorizedUserRoles.some(role => userRoles.includes(role)) 
        : true;

    if (user.platform_user_business_id === 1) {
        return hasRequiredRole ? ComponentIfUser : ComponentIfNoUser;
    }

    const hasRequiredPlugins = enablePluginsRequireds.every(pluginId => 
        enabledPlugins.includes(Number(pluginId)) 
    );


    return hasRequiredRole && hasRequiredPlugins ? ComponentIfUser : ComponentIfNoUser;
};

export default ConditionalSessionRender;
