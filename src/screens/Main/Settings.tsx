import { StyleSheet, Text, View, ScrollView, Switch, TouchableOpacity, SafeAreaView, StatusBar, Platform, Image } from 'react-native'
import React, { useState } from 'react'
import { CameraIcon } from 'react-native-heroicons/outline'

type SettingsSectionProps = {
  title: string
  children: React.ReactNode
}

const SettingsSection = ({ title, children }: SettingsSectionProps) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>{title}</Text>
    <View style={styles.sectionContent}>
      {children}
    </View>
  </View>
)

type SettingsItemProps = {
  title: string
  onPress?: () => void
  value?: boolean
  onValueChange?: (value: boolean) => void
  rightText?: string
}

const SettingsItem = ({ title, onPress, value, onValueChange, rightText }: SettingsItemProps) => (
  <TouchableOpacity 
    style={styles.settingsItem} 
    onPress={onPress}
    disabled={!onPress}
  >
    <View style={styles.settingsItemLeft}>
      <Text style={styles.settingsItemTitle}>{title}</Text>
    </View>
    {onValueChange && <Switch value={value} onValueChange={onValueChange} />}
    {rightText && <Text style={styles.settingsItemRight}>{rightText}</Text>}
    {onPress && <Text style={styles.chevron}>›</Text>}
  </TouchableOpacity>
)

export default function Settings() {
  const [notifications, setNotifications] = useState(true)
  const [darkMode, setDarkMode] = useState(false)
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [profileImage, setProfileImage] = useState(null)

  const handleImagePick = () => {
    // We'll implement this after installing react-native-image-picker
    console.log('Pick image')
  }

  return (
    <SafeAreaView style={styles.safeArea} >
      <StatusBar
        barStyle="dark-content"
        backgroundColor="#f5f5f5"
      />
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        
        {/* Profile Image Section */}
        <View style={styles.profileImageSection}>
          <View style={styles.imageContainer}>
            {profileImage ? (
              <Image 
                source={{ uri: profileImage }} 
                style={styles.profileImage} 
              />
            ) : (
              <View style={styles.placeholderImage}>
                <Text style={styles.placeholderText}>JD</Text>
              </View>
            )}
            <TouchableOpacity 
              style={styles.cameraButton}
              onPress={handleImagePick}
            >
              <CameraIcon size={20} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>

        <SettingsSection title="Account">
          <SettingsItem
            title="Profile"
            onPress={() => {}}
            rightText="John Doe"
          />
          <SettingsItem
            title="Email"
            onPress={() => {}}
            rightText="john@example.com"
          />
          <SettingsItem
            title="Change Password"
            onPress={() => {}}
          />
        </SettingsSection>

        <SettingsSection title="Preferences">
          <SettingsItem
            title="Push Notifications"
            value={notifications}
            onValueChange={setNotifications}
          />
          <SettingsItem
            title="Email Notifications"
            value={emailNotifications}
            onValueChange={setEmailNotifications}
          />
          <SettingsItem
            title="Dark Mode"
            value={darkMode}
            onValueChange={setDarkMode}
          />
        </SettingsSection>

        <SettingsSection title="Help & Support">
          <SettingsItem
            title="FAQ"
            onPress={() => {}}
          />
          <SettingsItem
            title="Contact Support"
            onPress={() => {}}
          />
          <SettingsItem
            title="Terms of Service"
            onPress={() => {}}
          />
          <SettingsItem
            title="Privacy Policy"
            onPress={() => {}}
          />
        </SettingsSection>

        <SettingsSection title="App Info">
          <SettingsItem
            title="Version"
            rightText="1.0.0"
          />
        </SettingsSection>

        <TouchableOpacity style={styles.logoutButton}>
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
    marginLeft: 16,
    marginBottom: 8,
  },
  sectionContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginHorizontal: 16,
    overflow: 'hidden',
  },
  settingsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    justifyContent: 'space-between',
  },
  settingsItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingsItemTitle: {
    fontSize: 16,
    color: '#333',
  },
  settingsItemRight: {
    fontSize: 14,
    color: '#999',
    marginRight: 8,
  },
  chevron: {
    fontSize: 20,
    color: '#666',
  },
  logoutButton: {
    margin: 16,
    backgroundColor: '#ff4444',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  logoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  profileImageSection: {
    alignItems: 'center',
    paddingVertical: 24,
    //backgroundColor: '#fff',
    //marginBottom: 10,
  },
  imageContainer: {
    position: 'relative',
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  placeholderImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 32,
    color: '#666',
    fontWeight: '600',
  },
  cameraButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#b0b098',
    padding: 8,
    borderRadius: 20,
    borderWidth: 3,
    borderColor: '#fff',
  },
})