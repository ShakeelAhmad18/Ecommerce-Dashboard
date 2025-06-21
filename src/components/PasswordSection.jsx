import React, { useState, useEffect } from "react";
import { FiEye, FiEyeOff, FiCheck, FiX } from "react-icons/fi";

const PasswordSection = () => {
  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState({
    old: false,
    new: false,
    confirm: false,
  });
  const [passwordValidations, setPasswordValidations] = useState({
    minLength: false,
    hasUpperCase: false,
    hasLowerCase: false,
    hasNumber: false,
    hasSpecialChar: false,
    passwordsMatch: false,
  });
  const [isFormValid, setIsFormValid] = useState(false);

  const validatePassword = (password) => {
    return {
      minLength: password.length >= 8,
      hasUpperCase: /[A-Z]/.test(password),
      hasLowerCase: /[a-z]/.test(password),
      hasNumber: /[0-9]/.test(password),
      hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    };
  };

  useEffect(() => {
    const validations = validatePassword(formData.newPassword);
    setPasswordValidations({
      ...validations,
      passwordsMatch:
        formData.newPassword === formData.confirmPassword &&
        formData.newPassword !== "",
    });
  }, [formData.newPassword, formData.confirmPassword]);

  useEffect(() => {
    const allValid =
      Object.values(passwordValidations).every(Boolean) &&
      formData.oldPassword !== "" &&
      formData.newPassword !== "" &&
      formData.confirmPassword !== "";
    setIsFormValid(allValid);
  }, [passwordValidations, formData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const togglePasswordVisibility = (field) => {
    setShowPassword((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isFormValid) {
      console.log("Password updated:", formData);
      alert("Password updated successfully!");
      setFormData({ oldPassword: "", newPassword: "", confirmPassword: "" });
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm dark:shadow-gray-900 p-6">
      <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-6">
        Password
      </h2>

      <form onSubmit={handleSubmit}>
        {/* Password Fields Row - Desktop */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {/* Old Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Old Password
            </label>
            <div className="relative">
              <input
                type={showPassword.old ? "text" : "password"}
                name="oldPassword"
                value={formData.oldPassword}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                required
              />
              <button
                type="button"
                className="absolute right-3 top-2.5 text-gray-500 dark:text-gray-400"
                onClick={() => togglePasswordVisibility("old")}
              >
                {showPassword.old ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
          </div>

          {/* New Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              New Password
            </label>
            <div className="relative">
              <input
                type={showPassword.new ? "text" : "password"}
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                required
              />
              <button
                type="button"
                className="absolute right-3 top-2.5 text-gray-500 dark:text-gray-400"
                onClick={() => togglePasswordVisibility("new")}
              >
                {showPassword.new ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Confirm Password
            </label>
            <div className="relative">
              <input
                type={showPassword.confirm ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                required
              />
              <button
                type="button"
                className="absolute right-3 top-2.5 text-gray-500 dark:text-gray-400"
                onClick={() => togglePasswordVisibility("confirm")}
              >
                {showPassword.confirm ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
          </div>
        </div>

        {/* Password Requirements */}
        <div className="mb-6 bg-gray-50 dark:bg-gray-700 rounded-md p-4">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Password Requirements:
          </h3>
          <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 text-sm text-gray-600 dark:text-gray-400">
            <li
              className={`flex items-center ${
                passwordValidations.minLength
                  ? "text-green-600 dark:text-green-400"
                  : ""
              }`}
            >
              {passwordValidations.minLength ? (
                <FiCheck className="mr-2" />
              ) : (
                <FiX className="mr-2" />
              )}
              Minimum 8 characters
            </li>
            <li
              className={`flex items-center ${
                passwordValidations.hasUpperCase
                  ? "text-green-600 dark:text-green-400"
                  : ""
              }`}
            >
              {passwordValidations.hasUpperCase ? (
                <FiCheck className="mr-2" />
              ) : (
                <FiX className="mr-2" />
              )}
              1 uppercase letter
            </li>
            <li
              className={`flex items-center ${
                passwordValidations.hasLowerCase
                  ? "text-green-600 dark:text-green-400"
                  : ""
              }`}
            >
              {passwordValidations.hasLowerCase ? (
                <FiCheck className="mr-2" />
              ) : (
                <FiX className="mr-2" />
              )}
              1 lowercase letter
            </li>
            <li
              className={`flex items-center ${
                passwordValidations.hasNumber
                  ? "text-green-600 dark:text-green-400"
                  : ""
              }`}
            >
              {passwordValidations.hasNumber ? (
                <FiCheck className="mr-2" />
              ) : (
                <FiX className="mr-2" />
              )}
              1 number
            </li>
            <li
              className={`flex items-center ${
                passwordValidations.hasSpecialChar
                  ? "text-green-600 dark:text-green-400"
                  : ""
              }`}
            >
              {passwordValidations.hasSpecialChar ? (
                <FiCheck className="mr-2" />
              ) : (
                <FiX className="mr-2" />
              )}
              1 special character
            </li>
            <li
              className={`flex items-center ${
                passwordValidations.passwordsMatch
                  ? "text-green-600 dark:text-green-400"
                  : ""
              }`}
            >
              {passwordValidations.passwordsMatch ? (
                <FiCheck className="mr-2" />
              ) : (
                <FiX className="mr-2" />
              )}
              Passwords match
            </li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!isFormValid}
            className={`px-4 py-2 rounded-md text-white font-medium ${
              isFormValid
                ? "bg-blue-600 hover:bg-blue-700"
                : "bg-blue-400 cursor-not-allowed"
            } transition-colors`}
          >
            Update Password
          </button>
        </div>
      </form>
    </div>
  );
};

export default PasswordSection;
