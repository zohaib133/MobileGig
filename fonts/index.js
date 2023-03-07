import { Platform } from 'react-native'

const DEFAULT = {
  black: 'Montserrat-Black',
  bold: 'Montserrat-Bold',
  extraBold: 'Montserrat-ExtraBold',
  extraLight: 'Montserrat-ExtraLight',
  light: 'Montserrat-Light',
  medium: 'Montserrat-Medium',
  regular: 'Montserrat-Regular',
  semiBold: 'Montserrat-SemiBold',
  thin: 'Montserrat-Thin',
  navigation:"Navigation"
}

const Fonts = Platform.select({
  ios: DEFAULT,
  android: DEFAULT,
})

export default Fonts