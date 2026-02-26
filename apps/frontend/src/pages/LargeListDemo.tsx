import { useState, useRef, useCallback, useMemo, memo, useEffect } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { Layout } from '../components/common/Layout';

interface Item {
  id: number;
  name: string;
  email: string;
  role: string;
}

function generateItems(count: number): Item[] {
  const roles = ['Engineer', 'Designer', 'Manager', 'Analyst', 'Lead', 'Intern'];
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    name: `User ${i + 1}`,
    email: `user${i + 1}@example.com`,
    role: roles[i % roles.length],
  }));
}

function useRenderTime() {
  const startRef = useRef(performance.now());
  const [renderTime, setRenderTime] = useState<number | null>(null);

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      setRenderTime(performance.now() - startRef.current);
    });
    return () => cancelAnimationFrame(frame);
  });

  const reset = useCallback(() => {
    startRef.current = performance.now();
    setRenderTime(null);
  }, []);

  return { renderTime, reset };
}

// ─── Approach 1: Naive Rendering ────────────────────────────────────────────

function NaiveList({ items }: { items: Item[] }) {
  const { renderTime } = useRenderTime();

  return (
    <div>
      <RenderBadge time={renderTime} />
      <div className="h-[400px] overflow-auto border border-gray-200 dark:border-gray-700 rounded-lg">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-gray-800"
          >
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">{item.name}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{item.email}</p>
            </div>
            <span className="text-xs px-2 py-1 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300">
              {item.role}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Approach 2: Memoized Rendering ─────────────────────────────────────────

const MemoizedItem = memo(function MemoizedItem({ item }: { item: Item }) {
  return (
    <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-gray-800">
      <div>
        <p className="text-sm font-medium text-gray-900 dark:text-white">{item.name}</p>
        <p className="text-xs text-gray-500 dark:text-gray-400">{item.email}</p>
      </div>
      <span className="text-xs px-2 py-1 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300">
        {item.role}
      </span>
    </div>
  );
});

function MemoizedList({ items }: { items: Item[] }) {
  const { renderTime } = useRenderTime();

  return (
    <div>
      <RenderBadge time={renderTime} />
      <div className="h-[400px] overflow-auto border border-gray-200 dark:border-gray-700 rounded-lg">
        {items.map((item) => (
          <MemoizedItem key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}

// ─── Approach 3: Virtualized Rendering ──────────────────────────────────────

function VirtualizedList({ items }: { items: Item[] }) {
  const parentRef = useRef<HTMLDivElement>(null);
  const { renderTime } = useRenderTime();

  const virtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 57,
    overscan: 5,
  });

  return (
    <div>
      <RenderBadge time={renderTime} />
      <div
        ref={parentRef}
        className="h-[400px] overflow-auto border border-gray-200 dark:border-gray-700 rounded-lg"
      >
        <div className="relative" style={{ height: virtualizer.getTotalSize() }}>
          {virtualizer.getVirtualItems().map((virtualRow) => {
            const item = items[virtualRow.index];
            return (
              <div
                key={virtualRow.key}
                className="absolute left-0 w-full flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-gray-800"
                style={{
                  top: virtualRow.start,
                  height: virtualRow.size,
                }}
              >
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{item.name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{item.email}</p>
                </div>
                <span className="text-xs px-2 py-1 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300">
                  {item.role}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── Shared Components ──────────────────────────────────────────────────────

function RenderBadge({ time }: { time: number | null }) {
  if (time === null) return null;
  const color =
    time < 50 ? 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/30'
    : time < 200 ? 'text-yellow-600 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-900/30'
    : 'text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/30';

  return (
    <div className={`inline-block text-xs font-mono px-2 py-1 rounded mb-2 ${color}`}>
      Render: {time.toFixed(1)}ms
    </div>
  );
}

const LIST_SIZE_OPTIONS = [1000, 5000, 10000, 50000];

// ─── Page Component ─────────────────────────────────────────────────────────

export function LargeListDemo() {
  const [listSize, setListSize] = useState(5000);
  const [activeApproach, setActiveApproach] = useState<'naive' | 'memoized' | 'virtualized'>('virtualized');
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  const items = useMemo(() => generateItems(listSize), [listSize]);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(timer);
  }, [search]);

  const filteredItems = useMemo(
    () =>
      debouncedSearch
        ? items.filter(
            (i) =>
              i.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
              i.role.toLowerCase().includes(debouncedSearch.toLowerCase()),
          )
        : items,
    [items, debouncedSearch],
  );

  return (
    <Layout title="Large List Demo" description="Comparing approaches for rendering large lists in React.">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Large List Rendering
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          Compare Naive, Memoized, and Virtualized approaches side by side.
        </p>

        {/* Controls */}
        <div className="flex flex-wrap gap-4 items-center mb-6 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
          <div>
            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
              List Size
            </label>
            <div className="flex gap-1">
              {LIST_SIZE_OPTIONS.map((size) => (
                <button
                  key={size}
                  onClick={() => setListSize(size)}
                  className={`px-3 py-1.5 text-sm rounded-lg font-medium transition-colors ${
                    listSize === size
                      ? 'bg-primary-600 text-white'
                      : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'
                  }`}
                >
                  {size.toLocaleString()}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
              Approach
            </label>
            <div className="flex gap-1">
              {(['naive', 'memoized', 'virtualized'] as const).map((approach) => (
                <button
                  key={approach}
                  onClick={() => setActiveApproach(approach)}
                  className={`px-3 py-1.5 text-sm rounded-lg font-medium capitalize transition-colors ${
                    activeApproach === approach
                      ? 'bg-primary-600 text-white'
                      : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'
                  }`}
                >
                  {approach}
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 min-w-[200px]">
            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
              Search (debounced 300ms)
            </label>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Filter by name or role..."
              className="w-full px-3 py-1.5 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400"
            />
          </div>
        </div>

        {/* Info */}
        <div className="flex items-center gap-4 mb-4 text-sm text-gray-500 dark:text-gray-400">
          <span>Showing <strong className="text-gray-900 dark:text-white">{filteredItems.length.toLocaleString()}</strong> items</span>
          <span>|</span>
          <span>
            DOM nodes:{' '}
            <strong className="text-gray-900 dark:text-white">
              {activeApproach === 'virtualized' ? '~20' : filteredItems.length.toLocaleString()}
            </strong>
          </span>
        </div>

        {/* Approach Description */}
        <div className="mb-4 p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-sm text-blue-800 dark:text-blue-300">
          {activeApproach === 'naive' && (
            <p>
              <strong>Naive:</strong> Renders all {filteredItems.length.toLocaleString()} items as DOM nodes.
              Simple but slow for large lists — the browser must layout and paint everything.
            </p>
          )}
          {activeApproach === 'memoized' && (
            <p>
              <strong>Memoized:</strong> Uses <code>React.memo</code> to skip re-rendering unchanged items.
              Helps with re-renders but initial mount is still slow since all DOM nodes are created.
            </p>
          )}
          {activeApproach === 'virtualized' && (
            <p>
              <strong>Virtualized:</strong> Only renders items visible in the viewport (~20 DOM nodes).
              Uses <code>@tanstack/react-virtual</code> for constant-time rendering regardless of list size.
            </p>
          )}
        </div>

        {/* List */}
        {activeApproach === 'naive' && <NaiveList items={filteredItems} />}
        {activeApproach === 'memoized' && <MemoizedList items={filteredItems} />}
        {activeApproach === 'virtualized' && <VirtualizedList items={filteredItems} />}
      </div>
    </Layout>
  );
}
