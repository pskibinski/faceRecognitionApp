import React from "react";
import "./ImageLinkForm.css";

const ImageLinkForm = ({ inputChange, onPictureSubmit }) => {
  return (
    <div>
      <p className="f3 center">
        {"This magic brain will detect faces in your pictures."}
      </p>
      <div>
        <div className="pa4 br3 shadow-5 center form">
          <input
            className="f4 pa2 w-70 center bn br3"
            type="text"
            onChange={inputChange}
          />
          <button
            className="w-30 grow f4 link ph3 pv2 dib white bg-dark-blue bn br3"
            onClick={onPictureSubmit}
          >
            Detect
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImageLinkForm;
