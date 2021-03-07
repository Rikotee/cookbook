import axios from 'axios';
import {useContext, useEffect, useState} from 'react';
import {MainContext} from '../contexts/MainContext';
import {appIdentifier, baseUrl} from '../utils/variables';

// general function for fetching (options default value is empty object)
const doFetch = async (url, options = {}) => {
  const response = await fetch(url, options);
  const json = await response.json();
  if (json.error) {
    // if API response contains error message (use Postman to get further details)
    throw new Error(json.message + ': ' + json.error);
  } else if (!response.ok) {
    // if API response does not contain error message, but there is some other error
    throw new Error('doFetch failed');
  } else {
    // if all goes well
    return json;
  }
};

const useLoadMedia = (myFilesOnly, userId) => {
  const [mediaArray, setMediaArray] = useState([]);
  const {update} = useContext(MainContext);

  const loadMedia = async () => {
    try {
      const listJson = await doFetch(baseUrl + 'tags/' + appIdentifier);
      let media = await Promise.all(
        listJson.map(async (item) => {
          const fileJson = await doFetch(baseUrl + 'media/' + item.file_id);
          return fileJson;
        })
      );
      if (myFilesOnly) {
        media = media.filter((item) => item.user_id === userId);
      }
      setMediaArray(media);
    } catch (error) {
      console.error('loadMedia error', error.message);
    }
  };
  useEffect(() => {
    loadMedia();
  }, [update]);
  return mediaArray;
};

const useLogin = () => {
  const postLogin = async (userCredentials) => {
    const options = {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(userCredentials),
    };
    try {
      const userData = await doFetch(baseUrl + 'login', options);
      return userData;
    } catch (error) {
      throw new Error('postLogin error: ' + error.message);
    }
  };

  return {postLogin};
};

const useUser = () => {
  const postRegister = async (inputs) => {
    console.log('trying to create user', inputs);
    const fetchOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(inputs),
    };
    try {
      const json = await doFetch(baseUrl + 'users', fetchOptions);
      console.log('register resp', json);
      return json;
    } catch (e) {
      throw new Error(e.message);
    }
  };

  const checkToken = async (token) => {
    try {
      const options = {
        method: 'GET',
        headers: {'x-access-token': token},
      };
      const userData = await doFetch(baseUrl + 'users/user', options);
      return userData;
    } catch (error) {
      throw new Error(error.message);
    }
  };

  const updateUser = async (token, inputs) => {
    const options = {
      method: 'PUT',
      headers: {
        'x-access-token': token,
      },
      data: inputs,
      url: baseUrl + 'users',
    };
    console.log('apihooks modify', options.data);

    try {
      await axios(options).then(
        (res) => {
          if (res.status === 200) {
            console.log("ok") // here is the resonse that is sent back
          } else console.log('Response was not 200, but: ', res);
        },
        (err) => {
          console.log('Something went wrong deleting comment: ', err);
        }
      );
    } catch (error) {
      console.log('uploaderror: ', error);
    }
  };

  const getUser = async (id, token) => {
    try {
      const options = {
        method: 'GET',
        headers: {'x-access-token': token},
      };
      const userData = await doFetch(baseUrl + 'users/' + id, options);
      return userData;
    } catch (error) {
      throw new Error(error.message);
    }
  };

  const checkIsUserAvailable = async (username) => {
    try {
      const result = await doFetch(baseUrl + 'users/username/' + username);
      return result.available;
    } catch (error) {
      throw new Error('apihooks checkIsUserAvailable', error.message);
    }
  };

  return {postRegister, checkToken, checkIsUserAvailable, getUser, updateUser};
};

const useTag = () => {
  const getFilesByTag = async (tag) => {
    try {
      const tagList = await doFetch(baseUrl + 'tags/' + tag);
      console.log("getFilesByTag backend " + tagList)
      return tagList;
    } catch (error) {
      throw new Error(error.message);
    }
  };
  const postTag = async (tag, token) => {
    console.log('HERE IS THE TAG2 ' + JSON.stringify(tag));
    const options = {
      method: 'POST',
      headers: {'Content-Type': 'application/json', 'x-access-token': token},
      body: JSON.stringify(tag),
    };
    console.log('HERE IS THE TAG ' + JSON.stringify(tag));

    try {
      const result = await doFetch(baseUrl + 'tags', options);
      return result;
    } catch (error) {
      throw new Error('postTag error: ' + error.message);
    }
  };

  return {getFilesByTag, postTag};
};

const useMedia = () => {
  const [mediaArray, setMediaArray] = useState([]);

  const upload = async (fd, token) => {
    const options = {
      method: 'POST',
      headers: {
        'x-access-token': token,
        'content-type': 'multipart/form-data',
      },
      data: fd,
      url: baseUrl + 'media',
    };
    console.log('apihooks upload', options);

    try {
      return await axios(options).then((res) => {
        if (res.status === 201) {
          console.log('Upload res ok: ', res.data.file_id);
          return res.data.file_id
        } else {
          console.log('err Upload: ', res.status, res.message);
        }
      })
    } catch (error) {
      console.log('uploaderror: ', error);
    }
  };

  const search = async (token, inputs) => {
    const searchOptions = {
      method: 'POST',
      headers: {'Content-Type': 'application/json', 'x-access-token': token},
      body: JSON.stringify(inputs),
      url: baseUrl + 'media/search',
    };

      // console.log('search options', searchOptions);

    try {

      // this fetch all tagged files
      const tagListJson = await doFetch(baseUrl + 'tags/' + appIdentifier);
      // this uses API search with input word
      const listJson = await doFetch(baseUrl + 'media/search', searchOptions);
      // compares searches and filter only right tagged searches
      const onlyTags = tagListJson.filter(({file_id:a, title:x}) => listJson.some(({file_id:b, title:y}) => a === b && x === y));

      // console.log('filter test', onlyTags);
      // console.log('ApiHooks search resp', listJson);

      const media = await Promise.all(
        onlyTags.map(async (item) => {
          const fileJson = await doFetch(baseUrl + 'media/' + item.file_id);
          return fileJson;
        })
      );

      // console.log('filtered apihooks search', searchOptions);

      setMediaArray(media);
      return mediaArray;
    } catch (e) {
      throw new Error(e.message);
    }
  };

  const updateFile = async (fileId, fileInfo, token) => {
    const options = {
      method: 'PUT',
      headers: {
        'x-access-token': token,
        'Content-type': 'application/json',
      },
      body: JSON.stringify(fileInfo),
    };
    try {
      const result = await doFetch(baseUrl + 'media/' + fileId, options);
      return result;
    } catch (error) {
      throw new Error('updateFile error: ' + error.message);
    }
  };

  const deleteFile = async (fileId, token) => {
    const options = {
      method: 'DELETE',
      headers: {'x-access-token': token},
    };
    try {
      const result = await doFetch(baseUrl + 'media/' + fileId, options);
      return result;
    } catch (error) {
      throw new Error('deleteFile error: ' + error.message);
    }
  };

  const getFile = async (fileId) => {
    try {
      const result = await doFetch(baseUrl + 'media/' + fileId);
      return result;
    } catch (error) {
      throw new Error('getFile error: ' + error.message);
    }
  };

  return {upload, updateFile, deleteFile, getFile, search};
};

export {useLoadMedia, useLogin, useUser, useTag, useMedia};
