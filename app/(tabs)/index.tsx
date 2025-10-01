import { Image } from 'expo-image';
import * as WebBrowser from 'expo-web-browser';
import React, { useEffect, useMemo, useState } from 'react';
import { Pressable, StyleSheet } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';

import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export default function PortfolioScreen() {
  const projects = useMemo(
    () => [
      'Canteen POS System (Web Based)',
      'Video Game Store w/ ML Models (Web Based)',
      'ITSO (Mobile Based)',
      'Kusinaries (Mobile Based)',
    ],
    []
  );

  // Ko-fi donate handler (replace YOUR_KOFI_USERNAME with your actual Ko-fi username or full page URL)
  const KOFI_URL = 'https://ko-fi.com/rincevergelabas';
  const handleDonate = async () => {
    try {
      await WebBrowser.openBrowserAsync(KOFI_URL);
    } catch (e) {
      // no-op; in rare cases WebBrowser can fail, but this keeps UI responsive
    }
  };

  // API service base URL (set EXPO_PUBLIC_API_BASE_URL for prod; defaults to local dev server)
  const API_BASE = process.env.EXPO_PUBLIC_API_BASE_URL || 'http://localhost:4000';
  const [supporters, setSupporters] = useState<any[]>([]);
  const [loadingSupporters, setLoadingSupporters] = useState(false);

  const fetchSupporters = async () => {
    try {
      setLoadingSupporters(true);
      const resp = await fetch(`${API_BASE}/api/supporters`);
      const data = await resp.json();
      const list = (data?.data || data?.supporters || data) as any[];
      setSupporters(Array.isArray(list) ? list.slice(0, 5) : []);
    } catch (e) {
      setSupporters([]);
    } finally {
      setLoadingSupporters(false);
    }
  };

  useEffect(() => {
    fetchSupporters();
  }, []);

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#E0F7FA', dark: '#0F2024' }}
      headerImage={
        <Image
          source={require('@/assets/images/partial-react-logo.png')}
          style={styles.reactLogo}
        />
      }
    >
      {/* Landing / Hero */}
      <Animated.View entering={FadeInUp.duration(600)} style={[styles.section, styles.hero]}>        
        <ThemedView style={styles.avatarRow}>          
          {/* Avatar */}
          <Image
            source={require('@/assets/images/profile.jpg')}
            style={styles.avatar}
            contentFit="cover"
            transition={300}
          />
          <ThemedView style={{ flex: 1 }}>            
            <ThemedText type="title" style={styles.name}>Rince Vergel L. Abas</ThemedText>
            <ThemedText type="subtitle">Aspiring Software Developer</ThemedText>
          </ThemedView>
        </ThemedView>
        <ThemedText type="default" style={styles.hook}>Need help with your software development?</ThemedText>
        <ThemedText style={styles.tagline}>I design and build impactful mobile & web solutions with a focus on clarity, performance, and user delight.</ThemedText>
      </Animated.View>

      {/* Skills */}
      <Animated.View entering={FadeInUp.delay(150).duration(600)} style={styles.section}>
        <ThemedText type="subtitle">Skills</ThemedText>
        <ThemedText style={styles.skillCategory}>Mobile</ThemedText>
        <ThemedText style={styles.skillLine}>React Native (Expo), Flutter</ThemedText>
        <ThemedText style={styles.skillCategory}>Web</ThemedText>
        <ThemedText style={styles.skillLine}>Vue.js, React.js</ThemedText>
      </Animated.View>

      {/* Projects */}
      <Animated.View entering={FadeInUp.delay(300).duration(600)} style={styles.section}>
        <ThemedText type="subtitle">Projects</ThemedText>
        {projects.map(p => (
          <ThemedText key={p} style={styles.bullet}>• {p}</ThemedText>
        ))}
      </Animated.View>

      {/* About / Bio */}
      <Animated.View entering={FadeInUp.delay(450).duration(600)} style={styles.section}>        
        <ThemedText type="subtitle">About</ThemedText>
        <ThemedText>
          Passionate about crafting clean, maintainable code and learning modern frameworks. I enjoy turning complex problems into simple, elegant interfaces.
        </ThemedText>
      </Animated.View>

      {/* Contact */}
      <Animated.View entering={FadeInUp.delay(600).duration(600)} style={[styles.section, styles.cta]}>        
        <ThemedText type="subtitle">Let’s Connect</ThemedText>
        <ThemedText>Email: rince221@gmail.com</ThemedText>
        <ThemedText>GitHub: Bulalordsss</ThemedText>
        <ThemedText style={styles.muted}>Open to collaboration, internships, and freelance opportunities.</ThemedText>
      </Animated.View>

      {/* Donate */}
      <Animated.View entering={FadeInUp.delay(700).duration(600)} style={[styles.section, styles.cta]}>
        <ThemedText type="subtitle">Support my work</ThemedText>
        <Pressable onPress={handleDonate} style={styles.kofiButton} accessibilityRole="button" accessibilityLabel="Donate on Ko-fi">
          <ThemedText style={styles.kofiButtonText}>☕️ Donate on Ko-fi</ThemedText>
        </Pressable>
        <ThemedText style={styles.muted}>Your support means a lot. Thank you!</ThemedText>
      </Animated.View>

      {/* Recent Supporters (via API service) */}
      <Animated.View entering={FadeInUp.delay(800).duration(600)} style={[styles.section, styles.cta]}>
        <ThemedText type="subtitle">Recent Supporters</ThemedText>
        {loadingSupporters ? (
          <ThemedText style={styles.muted}>Loading…</ThemedText>
        ) : supporters?.length ? (
          supporters.map((s: any, idx: number) => {
            const name = s.from_name || s.supporter_name || s.name || 'Someone';
            const amount = s.amount || s.tier_price;
            return (
              <ThemedText key={`${name}-${idx}`} style={styles.bullet}>
                • {name}{amount ? ` — ${amount}` : ''}
              </ThemedText>
            );
          })
        ) : (
          <ThemedText style={styles.muted}>Be the first to support!</ThemedText>
        )}
        <Pressable onPress={fetchSupporters} style={[styles.kofiButton, { backgroundColor: '#3B82F6' }]} accessibilityRole="button" accessibilityLabel="Refresh supporters">
          <ThemedText style={styles.kofiButtonText}>Refresh</ThemedText>
        </Pressable>
      </Animated.View>

      <ThemedText style={styles.footer}>© {new Date().getFullYear()} Rince Abas</ThemedText>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  hero: {
    paddingTop: 8,
  },
  section: {
    gap: 8,
    marginBottom: 28,
  },
  avatarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 4,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.6)',
    backgroundColor: '#222',
    overflow: 'hidden',
  },
  name: {
    fontSize: 24,
  },
  hook: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 4,
  },
  tagline: {
    opacity: 0.85,
  },
  bullet: {
    marginLeft: 4,
  },
  muted: {
    opacity: 0.6,
    fontSize: 12,
  },
  cta: {
    paddingBottom: 40,
  },
  footer: {
    textAlign: 'center',
    opacity: 0.4,
    fontSize: 10,
    marginBottom: 16,
  },
  reactLogo: {
    height: 180,
    width: 300,
    bottom: 0,
    left: 0,
    position: 'absolute',
    opacity: 0.15,
  },
  skillCategory: { fontWeight: '600', marginTop: 4 },
  skillLine: { opacity: 0.85, fontSize: 13 },
  kofiButton: {
    backgroundColor: '#FF5E5B',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  kofiButtonText: {
    color: '#fff',
    fontWeight: '700',
  },
});
