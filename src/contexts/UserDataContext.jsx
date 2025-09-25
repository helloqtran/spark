import React, { createContext, useContext } from 'react';
import { useUserData } from '../hooks/useUserData';
import LoadingWrapper from '../components/LoadingWrapper';

/**
 * UserDataContext - Provides user data throughout the app
 * 
 * This context eliminates prop drilling by making user data available
 * to any component in the component tree without passing props.
 */
const UserDataContext = createContext(null);

/**
 * UserDataProvider - Context provider component
 * 
 * Wraps the app and provides user data to all child components.
 * Uses the existing useUserData hook for data management.
 * Includes loading and error states.
 */
export const UserDataProvider = ({ children }) => {
  const userData = useUserData();
  
  return (
    <UserDataContext.Provider value={userData}>
      <LoadingWrapper isLoading={!userData.isLoaded} error={userData.error}>
        {children}
      </LoadingWrapper>
    </UserDataContext.Provider>
  );
};

/**
 * useUserDataContext - Hook to access user data from context
 * 
 * @returns {Object} User data object with state and actions
 * @throws {Error} If used outside of UserDataProvider
 */
export const useUserDataContext = () => {
  const context = useContext(UserDataContext);
  
  if (!context) {
    throw new Error('useUserDataContext must be used within a UserDataProvider');
  }
  
  return context;
};

export default UserDataContext;
