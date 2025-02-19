import React, { Component } from 'react';
import Helmet from 'react-helmet';
import AnalyticsActions from '../../actions/AnalyticsActions';
import { renderLog } from '../../common/utils/logging';
import AddFriendsByEmail from '../../components/Friends/AddFriendsByEmail';
import VoterStore from '../../stores/VoterStore';
import { SectionTitle } from '../../components/Style/friendStyles';

export default class InviteByEmail extends Component {
  constructor (props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount () {
    window.scrollTo(0, 0);
    AnalyticsActions.saveActionInviteByEmail(VoterStore.electionId());
  }

  render () {
    renderLog('InviteByEmail');  // Set LOG_RENDER_EVENTS to log all renders
    return (
      <div>
        <Helmet title="Invite Friends" />
        <SectionTitle>Invite Friends by Email</SectionTitle>
        <AddFriendsByEmail />
      </div>
    );
  }
}
