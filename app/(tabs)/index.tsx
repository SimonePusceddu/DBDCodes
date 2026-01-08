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
import { PromoCodesList } from '@/components/codes/PromoCodesList';
import { ShrineGrid } from '@/components/shrine/ShrineGrid';
import { Toast } from '@/components/ui/Toast';
import { usePromoCodes } from '@/hooks/usePromoCodes';
import { useShrineOfSecrets } from '@/hooks/useShrineOfSecrets';
import { useAppContext } from '@/context/AppContext';
import { DBDColors, Spacing, Typography } from '@/constants/theme';

export default function HomeScreen() {
  const { state } = useAppContext();
  const {
    codes,
    isLoading,
    isRefreshing,
    refresh: refreshCodes,
  } = usePromoCodes();
  const { shrine, refresh: refreshShrine } = useShrineOfSecrets();

  const handleRefresh = async () => {
    await Promise.all([refreshCodes(), refreshShrine()]);
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={DBDColors.accent.secondary} />
          <Text style={styles.loadingText}>Loading...</Text>
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
          <Text style={styles.title}>DBD</Text>
          <Text style={styles.titleAccent}>Codes</Text>
        </View>

        <PromoCodesList codes={codes} />

        {shrine ? (
          <ShrineGrid perks={shrine.perks} resetTime={shrine.endTime} />
        ) : null}
      </ScrollView>

      <Toast
        message={state.toastMessage || ''}
        visible={!!state.toastMessage}
      />
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
    marginBottom: Spacing.xl,
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
