/* @noflow */

import {
  StyleSheet,
  Platform,
  NavigationExperimental,
} from 'react-native';

const {
  hairlineWidth
} = StyleSheet;

const {
  Header: NavigationHeader,
} = NavigationExperimental;

export const NAVIGATION_HEADER_HEIGHT = NavigationHeader.HEIGHT;
export const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? 20 : 0;

export default StyleSheet.create({
  master: {
    flex: 1,
    backgroundColor: 'black',
  },
  body: {
    flex: 1,
    overflow: 'hidden',
  },
  component: {
    flex: 1,
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: '#F4F4F4',
    height: 40,
    borderTopWidth: hairlineWidth,
    borderTopColor: '#E0E0E0',
  },
  tabsActiveStyle: {
    backgroundColor: '#00B4B4',
  },
  tabLink: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F4F4F4',
  },
  tabLinkText: {
    fontSize: 9,
  },
  leftHeaderLink: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  leftHeaderLinkText: {
    margin: 8,
    color: '#000000',
    fontSize: 14,
  },
  hvCenterWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radiusWrapper: {
    height: 28,
    borderWidth: hairlineWidth,
    borderColor: '#E0E0E0',
    borderRadius: 6,
    overflow: 'hidden',
    backgroundColor: '#F4F4F4',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radiusAny: {
    borderWidth: hairlineWidth,
    borderColor: '#29ccb1',
    borderRadius: 6,
    overflow: 'hidden',
    backgroundColor: '#29ccb1',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: 6,
    paddingRight: 6,
    marginLeft: 12,
    marginRight: 12,
  },
  radiusLeft: {
    borderTopLeftRadius: 6,
    borderBottomLeftRadius: 6
  },
  radiusRight: {
    borderTopRightRadius: 6,
    borderBottomRightRadius: 6
  },
  titleText: {
    color: '#333333',
    fontSize: 14,
  },
  labelText: {
    color: '#333333',
    fontSize: 20,
  },
  switcher: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  switcherLinkActive: {
    backgroundColor: '#00B4B4',
  },
  homeSwitcher: {
    marginTop: 8,
    height: 26,
  },
  discoverSwitcher: {
    flex: 1,
    padding: 4,
    height: 32,
    borderWidth: hairlineWidth,
    borderColor: '#CECAFE',
    borderRadius: 10,
    overflow: 'hidden',
  },
  feedSwitcher: {
    height: 28,
  },
  switcherTabLinkTextWrapper: {
    flex: 1,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notifications: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  header: {
    backgroundColor: '#00B4B4',
    elevation: 0
  },
  discover: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  textfield: {
    height: 26, // have to do it on iOS
    marginTop: 8,
  },
  main: {
    flex: 1,
    marginTop: NAVIGATION_HEADER_HEIGHT,
  },
  switchHeader: {
    backgroundColor: '#F4F4F4',
    borderBottomColor: '#E0E0E0',
    elevation: 0,
    borderBottomWidth: hairlineWidth
  },
  disclosureIndicator: {
    width: 10,
    height: 10,
    marginLeft: 7,
    backgroundColor: 'transparent',
    borderTopWidth: 1,
    borderRightWidth: 1,
    borderColor: '#c7c7cc',
    transform: [{
      rotate: '45deg',
    }],
  },
});