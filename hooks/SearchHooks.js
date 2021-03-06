import {useState} from 'react';
import {validator} from '../utils/validator';

const constraints = {
  title: {
    presence: {
      message: 'cannot be empty',
    },
    length: {
      minimum: 3,
      message: 'min length is 3 characters',
    },
  },
};

const useSearchForm = (callback) => {
  const [inputs, setInputs] = useState({
    title: '',
  });
  const [searchErrors, setSearchErrors] = useState({});

  const handleInputChange = (name, text) => {
    // console.log(name, text);
    // console.log('inputs state', inputs);
    setInputs((inputs) => {
      return {
        ...inputs,
        [name]: text,
      };
    });
    const error = validator(name, text, constraints);
    setSearchErrors((searchErrors) => {
      return {
        ...searchErrors,
        [name]: error,
      };
    });
  };

  const reset = () => {
    setInputs({
      title: '',
    });
    setSearchErrors({});
  };

  return {
    handleInputChange,
    inputs,
    setInputs,
    searchErrors,
    reset,
  };
};

export default useSearchForm;
