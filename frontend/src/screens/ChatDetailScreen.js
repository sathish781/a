import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, FlatList, TextInput,
  TouchableOpacity, KeyboardAvoidingView, Platform, ActivityIndicator, Image, Alert
} from 'react-native';
import GlassScreen from '../components/GlassScreen';
import { useThemeMode } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import api from '../api/client';

// Dynamic imports to prevent crash if native modules aren't linked correctly
let ImagePicker = null;
let Audio = null;

export default function ChatDetailScreen({ route, navigation }) {
  const { userId, userName, bookId } = route.params || {};
  const { theme } = useThemeMode();
  const { user } = useAuth();

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [recording, setRecording] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [modulesReady, setModulesReady] = useState(false);

  const flatListRef = useRef();

  // Load native modules asynchronously
  useEffect(() => {
    async function setupModules() {
      try {
        ImagePicker = await import('expo-image-picker');
        const AudioModule = await import('expo-av');
        Audio = AudioModule.Audio;
        setModulesReady(true);
      } catch (e) {
        console.warn("Native modules for camera/audio not available:", e.message);
      }
    }
    setupModules();
    if (userId) {
      loadConversation();
      const interval = setInterval(loadConversation, 5000);
      return () => clearInterval(interval);
    } else {
      setLoading(false);
    }
  }, [userId]);

  async function loadConversation() {
    if (!userId) return;
    try {
      const res = await api.get(`/messages/${userId}`);
      setMessages(res.data);
    } catch (error) {
      console.log('Load convo error:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleSend(content = '', messageType = 'text', fileUrl = '') {
    if (!content.trim() && !fileUrl) return;

    if (!userId) {
      return Alert.alert('Error', 'Invalid recipient. Cannot send message.');
    }

    if (user && userId === user._id) {
      return Alert.alert('Notice', 'You cannot send a message to yourself.');
    }

    try {
      const payload = {
        receiverId: userId,
        content: content.trim(),
        messageType,
        fileUrl
      };

      // Only include bookId if it is a valid ID (not undefined/null)
      if (bookId) {
        payload.bookId = bookId;
      }

      const res = await api.post('/messages', payload);
      setMessages(prev => [...prev, res.data]);
      setInput('');
      setTimeout(() => flatListRef.current?.scrollToEnd(), 200);
    } catch (error) {
      console.log('Send error:', error.response?.data || error.message);
      Alert.alert('Error', error.response?.data?.message || 'Failed to send message');
    }
  }

  async function pickImage() {
    if (!ImagePicker) return Alert.alert("Error", "Camera module not ready");
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.7,
    });

    if (!result.canceled) {
      uploadFile(result.assets[0].uri, 'image');
    }
  }

  async function startRecording() {
    if (!Audio) return Alert.alert("Error", "Audio module not ready");
    try {
      const permission = await Audio.requestPermissionsAsync();
      if (permission.status !== 'granted') return;

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      setRecording(recording);
    } catch (err) {
      Alert.alert('Error', 'Failed to start recording');
    }
  }

  async function stopRecording() {
    if (!recording) return;
    try {
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      setRecording(undefined);
      uploadFile(uri, 'audio');
    } catch (e) {
      setRecording(undefined);
    }
  }

  async function uploadFile(uri, type) {
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', {
        uri: Platform.OS === 'ios' ? uri.replace('file://', '') : uri,
        type: type === 'image' ? 'image/jpeg' : 'audio/m4a',
        name: type === 'image' ? 'upload.jpg' : 'voice.m4a',
      });

      const res = await api.post('/uploads/file', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      handleSend('', type, res.data.fileUrl);
    } catch (error) {
      Alert.alert('Upload Error', 'Failed to upload file');
    } finally {
      setIsUploading(false);
    }
  }

  async function playAudio(uri) {
    if (!Audio) return;
    const { sound } = await Audio.Sound.createAsync({ uri });
    await sound.playAsync();
  }

  const renderMessage = ({ item }) => {
    const isMe = item.sender === user._id;
    return (
      <View style={[styles.msgWrap, isMe ? styles.myMsg : styles.theirMsg]}>
        <View style={[
          styles.bubble,
          isMe ? { backgroundColor: theme.primary } : { backgroundColor: theme.backgroundTwo }
        ]}>
          {item.messageType === 'image' ? (
            <Image source={{ uri: item.fileUrl }} style={styles.chatImage} resizeMode="cover" />
          ) : item.messageType === 'audio' ? (
            <TouchableOpacity onPress={() => playAudio(item.fileUrl)} style={styles.audioBtn}>
              <Text style={{ color: isMe ? '#fff' : theme.primary }}>▶ Play Voice Note</Text>
            </TouchableOpacity>
          ) : (
            <Text style={[styles.msgText, { color: isMe ? '#fff' : theme.text }]}>
              {item.content}
            </Text>
          )}
        </View>
        <Text style={styles.time}>{new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
      </View>
    );
  };

  return (
    <GlassScreen>
      <View style={[styles.header, { borderBottomColor: theme.glassBorder }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={{ color: theme.primary, fontSize: 24 }}>←</Text>
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.text }]}>{userName}</Text>
        {isUploading && <ActivityIndicator size="small" color={theme.primary} style={{ marginLeft: 10 }} />}
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item._id}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd()}
          renderItem={renderMessage}
          contentContainerStyle={{ padding: 16 }}
        />

        <View style={[styles.inputRow, { backgroundColor: theme.backgroundOne, borderTopColor: theme.glassBorder }]}>
          <TouchableOpacity onPress={pickImage} style={styles.actionBtn}>
            <Text style={{ fontSize: 22 }}>📷</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPressIn={startRecording}
            onPressOut={stopRecording}
            style={[styles.actionBtn, recording && { backgroundColor: theme.danger + '20', borderRadius: 10 }]}
          >
            <Text style={{ fontSize: 22, color: recording ? theme.danger : theme.text }}>🎤</Text>
          </TouchableOpacity>

          <TextInput
            style={[styles.input, { color: theme.text, backgroundColor: theme.backgroundTwo }]}
            value={input}
            onChangeText={setInput}
            placeholder={recording ? "Recording..." : "Type a message..."}
            placeholderTextColor={theme.muted}
            editable={!recording}
          />

          <TouchableOpacity onPress={() => handleSend(input)} style={[styles.sendBtn, { backgroundColor: theme.primary }]}>
            <Text style={styles.sendIcon}>➔</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </GlassScreen>
  );
}

const styles = StyleSheet.create({
  header: { padding: 16, flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, marginTop: 40 },
  backBtn: { marginRight: 15 },
  headerTitle: { fontSize: 18, fontWeight: '900' },
  msgWrap: { marginVertical: 8, maxWidth: '80%' },
  myMsg: { alignSelf: 'flex-end' },
  theirMsg: { alignSelf: 'flex-start' },
  bubble: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20, overflow: 'hidden' },
  msgText: { fontSize: 15, fontWeight: '500' },
  chatImage: { width: 200, height: 200, borderRadius: 10, marginVertical: 5 },
  audioBtn: { paddingVertical: 5, paddingHorizontal: 10 },
  time: { fontSize: 9, color: '#94a3b8', marginTop: 4, alignSelf: 'flex-end' },
  inputRow: { flexDirection: 'row', padding: 12, alignItems: 'center', borderTopWidth: 1 },
  actionBtn: { padding: 8, marginRight: 4 },
  input: { flex: 1, height: 44, borderRadius: 22, paddingHorizontal: 16, fontSize: 15 },
  sendBtn: { width: 44, height: 44, borderRadius: 22, marginLeft: 10, justifyContent: 'center', alignItems: 'center' },
  sendIcon: { color: '#fff', fontSize: 20 },
});