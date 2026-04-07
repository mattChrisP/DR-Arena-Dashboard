"use client";

import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { hierarchy, tree as d3Tree } from "d3-hierarchy";
import type { TopologyNode } from "@/lib/types";

interface Props {
  data: TopologyNode;
  onNodeSelect?: (node: TopologyNode | null) => void;
}

interface LayoutNode {
  id: string;
  x: number;
  y: number;
  data: TopologyNode;
  depth: number;
  childCount: number;
  descendantCount: number;
  expanded: boolean;
}

interface LayoutLink {
  source: LayoutNode;
  target: LayoutNode;
}

const CARD_WIDTH = 210;
const ROOT_CARD_WIDTH = 260;
const CARD_HEIGHT = 88;
const LEVEL_GAP = 148;
const SIBLING_GAP = 58;
const MARGIN_X = 120;
const MARGIN_Y = 88;
const FIT_PADDING = 56;
const MIN_SCALE = 0.28;
const MAX_SCALE = 1.6;
const DRAG_THRESHOLD = 5;

function nodeId(node: TopologyNode): string {
  return node.url;
}

function countDescendants(node: TopologyNode): number {
  return (node.children ?? []).reduce((sum, child) => sum + 1 + countDescendants(child), 0);
}

function findNode(root: TopologyNode, id: string): TopologyNode | null {
  if (root.url == id) return root;
  for (const child of root.children ?? []) {
    const match = findNode(child, id);
    if (match) return match;
  }
  return null;
}

function buildVisibleTree(node: TopologyNode, expandedIds: Set<string>): TopologyNode {
  const isExpanded = expandedIds.has(nodeId(node));
  return {
    ...node,
    children: isExpanded ? (node.children ?? []).map((child) => buildVisibleTree(child, expandedIds)) : [],
  };
}

function depthColor(depth: number): string {
  const palette = [
    "rgba(27, 149, 130, 0.14)",
    "rgba(43, 170, 145, 0.16)",
    "rgba(63, 188, 157, 0.18)",
    "rgba(103, 204, 173, 0.18)",
    "rgba(136, 214, 189, 0.2)",
  ];
  return palette[Math.min(depth, palette.length - 1)];
}

function shortHost(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url.replace(/^https?:\/\//, "").split("/")[0];
  }
}

function nodeTitle(node: TopologyNode): string {
  return node.title?.trim() || shortHost(node.url);
}

function nodeMeta(node: TopologyNode): string {
  if (node.rc) return node.rc.replaceAll("/", " / ");
  return node.domain;
}

function computeFitTransform(viewWidth: number, viewHeight: number, contentWidth: number, contentHeight: number) {
  const scale = Math.max(
    MIN_SCALE,
    Math.min(
      1,
      Math.min(
        (viewWidth - FIT_PADDING * 2) / contentWidth,
        (viewHeight - FIT_PADDING * 2) / contentHeight,
      ),
    ),
  );

  return {
    x: (viewWidth - contentWidth * scale) / 2,
    y: (viewHeight - contentHeight * scale) / 2,
    scale,
  };
}

export function TreeTopology({ data, onNodeSelect }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{
    startX: number;
    startY: number;
    startTx: number;
    startTy: number;
    didDrag: boolean;
  } | null>(null);
  const suppressClickRef = useRef(false);
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const [selectedId, setSelectedId] = useState<string>(nodeId(data));
  const [transform, setTransform] = useState({ x: 0, y: 0, scale: 1 });
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    setExpandedIds(new Set());
    setSelectedId(nodeId(data));
    onNodeSelect?.(data);
  }, [data, onNodeSelect]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleWheel = (event: WheelEvent) => {
      event.preventDefault();

      const rect = container.getBoundingClientRect();
      const cx = event.clientX - rect.left;
      const cy = event.clientY - rect.top;
      const factor = event.deltaY > 0 ? 0.92 : 1.08;

      setTransform((prev) => {
        const nextScale = Math.max(MIN_SCALE, Math.min(MAX_SCALE, prev.scale * factor));
        const ratio = nextScale / prev.scale;
        return {
          x: cx - ratio * (cx - prev.x),
          y: cy - ratio * (cy - prev.y),
          scale: nextScale,
        };
      });
    };

    container.addEventListener("wheel", handleWheel, { passive: false });
    return () => container.removeEventListener("wheel", handleWheel);
  }, []);

  const rootId = nodeId(data);

  const { nodes, links, width, height } = useMemo(() => {
    const visibleRoot = buildVisibleTree(data, expandedIds);
    const root = hierarchy(visibleRoot);

    d3Tree<TopologyNode>()
      .nodeSize([CARD_WIDTH + SIBLING_GAP, LEVEL_GAP])
      .separation((a, b) => (a.parent === b.parent ? 1 : 1.15))(root);

    let minX = Infinity;
    let maxX = -Infinity;
    let maxY = 0;

    const layoutNodes: LayoutNode[] = root.descendants().map((node) => {
      minX = Math.min(minX, node.x ?? 0);
      maxX = Math.max(maxX, node.x ?? 0);
      maxY = Math.max(maxY, node.y ?? 0);

      const original = findNode(data, node.data.url) ?? node.data;
      return {
        id: nodeId(original),
        x: node.x ?? 0,
        y: node.y ?? 0,
        data: original,
        depth: node.depth,
        childCount: original.children?.length ?? 0,
        descendantCount: countDescendants(original),
        expanded: expandedIds.has(nodeId(original)),
      };
    });

    const xOffset = MARGIN_X - minX;
    const yOffset = MARGIN_Y;

    const positionedNodes = layoutNodes.map((node) => ({
      ...node,
      x: node.x + xOffset,
      y: node.y + yOffset,
    }));

    const byId = new Map(positionedNodes.map((node) => [node.id, node]));
    const layoutLinks: LayoutLink[] = root.links()
      .map((link) => {
        const source = byId.get(nodeId(link.source.data));
        const target = byId.get(nodeId(link.target.data));
        return source && target ? { source, target } : null;
      })
      .filter((link): link is LayoutLink => Boolean(link));

    return {
      nodes: positionedNodes,
      links: layoutLinks,
      width: Math.max(860, maxX - minX + MARGIN_X * 2 + CARD_WIDTH),
      height: Math.max(420, maxY + MARGIN_Y * 2 + CARD_HEIGHT),
    };
  }, [data, expandedIds]);

  const selectedNode = findNode(data, selectedId) ?? data;

  const fitToViewport = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    if (rect.width <= 0 || rect.height <= 0) return;

    setTransform(computeFitTransform(rect.width, rect.height, width, height));
  }, [height, width]);

  useLayoutEffect(() => {
    const frame = requestAnimationFrame(() => {
      fitToViewport();
    });
    return () => cancelAnimationFrame(frame);
  }, [data, expandedIds, fitToViewport]);

  function resetView() {
    setExpandedIds(new Set());
    setSelectedId(rootId);
    onNodeSelect?.(data);
  }

  const onPointerDown = useCallback((event: React.PointerEvent<HTMLDivElement>) => {
    if (event.button !== 0) return;
    const target = event.currentTarget;
    target.setPointerCapture(event.pointerId);
    dragRef.current = {
      startX: event.clientX,
      startY: event.clientY,
      startTx: transform.x,
      startTy: transform.y,
      didDrag: false,
    };
    setIsDragging(false);
  }, [transform.x, transform.y]);

  const onPointerMove = useCallback((event: React.PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (!drag) return;

    const dx = event.clientX - drag.startX;
    const dy = event.clientY - drag.startY;

    if (!drag.didDrag && Math.hypot(dx, dy) < DRAG_THRESHOLD) return;

    drag.didDrag = true;
    setIsDragging(true);
    setTransform((prev) => ({
      ...prev,
      x: drag.startTx + dx,
      y: drag.startTy + dy,
    }));
  }, []);

  const onPointerUp = useCallback((event: React.PointerEvent<HTMLDivElement>) => {
    event.currentTarget.releasePointerCapture(event.pointerId);
    if (dragRef.current?.didDrag) {
      suppressClickRef.current = true;
      requestAnimationFrame(() => {
        suppressClickRef.current = false;
      });
    }
    dragRef.current = null;
    setIsDragging(false);
  }, []);

  function handleNodeClick(node: LayoutNode) {
    if (suppressClickRef.current) return;

    const id = node.id;
    setSelectedId(id);
    onNodeSelect?.(node.data);

    if (node.childCount === 0) return;

    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  return (
    <section className="rounded-[28px] border border-border bg-bg-elevated/62 p-4 shadow-[0_18px_52px_-30px_rgba(31,26,23,0.18)] md:p-5">
      <div className="mb-4 flex flex-col gap-3 border-b border-border-subtle/70 pb-4 md:flex-row md:items-end md:justify-between">
        <div className="max-w-2xl">
          <div className="app-kicker">Topology explorer</div>
          <p className="mt-2 text-sm leading-relaxed text-fg-muted">
            Start from the root page, then open branches one node at a time. Each card shows the page title and its relation
            label, so the tree reads like a research map instead of a canvas of dots.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={resetView}
            className="rounded-xl border border-border-subtle bg-bg/55 px-3 py-2 text-xs font-medium text-fg-muted transition-colors hover:border-accent-2/20 hover:bg-accent-2/[0.05] hover:text-fg"
          >
            Reset view
          </button>
          <button
            type="button"
            onClick={() => setTransform((prev) => ({ ...prev, scale: Math.min(MAX_SCALE, prev.scale * 1.16) }))}
            className="rounded-xl border border-border-subtle bg-bg/55 px-3 py-2 text-xs font-medium text-fg-muted transition-colors hover:border-accent-2/20 hover:bg-accent-2/[0.05] hover:text-fg"
          >
            Zoom in
          </button>
          <button
            type="button"
            onClick={() => setTransform((prev) => ({ ...prev, scale: Math.max(MIN_SCALE, prev.scale * 0.86) }))}
            className="rounded-xl border border-border-subtle bg-bg/55 px-3 py-2 text-xs font-medium text-fg-muted transition-colors hover:border-accent-2/20 hover:bg-accent-2/[0.05] hover:text-fg"
          >
            Zoom out
          </button>
          <button
            type="button"
            onClick={() => {
              const next = new Set<string>();
              next.add(rootId);
              setExpandedIds(next);
              setSelectedId(rootId);
              onNodeSelect?.(data);
            }}
            className="rounded-xl border border-border-subtle bg-bg/55 px-3 py-2 text-xs font-medium text-fg-muted transition-colors hover:border-accent-2/20 hover:bg-accent-2/[0.05] hover:text-fg"
          >
            Open root
          </button>
        </div>
      </div>

      <div className="mb-4 flex flex-wrap items-center gap-3 text-xs text-fg-dim">
        <span>
          <span className="font-mono" data-numeric>{nodes.length}</span> visible nodes
        </span>
        <span className="text-border-strong">·</span>
        <span>
          <span className="font-mono" data-numeric>{expandedIds.size}</span> expanded branches
        </span>
        <span className="text-border-strong">·</span>
        <span className="truncate">
          Selected: <span className="text-fg">{nodeTitle(selectedNode)}</span>
        </span>
        <span className="text-border-strong">·</span>
        <span>Drag to pan, wheel to zoom</span>
      </div>

      <div
        ref={containerRef}
        className={`relative h-[540px] overflow-hidden rounded-[24px] border border-border-subtle bg-[linear-gradient(180deg,rgba(255,255,255,0.02),rgba(255,255,255,0)),radial-gradient(circle_at_top,rgba(54,175,151,0.08),transparent_42%)] touch-none ${
          isDragging ? "cursor-grabbing" : "cursor-grab"
        }`}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        <div
          className="relative min-h-[460px]"
          style={{
            width: `${width}px`,
            height: `${height}px`,
            transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.scale})`,
            transformOrigin: "0 0",
            transition: isDragging ? "none" : "transform 220ms ease",
            willChange: "transform",
          }}
        >
          <svg className="absolute inset-0 h-full w-full" width={width} height={height}>
            {links.map((link) => {
              const sourceY = link.source.y + CARD_HEIGHT / 2 - 4;
              const targetY = link.target.y - CARD_HEIGHT / 2 + 4;
              const midY = sourceY + (targetY - sourceY) * 0.45;

              return (
                <path
                  key={`${link.source.id}-${link.target.id}`}
                  d={`M ${link.source.x} ${sourceY} C ${link.source.x} ${midY}, ${link.target.x} ${midY}, ${link.target.x} ${targetY}`}
                  fill="none"
                  stroke="rgba(43,170,145,0.28)"
                  strokeWidth={1.5}
                  strokeLinecap="round"
                />
              );
            })}
          </svg>

          {nodes.map((node) => {
            const isRoot = node.id === rootId;
            const isSelected = node.id === selectedId;
            const hasChildren = node.childCount > 0;
            const cardWidth = isRoot ? ROOT_CARD_WIDTH : CARD_WIDTH;

            return (
              <button
                key={node.id}
                type="button"
                onPointerDown={(event) => event.stopPropagation()}
                onClick={() => handleNodeClick(node)}
                className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-[20px] border px-4 py-3 text-left outline-none transition-all duration-200 focus-visible:border-accent-2/40 focus-visible:outline-none ${
                  isSelected
                    ? "border-accent-2/40 bg-bg shadow-[0_18px_36px_-26px_rgba(31,26,23,0.28)]"
                    : "border-border-subtle bg-bg-elevated/90 hover:-translate-y-[calc(50%+2px)] hover:border-accent-2/24 hover:bg-bg"
                }`}
                style={{
                  left: `${node.x}px`,
                  top: `${node.y}px`,
                  width: `${cardWidth}px`,
                  backgroundColor: isSelected ? "rgba(249, 248, 244, 0.98)" : depthColor(node.depth),
                }}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="app-kicker text-[10px]">
                      {node.depth === 0 ? "Root page" : `Depth ${node.depth}`}
                    </div>
                    <div className="mt-1 line-clamp-2 text-sm font-semibold leading-snug text-fg">
                      {nodeTitle(node.data)}
                    </div>
                  </div>

                  {hasChildren && (
                    <div
                      className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-[11px] font-semibold transition-colors ${
                        node.expanded
                          ? "border-accent-2/30 bg-accent-2/[0.08] text-accent-2"
                          : "border-border-subtle bg-bg/65 text-fg-dim"
                      }`}
                    >
                      {node.expanded ? "−" : "+"}
                    </div>
                  )}
                </div>

                <div className="mt-2 line-clamp-1 text-xs text-fg-muted">
                  {nodeMeta(node.data)}
                </div>

                <div className="mt-3 flex flex-wrap gap-1.5 text-[10px]">
                  <span className="rounded-full border border-border-subtle/80 bg-bg/55 px-2 py-1 text-fg-dim">
                    {node.data.crawled ? "Crawled" : node.data.error || "Failed"}
                  </span>
                  {hasChildren && (
                    <span className="rounded-full border border-border-subtle/80 bg-bg/55 px-2 py-1 text-fg-dim">
                      {node.childCount} child{node.childCount === 1 ? "" : "ren"}
                    </span>
                  )}
                  {node.descendantCount > 0 && (
                    <span className="rounded-full border border-border-subtle/80 bg-bg/55 px-2 py-1 text-fg-dim">
                      {node.descendantCount} below
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
