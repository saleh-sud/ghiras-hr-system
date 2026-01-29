
import React, { useState } from 'react';
import { User, Role, Department } from '../types';
import { UserPlus, Mail, Shield, Building2, Search, Trash2, Edit2, Hash, Lock, UserCircle, X } from 'lucide-react';

interface UserManagementProps {
  users: User[];
  onAddUser: (user: Omit<User, 'id'>) => void;
  onDeleteUser: (userId: string) => void;
  onUpdateUser: (user: User) => void;
}

const UserManagement: React.FC<UserManagementProps> = ({ users, onAddUser, onDeleteUser, onUpdateUser }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  
  const [newUser, setNewUser] = useState<Omit<User, 'id'>>({
    name: '',
    username: '',
    password: '',
    email: '',
    role: Role.EMPLOYEE,
    department: Department.ADMINISTRATION,
    avatar: '',
    totalAnnualBalance: 21,
    managerEmail: ''
  });

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingUser) {
      onUpdateUser(editingUser);
      setEditingUser(null);
    } else {
      onAddUser(newUser);
      setShowAddModal(false);
      setNewUser({
        name: '', username: '', password: '', email: '', role: Role.EMPLOYEE, department: Department.ADMINISTRATION,
        avatar: '', totalAnnualBalance: 21, managerEmail: ''
      });
    }
  };

  return (
    <div className="space-y-8 text-right" dir="rtl">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black text-gray-900">إدارة الحسابات</h2>
          <p className="text-slate-500 font-bold">إضافة وتعديل وحذف الموظفين وتعيين مدرائهم.</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-2xl shadow-xl shadow-indigo-200 transition-all flex items-center gap-2"
        >
          <UserPlus size={22} />
          <span>إضافة حساب جديد</span>
        </button>
      </div>

      <div className="relative">
        <input
          type="text"
          placeholder="ابحث بالاسم أو اسم المستخدم..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pr-14 pl-4 py-4 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all shadow-sm font-bold"
        />
        <Search className="absolute right-5 top-4.5 text-slate-300" size={24} />
      </div>

      <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
        <table className="w-full text-right">
          <thead className="bg-slate-50/50 border-b border-slate-100">
            <tr>
              <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">الموظف / الدخول</th>
              <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">القسم / الدور</th>
              <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">الرصيد / المدير</th>
              <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest text-left">الإجراءات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {filteredUsers.map(u => (
              <tr key={u.id} className="hover:bg-slate-50/50 transition-colors group">
                <td className="px-8 py-6">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-indigo-50 rounded-full flex items-center justify-center border-2 border-indigo-100">
                      <UserCircle size={20} className="text-indigo-400" />
                    </div>
                    <div>
                      <p className="font-black text-slate-900">{u.name}</p>
                      <p className="text-[10px] font-bold text-indigo-500 uppercase">@{u.username}</p>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-6">
                   <p className="font-bold text-slate-700">{u.department}</p>
                   <p className="text-[10px] font-black text-slate-400 uppercase">{u.role}</p>
                </td>
                <td className="px-8 py-6">
                   <p className="font-black text-indigo-600">{u.totalAnnualBalance} يوم</p>
                   <p className="text-[10px] font-bold text-slate-400 truncate max-w-[150px]">{u.managerEmail}</p>
                </td>
                <td className="px-8 py-6 text-left">
                  <div className="flex items-center justify-end gap-2">
                    <button 
                      onClick={() => setEditingUser(u)}
                      className="p-2.5 text-slate-400 hover:text-indigo-600 bg-white border border-slate-100 rounded-xl hover:shadow-sm transition-all"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button 
                      onClick={() => onDeleteUser(u.id)}
                      className="p-2.5 text-slate-400 hover:text-red-600 bg-white border border-slate-100 rounded-xl hover:shadow-sm transition-all"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {(showAddModal || editingUser) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-indigo-950/40 backdrop-blur-md">
          <div className="bg-white rounded-[2.5rem] w-full max-w-2xl shadow-2xl p-10 overflow-y-auto max-h-[90vh]">
            <div className="flex justify-between items-center mb-10">
               <h3 className="text-2xl font-black text-gray-900">{editingUser ? 'تعديل بيانات الحساب' : 'إنشاء حساب جديد'}</h3>
               <button onClick={() => { setShowAddModal(false); setEditingUser(null); }} className="p-2 hover:bg-slate-100 rounded-xl"><X /></button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-black text-slate-700">الاسم الكامل</label>
                  <input 
                    required type="text" 
                    value={editingUser ? editingUser.name : newUser.name} 
                    onChange={(e) => editingUser ? setEditingUser({...editingUser, name: e.target.value}) : setNewUser({...newUser, name: e.target.value})} 
                    className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-100 outline-none focus:border-indigo-500 font-bold" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-black text-slate-700">اسم المستخدم</label>
                  <input 
                    required type="text" 
                    value={editingUser ? editingUser.username : newUser.username} 
                    onChange={(e) => editingUser ? setEditingUser({...editingUser, username: e.target.value}) : setNewUser({...newUser, username: e.target.value})} 
                    className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-100 outline-none focus:border-indigo-500 font-bold" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-black text-slate-700">كلمة المرور</label>
                  <input 
                    required type="password" 
                    value={editingUser ? editingUser.password : newUser.password} 
                    onChange={(e) => editingUser ? setEditingUser({...editingUser, password: e.target.value}) : setNewUser({...newUser, password: e.target.value})} 
                    className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-100 outline-none focus:border-indigo-500 font-bold" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-black text-slate-700">البريد الإلكتروني</label>
                  <input 
                    required type="email" 
                    value={editingUser ? editingUser.email : newUser.email} 
                    onChange={(e) => editingUser ? setEditingUser({...editingUser, email: e.target.value}) : setNewUser({...newUser, email: e.target.value})} 
                    className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-100 outline-none focus:border-indigo-500 font-bold" 
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-black text-slate-700">الدور الوظيفي</label>
                  <select 
                    value={editingUser ? editingUser.role : newUser.role} 
                    onChange={(e) => editingUser ? setEditingUser({...editingUser, role: e.target.value as Role}) : setNewUser({...newUser, role: e.target.value as Role})} 
                    className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-100 font-bold"
                  >
                    {Object.values(Role).map(role => <option key={role} value={role}>{role}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-black text-slate-700">القسم</label>
                  <select 
                    value={editingUser ? editingUser.department : newUser.department} 
                    onChange={(e) => editingUser ? setEditingUser({...editingUser, department: e.target.value as Department}) : setNewUser({...newUser, department: e.target.value as Department})} 
                    className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-100 font-bold"
                  >
                    {Object.values(Department).map(dept => <option key={dept} value={dept}>{dept}</option>)}
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-black text-slate-700 text-indigo-600">البريد الإلكتروني للمدير المباشر</label>
                <input 
                  required type="email" 
                  value={editingUser ? editingUser.managerEmail : newUser.managerEmail} 
                  onChange={(e) => editingUser ? setEditingUser({...editingUser, managerEmail: e.target.value}) : setNewUser({...newUser, managerEmail: e.target.value})} 
                  className="w-full px-5 py-4 rounded-2xl bg-indigo-50 border border-indigo-100 outline-none focus:border-indigo-500 font-bold" 
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-black text-slate-700">رصيد الإجازات السنوي</label>
                <input 
                  required type="number" 
                  value={editingUser ? editingUser.totalAnnualBalance : newUser.totalAnnualBalance} 
                  onChange={(e) => editingUser ? setEditingUser({...editingUser, totalAnnualBalance: parseInt(e.target.value)}) : setNewUser({...newUser, totalAnnualBalance: parseInt(e.target.value)})} 
                  className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-100 font-bold" 
                />
              </div>

              <div className="pt-10 grid grid-cols-2 gap-4">
                <button type="submit" className="bg-indigo-600 text-white font-black py-5 rounded-2xl shadow-xl hover:bg-indigo-700 transition-all">
                  {editingUser ? 'حفظ التعديلات' : 'تأكيد الإضافة'}
                </button>
                <button type="button" onClick={() => { setShowAddModal(false); setEditingUser(null); }} className="bg-slate-50 text-slate-500 font-black py-5 rounded-2xl hover:bg-slate-100 transition-all">إلغاء</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
