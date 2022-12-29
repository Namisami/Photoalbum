import React, { useEffect, useState } from 'react';
import './FormInput.css';


function FormInput(props) {
  const nameToId = (name) => {
    let wordsInName = name.split("_");
    let id = wordsInName.shift();
    for (let word of wordsInName) {
      id = id + word.charAt(0).toUpperCase() + word.slice(1);
    }
    return id;
  }
  return (
    <label className='form-label col-12'>
      { props.title } <br />
      { props.name == 'photo_file'
        ? <input
            className='form-control'
            required
            name={ props.name }
            id= { nameToId(props.name) }
            type={ props.type }
            value={ props.value }
            accept={ props.type == 'file' ? 'image/jpeg,image/png,image/jpg,image/webp': undefined
            }
            onChange={ props.onChangeValue }
          />
        : <input
            className='form-control'
            name={ props.name }
            id= { nameToId(props.name) }
            type={ props.type }
            value={ props.value }
            accept={ props.type == 'file' ? 'image/jpeg,image/png,image/jpg,image/webp': undefined
            }
            onChange={ props.onChangeValue }
          />
      }
      
    </label>
  );
}

export default FormInput;