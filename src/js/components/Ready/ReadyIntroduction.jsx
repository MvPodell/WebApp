import withTheme from '@mui/styles/withTheme';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import historyPush from '../../common/utils/historyPush';
import { renderLog } from '../../common/utils/logging';
import AppObservableStore from '../../stores/AppObservableStore';
import VoterStore from '../../stores/VoterStore';
import {
  Dot,
  InnerWrapper,
  IntroHeader,
  ListMaxWidth,
  ListRow,
  ListTitleRow,
  ListWrapper,
  OuterWrapper,
  StepNumber,
  StepNumberPlaceholder,
  StepText,
  StepTitle,
} from '../Style/ReadyIntroductionStyles';
import ShowMoreButtons from '../Widgets/ShowMoreButtons';

class ReadyIntroduction extends Component {
  constructor (props) {
    super(props);
    this.state = {
      contentUnfurled: false,
    };
  }

  componentDidMount () {
    this.onVoterStoreChange();
    this.voterStoreListener = VoterStore.addListener(this.onVoterStoreChange.bind(this));
    const { contentUnfurledOnLoad } = this.props;
    this.setState({
      contentUnfurled: contentUnfurledOnLoad,
    });
  }

  componentWillUnmount () {
    this.voterStoreListener.remove();
  }

  onVoterStoreChange () {
    const voterIsSignedIn = VoterStore.getVoterIsSignedIn();
    const voterIsSignedInWithFacebook = VoterStore.getVoterIsSignedInWithFacebook();
    const voterIsSignedInWithTwitter = VoterStore.getVoterIsSignedInWithTwitter();
    this.setState({
      voterIsSignedIn,
      voterIsSignedInWithFacebook,
      voterIsSignedInWithTwitter,
    });
  }

  contentUnfurledLink = () => {
    const { contentUnfurled } = this.state;
    this.setState({
      contentUnfurled: !contentUnfurled,
    });
  }

  showSelectBallotModalEditAddress = () => {
    const showEditAddress = true;
    const showSelectBallotModal = true;
    AppObservableStore.setShowSelectBallotModal(showSelectBallotModal, showEditAddress);
  }

  onSignInClick = () => {
    const { voterIsSignedIn } = this.state;
    if (voterIsSignedIn) {
      historyPush('/settings/account');
      return true;
    } else {
      AppObservableStore.setShowSignInModal(true);
      return true;
    }
  }

  render () {
    renderLog('ReadyIntroduction');  // Set LOG_RENDER_EVENTS to log all renders
    const { contentUnfurled, voterIsSignedInWithFacebook, voterIsSignedInWithTwitter } = this.state;
    const { contentUnfurledOnLoad, showStep3WhenCompressed, titleCentered, titleLarge } = this.props;
    return (
      <OuterWrapper>
        <InnerWrapper>
          <IntroHeader titleCentered={titleCentered} titleLarge={titleLarge}>
            We Vote helps you:
          </IntroHeader>
          <ListWrapper>
            <ListMaxWidth>
              <ListTitleRow>
                <Dot><StepNumber>1</StepNumber></Dot>
                <StepTitle>Be ready to vote</StepTitle>
              </ListTitleRow>
              {contentUnfurled && (
                <ListRow>
                  <Dot><StepNumberPlaceholder>&nbsp;</StepNumberPlaceholder></Dot>
                  <StepText>
                    <span className="u-link-color u-link-color-on-hover u-cursor--pointer" onClick={this.showSelectBallotModalEditAddress}>
                      Enter your address
                    </span>
                    {' '}
                    to find out when your next election is, and
                    {' '}
                    <Link to="/ballot" className="u-link-color">preview your ballot</Link>
                    .
                    {' '}
                    How are
                    {' '}
                    <Link to="/findfriends/importcontacts" className="u-link-color">your friends</Link>
                    {' '}
                    planning to vote?
                  </StepText>
                </ListRow>
              )}

              <ListTitleRow>
                <Dot><StepNumber>2</StepNumber></Dot>
                <StepTitle>Be confident in your choices</StepTitle>
              </ListTitleRow>
              {contentUnfurled && (
                <ListRow>
                  <Dot><StepNumberPlaceholder>&nbsp;</StepNumberPlaceholder></Dot>
                  <StepText>
                    Tell us what topics are important to you and we&apos;ll recommend people and organizations to follow as well as make ballot recommendations.
                    {' '}
                    {voterIsSignedInWithTwitter ? (
                      <>
                        Since you are signed in with Twitter, you will see endorsements of everyone you follow on Twitter.
                      </>
                    ) : (
                      <>
                        <span className="u-link-color u-link-color-on-hover u-cursor--pointer" onClick={this.onSignInClick}>
                          Link to your Twitter account
                        </span>
                        {' '}
                        and see endorsements of everyone you follow on Twitter.
                      </>
                    )}
                  </StepText>
                </ListRow>
              )}

              {(contentUnfurled || showStep3WhenCompressed) && (
                <ListTitleRow>
                  <Dot><StepNumber>3</StepNumber></Dot>
                  <StepTitle>Help friends &amp; amplify your impact</StepTitle>
                </ListTitleRow>
              )}
              {contentUnfurled && (
                <ListRow>
                  <Dot><StepNumberPlaceholder>&nbsp;</StepNumberPlaceholder></Dot>
                  <StepText>
                    <Link to="/findfriends/importcontacts" className="u-link-color">Invite your friends</Link>
                    {' '}
                    to join WeVote to encourage them to vote, share your ballot and endorsements, engage in discussions and more!
                    {' '}
                    {!voterIsSignedInWithFacebook && (
                      <>
                        <span className="u-link-color u-link-color-on-hover u-cursor--pointer" onClick={this.onSignInClick}>
                          Link to your Facebook account
                        </span>
                        {' '}
                        so your friends can find you.
                        {' '}
                      </>
                    )}
                    Studies show people are more likely to vote if they see their friends voting.
                  </StepText>
                </ListRow>
              )}
              {!contentUnfurledOnLoad && (
                <ShowMoreButtons
                  showMoreId="showMoreReadyIntroductionCompressed"
                  showMoreButtonWasClicked={contentUnfurled}
                  showMoreButtonsLink={this.contentUnfurledLink}
                />
              )}
            </ListMaxWidth>
          </ListWrapper>
        </InnerWrapper>
      </OuterWrapper>
    );
  }
}
ReadyIntroduction.propTypes = {
  contentUnfurledOnLoad: PropTypes.bool,
  showStep3WhenCompressed: PropTypes.bool,
  titleCentered: PropTypes.bool,
  titleLarge: PropTypes.bool,
};

export default withTheme(ReadyIntroduction);
