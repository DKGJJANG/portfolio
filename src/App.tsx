import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowUpRight, X, Plus, LogIn, LogOut, Upload, Image as ImageIcon, Trash2, Loader2, GripVertical } from 'lucide-react';
import { auth, db, storage } from './lib/firebase';
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  signOut,
  User
} from 'firebase/auth';
import { 
  collection, 
  addDoc, 
  query, 
  onSnapshot, 
  orderBy, 
  deleteDoc, 
  doc,
  Timestamp 
} from 'firebase/firestore';
import { 
  ref, 
  uploadBytes, 
  getDownloadURL 
} from 'firebase/storage';

// --- Types ---
interface ProjectImage {
  url: string;
  caption?: string;
}

interface Project {
  id: string;
  number: string;
  title: string;
  subtitle: string;
  description: string;
  category: string;
  thumbnail: string;
  images: ProjectImage[];
  createdAt: string;
}

const CATEGORIES = [
  '공공디자인',
  '브랜딩디자인',
  '시각디자인',
  '인테리어디자인',
  '행사디자인'
];

// --- Admin Components ---

const AdminLoginModal = ({ onClose }: { onClose: () => void }) => {
  const [email, setEmail] = useState('dabin_0408@naver.com');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await signInWithEmailAndPassword(auth, email, password);
      onClose();
    } catch (err: any) {
      setError('로그인에 실패했습니다. 아이디와 비밀번호를 확인해주세요.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[300] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white p-8 rounded-2xl w-full max-w-md shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-display font-bold text-brand-green">ADMIN LOGIN</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-brand-green/40 mb-1">ID (Email)</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-lg focus:ring-2 focus:ring-brand-green/20 outline-none"
              placeholder="dabin@naver.com"
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-brand-green/40 mb-1">Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-lg focus:ring-2 focus:ring-brand-green/20 outline-none"
            />
          </div>
          {error && <p className="text-red-500 text-xs">{error}</p>}
          <button 
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-brand-green text-white font-bold rounded-lg hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'LOGIN'}
          </button>
        </form>
      </motion.div>
    </motion.div>
  );
};

const AddProjectModal = ({ onClose }: { onClose: () => void }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    description: '',
    category: CATEGORIES[0],
    number: '',
  });
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [subImages, setSubImages] = useState<{ file: File; caption: string }[]>([]);

  const handleDrop = (e: React.DragEvent, type: 'thumb' | 'sub') => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    if (type === 'thumb') {
      setThumbnail(files[0]);
    } else {
      setSubImages(prev => [...prev, ...files.map(file => ({ file, caption: '' }))]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>, type: 'thumb' | 'sub') => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    if (type === 'thumb') {
      setThumbnail(files[0]);
    } else {
      setSubImages(prev => [...prev, ...files.map(file => ({ file, caption: '' }))]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!thumbnail) return alert('썸네일 이미지는 필수입니다.');
    
    setLoading(true);
    try {
      // 1. Upload Thumbnail
      const thumbRef = ref(storage, `projects/${Date.now()}_thumb_${thumbnail.name}`);
      const thumbSnapshot = await uploadBytes(thumbRef, thumbnail);
      const thumbnailUrl = await getDownloadURL(thumbSnapshot.ref);

      // 2. Upload Sub Images
      const uploadedImages = await Promise.all(
        subImages.map(async (item) => {
          const imgRef = ref(storage, `projects/${Date.now()}_sub_${item.file.name}`);
          const snap = await uploadBytes(imgRef, item.file);
          const url = await getDownloadURL(snap.ref);
          return { url, caption: item.caption };
        })
      );

      // 3. Save to Firestore
      await addDoc(collection(db, 'projects'), {
        ...formData,
        thumbnail: thumbnailUrl,
        images: uploadedImages,
        createdAt: Timestamp.now(),
      });

      alert('프로젝트가 성공적으로 등록되었습니다.');
      onClose();
    } catch (err) {
      console.error(err);
      alert('오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[300] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 md:p-10"
      onClick={onClose}
    >
      <motion.div 
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-white w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-8 border-b sticky top-0 bg-white z-10 flex justify-between items-center">
          <h2 className="text-2xl font-display font-bold text-brand-green">ADD NEW PROJECT</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-brand-green/40 mb-1">Category</label>
                <select 
                  value={formData.category}
                  onChange={e => setFormData({...formData, category: e.target.value})}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-lg outline-none focus:ring-2 focus:ring-brand-green/20"
                >
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-brand-green/40 mb-1">Title</label>
                <input 
                  required
                  type="text" 
                  value={formData.title}
                  onChange={e => setFormData({...formData, title: e.target.value})}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-lg outline-none focus:ring-2 focus:ring-brand-green/20"
                  placeholder="프로젝트 제목"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-brand-green/40 mb-1">Subtitle</label>
                <input 
                  type="text" 
                  value={formData.subtitle}
                  onChange={e => setFormData({...formData, subtitle: e.target.value})}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-lg outline-none focus:ring-2 focus:ring-brand-green/20"
                  placeholder="EX: BRANDING DESIGN / Identity"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-brand-green/40 mb-1">Project NO.</label>
                <input 
                  type="text" 
                  value={formData.number}
                  onChange={e => setFormData({...formData, number: e.target.value})}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-lg outline-none focus:ring-2 focus:ring-brand-green/20"
                  placeholder="EX: 01"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-brand-green/40 mb-1">Description</label>
                <textarea 
                  rows={8}
                  value={formData.description}
                  onChange={e => setFormData({...formData, description: e.target.value})}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-lg outline-none focus:ring-2 focus:ring-brand-green/20 resize-none"
                  placeholder="프로젝트 상세 설명 (선택사항)"
                />
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-brand-green/40 mb-2">Thumbnail (Main Image)</label>
              <div 
                onDragOver={e => e.preventDefault()}
                onDrop={e => handleDrop(e, 'thumb')}
                className={`relative border-2 border-dashed rounded-xl p-8 transition-all flex flex-col items-center justify-center gap-4 ${thumbnail ? 'border-brand-green bg-brand-green/5' : 'border-gray-200 hover:border-brand-green/40 bg-gray-50'}`}
              >
                {thumbnail ? (
                  <div className="relative group">
                    <img src={URL.createObjectURL(thumbnail)} className="h-40 rounded-lg shadow-lg" alt="Thumbnail" />
                    <button onClick={() => setThumbnail(null)} className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full"><X size={14} /></button>
                  </div>
                ) : (
                  <>
                    <div className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center"><Upload className="text-brand-green/40" /></div>
                    <p className="text-xs text-gray-500">드래그 앤 드롭 하거나 클릭하여 업로드</p>
                  </>
                )}
                <input type="file" hidden onChange={e => handleFileSelect(e, 'thumb')} id="thumb-input" />
                <label htmlFor="thumb-input" className="absolute inset-0 cursor-pointer" />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-brand-green/40 mb-2">Sub Images & Captions</label>
              <div 
                onDragOver={e => e.preventDefault()}
                onDrop={e => handleDrop(e, 'sub')}
                className="border-2 border-dashed border-gray-200 bg-gray-50 rounded-xl p-8 flex flex-col items-center justify-center gap-4 hover:border-brand-green/40 transition-all relative"
              >
                <div className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center"><ImageIcon className="text-brand-green/40" /></div>
                <p className="text-xs text-gray-500">추가 상세 이미지들을 여기에 드롭하세요</p>
                <input type="file" multiple hidden onChange={e => handleFileSelect(e, 'sub')} id="sub-input" />
                <label htmlFor="sub-input" className="absolute inset-0 cursor-pointer" />
              </div>

              {subImages.length > 0 && (
                <div className="mt-6 space-y-4">
                  {subImages.map((item, idx) => (
                    <div key={idx} className="flex gap-4 p-4 bg-gray-50 rounded-xl items-center">
                      <div className="flex-shrink-0 cursor-grab"><GripVertical size={16} className="text-gray-300" /></div>
                      <img src={URL.createObjectURL(item.file)} className="w-20 h-20 object-cover rounded-lg" alt={`Sub image ${idx}`} />
                      <div className="flex-grow">
                        <input 
                          type="text" 
                          placeholder="이미지 설명 (문구)"
                          value={item.caption}
                          onChange={e => {
                            const next = [...subImages];
                            next[idx].caption = e.target.value;
                            setSubImages(next);
                          }}
                          className="w-full px-4 py-2 bg-white border border-gray-100 rounded-lg outline-none focus:ring-2 focus:ring-brand-green/20"
                        />
                      </div>
                      <button onClick={() => setSubImages(subImages.filter((_, i) => i !== idx))} className="p-2 text-red-500 hover:bg-red-50 rounded-lg">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full py-5 bg-brand-green text-white font-bold tracking-widest uppercase rounded-xl hover:scale-[1.01] transition-all flex items-center justify-center gap-3 shadow-lg shadow-brand-green/20"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'PUBLISH PROJECT'}
          </button>
        </form>
      </motion.div>
    </motion.div>
  );
};

// --- Data ---
const SAMPLE_PROJECTS: Project[] = [
  {
    id: 'sample-59',
    number: '01',
    title: '세종공동캠퍼스 외벽현수막 및 포토존',
    subtitle: 'PUBLIC DESIGN / Signage & Photozone',
    description: '세종공동캠퍼스 내외부의 시각적 활력을 위한 대형 외벽 현수막 및 방문객 포토존 디자인 프로젝트입니다.',
    category: '공공디자인',
    thumbnail: 'https://picsum.photos/seed/public16/1200/800',
    images: [],
    createdAt: new Date().toISOString()
  },
  {
    id: 'sample-2',
    number: '02',
    title: '국립세종수목원',
    subtitle: 'PUBLIC DESIGN / Signage System',
    description: '국립세종수목원의 자연과 조화되는 사인 시스템 디자인 프로젝트입니다.',
    category: '공공디자인',
    thumbnail: 'https://picsum.photos/seed/public1/1200/800',
    images: [
      { url: 'https://picsum.photos/seed/public2/1200/800', caption: '수목원 입구 종합 안내도' },
    ],
    createdAt: new Date().toISOString()
  }
];

// --- Components ---

const MarqueeImages = ({ images, index }: { images: string[]; index: number }) => {
  const isEvenRow = index % 2 !== 0;
  
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20 transition-opacity duration-700 group-hover:opacity-60">
      <motion.div
        className="flex gap-4 h-full items-center"
        animate={{
          x: isEvenRow ? [-500, -1500] : [0, -1000],
        }}
        transition={{
          duration: isEvenRow ? 30 : 20,
          repeat: Infinity,
          ease: "linear",
        }}
      >
        {[...images, ...images, ...images].map((src, idx) => (
          <img
            key={idx}
            src={src}
            alt="Project preview"
            className="h-[90%] aspect-video object-cover rounded-sm grayscale group-hover:grayscale-0 transition-all duration-700"
            referrerPolicy="no-referrer"
          />
        ))}
      </motion.div>
    </div>
  );
};

const ProjectItem: React.FC<{ project: Project; onClick: (project: Project) => void }> = ({ project, onClick }) => {
  return (
    <motion.div
      className="group relative aspect-square overflow-hidden cursor-pointer bg-gray-100 rounded-sm"
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.4 }}
      onClick={() => onClick(project)}
    >
      <img 
        src={project.thumbnail} 
        alt={project.title}
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        referrerPolicy="no-referrer"
      />
      <div className="absolute inset-0 bg-brand-green/80 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col items-center justify-center p-6 text-center text-white">
        <h3 className="text-xl md:text-2xl font-display font-bold tracking-tight mb-2 leading-tight">
          {project.title}
        </h3>
        <p className="text-[7px] md:text-[8px] font-medium tracking-widest uppercase opacity-80">
          {project.subtitle}
        </p>
        <div className="mt-6 w-8 h-8 rounded-full border border-white/30 flex items-center justify-center">
          <ArrowUpRight size={14} />
        </div>
      </div>
    </motion.div>
  );
};

const ProjectDetailModal = ({ project, onClose }: { project: Project; onClose: () => void }) => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-md flex items-center justify-center p-4 md:p-10"
      onClick={onClose}
    >
      <button 
        onClick={onClose}
        className="fixed top-6 right-6 z-[210] p-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors"
      >
        <X size={24} />
      </button>

      <motion.div 
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="w-full max-w-6xl max-h-[90vh] overflow-y-auto bg-white rounded-sm shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-8 md:p-12 border-b border-gray-100">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-brand-green/40 mb-2 block">
                {project.category}
              </span>
              <h2 className="text-3xl md:text-5xl font-display font-bold tracking-tight text-brand-green">
                {project.title}
              </h2>
              <p className="mt-4 text-sm md:text-base text-brand-green/60 max-w-xl leading-relaxed font-bold">
                {project.subtitle}
              </p>
              {project.description && (
                <p className="mt-2 text-xs md:text-sm text-brand-green/50 max-w-xl leading-relaxed italic">
                  {project.description}
                </p>
              )}
            </div>
            <div className="text-[10px] font-bold tracking-widest uppercase opacity-40">
              Project No. {project.number}
            </div>
          </div>
        </div>

        <div className="p-4 md:p-12 space-y-8">
          <div className="w-full aspect-video rounded-sm overflow-hidden bg-gray-50">
            <img 
              src={project.thumbnail} 
              alt={project.title} 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          {project.images && project.images.length > 0 && (
            <div className="grid grid-cols-1 gap-12">
              {project.images.map((imgObj, idx) => (
                <div key={idx} className="space-y-4">
                  <div className="w-full rounded-sm overflow-hidden bg-gray-50">
                    <img 
                      src={imgObj.url} 
                      alt={`${project.title} gallery ${idx + 1}`} 
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  {imgObj.caption && (
                    <p className="text-center text-xs md:text-sm text-brand-green/60 font-medium tracking-tight">
                      {imgObj.caption}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="p-8 md:p-12 bg-gray-50 flex justify-center">
          <button 
            onClick={onClose}
            className="px-10 py-4 bg-brand-green text-white font-bold tracking-widest uppercase text-xs rounded-full hover:scale-105 transition-transform"
          >
            Close Project
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

// --- Main Application ---

export default function App() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [showLogin, setShowLogin] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [projects, setProjects] = useState<Project[]>(SAMPLE_PROJECTS);

  // Auth Listener
  useEffect(() => {
    return onAuthStateChanged(auth, (u) => {
      if (u && u.email === 'dabin_0408@naver.com') {
        setUser(u);
      } else {
        setUser(null);
      }
    });
  }, []);

  // Data Listener
  useEffect(() => {
    const q = query(collection(db, 'projects'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const dbProjects = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate()?.toISOString() || new Date().toISOString()
      })) as Project[];
      
      if (dbProjects.length > 0) {
        setProjects([...dbProjects, ...SAMPLE_PROJECTS]);
      } else {
        setProjects(SAMPLE_PROJECTS);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = () => signOut(auth);

  const handleDeleteProject = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('정말 삭제하시겠습니까?')) return;
    try {
      await deleteDoc(doc(db, 'projects', id));
      alert('삭제되었습니다.');
    } catch (err) {
      alert('삭제 권한이 없습니다.');
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F5F3] text-brand-green selection:bg-brand-green selection:text-white font-sans">
      <AnimatePresence>
        {selectedProject && <ProjectDetailModal project={selectedProject} onClose={() => setSelectedProject(null)} />}
        {showLogin && <AdminLoginModal onClose={() => setShowLogin(false)} />}
        {showAddModal && <AddProjectModal onClose={() => setShowAddModal(false)} />}
      </AnimatePresence>

      <header className="fixed top-0 left-0 w-full z-50 flex justify-end items-center p-6 md:p-10 mix-blend-difference text-white">
        <div className="flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setShowAddModal(true)}
                className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-white hover:text-black transition-all bg-white/10"
              >
                <Plus size={20} />
              </button>
              <button 
                onClick={handleLogout}
                className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-white hover:text-black transition-all bg-white/10"
              >
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <button 
              onDoubleClick={() => setShowLogin(true)}
              className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center opacity-0 hover:opacity-10 transition-opacity"
            >
              <LogIn size={16} />
            </button>
          )}
        </div>
      </header>

      <section className="pt-24 pb-20 px-6 md:px-10">
        <div className="max-w-screen-2xl mx-auto">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <div className="flex items-center gap-4 mb-10">
              {selectedCategory && (
                <button 
                  onClick={() => setSelectedCategory(null)}
                  className="text-[15px] md:text-lg font-bold tracking-widest uppercase opacity-60 hover:opacity-100 transition-all flex items-center gap-4 group"
                >
                  <div className="w-12 h-12 rounded-full border border-brand-green/20 flex items-center justify-center group-hover:bg-brand-green group-hover:text-white transition-all">
                    <ArrowUpRight className="w-6 h-6 rotate-[225deg]" />
                  </div>
                  BACK TO PORTFOLIO
                </button>
              )}
            </div>
            <h1 className="text-[21px] md:text-[4.2vw] font-display font-black leading-[0.85] tracking-tighter uppercase mb-2 relative inline-block">
              {selectedCategory || 'PORTFOLIO'}
              <motion.div className="absolute -bottom-4 left-0 h-[2px] bg-[#D4AF37]" initial={{ width: 0 }} animate={{ width: '100%' }} />
            </h1>
          </motion.div>
        </div>
      </section>

      <section className="pb-40 min-h-[400px]">
        {!selectedCategory ? (
          <div className="flex flex-col">
            {CATEGORIES.map((cat, idx) => {
              const catProjects = projects.filter(p => p.category === cat);
              const previewImages = catProjects.length > 0 
                ? catProjects.map(p => p.thumbnail)
                : ['https://picsum.photos/seed/empty/800/600'];

              return (
                <motion.div
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className="group relative w-full border-b border-brand-green/10 overflow-hidden cursor-pointer"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                >
                  <MarqueeImages images={previewImages} index={idx} />
                  <div className="relative z-10 flex items-center justify-between py-10 px-6 md:px-12 transition-transform duration-500 group-hover:translate-x-4">
                    <h2 className="text-[17px] md:text-[34px] lg:text-[42px] font-display font-black leading-none tracking-tighter">
                      {cat}
                    </h2>
                    <div className="hidden md:flex items-center justify-center w-10 h-10 rounded-full border border-brand-green/20 group-hover:bg-brand-green group-hover:text-white transition-all duration-500">
                      <ArrowUpRight className="w-4 h-4" />
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <div className="max-w-screen-2xl mx-auto px-6 md:px-10">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
              {projects.filter(p => p.category === selectedCategory).length > 0 ? (
                projects.filter(p => p.category === selectedCategory).map((project) => (
                  <div key={project.id} className="relative group">
                    <ProjectItem project={project} onClick={setSelectedProject} />
                    {user && !project.id.startsWith('sample') && (
                      <button 
                        onClick={(e) => handleDeleteProject(project.id, e)}
                        className="absolute top-4 right-4 z-10 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:bg-red-600"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                ))
              ) : (
                <div className="col-span-full flex justify-center p-20 opacity-20 font-mono text-[10px] uppercase tracking-widest">No projects in this category.</div>
              )}
            </div>
          </div>
        )}
      </section>

      <footer className="bg-brand-green text-white p-10 md:p-20">
        <div className="max-w-screen-2xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 md:gap-20">
            <div className="lg:col-span-4 space-y-6">
              <button className="font-display text-3xl md:text-4xl tracking-tighter">DABIN GROUP</button>
              <p className="text-xs md:text-sm leading-relaxed opacity-70 font-light max-w-sm">
                다빈그룹은 광고, 행사기획, 인쇄편집 분야에서 최고의 전문성을 바탕으로 고객사의 가치를 극대화하는 결과 중심의 파트너 입니다.
              </p>
            </div>
            <div className="lg:col-span-4 space-y-8">
              <div className="space-y-3">
                <h4 className="text-[10px] font-bold tracking-[0.3em] uppercase text-[#D4AF37]">Contact</h4>
                <div className="space-y-4">
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-widest opacity-40">Phone</p>
                    <p className="text-sm md:text-base font-medium">044-715-5636</p>
                  </div>
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-widest opacity-40">Email</p>
                    <p className="text-sm md:text-base font-medium opacity-80">dabin_0408@naver.com</p>
                  </div>
                  <a href="https://pf.kakao.com/_YGjgb" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-[#FEE500] text-[#3c1e1e] px-6 py-3 rounded-full text-[10px] font-bold uppercase tracking-widest">
                    카카오톡 문의하기
                  </a>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-20 pt-10 border-t border-white/10 text-[9px] tracking-widest uppercase opacity-30">
            © 2024 DABIN GROUP. ALL RIGHTS RESERVED.
          </div>
        </div>
      </footer>
    </div>
  );
}
