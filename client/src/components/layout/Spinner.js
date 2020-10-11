import React, { Fragment } from 'react';
import spinner from './spinner.gif';

export default () => (
    <Fragment>
        <img
        src={spinner}
        style={{ width: '35px', margin: '0px 400px', dispay: 'block'}}
        slt='Loading...'
        />
    </Fragment>
);