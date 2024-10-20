import React, { useState } from 'react';
import { Field, ErrorMessage } from 'formik';

const InputField = ({ label, name, type, placeholder, showHide }) => {
  const [showPassword, setShowPassword] = useState(false);

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="mt-6 w-full">
      <label className="text-sm font-medium leading-none text-gray-800">
        {label}
      </label>
      <div className="relative flex items-center justify-center">
        <Field
          name={name}
          type={showHide && showPassword ? 'text' : type}
          placeholder={placeholder}
          className="bg-gray-200 border rounded text-xs font-medium leading-none placeholder-gray-800 text-gray-800 py-3 w-full pl-3 mt-2"
        />
        {showHide && (
          <div className="absolute right-0 mt-2 mr-3 cursor-pointer" onClick={toggleShowPassword}>
            {showPassword ? (
              <img
                src="https://tuk-cdn.s3.amazonaws.com/can-uploader/sign_in_2-svg6.svg" 
                alt="Hide"
              />
            ) : (
              <img
                src="https://tuk-cdn.s3.amazonaws.com/can-uploader/sign_in_2-svg5.svg" 
                alt="Show"
              />
            )}
          </div>
        )}
      </div>
      <ErrorMessage name={name}>
        {(msg) => <div className="text-red-600 text-xs">{msg}</div>}
      </ErrorMessage>
    </div>
  );
};

export default InputField;