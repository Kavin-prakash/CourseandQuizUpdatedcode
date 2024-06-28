import { useEffect } from "react";
import * as React from "react";
import { connect } from "react-redux";
import { fetchProfileCardRequest } from "../../actions/Admin/LearnersViewAction";
import { useParams } from "react-router-dom";
import '../../Styles/Admin/ProfileCard.css';
import MailIcon from '@mui/icons-material/Mail';
import StreamIcon from '@mui/icons-material/Stream';
import CakeIcon from '@mui/icons-material/Cake';
import LoginIcon from '@mui/icons-material/Login';
import PhoneIcon from '@mui/icons-material/Phone';
import MaleIcon from '@mui/icons-material/Male';
import FemaleIcon from '@mui/icons-material/Female';
import TransgenderIcon from '@mui/icons-material/Transgender';
const ProfileCard = ({ fetchProfileCard, profilecard }) => {
  const learnerid = useParams();
  useEffect(() => {
    fetchProfileCard(learnerid);
  }, [fetchProfileCard]);
  const {
    learnerprofile,
    learnerFirstName,
    learnerLastName,
    learnerStream,
    learnerEmail,
    learnerDob,
    learnerContactNumber,
    learnerGender,
    learnerLastlogin,
  } = profilecard.profilecard;
  return (
    <>
      <div id="adminprofile-card">
        <div id="profile-img">
          <div class="settings-widget dash-profile">
            <div class="settings-menu">
              <div class="profile-bg">
                <div class="profile-img">
                  <img src={learnerprofile} alt="img" />
                </div>
              </div>
              <div className="profile-group">
                <div className="profile-name text-center">
                  <h4>{learnerFirstName} {learnerLastName}</h4>
                </div>
                <p><MailIcon /> {learnerEmail}</p>
                <p><PhoneIcon /> {learnerContactNumber}</p>
                <p><CakeIcon /> {learnerDob}</p>
                <p>
                  {learnerGender === "others" ? <TransgenderIcon /> : learnerGender === "male" ? <MaleIcon /> : <FemaleIcon />}
                  {learnerGender ? learnerGender.toUpperCase() : 'Not Provided'} </p>
                <p><StreamIcon /> {learnerStream}</p>
                <p><LoginIcon /> {learnerLastlogin ? learnerLastlogin.replace('T', ' ') : 'Not Logged In'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

const mapStoreToProps = (state) => ({
  profilecard: state.profilecard,
});

const mapDispatchToProps = (dispatch) => ({
  fetchProfileCard: (learnerid) => dispatch(fetchProfileCardRequest(learnerid)),
});

export default connect(mapStoreToProps, mapDispatchToProps)(ProfileCard);