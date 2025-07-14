/// <reference path="../jsx.d.ts" />
import { h } from '../utils/simple-jsx';

export interface EventLogEntry {
  id: string;
  timestamp: string;
  eventType: string;
  componentName: string;
  data: any;
  level?: 'info' | 'warning' | 'error' | 'success';
}

export interface EventLoggerData {
  events: EventLogEntry[];
  maxEvents?: number;
  showFilters?: boolean;
  eventTypes?: string[];
}

export function EventLogger(data: EventLoggerData) {
  const {
    events = [],
    maxEvents = 100,
    showFilters = true,
    eventTypes = []
  } = data;

  const getEventLevelClass = (level?: string) => {
    switch (level) {
      case 'error': return 'event-error';
      case 'warning': return 'event-warning';
      case 'success': return 'event-success';
      default: return 'event-info';
    }
  };

  const formatEventData = (data: any) => {
    if (typeof data === 'object') {
      return JSON.stringify(data, null, 2);
    }
    return String(data);
  };

  return (
    <div class="event-logger">
      <div class="event-logger-header">
        <h3>Event Log</h3>
        <div class="event-logger-controls">
          <button class="clear-events-btn" onclick="clearEvents()">Clear</button>
          <button class="export-events-btn" onclick="exportEvents()">Export</button>
        </div>
      </div>

      {/* Event Filters */}
      {showFilters && eventTypes.length > 0 && (
        <div class="event-filters">
          <label class="filter-label">Filter by event type:</label>
          <select class="event-type-filter" onchange="filterEventsByType(this.value)">
            <option value="">All Events</option>
            {eventTypes.map(type => (
              <option value={type}>{type}</option>
            ))}
          </select>
        </div>
      )}

      {/* Event List */}
      <div class="event-list" id="event-list">
        {events.length === 0 ? (
          <div class="no-events">
            <em>No events logged yet. Interact with the component to see events.</em>
          </div>
        ) : (
          events.slice(0, maxEvents).map(event => (
            <div class={`event-entry ${getEventLevelClass(event.level)}`} key={event.id}>
              <div class="event-header">
                <span class="event-timestamp">{event.timestamp}</span>
                <span class="event-type">{event.eventType}</span>
                <span class="event-component">{event.componentName}</span>
              </div>
              <div class="event-data">
                <pre class="event-data-content">{formatEventData(event.data)}</pre>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Event Counter */}
      <div class="event-counter">
        <span>Total Events: {events.length}</span>
        {events.length > maxEvents && (
          <span class="events-truncated">(showing last {maxEvents})</span>
        )}
      </div>
    </div>
  );
} 
