import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TextInput, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { getComments, saveComment } from '../utils/storage';
import { mockComments } from '../data/mockEvents';

const SocialFeedScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const styles = createThemedStyles(theme);
  const { user } = useAuth();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    loadComments();
  }, []);

  const loadComments = async () => {
    try {
      const storedComments = await getComments();
      // Combine stored comments with mock comments
      const allComments = [];
      
      // Add mock comments
      Object.keys(mockComments).forEach(eventId => {
        mockComments[eventId].forEach(comment => {
          allComments.push({
            ...comment,
            eventId
          });
        });
      });
      
      // Add stored comments
      Object.keys(storedComments).forEach(eventId => {
        storedComments[eventId].forEach(comment => {
          allComments.push({
            ...comment,
            eventId
          });
        });
      });
      
      // Sort by timestamp (newest first)
      allComments.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
      setComments(allComments);
    } catch (error) {
      console.error('Error loading comments:', error);
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    
    try {
      // For demo purposes, add to first event
      const eventId = '1';
      await saveComment(eventId, newComment.trim(), user);
      setNewComment('');
      loadComments(); // Reload comments
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const commentTime = new Date(timestamp);
    const diffInHours = Math.floor((now - commentTime) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return `${Math.floor(diffInHours / 24)}d ago`;
  };

  const renderComment = ({ item }) => (
    <View style={styles.commentCard}>
      <View style={styles.commentHeader}>
        <Text style={styles.userName}>{item.userName}</Text>
        <Text style={styles.timeAgo}>
          {formatTimeAgo(item.timestamp)}
        </Text>
      </View>
      
      <Text style={styles.commentText}>{item.text}</Text>
      
      <View style={styles.reactionsContainer}>
        <TouchableOpacity style={styles.reactionButton}>
          <Text style={styles.reactionIcon}>👍</Text>
          <Text style={styles.reactionCount}>
            {item.reactions?.like || 0}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.reactionButton}>
          <Text style={styles.reactionIcon}>❤️</Text>
          <Text style={styles.reactionCount}>
            {item.reactions?.love || 0}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.reactionButton}>
          <Text style={styles.reactionIcon}>😂</Text>
          <Text style={styles.reactionCount}>
            {item.reactions?.laugh || 0}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Campus Activity Feed</Text>
      </View>

      <View style={styles.addCommentContainer}>
        <TextInput
          style={styles.commentInput}
          placeholder="Share something with the campus community..."
          placeholderTextColor={theme.colors.textSecondary}
          value={newComment}
          onChangeText={setNewComment}
          multiline
        />
        <TouchableOpacity
          style={styles.postButton}
          onPress={handleAddComment}
        >
          <Text style={styles.postButtonText}>Post</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={comments}
        renderItem={renderComment}
        keyExtractor={(item, index) => `${item.id}-${index}`}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              No comments yet. Be the first to share something!
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};

const createThemedStyles = (theme) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    padding: theme.spacing.m,
    borderBottomWidth: 1,
    backgroundColor: theme.colors.surface,
    borderBottomColor: theme.colors.border,
  },
  headerTitle: {
    fontSize: theme.typography.sizes.h3,
    fontWeight: theme.typography.weights.bold,
    textAlign: 'center',
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
    backgroundColor: theme.colors.background,
    color: theme.colors.text,
    borderColor: theme.colors.border,
  },
  postButton: {
    paddingHorizontal: theme.spacing.m,
    paddingVertical: theme.spacing.s,
    borderRadius: theme.radii.m,
    backgroundColor: theme.colors.primary,
  },
  postButtonText: {
    color: '#FFFFFF',
    fontWeight: theme.typography.weights.bold,
  },
  listContent: {
    padding: theme.spacing.m,
  },
  commentCard: {
    padding: theme.spacing.m,
    marginBottom: theme.spacing.m,
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
  },
  emptyText: {
    fontSize: theme.typography.sizes.body,
    textAlign: 'center',
    color: theme.colors.textSecondary,
  },
});

export default SocialFeedScreen;