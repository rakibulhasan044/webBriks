const fs = require('fs');

let file = 'frontend/src/components/modules/Board/BoardCanvas.tsx';
let content = fs.readFileSync(file, 'utf8');

const oldContent = `<DropdownMenuContent align="end" className="w-40 bg-slate-50/95 backdrop-blur-md border border-slate-200/50 shadow-lg">
                                      <DropdownMenuItem onClick={() => setTaskToEdit(task)} className="cursor-pointer">
                                        <Edit className="w-4 h-4 mr-2" />
                                        Edit Task
                                      </DropdownMenuItem>
                                      <DropdownMenuItem onClick={() => setTaskToDelete({ id: task.id, title: task.title })} className="text-red-600 focus:text-red-700 focus:bg-red-50">
                                        <Trash2 className="w-4 h-4 mr-2" />
                                        Delete Task
                                      </DropdownMenuItem>
                                    </DropdownMenuContent>`;

const newContent = `<DropdownMenuContent 
                                      align="end" 
                                      className="w-44 bg-slate-50/80 backdrop-blur-2xl border border-slate-200/40 shadow-xl shadow-slate-200/20 rounded-xl p-1.5"
                                    >
                                      <DropdownMenuItem 
                                        onClick={() => setTaskToEdit(task)} 
                                        className="rounded-lg p-2.5 cursor-pointer font-medium text-slate-700 hover:text-slate-900 focus:bg-indigo-50 focus:text-indigo-700 transition-colors group"
                                      >
                                        <Edit className="w-4 h-4 mr-2 text-slate-400 group-focus:text-indigo-600" />
                                        Edit Task
                                      </DropdownMenuItem>
                                      <DropdownMenuItem 
                                        onClick={() => setTaskToDelete({ id: task.id, title: task.title })} 
                                        className="rounded-lg p-2.5 cursor-pointer font-medium text-rose-600 focus:text-rose-700 focus:bg-rose-50 transition-colors group"
                                      >
                                        <Trash2 className="w-4 h-4 mr-2 text-rose-500 group-focus:text-rose-600" />
                                        Delete Task
                                      </DropdownMenuItem>
                                    </DropdownMenuContent>`;

content = content.replace(oldContent, newContent);
fs.writeFileSync(file, content);
console.log('Task dropdown updated');
