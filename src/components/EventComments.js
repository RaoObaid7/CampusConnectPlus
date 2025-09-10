import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, Alert } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { getComments, saveComment } from '../utils/storage';
import { mockComments } from '../data/mockEvents';

const EventComments = ({ eventId, headerContent = null }) => {
  const { theme } = useTheme();
  const styles = createThemedStyles(theme);
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
    <View style={styles.commentCard}>
      <View style={styles.commentHeader}>
        <Text style={styles.userName}>{item.userName}</Text>
        <Text style={styles.timeAgo}>
          {formatTimeAgo(item.timestamp)}
        </Text>
      </View>
      
      <Text style={styles.commentText}>{item.text}</Text>
      
      <View style={styles.reactionsContainer}>
        <TouchableOpacity 
          style={styles.reactionButton}
          onPress={() => handleReaction(index, 'like')}
        >
          <Text style={styles.reactionIcon}>👍</Text>
          <Text style={styles.reactionCount}>
            {item.reactions?.like || 0}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.reactionButton}
          onPress={() => handleReaction(index, 'love')}
        >
          <Text style={styles.reactionIcon}>❤️</Text>
          <Text style={styles.reactionCount}>
            {item.reactions?.love || 0}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.reactionButton}
          onPress={() => handleReaction(index, 'laugh')}
        >
          <Text style={styles.reactionIcon}>😂</Text>
          <Text style={styles.reactionCount}>
            {item.reactions?.laugh || 0}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderEmptyComments = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>
        No comments yet. Be the first to share your thoughts about this event!
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>

      {/* Comments List */}
      <FlatList
        data={comments}
        renderItem={renderComment}
        keyExtractor={(item, index) => `${item.id || index}-${item.timestamp}`}
        ListHeaderComponent={
          <View>
            {headerContent}
            <View style={styles.header}>
              <Text style={styles.headerTitle}>
                💬 Event Comments ({comments.length})
              </Text>
            </View>
            
            <View style={styles.addCommentContainer}>
              <TextInput
                style={styles.commentInput}
                placeholder="Share your thoughts about this event..."
                placeholderTextColor={theme.colors.textSecondary}
                value={newComment}
                onChangeText={setNewComment}
                multiline
                maxLength={500}
              />
              <TouchableOpacity
                style={[styles.postButton, { 
                  backgroundColor: newComment.trim() ? theme.colors.primary : theme.colors.border
                }]}
                onPress={handleAddComment}
                disabled={!newComment.trim()}
              >
                <Text style={[styles.postButtonText, { 
                  color: newComment.trim() ? '#FFFFFF' : theme.colors.textSecondary
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

const createThemedStyles = (theme) => StyleSheet.create({
  container: {
    flex: 1,
    marginTop: theme.spacing.l,
    backgroundColor: theme.colors.background,
  },
  header: {
    paddingHorizontal: theme.spacing.l,
    paddingVertical: theme.spacing.m,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  headerTitle: {
    fontSize: theme.typography.sizes.h3,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.text,
  },
  addCommentContainer: {
    padding: theme.spacing.m,
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: theme.spacing.m,
    backgroundColor: theme.colors.surface,
  },
  commentInput: {
    flex: 1,
    borderWidth: 1,
    borderRadius: theme.radii.m,
    paddingHorizontal: theme.spacing.m,
    paddingVertical: theme.spacing.s,
    fontSize: theme.typography.sizes.body,
    maxHeight: 100,
    textAlignVertical: 'top',
    backgroundColor: theme.colors.background,
    color: theme.colors.text,
    borderColor: theme.colors.border,
  },
  postButton: {
    paddingHorizontal: theme.spacing.m,
    paddingVertical: theme.spacing.s,
    borderRadius: theme.radii.m,
  },
  postButtonText: {
    fontWeight: theme.typography.weights.bold,
    fontSize: theme.typography.sizes.body,
  },
  listContent: {
    paddingHorizontal: theme.spacing.m,
    paddingBottom: theme.spacing.l,
  },
  commentCard: {
    padding: theme.spacing.m,
    marginVertical: theme.spacing.xs,
    borderRadius: theme.radii.m,
    borderWidth: 1,
    backgroundColor: theme.colors.card,
    borderColor: theme.colors.border,
  },
  commentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.s,
  },
  userName: {
    fontSize: theme.typography.sizes.body,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.text,
  },
  timeAgo: {
    fontSize: theme.typography.sizes.caption,
    color: theme.colors.textSecondary,
  },
  commentText: {
    fontSize: theme.typography.sizes.body,
    lineHeight: 22,
    marginBottom: theme.spacing.m,
    color: theme.colors.text,
  },
  reactionsContainer: {
    flexDirection: 'row',
    gap: theme.spacing.m,
  },
  reactionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
    paddingHorizontal: theme.spacing.s,
    paddingVertical: theme.spacing.xs,
  },
  reactionIcon: {
    fontSize: theme.typography.sizes.body,
  },
  reactionCount: {
    fontSize: theme.typography.sizes.caption,
    color: theme.colors.textSecondary,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: theme.spacing.xl,
    paddingHorizontal: theme.spacing.l,
  },
  emptyText: {
    fontSize: theme.typography.sizes.body,
    textAlign: 'center',
    lineHeight: 24,
    color: theme.colors.textSecondary,
  },
  emptyList: {
    flexGrow: 1,
  },
});

export default EventComments;
