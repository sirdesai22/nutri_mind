import { analyzeFood } from '@/utils/gemini';
import { storage } from '@/utils/storage';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useEffect, useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

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
  associatedMessageId?: string;
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

  const resetState = () => {
    setMessages([]);
    setTotalCalories(0);
    setTotalMacros({
      carbs: 0,
      protein: 0,
      fats: 0,
    });
  };

  // Load initial data when component mounts
  useEffect(() => {
    loadInitialData();
  }, []);

  // Reset state when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      const checkAndResetData = async () => {
        const today = new Date().toISOString().split('T')[0];
        const data = await storage.getDailyData(today);
        if (!data) {
          resetState();
        }
      };
      checkAndResetData();
    }, [])
  );

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

  const handleSendMessage = useCallback(async (text: string) => {
    const userMessageId = `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    try {
      setIsLoading(true);
      
      const userMessage: Message = {
        id: userMessageId,
        text,
        calories: 0,
        macros: { carbs: 0, protein: 0, fats: 0 },
        isUser: true,
        timestamp: new Date(),
      };

      // Add user message first
      setMessages(prev => [...prev, userMessage]);

      const nutritionInfo = await analyzeFood(text);
      
      if (!nutritionInfo || !nutritionInfo.calories || !nutritionInfo.macros) {
        throw new Error('Invalid nutrition information received');
      }

      const aiMessageId = `ai-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const aiMessage: Message = {
        id: aiMessageId,
        text: `This contains approximately ${nutritionInfo.calories} calories\n\nMacros:\nCarbs: ${nutritionInfo.macros.carbs}g\nProtein: ${nutritionInfo.macros.protein}g\nFats: ${nutritionInfo.macros.fats}g`,
        calories: nutritionInfo.calories,
        macros: nutritionInfo.macros,
        isUser: false,
        timestamp: new Date(),
        associatedMessageId: userMessageId,
      };

      const updatedUserMessage: Message = {
        ...userMessage,
        calories: nutritionInfo.calories,
        macros: nutritionInfo.macros,
      };

      // Update messages with both user and AI messages
      setMessages(prev => 
        prev.map(msg => 
          msg.id === userMessageId ? updatedUserMessage : msg
        ).concat(aiMessage)
      );

      // Update totals
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
      console.log('existingData', existingData);

      const newMeal = {
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        food: text,
        calories: nutritionInfo.calories,
        macros: nutritionInfo.macros
      };

      console.log('newMeal', newMeal);

      const updatedData = {
        ...existingData,
        meals: [...existingData.meals, newMeal],
        totalCalories: existingData.totalCalories + nutritionInfo.calories,
        totalCarbs: existingData.totalCarbs + nutritionInfo.macros.carbs,
        totalProtein: existingData.totalProtein + nutritionInfo.macros.protein,
        totalFats: existingData.totalFats + nutritionInfo.macros.fats
      };
      console.log('updatedData', updatedData);

      await storage.saveDailyData(today, updatedData);
      setInputText('');
    } catch (error) {
      console.error('Error in handleSendMessage:', error);
      Alert.alert(
        'Error',
        'Failed to analyze food item. Please try again.',
        [{ text: 'OK' }]
      );
      // Remove the user message if it was added
      setMessages(prev => prev.filter(msg => msg.id !== userMessageId));
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleDeleteMessage = useCallback((messageId: string) => {
    try {
      setMessages(prev => {
        const messageToDelete = prev.find(m => m.id === messageId);
        if (!messageToDelete) return prev;

        const associatedMessage = prev.find(m => 
          m.associatedMessageId === messageId || m.id === messageToDelete.associatedMessageId
        );

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

        const updatedMessages = prev.filter(m => 
          m.id !== messageId && 
          m.id !== associatedMessage?.id
        );

        // Update storage with the new state
        const today = new Date().toISOString().split('T')[0];
        const updatedMeals = updatedMessages
          .filter(m => m.isUser)
          .map(m => ({
            time: m.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            food: m.text,
            calories: m.calories,
            macros: m.macros
          }));

        const totalCal = updatedMessages.reduce((sum, m) => sum + (m.isUser ? m.calories : 0), 0);
        const totalMac = updatedMessages.reduce((acc, m) => {
          if (m.isUser) {
            acc.carbs += m.macros.carbs;
            acc.protein += m.macros.protein;
            acc.fats += m.macros.fats;
          }
          return acc;
        }, { carbs: 0, protein: 0, fats: 0 });

        // Save to storage in the background
        storage.saveDailyData(today, {
          date: today,
          totalCalories: totalCal,
          totalCarbs: totalMac.carbs,
          totalProtein: totalMac.protein,
          totalFats: totalMac.fats,
          meals: updatedMeals
        }).catch(error => {
          console.error('Error saving to storage:', error);
        });

        return updatedMessages;
      });
    } catch (error) {
      console.error('Error in handleDeleteMessage:', error);
      Alert.alert(
        'Error',
        'Failed to delete message. Please try again.',
        [{ text: 'OK' }]
      );
    }
  }, []);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}>
      <View style={styles.container}>
        {/* Nutrition Summary Card */}
        <View style={styles.summaryCard}>
          <Text style={styles.calories}>
            {totalCalories} kcal
          </Text>
          <View style={styles.macrosContainer}>
            <View style={styles.macroItem}>
              <Text style={styles.macroLabel}>Carbs</Text>
              <Text style={styles.macroValue}>{Math.round(totalMacros.carbs)}g</Text>
            </View>
            <View style={styles.macroItem}>
              <Text style={styles.macroLabel}>Protein</Text>
              <Text style={styles.macroValue}>{Math.round(totalMacros.protein)}g</Text>
            </View>
            <View style={styles.macroItem}>
              <Text style={styles.macroLabel}>Fats</Text>
              <Text style={styles.macroValue}>{Math.round(totalMacros.fats)}g</Text>
            </View>
          </View>
        </View>

        {/* Chat Messages */}
        <ScrollView style={styles.messagesContainer}>
          {messages.map((message, index) => (
            <View
              key={index}
              style={[
                styles.messageContainer,
                message.isUser ? styles.userMessage : styles.aiMessage,
              ]}>
              <Text style={message.isUser ? styles.userMessageText : styles.aiMessageText}>
                {message.text}
              </Text>
              {message.isUser && (
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => handleDeleteMessage(message.id)}>
                  <Ionicons name="trash-outline" size={20} color="#ff4444" />
                </TouchableOpacity>
              )}
            </View>
          ))}
        </ScrollView>

        {/* Input Area */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={inputText}
            onChangeText={setInputText}
            placeholder="What did you eat?"
            placeholderTextColor="#666666"
            editable={!isLoading}
          />
          <TouchableOpacity
            style={[styles.sendButton, isLoading && styles.sendButtonDisabled]}
            onPress={() => inputText.trim() && !isLoading && handleSendMessage(inputText.trim())}
            disabled={isLoading}>
            <Ionicons 
              name={isLoading ? "hourglass-outline" : "send"} 
              size={24} 
              color={isLoading ? "#666666" : "#4CAF50"} 
            />
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  summaryCard: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    backgroundColor: '#FFFFFF',
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
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 8,
  },
  macrosContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  macroItem: {
    alignItems: 'center',
  },
  macroLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 4,
  },
  macroValue: {
    fontSize: 16,
    color: '#666666',
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
    backgroundColor: '#4CAF50',
  },
  aiMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  userMessageText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  aiMessageText: {
    color: '#333333',
    fontSize: 16,
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
    borderTopColor: '#E0E0E0',
    backgroundColor: '#FFFFFF',
  },
  input: {
    flex: 1,
    height: 48,
    backgroundColor: '#F5F5F5',
    borderRadius: 24,
    paddingHorizontal: 16,
    marginRight: 8,
    fontSize: 16,
    color: '#333333',
  },
  sendButton: {
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
});
