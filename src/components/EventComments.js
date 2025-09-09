import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, Alert } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { getComments, saveComment } from '../utils/storage';
import { mockComments } from '../data/mockEvents';

const EventComments = ({ eventId, headerContent = null }) => {
  const { theme } = useTheme();
  const { user } = useAuth();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEventComments();
  }, [eventId]);

  const loadEventComments = async () => {
    try {
      setLoading(true);
      const storedComments = await getComments();
      const eventComments = storedComments[eventId] || [];
      
      // Include mock comments for this event
      const mockEventComments = mockComments[eventId] || [];
      
      // Combine mock and stored comments
      const allComments = [...mockEventComments, ...eventComments];
      
      // Sort by timestamp (newest first)
      allComments.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
      
      setComments(allComments);
    } catch (error) {
      console.error('Error loading event comments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) {
      Alert.alert('Error', 'Please enter a comment before posting.');
      return;
    }

    try {
      await saveComment(eventId, newComment.trim(), user);
      setNewComment('');
      await loadEventComments(); // Reload to show new comment
      Alert.alert('Success', 'Your comment has been posted!');
    } catch (error) {
      console.error('Error adding comment:', error);
      Alert.alert('Error', 'Failed to post comment. Please try again.');
    }
  };

  const handleReaction = (commentIndex, reactionType) => {
    // Simple reaction handling - in a real app, this would be stored
    const updatedComments = [...comments];
    if (!updatedComments[commentIndex].reactions) {
      updatedComments[commentIndex].reactions = { like: 0, love: 0, laugh: 0 };
    }
    updatedComments[commentIndex].reactions[reactionType]++;
    setComments(updatedComments);
  };

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const commentTime = new Date(timestamp);
    const diffInHours = Math.floor((now - commentTime) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return `${Math.floor(diffInHours / 24)}d ago`;
  };

  const renderComment = ({ item, index }) => (
    <View style={[styles.commentCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
      <View style={styles.commentHeader}>
        <Text style={[styles.userName, { color: theme.text }]}>{item.userName}</Text>
        <Text style={[styles.timeAgo, { color: theme.textSecondary }]}>
          {formatTimeAgo(item.timestamp)}
        </Text>
      </View>
      
      <Text style={[styles.commentText, { color: theme.text }]}>{item.text}</Text>
      
      <View style={styles.reactionsContainer}>
        <TouchableOpacity 
          style={styles.reactionButton}
          onPress={() => handleReaction(index, 'like')}
        >
          <Text style={styles.reactionIcon}>👍</Text>
          <Text style={[styles.reactionCount, { color: theme.textSecondary }]}>
            {item.reactions?.like || 0}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.reactionButton}
          onPress={() => handleReaction(index, 'love')}
        >
          <Text style={styles.reactionIcon}>❤️</Text>
          <Text style={[styles.reactionCount, { color: theme.textSecondary }]}>
            {item.reactions?.love || 0}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.reactionButton}
          onPress={() => handleReaction(index, 'laugh')}
        >
          <Text style={styles.reactionIcon}>😂</Text>
          <Text style={[styles.reactionCount, { color: theme.textSecondary }]}>
            {item.reactions?.laugh || 0}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderEmptyComments = () => (
    <View style={styles.emptyContainer}>
      <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
        No comments yet. Be the first to share your thoughts about this event!
      </Text>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>

      {/* Comments List */}
      <FlatList
        data={comments}
        renderItem={renderComment}
        keyExtractor={(item, index) => `${item.id || index}-${item.timestamp}`}
        ListHeaderComponent={
          <View>
            {headerContent}
            <View style={[styles.header, { borderBottomColor: theme.border }]}>
              <Text style={[styles.headerTitle, { color: theme.text }]}>
                💬 Event Comments ({comments.length})
              </Text>
            </View>
            
            <View style={[styles.addCommentContainer, { backgroundColor: theme.surface }]}>
              <TextInput
                style={[styles.commentInput, { 
                  backgroundColor: theme.background, 
                  color: theme.text,
                  borderColor: theme.border 
                }]}
                placeholder="Share your thoughts about this event..."
                placeholderTextColor={theme.textSecondary}
                value={newComment}
                onChangeText={setNewComment}
                multiline
                maxLength={500}
              />
              <TouchableOpacity
                style={[styles.postButton, { 
                  backgroundColor: newComment.trim() ? theme.primary : theme.border 
                }]}
                onPress={handleAddComment}
                disabled={!newComment.trim()}
              >
                <Text style={[styles.postButtonText, { 
                  color: newComment.trim() ? '#fff' : theme.textSecondary 
                }]}>
                  Post
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        }
        ListEmptyComponent={renderEmptyComments}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={comments.length === 0 ? styles.emptyList : styles.listContent}
        refreshing={loading}
        onRefresh={loadEventComments}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 24,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  addCommentContainer: {
    padding: 16,
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 12,
  },
  commentInput: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 16,
    maxHeight: 80,
    textAlignVertical: 'top',
  },
  postButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 6,
  },
  postButtonText: {
    fontWeight: '600',
    fontSize: 14,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  commentCard: {
    padding: 16,
    marginVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
  },
  commentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
  },
  timeAgo: {
    fontSize: 14,
  },
  commentText: {
    fontSize: 16,
    lineHeight: 22,
    marginBottom: 12,
  },
  reactionsContainer: {
    flexDirection: 'row',
    gap: 16,
  },
  reactionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  reactionIcon: {
    fontSize: 16,
  },
  reactionCount: {
    fontSize: 14,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
  emptyList: {
    flexGrow: 1,
  },
});

export default EventComments;
