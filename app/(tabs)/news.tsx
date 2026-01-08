import React from 'react';
import {
  View,
  ScrollView,
  RefreshControl,
  StyleSheet,
  Text,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Newspaper } from 'lucide-react-native';
import { NewsCard } from '@/components/news/NewsCard';
import { useNews } from '@/hooks/useNews';
import { DBDColors, Spacing, Typography } from '@/constants/theme';

export default function NewsScreen() {
  const { news, refresh } = useNews();
  const [isRefreshing, setIsRefreshing] = React.useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refresh();
    setIsRefreshing(false);
  };

  if (!news) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={DBDColors.accent.secondary} />
          <Text style={styles.loadingText}>Loading News...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            tintColor={DBDColors.accent.secondary}
            colors={[DBDColors.accent.secondary]}
            progressBackgroundColor={DBDColors.background.secondary}
          />
        }
      >
        <View style={styles.header}>
          <Text style={styles.title}>Latest</Text>
          <Text style={styles.titleAccent}>News</Text>
        </View>

        <View style={styles.headerRow}>
          <Newspaper size={20} color={DBDColors.text.muted} />
          <Text style={styles.subtitle}>
            {news.items.length} articles from Steam
          </Text>
        </View>

        {news.items.map((item) => (
          <NewsCard key={item.id} item={item} />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: DBDColors.background.primary,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: Spacing.lg,
    paddingBottom: Spacing.xxl,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: Spacing.sm,
    gap: Spacing.sm,
  },
  title: {
    ...Typography.header,
    color: DBDColors.text.primary,
  },
  titleAccent: {
    ...Typography.header,
    color: DBDColors.accent.secondary,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  subtitle: {
    ...Typography.body,
    color: DBDColors.text.muted,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing.md,
  },
  loadingText: {
    ...Typography.body,
    color: DBDColors.text.muted,
  },
});
