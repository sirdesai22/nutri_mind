import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { analyzeFood } from '@/utils/gemini';
import { storage } from '@/utils/storage';
import { Ionicons } from '@expo/vector-icons';
import React, { useCallback, useEffect, useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, TextInput, TouchableOpacity } from 'react-native';

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
  associatedMessageId?: string; // Reference to the paired message
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
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = useCallback(async (text: string) => {
    const userMessageId = Date.now().toString();
    try {
      setIsLoading(true);
      
      // Create user message first
      const userMessage: Message = {
        id: userMessageId,
        text,
        calories: 0,
        macros: { carbs: 0, protein: 0, fats: 0 },
        isUser: true,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, userMessage]);

      // Get nutrition info from Gemini
      const nutritionInfo = await analyzeFood(text);

      // Create AI response
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: `This contains approximately ${nutritionInfo.calories} calories\n\nMacros:\nCarbs: ${nutritionInfo.macros.carbs}g\nProtein: ${nutritionInfo.macros.protein}g\nFats: ${nutritionInfo.macros.fats}g`,
        calories: nutritionInfo.calories,
        macros: nutritionInfo.macros,
        isUser: false,
        timestamp: new Date(),
        associatedMessageId: userMessageId,
      };

      // Update user message with nutrition info
      const updatedUserMessage: Message = {
        ...userMessage,
        calories: nutritionInfo.calories,
        macros: nutritionInfo.macros,
      };

      setMessages(prev => 
        prev.map(msg => 
          msg.id === userMessageId ? updatedUserMessage : msg
        ).concat(aiMessage)
      );

      setTotalCalories(prev => prev + nutritionInfo.calories);
      setTotalMacros(prev => ({
        carbs: prev.carbs + nutritionInfo.macros.carbs,
        protein: prev.protein + nutritionInfo.macros.protein,
        fats: prev.fats + nutritionInfo.macros.fats,
      }));

      // Save to storage
      const today = new Date().toISOString().split('T')[0];
      const existingData = await storage.getDailyData(today) || {
        date: today,
        totalCalories: 0,
        totalCarbs: 0,
        totalProtein: 0,
        totalFats: 0,
        meals: []
      };

      existingData.meals.push({
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        food: text,
        calories: nutritionInfo.calories,
        macros: nutritionInfo.macros
      });

      existingData.totalCalories += nutritionInfo.calories;
      existingData.totalCarbs += nutritionInfo.macros.carbs;
      existingData.totalProtein += nutritionInfo.macros.protein;
      existingData.totalFats += nutritionInfo.macros.fats;

      await storage.saveDailyData(today, existingData);

      setInputText('');
    } catch (error) {
      Alert.alert(
        'Error',
        'Failed to analyze food item. Please try again.',
        [{ text: 'OK' }]
      );
      // Remove the user message if there was an error
      setMessages(prev => prev.filter(msg => msg.id !== userMessageId));
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleDeleteMessage = useCallback((messageId: string) => {
    setMessages(prev => {
      const messageToDelete = prev.find(m => m.id === messageId);
      if (!messageToDelete) return prev;

      // Find the associated message (AI response or user message)
      const associatedMessage = prev.find(m => 
        m.associatedMessageId === messageId || m.id === messageToDelete.associatedMessageId
      );

      // Update totals - handle both user and AI messages
      if (messageToDelete.isUser || (associatedMessage && associatedMessage.isUser)) {
        const messageToSubtract = messageToDelete.isUser ? messageToDelete : associatedMessage;
        if (messageToSubtract) {
          setTotalCalories(prev => Math.max(0, prev - messageToSubtract.calories));
          setTotalMacros(prev => ({
            carbs: Math.max(0, prev.carbs - messageToSubtract.macros.carbs),
            protein: Math.max(0, prev.protein - messageToSubtract.macros.protein),
            fats: Math.max(0, prev.fats - messageToSubtract.macros.fats),
          }));
        }
      }

      // Remove both messages
      return prev.filter(m => 
        m.id !== messageId && 
        m.id !== associatedMessage?.id
      );
    });
  }, []);

  useEffect(() => {
    const loadInitialData = async () => {
      const today = new Date().toISOString().split('T')[0];
      const data = await storage.getDailyData(today);
      if (data) {
        setTotalCalories(data.totalCalories);
        setTotalMacros({
          carbs: data.totalCarbs,
          protein: data.totalProtein,
          fats: data.totalFats
        });
        // Convert meals to messages
        const messages = data.meals.flatMap(meal => [
          {
            id: Date.now().toString(),
            text: meal.food,
            calories: meal.calories,
            macros: meal.macros,
            isUser: true,
            timestamp: new Date(),
          },
          {
            id: (Date.now() + 1).toString(),
            text: `This contains approximately ${meal.calories} calories\n\nMacros:\nCarbs: ${meal.macros.carbs}g\nProtein: ${meal.macros.protein}g\nFats: ${meal.macros.fats}g`,
            calories: meal.calories,
            macros: meal.macros,
            isUser: false,
            timestamp: new Date(),
            associatedMessageId: Date.now().toString(),
          }
        ]);
        setMessages(messages);
      }
    };
    loadInitialData();
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
            editable={!isLoading}
          />
          <TouchableOpacity
            style={[styles.sendButton, isLoading && styles.sendButtonDisabled]}
            onPress={() => inputText.trim() && !isLoading && handleSendMessage(inputText.trim())}
            disabled={isLoading}>
            <Ionicons 
              name={isLoading ? "hourglass-outline" : "send"} 
              size={24} 
              color={isLoading ? "#666" : "#4CAF50"} 
            />
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
  sendButtonDisabled: {
    opacity: 0.5,
  },
});
