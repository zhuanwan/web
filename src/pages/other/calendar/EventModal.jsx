import React, { useState, useEffect } from 'react';
import { getLunarDetails } from './lunarHelper';
// import { generateBirthdayWish } from '../services/geminiService';
import { X, Sparkles, Loader2 } from 'lucide-react';



const EventModal= ({
  isOpen,
  onClose,
  selectedDate,
  onSave,
  onDelete,
  existingEvents
}) => {
  const [title, setTitle] = useState('');
  const [isLunarRecurrent, setIsLunarRecurrent] = useState(false);
  const [lunarDetails, setLunarDetails] = useState(null);
  
  // AI Generation State
  const [showAiGen, setShowAiGen] = useState(false);
  const [relation, setRelation] = useState('Friend');
  const [aiLoading, setAiLoading] = useState(false);
  const [generatedWish, setGeneratedWish] = useState('');

  useEffect(() => {
    if (selectedDate) {
      setLunarDetails(getLunarDetails(selectedDate));
      setTitle('');
      setIsLunarRecurrent(false);
      setShowAiGen(false);
      setGeneratedWish('');
    }
  }, [selectedDate, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedDate || !title.trim()) return;

    const details = getLunarDetails(selectedDate);

    onSave({
      title,
      date: selectedDate.toISOString(),
      isLunarRecurrent,
      lunarMonth: details.lunarMonth,
      lunarDay: details.lunarDay,
      color: isLunarRecurrent ? 'bg-red-500' : 'bg-blue-500',
    });
    onClose();
  };

  const handleGenerateWish = async () => {
    if (!lunarDetails) return;
    setAiLoading(true);
    const dateStr = `${lunarDetails.lunarMonthStr}月${lunarDetails.lunarDayStr}`;
    const wish = await generateBirthdayWish(title || "User", relation, dateStr);
    setGeneratedWish(wish);
    setAiLoading(false);
  };

  if (!isOpen || !selectedDate) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-gray-900/20 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />

      {/* Card */}
      <div className="relative bg-white rounded-[24px] shadow-2xl w-full max-w-sm overflow-hidden transform transition-all scale-100 ring-1 ring-black/5">
        
        {/* Header - Clean with standard iOS-like separation */}
        <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold text-[#1C1C1E] tracking-tight">
              {selectedDate.getDate()}日
            </h2>
            <div className="text-sm text-gray-500 font-medium mt-1">
              {selectedDate.getFullYear()}年{selectedDate.getMonth() + 1}月
              <span className="mx-2">·</span>
              {lunarDetails?.lunarMonthStr}月{lunarDetails?.lunarDayStr}
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 transition"
          >
            <X size={16} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Existing Events */}
          {existingEvents.length > 0 && (
            <div className="mb-6 space-y-2">
              <h3 className="text-[11px] uppercase tracking-wider font-semibold text-gray-400 mb-2">已添加</h3>
              {existingEvents.map(evt => (
                <div key={evt.id} className="flex justify-between items-center py-2 border-b border-gray-50 last:border-0">
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${evt.isLunarRecurrent ? 'bg-[#FF3B30]' : 'bg-[#007AFF]'}`} />
                    <span className="text-[15px] font-medium text-gray-700">{evt.title}</span>
                  </div>
                  <button onClick={() => onDelete(evt.id)} className="text-gray-300 hover:text-[#FF3B30] transition">
                    <span className="text-xs">删除</span>
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* New Event Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="新建提醒..."
                className="w-full px-4 py-3 bg-gray-100 rounded-xl text-[17px] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#007AFF]/20 transition-all"
                autoFocus
              />
            </div>

            <div className="flex items-center justify-between">
              <span className="text-[15px] text-gray-700 font-medium">农历生日 (每年重复)</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={isLunarRecurrent}
                  onChange={(e) => setIsLunarRecurrent(e.target.checked)}
                  className="sr-only peer" 
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#34C759]"></div>
              </label>
            </div>

            {/* AI Generator Section - Styled subtly */}
            {isLunarRecurrent && (
               <div className="pt-2 border-t border-gray-50">
                 <button 
                    type="button"
                    onClick={() => setShowAiGen(!showAiGen)}
                    className="w-full flex items-center justify-center gap-2 py-2 text-sm font-medium text-purple-600 hover:bg-purple-50 rounded-lg transition"
                 >
                    <Sparkles size={16} />
                    {showAiGen ? "收起助手" : "AI 祝福语助手"}
                 </button>

                 {showAiGen && (
                   <div className="mt-3 bg-gray-50 p-3 rounded-xl">
                      <div className="flex gap-2 mb-3">
                         <select 
                            value={relation} 
                            onChange={(e) => setRelation(e.target.value)}
                            className="text-sm bg-white border-none rounded-lg px-3 py-1.5 flex-1 shadow-sm focus:ring-0"
                         >
                            <option value="Friend">朋友</option>
                            <option value="Mom">妈妈</option>
                            <option value="Dad">爸爸</option>
                            <option value="Grandma">奶奶</option>
                            <option value="Grandpa">爷爷</option>
                            <option value="Other">其他</option>
                         </select>
                         <button
                            type="button"
                            // onClick={handleGenerateWish}
                            disabled={!title || aiLoading}
                            className="bg-[#1C1C1E] text-white text-xs px-4 py-1.5 rounded-lg hover:opacity-90 disabled:opacity-50"
                         >
                            {aiLoading ? <Loader2 size={14} className="animate-spin" /> : "生成"}
                         </button>
                      </div>
                      {generatedWish && (
                        <div className="bg-white p-3 rounded-lg text-sm text-gray-600 leading-relaxed shadow-sm">
                           {generatedWish}
                        </div>
                      )}
                   </div>
                 )}
               </div>
            )}

            <button
              type="submit"
              className="w-full bg-[#007AFF] hover:bg-[#007AFF]/90 text-white text-[17px] font-semibold py-3.5 rounded-xl transition-all shadow-lg shadow-blue-200"
            >
              完成
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EventModal;