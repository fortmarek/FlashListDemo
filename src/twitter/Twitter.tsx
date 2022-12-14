import {FlashList, useBenchmark} from '@shopify/flash-list';
import React, {useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  SafeAreaView,
  Alert,
} from 'react-native';

import {tweets} from './data/tweets';
import Tweet from './models/Tweet';
import TweetCell from './TweetCell';

const Twitter = () => {
  const ref = useRef<FlashList<Tweet>>(null);
  const [blankAreaTracker] = useBenchmark(ref, res => {
    if (!res.interrupted) {
      Alert.alert('Blank area', res.formattedString);
    }
  });
  return (
    <SafeAreaView style={{flex: 1}}>
      <FlashList
        estimatedItemSize={150}
        ref={ref}
        onBlankArea={blankAreaTracker}
        keyExtractor={item => {
          return item.id;
        }}
        renderItem={({item}) => {
          return <TweetCell tweet={item} />;
        }}
        ListHeaderComponent={Header}
        ListHeaderComponentStyle={{backgroundColor: '#ccc'}}
        ListFooterComponent={Footer}
        ItemSeparatorComponent={Divider}
        ListEmptyComponent={Empty()}
        data={tweets}
        viewabilityConfig={{
          waitForInteraction: true,
          itemVisiblePercentThreshold: 50,
          minimumViewTime: 1000,
        }}
        onViewableItemsChanged={info => {
          console.log(info);
        }}
      />
    </SafeAreaView>
  );
};

export const Divider = () => {
  return <View style={styles.divider} />;
};

export const Header = () => {
  return (
    <View style={styles.header}>
      <Text style={styles.headerTitle}>New tweets available</Text>
    </View>
  );
};

interface FooterProps {
  isLoading: boolean;
  isPagingEnabled: boolean;
}

export const Footer = ({isLoading, isPagingEnabled}: FooterProps) => {
  return (
    <View style={styles.footer}>
      {isLoading && isPagingEnabled ? (
        <ActivityIndicator />
      ) : (
        <Text style={styles.footerTitle}>No more tweets</Text>
      )}
    </View>
  );
};

export const Empty = () => {
  const title = 'Welcome to your timeline';
  const subTitle =
    "It's empty now but it won't be for long. Start following peopled you'll see Tweets show up here";
  return (
    <View style={styles.emptyComponent} testID="EmptyComponent">
      <Text style={styles.emptyComponentTitle}>{title}</Text>
      <Text style={styles.emptyComponentSubtitle}>{subTitle}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  divider: {
    width: '100%',
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#DDD',
  },
  header: {
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1DA1F2',
  },
  footer: {
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    color: '#FFFFFF',
    padding: 8,
    borderRadius: 12,
    fontSize: 12,
  },
  footerTitle: {
    padding: 8,
    borderRadius: 12,
    fontSize: 12,
  },
  emptyComponentTitle: {
    color: 'black',
    fontSize: 20,
    fontWeight: 'bold',
  },
  emptyComponentSubtitle: {
    color: '#808080',
    padding: 8,
    fontSize: 14,
    textAlign: 'center',
  },
  emptyComponent: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
});

export default Twitter;
