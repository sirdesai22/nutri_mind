import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Ionicons } from '@expo/vector-icons';
import React, { useCallback, useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, TextInput, TouchableOpacity } from 'react-native';

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

export default function HomeScreen() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [totalCalories, setTotalCalories] = useState(0);
  const [totalMacros, setTotalMacros] = useState({
    carbs: 0,
    protein: 0,
    fats: 0,
  });

  const handleSendMessage = useCallback(async (text: string) => {
    // TODO: Replace with actual Gemini API call
    // Mock response for now
    const mockResponse = {
      calories: 250,
      macros: {
        carbs: 30,
        protein: 15,
        fats: 8,
      },
    };

    const newMessage: Message = {
      id: Date.now().toString(),
      text,
      calories: mockResponse.calories,
      macros: mockResponse.macros,
      isUser: true,
      timestamp: new Date(),
    };

    const aiResponse: Message = {
      id: (Date.now() + 1).toString(),
      text: `This contains approximately ${mockResponse.calories} calories`,
      calories: mockResponse.calories,
      macros: mockResponse.macros,
      isUser: false,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, newMessage, aiResponse]);
    setTotalCalories(prev => prev + mockResponse.calories);
    setTotalMacros(prev => ({
      carbs: prev.carbs + mockResponse.macros.carbs,
      protein: prev.protein + mockResponse.macros.protein,
      fats: prev.fats + mockResponse.macros.fats,
    }));
    setInputText('');
  }, []);

  const handleDeleteMessage = useCallback((messageId: string) => {
    setMessages(prev => {
      const messageToDelete = prev.find(m => m.id === messageId);
      if (messageToDelete && messageToDelete.isUser) {
        setTotalCalories(prev => prev - messageToDelete.calories);
        setTotalMacros(prev => ({
          carbs: prev.carbs - messageToDelete.macros.carbs,
          protein: prev.protein - messageToDelete.macros.protein,
          fats: prev.fats - messageToDelete.macros.fats,
        }));
      }
      return prev.filter(m => m.id !== messageId);
    });
  }, []);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}>
      <ThemedView style={styles.container}>
        {/* Nutrition Summary Card */}
        <ThemedView style={styles.summaryCard}>
          <ThemedText type="title" style={styles.calories}>
            {totalCalories} kcal
          </ThemedText>
          <ThemedView style={styles.macrosContainer}>
            <ThemedView style={styles.macroItem}>
              <ThemedText type="defaultSemiBold">Carbs</ThemedText>
              <ThemedText>{totalMacros.carbs}g</ThemedText>
            </ThemedView>
            <ThemedView style={styles.macroItem}>
              <ThemedText type="defaultSemiBold">Protein</ThemedText>
              <ThemedText>{totalMacros.protein}g</ThemedText>
            </ThemedView>
            <ThemedView style={styles.macroItem}>
              <ThemedText type="defaultSemiBold">Fats</ThemedText>
              <ThemedText>{totalMacros.fats}g</ThemedText>
            </ThemedView>
          </ThemedView>
        </ThemedView>

        {/* Chat Messages */}
        <ScrollView style={styles.messagesContainer}>
          {messages.map(message => (
            <ThemedView
              key={message.id}
              style={[
                styles.messageContainer,
                message.isUser ? styles.userMessage : styles.aiMessage,
              ]}>
              <ThemedText style={message.isUser ? styles.userMessageText : styles.aiMessageText}>
                {message.text}
              </ThemedText>
              {message.isUser && (
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => handleDeleteMessage(message.id)}>
                  <Ionicons name="trash-outline" size={20} color="#ff4444" />
                </TouchableOpacity>
              )}
            </ThemedView>
          ))}
        </ScrollView>

        {/* Input Area */}
        <ThemedView style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={inputText}
            onChangeText={setInputText}
            placeholder="What did you eat?"
            placeholderTextColor="#666"
          />
          <TouchableOpacity
            style={styles.sendButton}
            onPress={() => inputText.trim() && handleSendMessage(inputText.trim())}>
            <Ionicons name="send" size={24} color="#007AFF" />
          </TouchableOpacity>
        </ThemedView>
      </ThemedView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  summaryCard: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  calories: {
    fontSize: 24,
    marginBottom: 8,
  },
  macrosContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  macroItem: {
    alignItems: 'center',
  },
  messagesContainer: {
    flex: 1,
    padding: 16,
  },
  messageContainer: {
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
    maxWidth: '80%',
    position: 'relative',
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#007AFF',
  },
  aiMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#E9E9EB',
  },
  userMessageText: {
    color: '#fff',
  },
  aiMessageText: {
    color: '#000',
  },
  deleteButton: {
    position: 'absolute',
    top: 8,
    right: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    backgroundColor: '#fff',
  },
  input: {
    flex: 1,
    height: 40,
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    paddingHorizontal: 16,
    marginRight: 8,
  },
  sendButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
