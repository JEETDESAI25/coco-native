/**
 * Chat page for describing the foods eaten each day.
 */

import React, {useContext, useState, useEffect, useRef} from 'react';
import {
  FlatList,
  Alert,
  ActivityIndicator,
  Image,
  StyleSheet,
} from 'react-native';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import {NavigatorContext} from '../contexts/Navigation';
import TopBar from '../components/TopBar';
import SincePicker, {SinceOption} from '../components/SincePicker';
import NWTouchableHighlight from '../primitives/NWTouchableHighlight';
import NWText from '../primitives/NWText';
import {Formik} from 'formik';
import NWView from '../primitives/NWView';
import NWTextInput from '../primitives/NWTextInput';
import {format} from 'date-fns'; // cool package but can create own date format Object from javvascript date
import NWSafeAreaView from '../primitives/NWSafeAreaView';
import NWStatusBar from '../primitives/NWStatusBar';
import {AuthenticationContext} from '../contexts/Authentication';
import {NetworkContext} from '../contexts/Network';
import * as ApiEndpoint from '../constants/ApiEndpoint';

// Type Definition
type MessageStatus = 'sending' | 'sent' | 'error' | 'failed';

interface NutritionInfo {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

interface FoodItem {
  food_text: string;
  quantity_num: string;
  quantity_unit: string;
  food_id: string;
  food_name: string;
  nutrition_info: NutritionInfo;
  alternatives: string[];
  message?: string;
  image_url?: string;
  is_confirmed?: boolean;
}

interface ChatMessage {
  id: string;
  fromMe: boolean;
  text: string;
  date: Date;
  status?: MessageStatus;
  suggestions?: string[];
  foods?: FoodItem[];
}

// Add new interfaces for API responses
interface ChatProcessResponse {
  status: 'processing' | 'error';
  task_id?: string;
  error?: string;
  message?: string;
}

interface ChatConfirmResponse {
  state: 'PENDING' | 'SUCCESS' | 'ERROR';
  result?: {
    meal_id: string;
    foods: FoodItem[];
    suggestions?: string[];
    message?: string;
  };
  error?: string;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  messageContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  messageBubble: {
    padding: 12,
    borderRadius: 16,
    marginVertical: 4,
    maxWidth: '80%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  myMessage: {
    backgroundColor: '#A62A72',
    alignSelf: 'flex-end',
    borderBottomRightRadius: 4,
    marginLeft: '20%',
  },
  theirMessage: {
    backgroundColor: '#FFFFFF',
    alignSelf: 'flex-start',
    borderBottomLeftRadius: 4,
    marginRight: '20%',
  },
  messageText: {
    fontSize: 16,
    color: '#FFFFFF',
    lineHeight: 22,
  },
  theirMessageText: {
    color: '#2D3748',
  },
  messageDate: {
    fontSize: 12,
    color: '#FFFFFF90',
    marginTop: 4,
  },
  theirMessageDate: {
    color: '#718096',
  },
  inputContainer: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    padding: 12,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F7FAFC',
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    marginLeft: 8,
    color: '#2D3748',
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#A62A72',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  suggestionContainer: {
    marginTop: 8,
    padding: 8,
    backgroundColor: '#F7FAFC',
    borderRadius: 8,
  },
  suggestionText: {
    fontSize: 14,
    color: '#4A5568',
    marginVertical: 2,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  pendingFoodCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  confirmedFoodCard: {
    backgroundColor: '#F7FAFC',
  },
  nutritionContainer: {
    backgroundColor: '#F7FAFC',
    padding: 8,
    borderRadius: 8,
    marginTop: 8,
  },
  nutritionText: {
    fontSize: 12,
    color: '#4A5568',
    lineHeight: 16,
  },
  messageStatus: {
    fontSize: 10,
    color: '#718096',
    marginTop: 4,
  },
});

const Chat: React.FC = () => {
  const navigator = useContext(NavigatorContext);
  const {token, signOut} = useContext(AuthenticationContext);
  const {fetch} = useContext(NetworkContext);

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [sinceOption, setSinceOption] = useState<SinceOption>(
    SinceOption.Today,
  );
  const pollInterval = useRef<NodeJS.Timeout | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [pendingFoods, setPendingFoods] = useState<FoodItem[]>([]);
  const [currentMealId, setCurrentMealId] = useState<string | null>(null);
  const userId = token || '';
  const [isHistoryLoading, setIsHistoryLoading] = useState(false);

  // Memoize loadMessageHistory to prevent infinite loops
  const loadMessageHistory = React.useCallback(async () => {
    // Add loading check
    if (isHistoryLoading || !userId || !token || !fetch) return;

    let isMounted = true;
    setIsHistoryLoading(true);

    try {
      const response = await fetch({
        resource: ApiEndpoint.getMeals,
        options: {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            user_id: userId,
            since: sinceOption.toString().toLowerCase(),
          }),
        },
      });

      if (!response.isOk) {
        throw new Error(
          response.data?.error || 'Failed to load message history',
        );
      }

      const data = response.data as {messages: ChatMessage[]};
      if (!Array.isArray(data.messages)) {
        throw new Error('Invalid response format');
      }

      if (isMounted) {
        setMessages(prev => {
          const newMessages = data.messages.map(msg => ({
            ...msg,
            date: new Date(msg.date),
          }));
          return newMessages;
        });
      }
    } catch (error) {
      if (isMounted) {
        console.error('Load history error:', error);
        const errorMessage = handleApiError(
          error as ApiError,
          'Failed to load message history',
        );
        if (errorMessage.includes('unauthorized')) {
          signOut?.();
        }
      }
    } finally {
      if (isMounted) {
        setIsHistoryLoading(false);
      }
    }

    return () => {
      isMounted = false;
    };
  }, [userId, token, fetch, sinceOption, signOut, isHistoryLoading]);

  useEffect(() => {
    const cleanup = loadMessageHistory();
    return () => {
      cleanup?.();
    };
  }, [loadMessageHistory]);

  // Add function to filter messages based on sinceOption
  const getFilteredMessages = () => {
    if (messages.length === 0) return [];

    const now = new Date();
    const startOfDay = new Date(now);
    startOfDay.setHours(0, 0, 0, 0);

    try {
      switch (sinceOption) {
        case SinceOption.Today:
          return messages.filter(msg => new Date(msg.date) >= startOfDay);
        case SinceOption.LastWeek:
          const weekAgo = new Date(now);
          weekAgo.setDate(weekAgo.getDate() - 7);
          return messages.filter(msg => new Date(msg.date) >= weekAgo);
        case SinceOption.LastMonth:
          const monthAgo = new Date(now);
          monthAgo.setMonth(monthAgo.getMonth() - 1);
          return messages.filter(msg => new Date(msg.date) >= monthAgo);
        case SinceOption.Yesterday:
          const yesterday = new Date(now);
          yesterday.setDate(yesterday.getDate() - 1);
          yesterday.setHours(0, 0, 0, 0);
          return messages.filter(msg => new Date(msg.date) >= yesterday);
        case SinceOption.LastYear:
          const yearAgo = new Date(now);
          yearAgo.setFullYear(yearAgo.getFullYear() - 1);
          return messages.filter(msg => new Date(msg.date) >= yearAgo);
        default:
          return messages;
      }
    } catch (error) {
      console.error('Error filtering messages:', error);
      return messages;
    }
  };

  useEffect(() => {
    // Cleanup on unmount
    return () => {
      if (pollInterval.current) {
        clearInterval(pollInterval.current);
      }
    };
  }, []);

  const handleApiError = (error: ApiError, defaultMessage: string) => {
    const errorMessage =
      error?.response?.data?.error || error.message || defaultMessage;
    console.error(defaultMessage, error);
    Alert.alert('Error', errorMessage);
    return errorMessage;
  };

  const startPolling = (taskId: string) => {
    if (pollInterval.current) {
      clearInterval(pollInterval.current);
    }

    let attempts = 0;
    const maxAttempts = 24; // 2 minutes maximum polling time
    const pollIntervalTime = 5000; // 5 seconds

    const poll = async () => {
      try {
        attempts++;
        if (attempts >= maxAttempts) {
          throw new Error('Processing timeout - please try again');
        }

        const response = await fetch({
          resource: ApiEndpoint.chatConfirm,
          options: {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              task_id: taskId,
              user_id: userId,
              action: 'poll',
            }),
          },
        });

        if (!response.isOk) {
          throw new Error(response.data?.error || 'Failed to check status');
        }

        const data = response.data as ChatConfirmResponse;
        handlePollResponse(data);
      } catch (error) {
        handlePollError(error);
      }
    };

    pollInterval.current = setInterval(poll, pollIntervalTime);
    poll(); // Initial poll
  };

  // Helper function to update the last message
  const updateLastMessage = (
    suggestions?: string[],
    foods?: FoodItem[],
    status?: MessageStatus,
  ) => {
    setMessages(prev => {
      const newMessages = [...prev];
      const lastMessage = newMessages[newMessages.length - 1];
      if (lastMessage?.status === 'sending') {
        lastMessage.status = status || 'sent';
        lastMessage.suggestions = suggestions;
        lastMessage.foods = foods;
      }
      return newMessages;
    });
  };

  const handleSendMessage = async (text: string) => {
    if (!text.trim() || !userId) return;

    setIsLoading(true);
    setIsProcessing(true);

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      fromMe: true,
      text,
      date: new Date(),
      status: 'sending',
    };

    setMessages(prev => [...prev, newMessage]);

    try {
      const response = await fetch({
        resource: ApiEndpoint.chatProcess,
        options: {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            user_id: userId,
            message: text,
            date: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
          }),
        },
      });

      if (!response.isOk) {
        throw new Error(response.data?.error || 'Failed to process message');
      }

      const data = response.data as ChatProcessResponse;
      if (data.status === 'processing' && data.task_id) {
        startPolling(data.task_id);
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error: unknown) {
      if (
        error instanceof Error ||
        (error && typeof error === 'object' && 'message' in error)
      ) {
        handleApiError(error as ApiError, 'Failed to send message');
      } else {
        console.error('An unexpected error occurred:', error);
      }
      updateLastMessage([], [], 'failed');
    } finally {
      setIsLoading(false);
      setIsProcessing(false);
    }
  };

  const renderFoodItem = (food: FoodItem) => (
    <NWView
      key={food.food_id}
      className={['overflow-hidden', food.is_confirmed ? 'opacity-80' : '']
        .join(' ')
        .trim()}
      style={[
        styles.pendingFoodCard,
        food.is_confirmed && styles.confirmedFoodCard,
      ]}>
      {food.image_url && (
        <Image
          source={{uri: food.image_url}}
          style={{width: '100%', height: 140}}
          resizeMode="cover"
        />
      )}
      <NWView className="p-5">
        <NWText className="text-xl font-semibold text-gray-800 mb-2">
          {food.quantity_num} {food.quantity_unit} {food.food_text}
        </NWText>

        {food.message && (
          <NWText className="text-amber-500 italic text-sm mb-3">
            {food.message}
          </NWText>
        )}

        <NWView style={styles.nutritionContainer}>
          <NWText style={styles.nutritionText}>
            {food.nutrition_info.calories} calories •{' '}
            {food.nutrition_info.protein}g protein • {food.nutrition_info.carbs}
            g carbs • {food.nutrition_info.fat}g fat
          </NWText>
        </NWView>

        {food.alternatives.length > 0 && (
          <NWView className="mt-2">
            <NWText className="text-xs text-gray-500 font-medium">
              Healthier alternatives:
            </NWText>
            <NWText className="text-xs text-gray-600">
              {food.alternatives.join(', ')}
            </NWText>
          </NWView>
        )}
        {!food.is_confirmed && (
          <NWView className="flex-row justify-end mt-4">
            <NWTouchableHighlight
              className="bg-[#C678A6] px-6 py-3 rounded-lg"
              onPress={() => handleConfirmFood(food)}>
              <NWText className="text-white font-medium">Confirm</NWText>
            </NWTouchableHighlight>
          </NWView>
        )}
      </NWView>
    </NWView>
  );

  const handleConfirmFood = async (food: FoodItem) => {
    if (!currentMealId) return;

    try {
      const response = await fetch({
        resource: ApiEndpoint.chatConfirm,
        options: {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            task_id: currentMealId,
            user_id: userId,
            date: format(new Date(), 'M_d_yyyy_H_m'),
            meal_id: currentMealId,
            foods: [{...food, is_confirmed: true}],
            action: 'confirm',
          }),
        },
      });

      if (!response.isOk) {
        throw new Error('Failed to confirm food');
      }

      setPendingFoods(prev =>
        prev.map(f =>
          f.food_id === food.food_id ? {...f, is_confirmed: true} : f,
        ),
      );
    } catch (error) {
      console.error('Error confirming food:', error);
      Alert.alert('Error', 'Failed to confirm food item');
    }
  };

  const renderFoodConfirmation = () => (
    <NWView className="p-4 bg-white border-t border-gray-200">
      {pendingFoods.map((food, index) => (
        <NWView key={index} className="mb-4">
          {renderFoodItem(food)}
        </NWView>
      ))}
    </NWView>
  );

  // Render loading overlay when processing
  const renderLoadingOverlay = () =>
    isLoading && (
      <NWView style={styles.loadingOverlay}>
        <ActivityIndicator size="large" color="#C678A6" />
      </NWView>
    );

  const handlePollResponse = (data: ChatConfirmResponse) => {
    switch (data.state) {
      case 'PENDING':
        // Continue polling
        break;
      case 'SUCCESS':
        if (data.result) {
          const {meal_id, foods, suggestions} = data.result;
          setCurrentMealId(meal_id);
          setPendingFoods(foods || []);
          updateLastMessage(suggestions, foods);
          clearInterval(pollInterval.current as NodeJS.Timeout);
          setIsProcessing(false);
        }
        break;
      case 'ERROR':
        throw new Error(data.error || 'Processing failed');
      default:
        throw new Error('Invalid response state');
    }
  };

  const handlePollError = (error: any) => {
    clearInterval(pollInterval.current as NodeJS.Timeout);
    handleApiError(error, 'Failed to process message');
    updateLastMessage([], [], 'error');
  };

  return (
    <NWSafeAreaView className="flex-1">
      <NWStatusBar />
      <TopBar onButtonPress={() => navigator?.openDrawer()} />

      <NWView style={{height: 60, zIndex: 1000}}>
        <SincePicker
          currentSinceOption={sinceOption}
          updateSinceOption={(option: SinceOption) => {
            setSinceOption(option);
            setMessages([]); // Clear current messages before loading new ones
          }}
        />
      </NWView>

      <NWView style={styles.messageContainer}>
        <FlatList
          data={getFilteredMessages()}
          keyExtractor={item => item.id}
          renderItem={({item}) => (
            <NWView
              style={[
                styles.messageBubble,
                item.fromMe ? styles.myMessage : styles.theirMessage,
              ]}>
              <NWText
                style={[
                  styles.messageText,
                  !item.fromMe && styles.theirMessageText,
                ]}>
                {item.text}
              </NWText>
              <NWText
                style={[
                  styles.messageDate,
                  !item.fromMe && styles.theirMessageDate,
                ]}>
                {format(item.date, 'h:mm a')}
              </NWText>
              {item.status && (
                <NWText style={styles.messageStatus}>
                  {item.status.toUpperCase()}
                </NWText>
              )}
              {item.suggestions && (
                <NWView style={styles.suggestionContainer}>
                  {item.suggestions.map((suggestion, index) => (
                    <NWText key={index} style={styles.suggestionText}>
                      • {suggestion}
                    </NWText>
                  ))}
                </NWView>
              )}
            </NWView>
          )}
          inverted
          refreshing={isHistoryLoading}
          onRefresh={loadMessageHistory}
          contentContainerStyle={{paddingVertical: 16}}
        />
      </NWView>

      {pendingFoods.length > 0 && renderFoodConfirmation()}

      <Formik
        initialValues={{text: ''}}
        onSubmit={(values, {resetForm}) => {
          handleSendMessage(values.text);
          resetForm();
        }}>
        {({handleChange, handleBlur, handleSubmit, values}) => (
          <NWView style={styles.inputContainer}>
            <NWView style={styles.inputWrapper}>
              <MaterialIcon name="restaurant" size={24} color="#A62A72" />
              <NWTextInput
                style={styles.input}
                placeholder="What did you eat?"
                placeholderTextColor="#A0AEC0"
                onChangeText={handleChange('text')}
                onBlur={handleBlur('text')}
                value={values.text}
              />
              <NWTouchableHighlight
                style={styles.sendButton}
                onPress={handleSubmit as any}
                disabled={isLoading || isProcessing}>
                {isLoading || isProcessing ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <MaterialIcon name="send" size={20} color="#FFFFFF" />
                )}
              </NWTouchableHighlight>
            </NWView>
          </NWView>
        )}
      </Formik>

      {renderLoadingOverlay()}
    </NWSafeAreaView>
  );
};

export default Chat;

// Add proper error interface
interface ApiError extends Error {
  response?: {
    data?: {
      error?: string;
    };
  };
}
