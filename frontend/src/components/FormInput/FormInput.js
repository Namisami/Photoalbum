import React, { useEffect, useState } from 'react';
import './FormInput.css';


function FormInput(props) {
  const nameToId = (name) => {
    let wordsInName = name.split("_");
    let id = wordsInName.shift();
    for (let word of wordsInName) {
      id = id + word.charAt(0).toUpperCase() + word.slice(1);
    }
    console.log(id);
    return id;
  }
  return (
    <label>
      { props.title } <br />
      <input
        name={ props.name }
        id= { nameToId(props.name) }
        type={ props.type }
        accept={ props.type == 'file' &&
          'image/jpeg,image/png,image/jpg,image/webp'
        }
        // onChange={ handlePhotoFileChange }
      />
    </label>
  );
}

export default FormInput;