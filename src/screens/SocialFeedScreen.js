import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TextInput, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { getComments, saveComment } from '../utils/storage';
import { mockComments } from '../data/mockEvents';

const SocialFeedScreen = ({ navigation }) => {
  const { theme } = useTheme();
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
    <View style={[styles.commentCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
      <View style={styles.commentHeader}>
        <Text style={[styles.userName, { color: theme.text }]}>{item.userName}</Text>
        <Text style={[styles.timeAgo, { color: theme.textSecondary }]}>
          {formatTimeAgo(item.timestamp)}
        </Text>
      </View>
      
      <Text style={[styles.commentText, { color: theme.text }]}>{item.text}</Text>
      
      <View style={styles.reactionsContainer}>
        <TouchableOpacity style={styles.reactionButton}>
          <Text style={styles.reactionIcon}>👍</Text>
          <Text style={[styles.reactionCount, { color: theme.textSecondary }]}>
            {item.reactions?.like || 0}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.reactionButton}>
          <Text style={styles.reactionIcon}>❤️</Text>
          <Text style={[styles.reactionCount, { color: theme.textSecondary }]}>
            {item.reactions?.love || 0}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.reactionButton}>
          <Text style={styles.reactionIcon}>😂</Text>
          <Text style={[styles.reactionCount, { color: theme.textSecondary }]}>
            {item.reactions?.laugh || 0}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.header, { backgroundColor: theme.surface, borderBottomColor: theme.border }]}>
        <Text style={[styles.headerTitle, { color: theme.text }]}>Campus Activity Feed</Text>
      </View>

      <View style={[styles.addCommentContainer, { backgroundColor: theme.surface }]}>
        <TextInput
          style={[styles.commentInput, { 
            backgroundColor: theme.background, 
            color: theme.text,
            borderColor: theme.border 
          }]}
          placeholder="Share something with the campus community..."
          placeholderTextColor={theme.textSecondary}
          value={newComment}
          onChangeText={setNewComment}
          multiline
        />
        <TouchableOpacity
          style={[styles.postButton, { backgroundColor: theme.primary }]}
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
            <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
              No comments yet. Be the first to share something!
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
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
  },
  postButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  postButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  listContent: {
    padding: 16,
  },
  commentCard: {
    padding: 16,
    marginBottom: 12,
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
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
  },
});

export default SocialFeedScreen;