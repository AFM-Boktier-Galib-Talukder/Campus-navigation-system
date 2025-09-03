import React, { useState, useEffect } from "react";

function DotEditModal({ isOpen, onClose, dotData, onSave }) {
  const [formData, setFormData] = useState({
    connection: [],
    left: "",
    right: "",
    up: null,
    down: null,
  });
  const [connectionInput, setConnectionInput] = useState("");
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (dotData) {
      setFormData({
        connection: dotData.connection || [],
        left: dotData.left || "",
        right: dotData.right || "",
        up: dotData.up,
        down: dotData.down,
      });
      setConnectionInput((dotData.connection || []).join(", "));
      // Clear errors when new dot data is loaded
      setErrors({});
    }
  }, [dotData]);

  const validateForm = () => {
    const newErrors = {};

    // Validate connections
    if (!formData.connection || formData.connection.length === 0) {
      newErrors.connection = "Connection array cannot be empty";
    } else {
      const invalidConnections = formData.connection.filter(
        (conn) => !Number.isInteger(conn)
      );
      if (invalidConnections.length > 0) {
        newErrors.connection = "All connections must be integers";
      }
    }

    // Validate up/down
    if (formData.up !== null && !Number.isInteger(formData.up)) {
      newErrors.up = "Up value must be null or an integer";
    }

    if (formData.down !== null && !Number.isInteger(formData.down)) {
      newErrors.down = "Down value must be null or an integer";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleConnectionChange = (value) => {
    setConnectionInput(value);
    if (value.trim()) {
      const connections = value
        .split(",")
        .map((conn) => {
          const num = parseInt(conn.trim());
          return isNaN(num) ? conn.trim() : num;
        })
        .filter((conn) => conn !== "");
      setFormData((prev) => ({ ...prev, connection: connections }));
    } else {
      setFormData((prev) => ({ ...prev, connection: [] }));
    }
  };

  const handleUpDownChange = (field, value) => {
    if (value === "" || value === null) {
      setFormData((prev) => ({ ...prev, [field]: null }));
    } else {
      const num = parseInt(value);
      setFormData((prev) => ({ ...prev, [field]: isNaN(num) ? value : num }));
    }
  };

  const handleClose = () => {
    // Reset errors when closing
    setErrors({});
    onClose();
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      await onSave(formData);
      // Reset errors on successful save
      setErrors({});
    } catch (error) {
      console.error("Error saving dot:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto shadow-2xl border border-green-200">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-400 rounded-xl flex items-center justify-center shadow-lg">
            <svg
              className="w-7 h-7 text-white"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div>
            <h2 className="text-3xl font-bold text-gray-800">
              Edit Dot {dotData?.dot}
            </h2>
            <p className="text-gray-600 text-lg">
              Modify the dot information below
            </p>
          </div>
        </div>

        {/* Form */}
        <div className="space-y-6">
          {/* Connections */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Connections <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={connectionInput}
              onChange={(e) => handleConnectionChange(e.target.value)}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 focus:outline-none transition-all ${
                errors.connection ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Enter comma-separated integers (e.g., 11, 12, 13)"
            />
            {errors.connection && (
              <p className="text-red-500 text-sm mt-1">{errors.connection}</p>
            )}
            <p className="text-gray-500 text-sm mt-1">
              Array of connected dot numbers (cannot be empty)
            </p>
          </div>

          {/* Left and Right */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Left Room
              </label>
              <input
                type="text"
                value={formData.left}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, left: e.target.value }))
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 focus:outline-none transition-all"
                placeholder="Room name or empty"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Right Room
              </label>
              <input
                type="text"
                value={formData.right}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, right: e.target.value }))
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 focus:outline-none transition-all"
                placeholder="Room name or empty"
              />
            </div>
          </div>

          {/* Up and Down */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Up Connection
              </label>
              <input
                type="text"
                value={formData.up === null ? "" : formData.up}
                onChange={(e) => handleUpDownChange("up", e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 focus:outline-none transition-all ${
                  errors.up ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Dot number or leave empty for null"
              />
              {errors.up && (
                <p className="text-red-500 text-sm mt-1">{errors.up}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Down Connection
              </label>
              <input
                type="text"
                value={formData.down === null ? "" : formData.down}
                onChange={(e) => handleUpDownChange("down", e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 focus:outline-none transition-all ${
                  errors.down ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Dot number or leave empty for null"
              />
              {errors.down && (
                <p className="text-red-500 text-sm mt-1">{errors.down}</p>
              )}
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-4 mt-8">
          <button
            onClick={handleSave}
            disabled={isLoading}
            className="flex-1 bg-gradient-to-r from-red-500 to-red-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-red-600 hover:to-red-700 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50"
          >
            {isLoading ? "Saving..." : "Save Changes"}
          </button>

          <button
            onClick={handleClose}
            disabled={isLoading}
            className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-green-600 hover:to-green-700 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50"
          >
            Back
          </button>
        </div>
      </div>
    </div>
  );
}

export default DotEditModal;
