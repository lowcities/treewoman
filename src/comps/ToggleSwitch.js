import React, { useState, useEffect } from 'react';

const ToggleSwitch = ({ parentCallback }) => {
    const [ gridMode, setGridMode ] = useState(false);

    const changeHandler = (e) => {
         gridMode === true ? setGridMode(false) : setGridMode(true);
         return parentCallback(gridMode);
    }

    return (
        <div className='toggle-container'>
        <input  className="toggle-input" type="checkbox" id="toggle" name="toggle" value="is_on" onChange={changeHandler} />
        <label for="toggle" class="toy-toggle">
            <span class="border1"></span>
            <span class="border2"></span>
            <span class="border3"></span>
            <span class="handle">
            <span class="handle-off"></span>
            <span class="handle-on"></span>
            </span>
        </label>
        </div>
    )
}

export default ToggleSwitch;