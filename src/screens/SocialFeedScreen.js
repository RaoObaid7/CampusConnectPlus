  import React, { useState, useEffect, useCallback } from 'react';
import { 
  View, Text, FlatList, ActivityIndicator, 
  RefreshControl, Share, TouchableOpacity, StyleSheet, SafeAreaView 
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { getComments, saveComment, updateReaction } from '../utils/storage';
import Background from '../components/Background';
import Card from '../components/Card';
import Button from '../components/Button';
import Input from '../components/Input';
import DropdownMenu from '../components/DropdownMenu';
import { spacing, borderRadius, typography } from '../utils/designSystem';

const SocialFeedScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const { user } = useAuth();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [sortBy, setSortBy] = useState('newest');
  const [filterBy, setFilterBy] = useState('all');

  // Sort options
  const sortOptions = [
    { label: 'Newest First', value: 'newest' },
    { label: 'Most Liked', value: 'popular' },
    { label: 'My Posts', value: 'mine' }
  ];

  useEffect(() => {
    loadComments();
  }, [sortBy, filterBy]);

  const loadComments = async () => {
    setIsLoading(true);
    try {
      let storedComments = await getComments();
      let allComments = Object.entries(storedComments).flatMap(([eventId, comments]) =>
        comments.map(comment => ({ ...comment, eventId }))
      );

      // Apply filters
      if (filterBy === 'mine') {
        allComments = allComments.filter(comment => comment.userId === user.id);
      }

      // Apply sorting
      allComments.sort((a, b) => {
        switch (sortBy) {
          case 'popular':
            const likesA = Array.isArray(a.reactions?.likes) ? a.reactions.likes.length : 0;
            const likesB = Array.isArray(b.reactions?.likes) ? b.reactions.likes.length : 0;
            return likesB - likesA;
          case 'newest':
          default:
            return new Date(b.timestamp) - new Date(a.timestamp);
        }
      });

      setComments(allComments);
    } catch (error) {
      console.error('Error loading comments:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    
    setIsLoading(true);
    try {
      const eventId = 'social'; // Generic social feed posts
      await saveComment(eventId, newComment.trim(), user);
      setNewComment('');
      await loadComments();
    } catch (error) {
      console.error('Error adding comment:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReaction = async (commentId, reactionType) => {
    try {
      await updateReaction(commentId, reactionType, user.id);
      await loadComments();
    } catch (error) {
      console.error('Error updating reaction:', error);
    }
  };

  const handleShare = async (comment) => {
    try {
      await Share.share({
        message: `${comment.userName}: ${comment.text}`,
        title: 'Campus Connect Plus Post'
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadComments();
    setRefreshing(false);
  }, []);

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const commentTime = new Date(timestamp);
    const diffInHours = Math.floor((now - commentTime) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return `${Math.floor(diffInHours / 24)}d ago`;
  };

  const renderComment = ({ item }) => (
    <Card variant="elevated" style={styles.commentCard}>
      <View style={styles.commentHeader}>
        <TouchableOpacity 
          onPress={() => navigation.navigate('UserProfile', { userId: item.userId })}
        >
          <Text style={[styles.userName, { color: theme.text }]}>{item.userName}</Text>
        </TouchableOpacity>
        <Text style={[styles.timeAgo, { color: theme.textSecondary }]}>
          {formatTimeAgo(item.timestamp)}
        </Text>
      </View>
      
      <Text style={[styles.commentText, { color: theme.text }]}>{item.text}</Text>
      
      <View style={styles.reactionsContainer}>
        <TouchableOpacity 
          style={[
            styles.reactionButton,
            Array.isArray(item.reactions?.likes) && 
            item.reactions.likes.includes(user.id) && 
            styles.activeReaction
          ]}
          onPress={() => handleReaction(item.id, 'like')}
        >
          <Text style={styles.reactionIcon}>👍</Text>
          <Text style={[styles.reactionCount, { color: theme.textSecondary }]}>
            {Array.isArray(item.reactions?.likes) ? item.reactions.likes.length : 0}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.reactionButton}
          onPress={() => handleShare(item)}
        >
          <Text style={styles.reactionIcon}>↗️</Text>
          <Text style={[styles.reactionCount, { color: theme.textSecondary }]}>
            Share
          </Text>
        </TouchableOpacity>
      </View>
    </Card>
  );

  return (
    <Background variant="gradient">
      <SafeAreaView style={styles.container}>
        <View style={styles.filterContainer}>
          <DropdownMenu
            options={sortOptions}
            value={sortBy}
            onValueChange={setSortBy}
            style={styles.dropdown}
          />
        </View>

        <Card variant="elevated" style={styles.addCommentContainer}>
          <Input
            style={styles.commentInput}
            placeholder="Share something with the campus community..."
            placeholderTextColor={theme.textSecondary}
            value={newComment}
            onChangeText={setNewComment}
            multiline
          />
          <Button
            title="Post"
            variant="gradient"
            onPress={handleAddComment}
            style={styles.postButton}
            disabled={isLoading}
          />
        </Card>

        <FlatList
          data={comments}
          renderItem={renderComment}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          ListEmptyComponent={
            isLoading ? (
              <ActivityIndicator size="large" color={theme.primary} />
            ) : (
              <Card variant="elevated" style={styles.emptyContainer}>
                <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
                  No posts yet. Be the first to share something!
                </Text>
              </Card>
            )
          }
        />
      </SafeAreaView>
    </Background>
  );
};

// Add these new styles to the existing StyleSheet
const newStyles = {
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: spacing.sm,
    marginHorizontal: spacing.md,
  },
  dropdown: {
    flex: 1,
    marginRight: spacing.sm,
  },
  activeReaction: {
    backgroundColor: 'rgba(0, 122, 255, 0.1)',
  }
};

const styles = StyleSheet.create({
  ...StyleSheet.create(newStyles),
  container: {
    flex: 1,
  },
  header: {
    padding: spacing.md,
    marginHorizontal: spacing.md,
    marginTop: spacing.sm,
    marginBottom: spacing.sm,
  },
  headerTitle: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    textAlign: 'center',
  },
  addCommentContainer: {
    padding: spacing.md,
    marginHorizontal: spacing.md,
    marginBottom: spacing.sm,
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: spacing.sm,
  },
  commentInput: {
    flex: 1,
    minHeight: 40,
    maxHeight: 100,
  },
  postButton: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
  },
  listContent: {
    padding: spacing.md,
  },
  commentCard: {
    marginBottom: spacing.sm,
  },
  commentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  userName: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.semibold,
  },
  timeAgo: {
    fontSize: typography.fontSize.sm,
  },
  commentText: {
    fontSize: typography.fontSize.md,
    lineHeight: typography.fontSize.md * 1.4,
    marginBottom: spacing.sm,
  },
  reactionsContainer: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  reactionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    padding: spacing.xs,
    borderRadius: borderRadius.sm,
  },
  reactionIcon: {
    fontSize: typography.fontSize.md,
  },
  reactionCount: {
    fontSize: typography.fontSize.sm,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacing.xl,
    marginHorizontal: spacing.md,
  },
  emptyText: {
    fontSize: typography.fontSize.md,
    textAlign: 'center',
  },
});

export default SocialFeedScreen;