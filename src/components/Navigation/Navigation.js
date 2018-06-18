import React from 'react';

const styles = {
    display: 'flex',
    justifyContent: 'flex-end'
}

export const Navigation = ({onRouteChange, isSignedIn}) => {

    if(isSignedIn) {
        return (
            <nav style={styles}>
                <p onClick={() => onRouteChange('signout')} className='f3 link dim black underline pa3 pointer'>Sign out </p>
            </nav>
        );
    } else {
        return (
            <nav style={styles}>
                <p onClick={() => onRouteChange('signin')} className='f3 link dim black underline pa3 pointer'>Sign in </p>
                <p onClick={() => onRouteChange('register')} className='f3 link dim black underline pa3 pointer'>Register</p>
            </nav>
        )
    }

    
};

