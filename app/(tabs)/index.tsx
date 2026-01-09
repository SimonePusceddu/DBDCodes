import React, { useState, useMemo, useRef } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Text,
  ActivityIndicator,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search, X } from 'lucide-react-native';
import { TouchableOpacity } from 'react-native';
import { useScrollToTop } from '@react-navigation/native';
import { PromoCodesList } from '@/components/codes/PromoCodesList';
import { Toast } from '@/components/ui/Toast';
import { usePromoCodes } from '@/hooks/usePromoCodes';
import { useAppContext } from '@/context/AppContext';
import { DBDColors, Spacing, Typography, BorderRadius } from '@/constants/theme';

export default function HomeScreen() {
  const { state } = useAppContext();
  const scrollRef = useRef<ScrollView>(null);
  const {
    codes,
    isLoading,
  } = usePromoCodes();
  const [searchQuery, setSearchQuery] = useState('');

  useScrollToTop(scrollRef);

  const filteredCodes = useMemo(() => {
    if (!searchQuery.trim()) {
      return codes;
    }
    const query = searchQuery.toLowerCase().trim();
    return codes.filter(
      (code) =>
        code.title.toLowerCase().includes(query) ||
        code.code.toLowerCase().includes(query)
    );
  }, [codes, searchQuery]);

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
        ref={scrollRef}
        style={styles.scrollView}
        contentContainerStyle={styles.content}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Promo</Text>
          <Text style={styles.titleAccent}>Codes</Text>
        </View>

        <View style={styles.searchContainer}>
          <Search size={18} color={DBDColors.text.muted} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by name or code..."
            placeholderTextColor={DBDColors.text.muted}
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoCapitalize="none"
            autoCorrect={false}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity
              onPress={() => setSearchQuery('')}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <X size={18} color={DBDColors.text.muted} />
            </TouchableOpacity>
          )}
        </View>

        <PromoCodesList codes={filteredCodes} />
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: DBDColors.background.secondary,
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    marginBottom: Spacing.lg,
    gap: Spacing.sm,
  },
  searchInput: {
    flex: 1,
    ...Typography.body,
    color: DBDColors.text.primary,
    padding: 0,
  },
});
