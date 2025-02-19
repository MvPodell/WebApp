import withStyles from '@mui/styles/withStyles';
import withTheme from '@mui/styles/withTheme';
import PropTypes from 'prop-types';
import React, { Component, Suspense } from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';
import styled from 'styled-components';
import { renderLog } from '../../common/utils/logging';
import AppObservableStore, { messageService } from '../../stores/AppObservableStore';
import { openSnackbar } from '../Widgets/SnackNotifier';

const OpenExternalWebSite = React.lazy(() => import(/* webpackChunkName: 'OpenExternalWebSite' */ '../../common/components/Widgets/OpenExternalWebSite'));

class ShareModalOption extends Component {
  constructor (props) {
    super(props);
    this.state = {
      copyLinkCopied: false,
      shareModalStep: '',
    };
  }

  componentDidMount () {
    // console.log('Candidate componentDidMount');
    this.appStateSubscription = messageService.getMessage().subscribe(() => this.onAppObservableStoreChange());
    this.onAppObservableStoreChange();
  }

  componentWillUnmount () {
    // console.log('componentWillUnmount');
    this.appStateSubscription.unsubscribe();
  }

  onAppObservableStoreChange () {
    const { shareModalStep } = this.state;
    const newShareModalStep = AppObservableStore.getShareModalStep();
    if (newShareModalStep !== shareModalStep) {
      // If we change modes, reset the copy link state
      this.setState({
        copyLinkCopied: false,
      });
    }
    this.setState({
      shareModalStep: newShareModalStep,
    });
  }

  onClick = () => {
    // console.log('ShareModalOption onClick function');
    if (this.props.onClickFunction) {
      this.props.onClickFunction();
    }
  }

  // onCopyToClipboardClick = () => {
  //   openSnackbar({ message: 'Copied!' });
  //   this.setState({
  //     copyLinkCopied: true,
  //   });
  // }
  //  onClick={this.onCopyToClipboardClick}

  copyLink = () => {
    // console.log('ShareModalOption copyLink');
    openSnackbar({ message: 'Copied!' });
    this.setState({
      copyLinkCopied: true,
    });
    if (this.props.onClickFunction) {
      this.props.onClickFunction();
    }
  }

  render () {
    renderLog('ShareModalOption');  // Set LOG_RENDER_EVENTS to log all renders
    const { backgroundColor, classes, copyLink, icon, urlToShare, noLink, title, uniqueExternalId } = this.props;
    const { copyLinkCopied } = this.state;
    let urlToBeShared = '';
    if (urlToShare) {
      urlToBeShared = urlToShare.replace(/https:\/\/file:.*?\/|https:\/\/localhost.*?\//, 'https://wevote.us/');
    }
    // console.log('ShareModalOption copyLink:', copyLink, ', noLink:', noLink, 'urlToShare:', urlToShare, ', urlToBeShared:', urlToBeShared);
    return (
      <Wrapper>
        {(copyLink && urlToBeShared) ? (
          <CopyToClipboard text={urlToBeShared} onCopy={this.copyLink}>
            <div id={`shareModalOption-${uniqueExternalId}`}>
              <Icon
                className={copyLinkCopied ? classes.copyLinkIconCopied : classes.copyLinkIcon}
              >
                {icon}
              </Icon>
              <Text>
                {copyLinkCopied ? 'Copied!' : title}
              </Text>
            </div>
          </CopyToClipboard>
        ) : (
          <div>
            {noLink ? (
              <div id={`shareModalOption-${uniqueExternalId}`} onClick={this.onClick}>
                <Icon backgroundColor={backgroundColor}>
                  {icon}
                </Icon>
                <Text>
                  {title}
                </Text>
              </div>
            ) : (
              <>
                {(urlToBeShared) && (
                  <>
                    <Suspense fallback={<></>}>
                      <OpenExternalWebSite
                        linkIdAttribute="linkToShare"
                        className="no-decoration"
                        url={urlToBeShared}
                        target="_blank"
                        body={(
                          <div id={`shareModalOption-${uniqueExternalId}`} onClick={() => this.onClick}>
                            <Icon backgroundColor={backgroundColor}>
                              {icon}
                            </Icon>
                            <Text>
                              {title}
                            </Text>
                          </div>
                        )}
                      />
                    </Suspense>
                  </>
                )}
              </>
            )}
          </div>
        )}
      </Wrapper>
    );
  }
}
ShareModalOption.propTypes = {
  backgroundColor: PropTypes.string,
  classes: PropTypes.object,
  copyLink: PropTypes.bool,
  icon: PropTypes.object,
  urlToShare: PropTypes.string,
  noLink: PropTypes.bool,
  onClickFunction: PropTypes.func,
  title: PropTypes.string,
  uniqueExternalId: PropTypes.string,
};

const styles = () => ({
  copyLinkIcon: {
    background: '#000',
  },
  copyLinkIconCopied: {
    background: '#1fc06f',
  },
});

const Wrapper = styled('div')`
  cursor: pointer;
  display: block !important;
  margin-bottom: 12px;
  @media (min-width: 600px) {
    flex: 1 1 0;
  }
  height: 100%;
  text-align: center;
  text-decoration: none !important;
  color: black !important;
  transition-duration: .25s;
  &:hover {
    text-decoration: none !important;
    color: black !important;
    transform: scale(1.05);
    transition-duration: .25s;
  }
`;

const Icon = styled('div', {
  shouldForwardProp: (prop) => !['backgroundColor'].includes(prop),
})(({ backgroundColor }) => (`
  text-decoration: none !important;
  margin: 0 auto;
  width: 65px;
  height: 65px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${backgroundColor || 'black'};
  padding: 0;
  border-radius: 60px;
  font-size: 30px;
  font-weight: bold;
  color: white !important;
  & * {
    color: white !important;
  }
  & svg, & path {
    width: 30px !important;
    height: 30px !important;
  }
  & img {
    width: 42px;
    height: 42px;
  }
  margin-bottom: 8px;
`));

const Text = styled('h3')`
  font-weight: normal;
  font-size: 16px;
  color: black !important;
`;

export default withTheme(withStyles(styles)(ShareModalOption));
