import type { AssetData, FileNode } from "./types"

// ─── Path Parsing ────────────────────────────────────────────────────────────

/**
 * Split a storageKey into path segments.
 * "images/hero.png" → ["images", "hero.png"]
 */
export function parseStorageKeyPath(storageKey: string): string[] {
  return storageKey.split("/").filter(Boolean)
}

// ─── Count files recursively in a FileNode ───────────────────────────────────

function countFiles(node: FileNode): number {
  if (node.type === "file") return 1
  if (!node.children) return 0
  return node.children.reduce((sum, child) => sum + countFiles(child), 0)
}

// ─── Insert asset into folder tree at path segments ──────────────────────────

function insertIntoTree(
  nodes: FileNode[],
  segments: string[],
  asset: AssetData,
  basePath: string,
  startLevel: number
): void {
  if (segments.length === 0) return

  const [current, ...rest] = segments
  const currentPath = basePath ? `${basePath}/${current}` : current
  const isFile = rest.length === 0

  if (isFile) {
    // Leaf node → file
    nodes.push({
      id: `file-${asset.id}`,
      name: current,
      type: "file",
      path: currentPath,
      asset,
      level: startLevel,
    })
    return
  }

  // Intermediate node → folder
  let folder = nodes.find(
    (n) => n.type === "folder" && n.name === current
  )

  if (!folder) {
    folder = {
      id: `folder-${currentPath}`,
      name: current,
      type: "folder",
      path: currentPath,
      children: [],
      level: startLevel,
      isExpanded: false,
    }
    nodes.push(folder)
  }

  insertIntoTree(folder.children!, rest, asset, currentPath, startLevel + 1)
}

// ─── Sort nodes: folders first (alphabetical), then files (alphabetical) ─────

function sortNodes(nodes: FileNode[]): FileNode[] {
  return nodes
    .map((node) => {
      if (node.type === "folder" && node.children) {
        return { ...node, children: sortNodes(node.children) }
      }
      return node
    })
    .sort((a, b) => {
      if (a.type === "folder" && b.type === "file") return -1
      if (a.type === "file" && b.type === "folder") return 1
      return a.name.localeCompare(b.name, "de")
    })
}

// ─── Annotate folders with file counts ───────────────────────────────────────

function annotateCounts(nodes: FileNode[]): FileNode[] {
  return nodes.map((node) => {
    if (node.type === "folder") {
      const children = node.children ? annotateCounts(node.children) : []
      return {
        ...node,
        children,
        fileCount: countFiles({ ...node, children }),
      }
    }
    return node
  })
}

// ─── Build File Tree ─────────────────────────────────────────────────────────

/**
 * Build a file tree from a flat list of assets.
 *
 * @param assets       - Flat array of assets (with project/company relations)
 * @param groupByProject - If true, only groups by storageKey path (for project detail view).
 *                         If false, groups by Company → Project → storageKey path.
 */
export function buildFileTree(
  assets: AssetData[],
  groupByProject = false
): FileNode[] {
  const root: FileNode[] = []

  if (groupByProject) {
    // ── Project-specific view: just path hierarchy ──
    for (const asset of assets) {
      const segments = parseStorageKeyPath(asset.storageKey)
      insertIntoTree(root, segments, asset, "", 0)
    }
  } else {
    // ── Global view: Company → Project → path ──
    // Group assets by company
    const companyMap = new Map<
      string,
      { name: string; projects: Map<string, { name: string; assets: AssetData[] }> }
    >()

    // Separate: assets with project/company and orphans
    const orphanAssets: AssetData[] = []

    for (const asset of assets) {
      const companyName = asset.project?.company?.name
      const companyId = asset.project?.company?.id
      const projectName = asset.project?.name
      const projectId = asset.project?.id

      if (!companyId || !companyName || !projectId || !projectName) {
        orphanAssets.push(asset)
        continue
      }

      if (!companyMap.has(companyId)) {
        companyMap.set(companyId, { name: companyName, projects: new Map() })
      }

      const company = companyMap.get(companyId)!
      if (!company.projects.has(projectId)) {
        company.projects.set(projectId, { name: projectName, assets: [] })
      }
      company.projects.get(projectId)!.assets.push(asset)
    }

    // Build company → project → path tree
    for (const [companyId, company] of companyMap) {
      const companyNode: FileNode = {
        id: `company-${companyId}`,
        name: company.name,
        type: "folder",
        path: company.name,
        children: [],
        level: 0,
        isExpanded: true, // companies start expanded
      }

      for (const [projectId, project] of company.projects) {
        const projectPath = `${company.name}/${project.name}`
        const projectNode: FileNode = {
          id: `project-${projectId}`,
          name: project.name,
          type: "folder",
          path: projectPath,
          children: [],
          level: 1,
          isExpanded: true, // projects start expanded
        }

        for (const asset of project.assets) {
          const segments = parseStorageKeyPath(asset.storageKey)
          insertIntoTree(projectNode.children!, segments, asset, projectPath, 2)
        }

        companyNode.children!.push(projectNode)
      }

      root.push(companyNode)
    }

    // Orphan assets (no project/company) go into "Nicht zugeordnet" folder
    if (orphanAssets.length > 0) {
      const orphanNode: FileNode = {
        id: "folder-orphan",
        name: "Nicht zugeordnet",
        type: "folder",
        path: "Nicht zugeordnet",
        children: [],
        level: 0,
        isExpanded: true,
      }

      for (const asset of orphanAssets) {
        const segments = parseStorageKeyPath(asset.storageKey)
        insertIntoTree(orphanNode.children!, segments, asset, "Nicht zugeordnet", 1)
      }

      root.push(orphanNode)
    }
  }

  return annotateCounts(sortNodes(root))
}

// ─── Toggle Node Expanded (immutable) ────────────────────────────────────────

export function toggleNodeExpanded(nodes: FileNode[], id: string): FileNode[] {
  return nodes.map((node) => {
    if (node.id === id) {
      return { ...node, isExpanded: !node.isExpanded }
    }
    if (node.type === "folder" && node.children) {
      return { ...node, children: toggleNodeExpanded(node.children, id) }
    }
    return node
  })
}

// ─── Find Node by ID (recursive) ────────────────────────────────────────────

export function findNodeById(nodes: FileNode[], id: string): FileNode | null {
  for (const node of nodes) {
    if (node.id === id) return node
    if (node.type === "folder" && node.children) {
      const found = findNodeById(node.children, id)
      if (found) return found
    }
  }
  return null
}

// ─── Expand all nodes ────────────────────────────────────────────────────────

export function expandAll(nodes: FileNode[]): FileNode[] {
  return nodes.map((node) => {
    if (node.type === "folder") {
      return {
        ...node,
        isExpanded: true,
        children: node.children ? expandAll(node.children) : [],
      }
    }
    return node
  })
}

// ─── Collapse all nodes ─────────────────────────────────────────────────────

export function collapseAll(nodes: FileNode[]): FileNode[] {
  return nodes.map((node) => {
    if (node.type === "folder") {
      return {
        ...node,
        isExpanded: false,
        children: node.children ? collapseAll(node.children) : [],
      }
    }
    return node
  })
}
