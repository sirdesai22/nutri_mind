import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

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
    <View
      style={[
        styles.container,
        message.isUser ? styles.userMessage : styles.aiMessage,
      ]}>
      <Text style={styles.messageText}>{message.text}</Text>
      {message.isUser && (
        <TouchableOpacity style={styles.deleteButton} onPress={onDelete}>
          <Ionicons name="trash-outline" size={20} color="#ff4444" />
        </TouchableOpacity>
      )}
    </View>
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
    backgroundColor: '#4CAF50',
  },
  aiMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  messageText: {
    fontSize: 16,
    color: '#333333',
  },
  deleteButton: {
    position: 'absolute',
    top: 8,
    right: 8,
  },
}); 