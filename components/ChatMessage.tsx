import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { ThemedText } from './ThemedText';
import { ThemedView } from './ThemedView';

interface Message {
  id: string;
  text: string;
  calories: number;
  macros: {
    carbs: number;
    protein: number;
    fats: number;
  };
  isUser: boolean;
  timestamp: Date;
}

interface ChatMessageProps {
  message: Message;
  onDelete: () => void;
}

export function ChatMessage({ message, onDelete }: ChatMessageProps) {
  return (
    <ThemedView
      style={[
        styles.container,
        message.isUser ? styles.userMessage : styles.aiMessage,
      ]}>
      <ThemedText>{message.text}</ThemedText>
      {message.isUser && (
        <TouchableOpacity style={styles.deleteButton} onPress={onDelete}>
          <Ionicons name="trash-outline" size={20} color="#ff4444" />
        </TouchableOpacity>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
    maxWidth: '80%',
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#007AFF',
  },
  aiMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#E9E9EB',
  },
  deleteButton: {
    position: 'absolute',
    top: 8,
    right: 8,
  },
}); 