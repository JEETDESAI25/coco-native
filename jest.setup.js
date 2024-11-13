// Mock vector icons
jest.mock('react-native-vector-icons/MaterialIcons', () => 'MaterialIcons');
jest.mock('react-native-vector-icons/FontAwesome5', () => 'FontAwesome5');

// Mock Nativewind
jest.mock('nativewind', () => ({
  styled: jest.fn((component) => {
    const StyledComponent = (props) => ({
      type: component,
      props: {
        ...props,
        'data-testid': props.testID,
        onClick: props.onPress
      },
      children: props.children
    });
    return StyledComponent;
  })
}));

// Mock React Native components
jest.mock('react-native', () => ({
  TouchableHighlight: jest.fn(({ children, onPress, testID, ...props }) => ({
    type: 'button',
    props: {
      ...props,
      onClick: onPress,
      'data-testid': testID,
      accessibilityRole: 'button'
    },
    children
  })),
  Text: jest.fn(({ children, testID, onPress, ...props }) => ({
    type: 'text',
    props: {
      ...props,
      onClick: onPress,
      'data-testid': testID
    },
    children
  })),
  View: jest.fn(({ children, testID, ...props }) => ({
    type: 'view',
    props: {
      ...props,
      'data-testid': testID
    },
    children
  })),
  Image: jest.fn(({ source, testID, ...props }) => ({
    type: 'image',
    props: {
      ...props,
      src: source,
      'data-testid': testID
    }
  })),
  SafeAreaView: jest.fn(({ children, ...props }) => ({
    type: 'view',
    props,
    children
  })),
  StatusBar: jest.fn(() => null),
  Linking: {
    canOpenURL: jest.fn(() => Promise.resolve(true)),
    openURL: jest.fn()
  },
  Alert: {
    alert: jest.fn()
  },
  Platform: {
    select: jest.fn(obj => obj.ios)
  }
}));

// Mock Linking
jest.mock('react-native/Libraries/Linking/Linking', () => ({
  canOpenURL: jest.fn(() => Promise.resolve(true)),
  openURL: jest.fn(),
}));

// Mock Alert
jest.mock('react-native/Libraries/Alert/Alert', () => ({
  alert: jest.fn(),
}));

// Mock StyleSheet
jest.mock('react-native/Libraries/StyleSheet/StyleSheet', () => ({
  create: jest.fn(),
}));

// Mock react-native-modal
jest.mock('react-native-modal', () => 'Modal');