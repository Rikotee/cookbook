import React, {useState} from 'react';
import PropTypes from 'prop-types';

const MainContext = React.createContext({});

const MainProvider = ({children}) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState({});
  const [update, setUpdate] = useState(0);
  const [guest, setGuest] = useState({});
  const [getRatings, setGetRatings] = useState(true);
  const [getPicture, setGetPicture] = useState(true);
  const [getBioChange, setGetBioChange] = useState(true);

  return (
    <MainContext.Provider
      value={{
        isLoggedIn,
        setIsLoggedIn,
        user,
        setUser,
        update,
        setUpdate,
        guest,
        setGuest,
        setGetRatings,
        getRatings,
        getPicture,
        setGetPicture,
        getBioChange,
        setGetBioChange
      }}
    >
      {children}
    </MainContext.Provider>
  );
};

MainProvider.propTypes = {
  children: PropTypes.node,
};

export {MainContext, MainProvider};
