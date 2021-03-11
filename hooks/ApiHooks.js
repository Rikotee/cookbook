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
    throw new Error('doFetch failed: ' + url + '  ' + JSON.stringify(options));
  } else {
    // if all goes well
    return json;
  }
};

const useLoadMedia = (myFilesOnly, userId, guestFilesOnly, guestId) => {
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
      if (guestFilesOnly) {
        media = media.filter((item) => item.user_id === guestId);
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
            console.log('ok'); // here is the resonse that is sent back
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
      return tagList;
    } catch (error) {
      throw new Error(error.message);
    }
  };

  const getTagsOfFile = async (id) => {
    try {
      const options = {
        method: 'GET',
      };
      const tags = await doFetch(baseUrl + 'tags/file/' + id, options);
      return tags;
    } catch (error) {
      throw new Error(error.message);
    }
  };

  const postTag = async (tagAndFileId, token) => {
    console.log('Tag = ' + JSON.stringify(tagAndFileId));
    const options = {
      method: 'POST',
      headers: {'Content-Type': 'application/json', 'x-access-token': token},
      body: JSON.stringify(tagAndFileId),
    };
    try {
      const result = await doFetch(baseUrl + 'tags', options);
      return result;
    } catch (error) {
      throw new Error('postTag error: ' + error.message);
    }
  };

  return {getFilesByTag, postTag, getTagsOfFile};
};

const useMedia = () => {
  const rate = async (ratingAndFileId, token) => {
    console.log('Who called me??? ' + JSON.stringify(ratingAndFileId));
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': token,
      },
      body: JSON.stringify(ratingAndFileId),
    };
    try {
      const result = await doFetch(baseUrl + 'ratings', options);
      return result;
    } catch (error) {
      throw new Error('rating error: ' + error.message);
    }
  };

  const getRating = async (fileId) => {
    try {
      const result = await doFetch(baseUrl + 'ratings/file/' + fileId);
      return result;
    } catch (error) {
      throw new Error('getFile error: ' + error.message);
    }
  };

  const deleteRating = async (fileId, token) => {
    const options = {
      method: 'DELETE',
      headers: {'x-access-token': token},
    };
    try {
      const result = await doFetch(baseUrl + 'ratings/file/' + fileId, options);
      console.log('rating delete: ' + JSON.stringify(result));
      return result;
    } catch (error) {
      throw new Error('deleteFile error: ' + error.message);
    }
  };

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
    console.log('apihooks upload', options.data);

    try {
      return await axios(options).then((res) => {
        if (res.status === 201) {
          console.log('Upload res ok: ', res.data.file_id);
          return res.data.file_id;
        } else {
          console.log('err Upload: ', res.status, res.message);
        }
      });
    } catch (error) {
      console.log('uploaderror: ', error);
    }
  };

  const search = async (token, inputs, tags) => {
    console.log(
      'searching with these tags: ' + tags + ' and this search word: ' + inputs
    );
    try {
      const tagParser = (tag) => {
        const temp = JSON.parse(tag);
        return temp[1];
      };

      // Function to check if string contains words from array
      const multiSearchAnd = (text, searchWords) =>
        searchWords.every((el) => {
          return text.match(new RegExp(el, 'i'));
        });

      // gets all the files that match the search tags and compares if they have all required tags to be shown
      const idsOfFilesOfThisApp = [];
      for (let i = 0; i < tags.length; i++) {
        if (tags[i] !== '') {
          const searchTag = JSON.stringify([
            appIdentifier,
            encodeURIComponent(tags[i]),
          ]);
          // Get all files that have even 1 corresponding tag to search tags
          const files = await doFetch(baseUrl + 'tags/' + searchTag);
          for (let j = 0; j < files.length; j++) {
            const tagsOfFile = await doFetch(
              baseUrl + 'tags/file/' + files[j].file_id
            );
            const tagArray = [
              tagParser(tagsOfFile[0].tag),
              tagParser(tagsOfFile[1].tag),
              tagParser(tagsOfFile[2].tag),
            ];
            // Compares if the file has all required tags compared to search tags
            if (multiSearchAnd(JSON.stringify(tagArray), tags) === true) {
              idsOfFilesOfThisApp.push(files[j].file_id);
            }
          }
        }
      }
      if (idsOfFilesOfThisApp.length === 0) {
        const tagListJson = await doFetch(baseUrl + 'tags/' + appIdentifier);
        for (let n = 0; n < tagListJson.length; n++) {
          idsOfFilesOfThisApp.push(tagListJson[n].file_id);
        }
      }

      const searchOptions = {
        method: 'POST',
        headers: {'Content-Type': 'application/json', 'x-access-token': token},
        body: JSON.stringify(inputs),
      };

      // this uses API search with input word
      const listJson = await doFetch(baseUrl + 'media/search', searchOptions);
      const actualList = [];
      for (let k = 0; k < listJson.length; k++) {
        if (idsOfFilesOfThisApp.includes(listJson[k].file_id)) {
          actualList.push(listJson[k].file_id);
        }
      }

      // actually
      const filteredFiles = [];
      for (let l = 0; l < actualList.length; l++) {
        const fileJson = await doFetch(baseUrl + 'media/' + actualList[l]);
        filteredFiles.push(fileJson);
      }

      // Setting filtered tags
      setMediaArray(filteredFiles);
    } catch (e) {
      throw new Error(e.message);
    }
    return mediaArray;
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
    console.log(options.body)
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

  return {
    upload,
    updateFile,
    deleteFile,
    getFile,
    search,
    rate,
    getRating,
    deleteRating,
  };
};

export {useLoadMedia, useLogin, useUser, useTag, useMedia};
