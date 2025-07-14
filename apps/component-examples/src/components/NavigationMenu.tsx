/// <reference path="../jsx.d.ts" />
import { h } from '../utils/simple-jsx';

export interface NavigationItem {
  id: string;
  title: string;
  description?: string;
  category?: string;
  url: string;
  isActive?: boolean;
}

export interface NavigationMenuData {
  items: NavigationItem[];
  currentPath?: string;
  showCategories?: boolean;
}

export function NavigationMenu(data: NavigationMenuData) {
  const { items, currentPath: _currentPath = '', showCategories = true } = data;

  // Group items by category if showCategories is true
  const groupedItems = showCategories
    ? items.reduce((groups, item) => {
      const category = item.category || 'Other';
      if (!groups[category]) {
        groups[category] = [];
      }
      groups[category].push(item);
      return groups;
    }, {} as Record<string, NavigationItem[]>)
    : { 'Examples': items };

  const renderNavigationItem = (item: NavigationItem) => (
    <li class={`nav-item ${item.isActive ? 'active' : ''}`}>
      <a href={item.url} class="nav-link">
        <span class="nav-title">{item.title}</span>
        {item.description && (
          <span class="nav-description">{item.description}</span>
        )}
      </a>
    </li>
  );

  return (
    <nav class="navigation-menu">
      <div class="nav-header">
        <h2>Component Examples</h2>
        <button class="nav-toggle" onclick="toggleNavigation()">
          <span class="nav-toggle-icon">☰</span>
        </button>
      </div>

      <div class="nav-content">
        {Object.entries(groupedItems).map(([category, categoryItems]) => (
          <div class="nav-category">
            <h3 class="nav-category-title">{category}</h3>
            <ul class="nav-list">
              {categoryItems.map(renderNavigationItem)}
            </ul>
          </div>
        ))}
      </div>

      <div class="nav-footer">
        <a href="/" class="nav-home-link">← Back to Home</a>
      </div>
    </nav>
  );
} 
