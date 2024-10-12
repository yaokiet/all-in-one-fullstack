import React from 'react';

export default function Switch({ id, checked, onChange }) {
  return (
    <div className="inline-flex items-center">
      <input
        type="checkbox"
        id={id}
        className="sr-only"
        checked={checked}
        onChange={onChange}
      />
      <div
        className={`relative w-11 h-6 bg-gray-200 rounded-full transition-colors duration-200 ease-in-out ${
          checked ? 'bg-blue-600' : ''
        }`}
      >
        <div
          className={`absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full transition-transform duration-200 ease-in-out ${
            checked ? 'transform translate-x-5' : ''
          }`}
        ></div>
      </div>
    </div>
  );
}