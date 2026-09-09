import React, { useState, useRef } from 'react'
import AppLayout from '../components/AppLayout'
import CoupleImage from '../components/CoupleImage'
import { useAuth } from '../contexts/AuthContext'

export default function MemoriesPage() {
  const {
    memories,
    memoryFolders,
    createMemoryFolder,
    renameMemoryFolder,
    deleteMemoryFolder,
    uploadMemory,
    deleteMemory,
    toggleFavoriteMemory,
  } = useAuth()

  const [activeTab, setActiveTab] = useState('folders') // 'folders' | 'all'
  const [viewingFolder, setViewingFolder] = useState(null) // null or folder object
  const [activeCategory, setActiveCategory] = useState('All')

  // Modals
  const [showAddModal, setShowAddModal] = useState(false)
  const [showCreateFolderModal, setShowCreateFolderModal] = useState(false)
  const [editingFolder, setEditingFolder] = useState(null)
  const [deletingFolderId, setDeletingFolderId] = useState(null)

  const [selectedMemory, setSelectedMemory] = useState(null)
  const [deletingMemoryId, setDeletingMemoryId] = useState(null)

  // Folder Form State
  const [folderNameInput, setFolderNameInput] = useState('')

  // New Memory Form State
  const [newTitle, setNewTitle] = useState('')
  const [newDate, setNewDate] = useState('')
  const [newCategory, setNewCategory] = useState('First Date')
  const [newDescription, setNewDescription] = useState('')
  const [targetFolderId, setTargetFolderId] = useState('')
  const [fileDataUrl, setFileDataUrl] = useState('')
  const [fileType, setFileType] = useState('photo')
  const [fileName, setFileName] = useState('')
  const fileInputRef = useRef(null)

  const categories = ['All', 'First Date', 'Travel', 'Birthday', 'Celebration', 'Movie Night', 'Adventure']

  // File Selector Handler
  const handleFileSelect = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setFileName(file.name)
    const isVideo = file.type.startsWith('video')
    setFileType(isVideo ? 'video' : 'photo')

    const reader = new FileReader()
    reader.onload = (event) => {
      setFileDataUrl(event.target?.result || '')
    }
    reader.readAsDataURL(file)
  }

  // Create Folder Handler
  const handleCreateFolder = async (e) => {
    e.preventDefault()
    if (!folderNameInput.trim()) return
    try {
      const created = await createMemoryFolder(folderNameInput.trim())
      setShowCreateFolderModal(false)
      setFolderNameInput('')
      if (created && viewingFolder) {
        setViewingFolder(created)
      }
    } catch (err) {
      console.error('Failed to create folder:', err)
    }
  }

  // Rename Folder Handler
  const handleRenameFolder = async (e) => {
    e.preventDefault()
    if (!editingFolder || !folderNameInput.trim()) return
    const folderId = editingFolder._id || editingFolder.id
    try {
      await renameMemoryFolder(folderId, folderNameInput.trim())
      if ((viewingFolder?._id || viewingFolder?.id) === folderId) {
        setViewingFolder((prev) => ({ ...prev, name: folderNameInput.trim() }))
      }
      setEditingFolder(null)
      setFolderNameInput('')
    } catch (err) {
      console.error('Failed to rename folder:', err)
    }
  }

  // Delete Folder Handler
  const confirmDeleteFolder = async () => {
    if (deletingFolderId) {
      try {
        await deleteMemoryFolder(deletingFolderId)
        if ((viewingFolder?._id || viewingFolder?.id) === deletingFolderId) {
          setViewingFolder(null)
        }
        setDeletingFolderId(null)
      } catch (err) {
        console.error('Failed to delete folder:', err)
      }
    }
  }

  // Save Memory Handler
  const handleAddMemory = async (e) => {
    e.preventDefault()
    if (!newTitle.trim()) return
    const targetId = targetFolderId || (viewingFolder ? (viewingFolder._id || viewingFolder.id) : null)
    try {
      await uploadMemory({
        title: newTitle.trim(),
        url: fileDataUrl || 'https://images.unsplash.com/photo-1518199266791-5375a83190b7',
        mediaType: fileType,
        folderId: targetId,
        note: newDescription,
      })
      setShowAddModal(false)
      setNewTitle('')
      setNewDate('')
      setNewDescription('')
      setFileDataUrl('')
      setFileName('')
      setFileType('photo')
      setTargetFolderId('')
    } catch (err) {
      console.error('Failed to upload memory:', err)
    }
  }

  // Delete Memory Handler
  const confirmDeleteMemory = async () => {
    if (deletingMemoryId) {
      try {
        await deleteMemory(deletingMemoryId)
        if ((selectedMemory?._id || selectedMemory?.id) === deletingMemoryId) {
          setSelectedMemory(null)
        }
        setDeletingMemoryId(null)
      } catch (err) {
        console.error('Failed to delete memory:', err)
      }
    }
  }

  // Calculate Photos & Videos counts for a folder
  const getFolderCounts = (folderId) => {
    const items = memories.filter((m) => (m.folderId?._id || m.folderId)?.toString() === folderId?.toString())
    const photoCount = items.filter((m) => m.mediaType === 'photo' || !m.mediaType).length
    const videoCount = items.filter((m) => m.mediaType === 'video').length
    return { photos: photoCount, videos: videoCount, total: items.length, items }
  }

  const openUploadModalForFolder = (folderId = '') => {
    setTargetFolderId(folderId || (viewingFolder ? viewingFolder.id : ''))
    setShowAddModal(true)
  }

  const openEditFolderModal = (folder) => {
    setEditingFolder(folder)
    setFolderNameInput(folder.name)
  }

  // Filtered list for "All Memories" tab
  const filteredAllMemories =
    activeCategory === 'All'
      ? specialMoments
      : specialMoments.filter((m) => m.category === activeCategory)

  // Filtered list for active Folder View
  const folderMemories = viewingFolder
    ? specialMoments.filter((m) => m.folderId === viewingFolder.id)
    : []

  return (
    <AppLayout>
      <div className="max-w-5xl mx-auto space-y-8 animate-fadeIn">
        {/* TOP HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-bold text-[#C44569] uppercase tracking-wider bg-[#FFF1F4] px-3.5 py-1 rounded-full border border-[#F7DDE4]">
                MEMORY ALBUMS & TIMELINE
              </span>
              {viewingFolder && (
                <span className="text-xs font-bold text-[#681F3B] bg-white px-3 py-1 rounded-full border border-[#EADDE2]">
                  📁 {viewingFolder.name}
                </span>
              )}
            </div>
            <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#681F3B]">
              {viewingFolder ? viewingFolder.name : 'Memories & Photo Albums'}
            </h1>
            <p className="text-sm text-[#75676E] mt-1">
              {viewingFolder
                ? `Viewing photos and videos saved in "${viewingFolder.name}"`
                : 'Organize your actual photos and videos into custom memory folders.'}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0 flex-wrap">
            {viewingFolder ? (
              <>
                <button
                  onClick={() => setViewingFolder(null)}
                  className="px-4 py-2.5 rounded-xl border border-[#EADDE2] bg-white text-xs font-bold text-[#681F3B] hover:bg-[#FFF9F7] shadow-xs"
                >
                  ← Back to All Folders
                </button>
                <button
                  onClick={() => openUploadModalForFolder(viewingFolder.id)}
                  className="btn-primary px-5 py-2.5 text-xs font-bold flex items-center gap-2 shadow-md"
                >
                  <span>+ Upload to Folder</span>
                  <span>📸</span>
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => {
                    setFolderNameInput('')
                    setShowCreateFolderModal(true)
                  }}
                  className="px-5 py-2.5 rounded-xl bg-[#681F3B] hover:bg-[#9E3155] text-white text-xs font-bold shadow-md transition-colors flex items-center gap-2"
                >
                  <span>+ Create Folder</span>
                  <span>📁</span>
                </button>

                <button
                  onClick={() => openUploadModalForFolder('')}
                  className="btn-primary px-5 py-2.5 text-xs font-bold flex items-center gap-2 shadow-md"
                >
                  <span>+ Save New Memory</span>
                  <span>📸</span>
                </button>
              </>
            )}
          </div>
        </div>

        {/* TABS & BREADCRUMB BAR (When not in folder view) */}
        {!viewingFolder && (
          <div className="flex items-center justify-between border-b border-[#EADDE2] pb-3 gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveTab('folders')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                  activeTab === 'folders'
                    ? 'bg-[#681F3B] text-white shadow-sm'
                    : 'bg-white text-[#75676E] border border-[#EADDE2] hover:border-[#C44569]'
                }`}
              >
                <span>📁 Folders / Albums</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] bg-white/20">{memoryFolders.length}</span>
              </button>

              <button
                onClick={() => setActiveTab('all')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                  activeTab === 'all'
                    ? 'bg-[#681F3B] text-white shadow-sm'
                    : 'bg-white text-[#75676E] border border-[#EADDE2] hover:border-[#C44569]'
                }`}
              >
                <span>🖼️ All Uploaded Memories</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] bg-white/20">{specialMoments.length}</span>
              </button>
            </div>

            {activeTab === 'all' && (
              <div className="flex items-center gap-2 overflow-x-auto">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-3 py-1.5 rounded-lg text-[11px] font-semibold whitespace-nowrap transition-colors ${
                      activeCategory === cat
                        ? 'bg-[#C44569] text-white'
                        : 'bg-white border border-[#EADDE2] text-[#75676E] hover:border-[#C44569]'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 1. VIEWING A SPECIFIC FOLDER */}
        {viewingFolder && (
          <div className="space-y-6">
            <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-[#EADDE2] shadow-xs">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setViewingFolder(null)}
                  className="w-9 h-9 rounded-xl bg-[#FFF1F4] text-[#C44569] flex items-center justify-center text-sm font-bold hover:bg-[#F7DDE4]"
                  title="Back to Folders"
                >
                  ←
                </button>
                <div>
                  <h2 className="font-serif font-bold text-lg text-[#681F3B] flex items-center gap-2">
                    <span>📁</span>
                    <span>{viewingFolder.name}</span>
                  </h2>
                  <p className="text-xs text-[#75676E]">
                    {getFolderCounts(viewingFolder.id).photos} Photos • {getFolderCounts(viewingFolder.id).videos} Videos
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => openEditFolderModal(viewingFolder)}
                  className="px-3 py-1.5 rounded-lg border border-[#EADDE2] text-xs font-bold text-[#681F3B] hover:bg-[#FFF9F7]"
                >
                  ✏️ Rename Folder
                </button>
                <button
                  onClick={() => setDeletingFolderId(viewingFolder.id)}
                  className="px-3 py-1.5 rounded-lg border border-rose-200 text-xs font-bold text-rose-600 hover:bg-rose-50"
                >
                  🗑️ Delete Folder
                </button>
              </div>
            </div>

            {/* Folder Items Grid */}
            {folderMemories.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-[#EADDE2] shadow-sm space-y-4 max-w-xl mx-auto">
                <div className="w-16 h-16 rounded-full bg-[#FFF1F4] text-[#C44569] flex items-center justify-center text-3xl mx-auto">
                  📁
                </div>
                <h3 className="text-xl font-serif font-bold text-[#681F3B]">Folder is empty</h3>
                <p className="text-xs text-[#75676E]">
                  There are no photos or videos in "{viewingFolder.name}" yet.
                </p>
                <button
                  onClick={() => openUploadModalForFolder(viewingFolder.id)}
                  className="btn-primary px-6 py-2.5 text-xs font-bold shadow-md inline-flex items-center gap-2"
                >
                  <span>+ Upload Photo or Video</span>
                  <span>📸</span>
                </button>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {folderMemories.map((mem) => (
                  <div
                    key={mem.id}
                    className="bg-white rounded-3xl p-5 border border-[#EADDE2] shadow-sm hover:shadow-lg transition-all card-hover flex flex-col justify-between"
                  >
                    <div>
                      <div className="relative group rounded-2xl overflow-hidden mb-4 bg-slate-900 border border-[#EADDE2]">
                        {mem.mediaUrl ? (
                          mem.mediaType === 'video' ? (
                            <div className="relative aspect-video bg-black flex items-center justify-center">
                              <video src={mem.mediaUrl} className="w-full h-44 object-cover" />
                              <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                                <span className="w-12 h-12 rounded-full bg-[#C44569] text-white flex items-center justify-center text-xl shadow-lg">🎬</span>
                              </div>
                            </div>
                          ) : (
                            <img
                              src={mem.mediaUrl}
                              alt={mem.title}
                              className="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-300 cursor-pointer"
                              onClick={() => setSelectedMemory(mem)}
                            />
                          )
                        ) : (
                          <CoupleImage folder={mem.folder || 'memories'} alt={mem.title} className="w-full h-44 object-cover" aspect="4/3" />
                        )}

                        <button
                          onClick={() => toggleFavoriteMoment(mem.id)}
                          className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-base shadow hover:scale-110 transition-transform"
                        >
                          {mem.favorite ? '❤️' : '🤍'}
                        </button>

                        <span className="absolute bottom-3 left-3 text-[10px] font-bold uppercase tracking-wider text-white bg-black/60 backdrop-blur-md px-2.5 py-0.5 rounded-full border border-white/20">
                          {mem.mediaType === 'video' ? '🎬 Video' : '📸 Photo'}
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-xs mb-2">
                        <span className="font-bold text-[#C44569] bg-[#FFF1F4] px-2.5 py-0.5 rounded-full border border-[#F7DDE4]">
                          {mem.category || 'General'}
                        </span>
                        <span className="text-[#75676E] font-medium">{mem.date}</span>
                      </div>

                      <h3 className="text-lg font-serif font-bold text-[#681F3B] hover:text-[#C44569] cursor-pointer" onClick={() => setSelectedMemory(mem)}>
                        {mem.title}
                      </h3>
                      {mem.note && (
                        <p className="mt-2 text-xs text-[#75676E] leading-relaxed line-clamp-2">
                          {mem.note}
                        </p>
                      )}
                    </div>

                    <div className="mt-4 pt-3 border-t border-[#EADDE2] flex items-center justify-between text-xs">
                      <button
                        onClick={() => setSelectedMemory(mem)}
                        className="font-bold text-[#681F3B] hover:text-[#C44569] flex items-center gap-1"
                      >
                        <span>View / Open</span>
                        <span>→</span>
                      </button>
                      <button
                        onClick={() => setDeletingMemoryId(mem.id)}
                        className="text-xs font-bold text-rose-600 hover:bg-rose-50 px-2.5 py-1 rounded-lg transition-colors"
                      >
                        🗑️ Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 2. FOLDERS / ALBUMS TAB */}
        {!viewingFolder && activeTab === 'folders' && (
          <div>
            {memoryFolders.length === 0 ? (
              /* FRIENDLY EMPTY STATE FOR FOLDERS */
              <div className="bg-white rounded-3xl p-12 text-center border border-[#EADDE2] shadow-sm space-y-4 max-w-xl mx-auto">
                <div className="w-16 h-16 rounded-full bg-[#FFF1F4] text-[#C44569] flex items-center justify-center text-3xl mx-auto">
                  📁
                </div>
                <h3 className="text-xl font-serif font-bold text-[#681F3B]">Create your first memory folder ❤️</h3>
                <p className="text-xs text-[#75676E]">
                  Organize your relationship photos and videos into custom albums like "Our Trips", "Birthdays", or "Special Moments".
                </p>
                <button
                  onClick={() => {
                    setFolderNameInput('')
                    setShowCreateFolderModal(true)
                  }}
                  className="btn-primary px-6 py-3 text-xs font-bold shadow-md inline-flex items-center gap-2"
                >
                  <span>+ Create Folder</span>
                  <span>📁</span>
                </button>
              </div>
            ) : (
              /* FOLDERS GRID LAYOUT */
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {memoryFolders.map((folder) => {
                  const counts = getFolderCounts(folder.id)
                  const firstItem = counts.items.find((i) => i.mediaUrl)

                  return (
                    <div
                      key={folder.id}
                      className="bg-white rounded-3xl p-5 border border-[#EADDE2] shadow-sm hover:shadow-lg transition-all card-hover flex flex-col justify-between group"
                    >
                      <div>
                        {/* Folder Thumbnail Preview */}
                        <div
                          onClick={() => setViewingFolder(folder)}
                          className="relative aspect-video rounded-2xl overflow-hidden mb-4 bg-gradient-to-tr from-[#681F3B] to-[#9E3155] cursor-pointer flex items-center justify-center border border-[#EADDE2]"
                        >
                          {firstItem ? (
                            firstItem.mediaType === 'video' ? (
                              <div className="relative w-full h-full flex items-center justify-center bg-black">
                                <video src={firstItem.mediaUrl} className="w-full h-full object-cover opacity-80" />
                                <span className="absolute text-3xl">📁</span>
                              </div>
                            ) : (
                              <img src={firstItem.mediaUrl} alt={folder.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                            )
                          ) : (
                            <div className="text-center text-white space-y-1">
                              <span className="text-4xl block">📁</span>
                              <p className="text-[10px] uppercase font-bold tracking-wider text-white/80">Folder Album</p>
                            </div>
                          )}

                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-3">
                            <span className="text-xs font-bold text-white tracking-wide drop-shadow">
                              📁 {folder.name}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <h3
                            onClick={() => setViewingFolder(folder)}
                            className="font-serif font-bold text-lg text-[#681F3B] hover:text-[#C44569] cursor-pointer"
                          >
                            {folder.name}
                          </h3>

                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => openEditFolderModal(folder)}
                              className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 text-xs"
                              title="Rename Folder"
                            >
                              ✏️
                            </button>
                            <button
                              onClick={() => setDeletingFolderId(folder.id)}
                              className="p-1.5 rounded-lg hover:bg-rose-50 text-rose-500 text-xs"
                              title="Delete Folder"
                            >
                              🗑️
                            </button>
                          </div>
                        </div>

                        <p className="text-xs font-semibold text-[#75676E] mt-1">
                          {counts.photos} Photos • {counts.videos} Videos
                        </p>
                      </div>

                      <div className="mt-4 pt-3 border-t border-[#EADDE2] flex items-center justify-between text-xs">
                        <button
                          onClick={() => setViewingFolder(folder)}
                          className="font-bold text-[#681F3B] hover:text-[#C44569] flex items-center gap-1"
                        >
                          <span>Open Folder</span>
                          <span>→</span>
                        </button>
                        <button
                          onClick={() => openUploadModalForFolder(folder.id)}
                          className="text-[11px] font-bold text-[#C44569] hover:underline"
                        >
                          + Add Photos/Videos
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}

        {/* 3. ALL MEMORIES TAB */}
        {!viewingFolder && activeTab === 'all' && (
          <div>
            {filteredAllMemories.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-[#EADDE2] shadow-sm space-y-4 max-w-xl mx-auto">
                <div className="w-16 h-16 rounded-full bg-[#FFF1F4] text-[#C44569] flex items-center justify-center text-3xl mx-auto">
                  📸
                </div>
                <h3 className="text-xl font-serif font-bold text-[#681F3B]">No uploaded memories yet.</h3>
                <p className="text-xs text-[#75676E]">
                  Upload your actual photos and videos to save and cherish your special moments.
                </p>
                <button
                  onClick={() => openUploadModalForFolder('')}
                  className="btn-primary px-6 py-2.5 text-xs font-bold shadow-md inline-flex items-center gap-2"
                >
                  <span>+ Save New Memory</span>
                  <span>📸</span>
                </button>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredAllMemories.map((mem) => {
                  const assignedFolder = memoryFolders.find((f) => f.id === mem.folderId)
                  return (
                    <div
                      key={mem.id}
                      className="bg-white rounded-3xl p-5 border border-[#EADDE2] shadow-sm hover:shadow-lg transition-all card-hover flex flex-col justify-between"
                    >
                      <div>
                        <div className="relative group rounded-2xl overflow-hidden mb-4 bg-slate-900 border border-[#EADDE2]">
                          {mem.mediaUrl ? (
                            mem.mediaType === 'video' ? (
                              <div className="relative aspect-video bg-black flex items-center justify-center">
                                <video src={mem.mediaUrl} className="w-full h-44 object-cover" />
                                <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                                  <span className="w-12 h-12 rounded-full bg-[#C44569] text-white flex items-center justify-center text-xl shadow-lg">🎬</span>
                                </div>
                              </div>
                            ) : (
                              <img
                                src={mem.mediaUrl}
                                alt={mem.title}
                                className="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-300 cursor-pointer"
                                onClick={() => setSelectedMemory(mem)}
                              />
                            )
                          ) : (
                            <CoupleImage folder={mem.folder || 'memories'} alt={mem.title} className="w-full h-44 object-cover" aspect="4/3" />
                          )}

                          <button
                            onClick={() => toggleFavoriteMoment(mem.id)}
                            className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-base shadow hover:scale-110 transition-transform"
                          >
                            {mem.favorite ? '❤️' : '🤍'}
                          </button>

                          <span className="absolute bottom-3 left-3 text-[10px] font-bold uppercase tracking-wider text-white bg-black/60 backdrop-blur-md px-2.5 py-0.5 rounded-full border border-white/20">
                            {mem.mediaType === 'video' ? '🎬 Video' : '📸 Photo'}
                          </span>
                        </div>

                        <div className="flex items-center justify-between text-xs mb-2">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="font-bold text-[#C44569] bg-[#FFF1F4] px-2.5 py-0.5 rounded-full border border-[#F7DDE4]">
                              {mem.category || 'General'}
                            </span>
                            {assignedFolder && (
                              <span className="font-bold text-[#681F3B] bg-gray-100 px-2 py-0.5 rounded-full text-[10px]">
                                📁 {assignedFolder.name}
                              </span>
                            )}
                          </div>
                          <span className="text-[#75676E] font-medium">{mem.date}</span>
                        </div>

                        <h3 className="text-lg font-serif font-bold text-[#681F3B] hover:text-[#C44569] cursor-pointer" onClick={() => setSelectedMemory(mem)}>
                          {mem.title}
                        </h3>
                        {mem.note && (
                          <p className="mt-2 text-xs text-[#75676E] leading-relaxed line-clamp-2">
                            {mem.note}
                          </p>
                        )}
                      </div>

                      <div className="mt-4 pt-3 border-t border-[#EADDE2] flex items-center justify-between text-xs">
                        <button
                          onClick={() => setSelectedMemory(mem)}
                          className="font-bold text-[#681F3B] hover:text-[#C44569] flex items-center gap-1"
                        >
                          <span>View / Open</span>
                          <span>→</span>
                        </button>
                        <button
                          onClick={() => setDeletingMemoryId(mem.id)}
                          className="text-xs font-bold text-rose-600 hover:bg-rose-50 px-2.5 py-1 rounded-lg transition-colors"
                        >
                          🗑️ Remove
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}

        {/* MODAL 1: CREATE NEW FOLDER */}
        {showCreateFolderModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
            <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border border-[#EADDE2] shadow-2xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#EADDE2]">
                <h3 className="font-serif font-bold text-xl text-[#681F3B]">Create Memory Folder 📁</h3>
                <button onClick={() => setShowCreateFolderModal(false)} className="text-gray-400 hover:text-gray-600 text-lg">✕</button>
              </div>

              <form onSubmit={handleCreateFolder} className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-[#681F3B] mb-1">Folder / Album Name</label>
                  <input
                    type="text"
                    required
                    value={folderNameInput}
                    onChange={(e) => setFolderNameInput(e.target.value)}
                    placeholder="e.g. Our Trips, Birthdays, Special Moments"
                    className="w-full p-3 rounded-xl border border-[#EADDE2] text-sm focus:outline-none focus:border-[#C44569]"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowCreateFolderModal(false)}
                    className="px-4 py-2.5 rounded-xl border border-[#EADDE2] text-[#75676E] font-bold"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary px-6 py-2.5 text-xs font-bold shadow-md">
                    Create Folder ❤️
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL 2: RENAME FOLDER */}
        {editingFolder && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
            <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border border-[#EADDE2] shadow-2xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#EADDE2]">
                <h3 className="font-serif font-bold text-xl text-[#681F3B]">Rename Folder ✏️</h3>
                <button onClick={() => setEditingFolder(null)} className="text-gray-400 hover:text-gray-600 text-lg">✕</button>
              </div>

              <form onSubmit={handleRenameFolder} className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-[#681F3B] mb-1">New Folder Name</label>
                  <input
                    type="text"
                    required
                    value={folderNameInput}
                    onChange={(e) => setFolderNameInput(e.target.value)}
                    placeholder="e.g. Our Summer Trips"
                    className="w-full p-3 rounded-xl border border-[#EADDE2] text-sm focus:outline-none focus:border-[#C44569]"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setEditingFolder(null)}
                    className="px-4 py-2.5 rounded-xl border border-[#EADDE2] text-[#75676E] font-bold"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary px-6 py-2.5 text-xs font-bold shadow-md">
                    Update Name ✓
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL 3: DELETE FOLDER CONFIRMATION */}
        {deletingFolderId && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
            <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border border-[#EADDE2] shadow-2xl text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center text-3xl mx-auto">
                🗑️
              </div>
              <h3 className="text-xl font-serif font-bold text-[#681F3B]">Delete Folder & Contents?</h3>
              <p className="text-xs text-[#75676E]">
                Are you sure you want to delete this folder? All photos and videos stored inside this folder will also be removed from memory storage.
              </p>
              <div className="pt-2 flex items-center gap-3">
                <button
                  onClick={() => setDeletingFolderId(null)}
                  className="flex-1 py-3 rounded-xl border border-[#EADDE2] text-xs font-bold text-[#75676E] hover:bg-[#FFF9F7]"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDeleteFolder}
                  className="flex-1 py-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-md"
                >
                  Delete Folder
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL 4: DELETE MEMORY ITEM CONFIRMATION */}
        {deletingMemoryId && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
            <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border border-[#EADDE2] shadow-2xl text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center text-3xl mx-auto">
                🗑️
              </div>
              <h3 className="text-xl font-serif font-bold text-[#681F3B]">Remove Photo / Video?</h3>
              <p className="text-xs text-[#75676E]">
                Are you sure you want to delete this memory from your storage?
              </p>
              <div className="pt-2 flex items-center gap-3">
                <button
                  onClick={() => setDeletingMemoryId(null)}
                  className="flex-1 py-3 rounded-xl border border-[#EADDE2] text-xs font-bold text-[#75676E] hover:bg-[#FFF9F7]"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDeleteMemory}
                  className="flex-1 py-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-md"
                >
                  Remove Memory
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL 5: FULL MEMORY PHOTO / VIDEO VIEWER */}
        {selectedMemory && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fadeIn">
            <div className="bg-white rounded-3xl p-6 max-w-2xl w-full border border-[#EADDE2] shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between pb-3 border-b border-[#EADDE2]">
                <div>
                  <span className="text-[10px] font-bold uppercase text-[#C44569] bg-[#FFF1F4] px-3 py-1 rounded-full border border-[#F7DDE4]">
                    {selectedMemory.category || 'Memory'} • {selectedMemory.date}
                  </span>
                  <h3 className="font-serif font-bold text-2xl text-[#681F3B] mt-2">
                    {selectedMemory.title}
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedMemory(null)}
                  className="w-9 h-9 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 flex items-center justify-center font-bold"
                >
                  ✕
                </button>
              </div>

              <div className="rounded-2xl overflow-hidden bg-black border border-[#EADDE2] flex items-center justify-center">
                {selectedMemory.mediaUrl ? (
                  selectedMemory.mediaType === 'video' ? (
                    <video src={selectedMemory.mediaUrl} controls autoPlay className="w-full max-h-[60vh] object-contain" />
                  ) : (
                    <img src={selectedMemory.mediaUrl} alt={selectedMemory.title} className="w-full max-h-[60vh] object-contain" />
                  )
                ) : (
                  <CoupleImage folder={selectedMemory.folder || 'memories'} alt={selectedMemory.title} className="w-full max-h-[50vh] object-cover" />
                )}
              </div>

              {selectedMemory.note && (
                <div className="p-4 rounded-2xl bg-[#FFF9F7] border border-[#EADDE2]">
                  <p className="text-xs font-bold text-[#681F3B] uppercase tracking-wider mb-1">Story / Note</p>
                  <p className="text-xs text-[#2B2025] leading-relaxed">{selectedMemory.note}</p>
                </div>
              )}

              <div className="pt-2 flex justify-between items-center text-xs">
                <button
                  onClick={() => {
                    setDeletingMemoryId(selectedMemory.id)
                  }}
                  className="px-4 py-2.5 rounded-xl border border-rose-200 text-rose-600 font-bold hover:bg-rose-50"
                >
                  🗑️ Remove Memory
                </button>

                <button
                  onClick={() => setSelectedMemory(null)}
                  className="btn-primary px-6 py-2.5 font-bold shadow-md"
                >
                  Close Viewer
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL 6: SAVE NEW MEMORY FILE UPLOAD */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
            <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-[#EADDE2] shadow-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between pb-4 border-b border-[#EADDE2]">
                <h3 className="font-serif font-bold text-xl text-[#681F3B]">Save New Memory 📸</h3>
                <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-gray-600 text-lg">
                  ✕
                </button>
              </div>

              <form onSubmit={handleAddMemory} className="mt-5 space-y-4 text-xs">
                {/* File Upload Selector */}
                <div>
                  <label className="block font-bold text-[#681F3B] mb-1">Upload Photo or Video File</label>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileSelect}
                    accept="image/*,video/*"
                    className="hidden"
                  />
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-[#C44569]/40 hover:border-[#C44569] bg-[#FFF9F7] rounded-2xl p-4 text-center cursor-pointer transition-colors space-y-2"
                  >
                    {fileDataUrl ? (
                      <div className="space-y-2">
                        {fileType === 'video' ? (
                          <video src={fileDataUrl} className="h-32 mx-auto rounded-xl object-cover" />
                        ) : (
                          <img src={fileDataUrl} alt="Preview" className="h-32 mx-auto rounded-xl object-cover" />
                        )}
                        <p className="text-xs font-bold text-[#681F3B]">✓ Selected: {fileName}</p>
                        <p className="text-[10px] text-[#C44569] underline">Click to change file</p>
                      </div>
                    ) : (
                      <>
                        <span className="text-3xl block">📁</span>
                        <p className="font-bold text-[#681F3B] text-xs">Click here to upload your actual photo or video</p>
                        <p className="text-[11px] text-[#75676E]">Supports JPG, PNG, GIF, MP4, WEBM</p>
                      </>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-[#681F3B] mb-1">Memory Title</label>
                  <input
                    type="text"
                    required
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="e.g. Sunset Walk by the Beach"
                    className="w-full p-3 rounded-xl border border-[#EADDE2] text-sm focus:outline-none focus:border-[#C44569]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-[#681F3B] mb-1">Target Folder / Album</label>
                    <select
                      value={targetFolderId}
                      onChange={(e) => setTargetFolderId(e.target.value)}
                      className="w-full p-3 rounded-xl border border-[#EADDE2] text-xs focus:outline-none focus:border-[#C44569] bg-white font-medium"
                    >
                      <option value="">(No Folder / General)</option>
                      {memoryFolders.map((f) => (
                        <option key={f.id} value={f.id}>📁 {f.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block font-bold text-[#681F3B] mb-1">Category</label>
                    <select
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                      className="w-full p-3 rounded-xl border border-[#EADDE2] text-xs focus:outline-none focus:border-[#C44569] bg-white font-medium"
                    >
                      {categories.filter((c) => c !== 'All').map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-[#681F3B] mb-1">Date</label>
                  <input
                    type="date"
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    className="w-full p-3 rounded-xl border border-[#EADDE2] text-xs focus:outline-none focus:border-[#C44569]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#681F3B] mb-1">Story / Note</label>
                  <textarea
                    rows={3}
                    value={newDescription}
                    onChange={(e) => setNewDescription(e.target.value)}
                    placeholder="Write a few sentimental words about this moment..."
                    className="w-full p-3 rounded-xl border border-[#EADDE2] text-xs focus:outline-none focus:border-[#C44569]"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-5 py-2.5 rounded-xl border border-[#EADDE2] text-[#75676E] font-bold"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary px-6 py-2.5 text-xs font-bold shadow-md">
                    Save Memory ❤️
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  )
}
