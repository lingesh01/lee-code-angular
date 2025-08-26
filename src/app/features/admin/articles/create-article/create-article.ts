import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

interface Article {
  id?: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  tags: string[];
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  imageUrl: string;
  status: 'draft' | 'published';
  readingTime: number;
  publishDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

@Component({
  selector: 'app-create-article',
  imports: [CommonModule, FormsModule],
  templateUrl: './create-article.html',
  styleUrl: './create-article.scss'
})
export class CreateArticle implements OnInit {
  
  article: Article = {
    title: '',
    excerpt: '',
    content: '',
    category: '',
    tags: [],
    difficulty: 'Beginner',
    imageUrl: '',
    status: 'draft',
    readingTime: 1,
    createdAt: new Date(),
    updatedAt: new Date()
  };

  difficultyLevels: Array<'Beginner' | 'Intermediate' | 'Advanced'> = ['Beginner', 'Intermediate', 'Advanced'];
  
  newTag = '';
  showSettings = true;
  showPreview = false;
  isSaving = false;
  isEditing = false;

  constructor(private router: Router) {}

  ngOnInit(): void {
    // Auto-save functionality
    setInterval(() => {
      this.autoSave();
    }, 30000); // Auto-save every 30 seconds
  }

  // Navigation
  goBack(): void {
    if (this.hasUnsavedChanges()) {
      if (confirm('You have unsaved changes. Are you sure you want to leave?')) {
        this.router.navigate(['/admin/dashboard']);
      }
    } else {
      this.router.navigate(['/admin/dashboard']);
    }
  }

  // Settings panel
  toggleSettings(): void {
    this.showSettings = !this.showSettings;
  }

  // Content handlers
  onTitleChange(): void {
    this.updateReadingTime();
  }

  onExcerptChange(): void {
    // No specific logic needed, just for future enhancements
  }

  onContentChange(): void {
    this.updateReadingTime();
  }

  // Tag management
  addTag(): void {
    if (this.newTag.trim() && !this.article.tags.includes(this.newTag.trim())) {
      this.article.tags.push(this.newTag.trim());
      this.newTag = '';
    }
  }

  removeTag(index: number): void {
    this.article.tags.splice(index, 1);
  }

  // Content formatting
  insertFormat(format: string): void {
    const textarea = document.querySelector('.content-textarea') as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = textarea.value.substring(start, end);
    
    let insertText = '';
    
    switch (format) {
      case 'bold':
        insertText = `**${selectedText || 'bold text'}**`;
        break;
      case 'italic':
        insertText = `*${selectedText || 'italic text'}*`;
        break;
      case 'code':
        insertText = `\`${selectedText || 'code'}\``;
        break;
      case 'h2':
        insertText = `## ${selectedText || 'Heading 2'}`;
        break;
      case 'h3':
        insertText = `### ${selectedText || 'Heading 3'}`;
        break;
      case 'quote':
        insertText = `> ${selectedText || 'Quote text'}`;
        break;
      case 'ul':
        insertText = `- ${selectedText || 'List item'}`;
        break;
      case 'ol':
        insertText = `1. ${selectedText || 'List item'}`;
        break;
      case 'link':
        insertText = `[${selectedText || 'Link text'}](https://example.com)`;
        break;
      case 'codeblock':
        insertText = `\`\`\`javascript\n${selectedText || '// Your code here'}\n\`\`\``;
        break;
      case 'image':
        insertText = `![${selectedText || 'Alt text'}](https://example.com/image.jpg)`;
        break;
    }

    const newValue = textarea.value.substring(0, start) + insertText + textarea.value.substring(end);
    this.article.content = newValue;
    
    // Focus and set cursor position
    setTimeout(() => {
      textarea.focus();
      const newCursorPos = start + insertText.length;
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    });
  }

  // Utility methods
  getWordCount(): number {
    return this.article.content.trim().split(/\s+/).filter(word => word.length > 0).length;
  }

  updateReadingTime(): void {
    const wordsPerMinute = 200; // Average reading speed
    const wordCount = this.getWordCount();
    this.article.readingTime = Math.max(1, Math.ceil(wordCount / wordsPerMinute));
  }

  canPublish(): boolean {
    return !!(
      this.article.title.trim() &&
      this.article.excerpt.trim() &&
      this.article.content.trim() &&
      this.article.category &&
      this.article.imageUrl
    );
  }

  // Save operations
  autoSave(): void {
    if (this.hasUnsavedChanges() && this.article.title.trim()) {
      this.saveDraft(true);
    }
  }

  saveDraft(isAutoSave = false): void {
    if (this.isSaving) return;

    this.isSaving = true;
    this.article.status = 'draft';
    this.article.updatedAt = new Date();

    // TODO: Implement actual API call
    setTimeout(() => {
      console.log('Draft saved:', this.article);
      this.isSaving = false;
      
      if (!isAutoSave) {
        // Show success message
        this.showSuccessMessage('Draft saved successfully!');
      }
    }, 1000);
  }

  publishArticle(): void {
    if (!this.canPublish() || this.isSaving) return;

    this.isSaving = true;
    this.article.status = 'published';
    this.article.publishDate = new Date();
    this.article.updatedAt = new Date();

    // TODO: Implement actual API call
    setTimeout(() => {
      console.log('Article published:', this.article);
      this.isSaving = false;
      
      // Show success message and redirect
      this.showSuccessMessage('Article published successfully!');
      setTimeout(() => {
        this.router.navigate(['/admin/articles']);
      }, 2000);
    }, 1500);
  }

  // Preview functionality
  openPreview(): void {
    this.showPreview = true;
  }

  closePreview(): void {
    this.showPreview = false;
  }

  getPreviewContent(): string {
    // Simple markdown to HTML conversion (in a real app, use a proper markdown parser)
    return this.article.content
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/`(.*?)`/g, '<code>$1</code>')
      .replace(/^## (.*$)/gim, '<h2>$1</h2>')
      .replace(/^### (.*$)/gim, '<h3>$1</h3>')
      .replace(/^> (.*$)/gim, '<blockquote>$1</blockquote>')
      .replace(/\n/g, '<br>');
  }

  // Image handling
  onImageError(): void {
    this.article.imageUrl = '';
  }

  // Helper methods
  hasUnsavedChanges(): boolean {
    // In a real app, compare with saved version
    return !!(this.article.title || this.article.content || this.article.excerpt);
  }

  showSuccessMessage(message: string): void {
    // TODO: Implement proper toast notification
    alert(message);
  }

}
