import React, { useState } from "react";
import { FaFolder, FaFile, FaPlus, FaTrash, FaEdit } from "react-icons/fa";
import { v4 as generateId } from "uuid";

const defaultStructure = [
  {
    id: generateId(),
    name: "Main Directory",
    type: "folder",
    items: [
      { id: generateId(), name: "Document1.txt", type: "file" },
      {
        id: generateId(),
        name: "Projects",
        type: "folder",
        items: [{ id: generateId(), name: "Notes.txt", type: "file" }],
      },
    ],
  },
];

const FileManager = () => {
  const [fileData, setFileData] = useState(defaultStructure);
  const [openFolders, setOpenFolders] = useState(new Set());

  const toggleDirectory = (id) => {
    const updatedSet = new Set(openFolders);
    updatedSet.has(id) ? updatedSet.delete(id) : updatedSet.add(id);
    setOpenFolders(updatedSet);
  };

  const addNewItem = (parentId, itemType) => {
    const newItem = { id: generateId(), name: itemType === "folder" ? "New Directory" : "Untitled.txt", type: itemType };
    const updateTree = (nodes) =>
      nodes.map((node) =>
        node.id === parentId && node.type === "folder"
          ? { ...node, items: [...(node.items || []), newItem] }
          : { ...node, items: node.items ? updateTree(node.items) : [] }
      );
    setFileData(updateTree(fileData));
  };

  const removeItem = (id) => {
    const filterTree = (nodes) => nodes.filter((node) => node.id !== id).map((node) => ({
      ...node,
      items: node.items ? filterTree(node.items) : [],
    }));
    setFileData(filterTree(fileData));
  };

  const renameItem = (id, newName) => {
    const modifyTree = (nodes) =>
      nodes.map((node) =>
        node.id === id ? { ...node, name: newName } : { ...node, items: node.items ? modifyTree(node.items) : [] }
      );
    setFileData(modifyTree(fileData));
  };

  const renderStructure = (nodes) => (
    <ul>
      {nodes.map((node) => (
        <li key={node.id}>
          {node.type === "folder" && (
            <span onClick={() => toggleDirectory(node.id)} style={{ cursor: "pointer" }}>
              {openFolders.has(node.id) ? "▼" : "▶"} <FaFolder /> {node.name}
            </span>
          )}
          {node.type === "file" && (
            <span>
              <FaFile /> {node.name}
            </span>
          )}
          <button onClick={() => addNewItem(node.id, "folder")}>Folder <FaPlus /></button>
          <button onClick={() => addNewItem(node.id, "file")}>File <FaPlus /></button>
          <button onClick={() => renameItem(node.id, prompt("Rename to:", node.name))}><FaEdit /></button>
          <button onClick={() => removeItem(node.id)}><FaTrash /></button>
          {node.items && openFolders.has(node.id) && renderStructure(node.items)}
        </li>
      ))}
    </ul>
  );

  return <div>{renderStructure(fileData)}</div>;
};

export default FileManager;
