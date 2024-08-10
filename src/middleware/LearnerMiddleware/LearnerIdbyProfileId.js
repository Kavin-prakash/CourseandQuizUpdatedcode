import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function LearnerIdbyProfileId() {
    const sessionLearnerId = sessionStorage.getItem('UserSessionID');
    if (sessionLearnerId) {
        axios.get(`http://localhost:5199/api/Registration/GetProfileId/${sessionLearnerId}`)
            .then(response => {
                sessionStorage.setItem('ProfileId', response.data);

            })
            .catch(error => {
                console.error('Error fetching data: ', error);
            });

        return (
            <div>
                <h1>Hi</h1>
            </div>
        );
    }

}
LearnerIdbyProfileId();