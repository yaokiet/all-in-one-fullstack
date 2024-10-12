import React from 'react';

export default function Label({ htmlFor, children }) {
  return (
    <label htmlFor={htmlFor} className="ml-2 text-sm font-medium text-gray-900">
      {children}
    </label>
  );
}