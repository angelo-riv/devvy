import React, { useState } from 'react';

const fileStructure = {
  src: {
    components: {
      'Header.jsx': null,
      'Sidebar.jsx': null,
    },
    'App.jsx': null,
    'index.js': null,
  },
  'README.md': null,
  'package.json': null,
};

const TreeNode = ({ name, children, level = 0 }) => {
  const [isOpen, setIsOpen] = useState(false);
  const isFolder = children && typeof children === 'object';

  return (
    <div className="tree-node" style={{ paddingLeft: `${level * 1}rem` }}>
      <div onClick={() => isFolder && setIsOpen(!isOpen)} className="tree-label">
        {isFolder ? (isOpen ? '📂' : '📁') : '📄'} {name}
      </div>
      {isOpen && isFolder && (
        Object.entries(children).map(([childName, childContent]) => (
          <TreeNode key={childName} name={childName} children={childContent} level={level + 1} />
        ))
      )}
    </div>
  );
};

const FileExplorer = ({ files = [], folders = [], onFileClick }) => (
  <div className="file-explorer">
    <h3 className="explorer-title">Explorer</h3>
    <ul>
      {folders.map((folder) => (
        <li key={folder} className="folder">
          📁 {folder}
        </li>
      ))}
      {files.map((fileUrl) => {
        // Extract the file name from the URL
        const fileName = fileUrl.split('/').pop().split('?')[0];
        return (
          <li key={fileUrl} className="file" onClick={() => onFileClick(fileUrl)}>
            📄 {fileName}
          </li>
        );
      })}
    </ul>
  </div>
);

export default FileExplorer;
