# Real-Time Stock Feed App

A React Native/Expo application that displays real-time stock prices using WebSocket connections to financial data APIs.

## Features

- **Real-time stock price updates** via WebSocket connection
- **Connection status indicator** showing WebSocket connection state
- **Automatic reconnection** when connection is lost
- **Clean, modern UI** with stock cards showing symbol, price, change, and timestamp
- **Cross-platform support** for iOS, Android, and Web

## Requirements Met

✅ **Create a Live Stock Feed**

- APIs supported: Mockly.me WebSocket streams

✅ **WebSocket endpoint connection**

- Uses `https://mockly.me/docs/websocket/stream` for live financial data
- Subscribes to multiple popular stocks (AAPL, GOOGL, MSFT, AMZN, TSLA, META, NVDA, NFLX)

✅ **Real-time data display**

- Live updates displayed in a scrollable FlatList
- Shows current price, price change, percentage change, and timestamp

## Libraries and Technologies Used

### Core Technologies

- **React Native** (0.81.5) - Mobile app framework
- **Expo** (~54.0.20) - Development platform and build tools
- **TypeScript** (~5.9.2) - Type safety and better development experience

### Navigation & Routing

- **Expo Router** (~6.0.13) - File-based routing system
- **@react-navigation/native** (^7.1.8) - Navigation library
- **@react-navigation/bottom-tabs** (^7.4.0) - Tab navigation

### UI Components & Styling

- **React Native built-in components**: SafeAreaView, FlatList, Text, View, StyleSheet
- **Expo Status Bar** (~3.0.8) - Status bar management
- **Custom styled components** with modern card-based design

### WebSocket Implementation

- **Native WebSocket API** - Built-in browser/React Native WebSocket support
- **Finnhub WebSocket API** - Financial data provider (demo token included)

### Development Tools

- **ESLint** (^9.25.0) - Code linting
- **Expo CLI tools** - Development and building

## API Integration

### APIs

- **Mockly.me**: https://mockly.me/docs/websocket/stream
- **OpenPublicAPIs Finnhub**: https://openpublicapis.com/api/finnhub

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npm start
   # or
   npx expo start
   ```

development build, Android emulator, iOS simulator, or Expo Go.

3. **Run on specific platforms**:

   ```bash
   # iOS
   npm run ios

   # Android
   npm run android

   # Web
   npm run web
   ```

## Project Structure

```
app/
├── _layout.tsx          # Root layout with navigation setup
├── index.tsx            # Main stock feed screen (TypeScript)
package.json             # Dependencies and scripts
README.md               # This documentation
```

## Building for Production

### Android APK

```bash
expo build:android
```

### iOS IPA

```bash
expo build:ios
```

### Expo Development Build

```bash
# Create development build
expo install expo-dev-client
expo run:android
expo run:ios
```

## Configuration

### API Key Setup (Production)

Replace the demo token in the WebSocket URL:

```javascript
const ws = new WebSocket("wss://mockly.me/ws/stream/UNIQUE_CLIENT_ID_HERE");
```

### Customization

- **Add more stocks**: Modify the `symbols` array in the WebSocket connection
- **Update refresh rate**: Currently updates in real-time as data arrives
- **Styling**: Modify the `styles` object to customize appearance
- **Error handling**: Enhanced error states and retry logic included

## Performance Features

- **Efficient updates**: Only updates prices when new data arrives
- **Memory management**: Limits stored data to latest 20 updates
- **Smooth scrolling**: Optimized FlatList with proper key extraction
- **Connection management**: Automatic cleanup and reconnection

## Testing

The app has been tested on:

- ✅ iOS Simulator
- ✅ Android Emulator
- ✅ Expo Web
- ✅ Physical devices (iOS/Android)

## Deliverables Completed

✅ **Source code** - Complete React Native/Expo implementation
✅ **Android and iOS builds** - Ready for testing with `expo build` commands
✅ **Libraries documentation** - All dependencies and APIs documented above

## Troubleshooting

### Connection Issues

- Check internet connection
- Verify API key if using production Finnhub token
- Monitor console logs for WebSocket connection status

### Build Issues

- Run `expo doctor` to check for configuration issues
- Clear cache: `expo r -c`
- Update Expo CLI: `npm install -g @expo/cli@latest`

## Learn More

- [Expo documentation](https://docs.expo.dev/)
- [React Native documentation](https://reactnative.dev/)
