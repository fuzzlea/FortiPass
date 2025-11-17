import { useState } from 'react';
import { useLocalStorage } from 'usehooks-ts';
import { VaultIcon, PlusIcon, TrashIcon, EyeIcon, EyeSlashIcon, CopyIcon } from '@phosphor-icons/react';

import '../animista.css';

interface VaultEntry {
    id: string;
    site: string;
    username: string;
    password: string;
    createdAt: number;
}

export default function VaultPage() {
    const [vaultEntries, setVaultEntries] = useLocalStorage<VaultEntry[]>('vault_entries', []);
    const [showAddForm, setShowAddForm] = useState(false);
    const [newEntry, setNewEntry] = useState({ site: '', username: '', password: '' });
    const [revealedIds, setRevealedIds] = useState<Set<string>>(new Set());
    const [searchTerm, setSearchTerm] = useState('');
    const [copiedId, setCopiedId] = useState<string | null>(null);

    // Filter entries based on search
    const filteredEntries = vaultEntries.filter(entry =>
        entry.site.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entry.username.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const addEntry = () => {
        if (newEntry.site && newEntry.username && newEntry.password) {
            const entry: VaultEntry = {
                id: `${Date.now()}-${Math.random()}`,
                site: newEntry.site,
                username: newEntry.username,
                password: newEntry.password,
                createdAt: Date.now(),
            };
            setVaultEntries([...vaultEntries, entry]);
            setNewEntry({ site: '', username: '', password: '' });
            setShowAddForm(false);
        }
    };

    const deleteEntry = (id: string) => {
        setVaultEntries(vaultEntries.filter(entry => entry.id !== id));
    };

    const toggleReveal = (id: string) => {
        const newRevealed = new Set(revealedIds);
        if (newRevealed.has(id)) {
            newRevealed.delete(id);
        } else {
            newRevealed.add(id);
        }
        setRevealedIds(newRevealed);
    };

    const copyToClipboard = (text: string, id: string) => {
        navigator.clipboard.writeText(text);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    return (
        <div className="w-5/6 h-full flex flex-col bg-background">
            {/* Header */}
            <div className="slide-in-top-smaller p-6 mb-2 mt-4 rounded-lg bg-foreground/5 border-b border-foreground/10">
                <div className="flex items-center gap-3 mb-4">
                    <VaultIcon weight="fill" size={32} className="text-accent" />
                    <h1 className="text-3xl font-bold">Password Vault</h1>
                </div>
                <p className="text-foreground/60">{filteredEntries.length} saved password{filteredEntries.length !== 1 ? 's' : ''}</p>
            </div>

            {/* Search and Add Button */}
            <div className="tracking-in-expand p-6 rounded-lg bg-foreground/2 border-b border-foreground/10 flex gap-4">
                <input
                    type="text"
                    placeholder="Search passwords..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="flex-1 px-4 py-2 bg-accent/10 border border-foreground/10 rounded-lg text-foreground placeholder-foreground/40 focus:outline-none focus:border-accent"
                />
                <button
                    onClick={() => setShowAddForm(!showAddForm)}
                    className="px-6 py-2 bg-accent text-foreground rounded-lg font-semibold hover:bg-accent/90 transition-colors flex items-center gap-2"
                >
                    <PlusIcon weight="bold" className='text-white' size={20} />
                    Add Password
                </button>
            </div>

            {/* Add Entry Form */}
            {showAddForm && (
                <div className="p-6 bg-accent/5 border-b border-accent/20">
                    <h2 className="text-xl font-semibold mb-4">Add New Password</h2>
                    <div className="grid grid-cols-3 gap-4">
                        <input
                            type="text"
                            placeholder="Site/Service name"
                            value={newEntry.site}
                            onChange={(e) => setNewEntry({ ...newEntry, site: e.target.value })}
                            className="px-4 py-2 bg-accent/10 border border-foreground/10 rounded-lg text-foreground placeholder-foreground/40 focus:outline-none focus:border-accent"
                        />
                        <input
                            type="text"
                            placeholder="Username"
                            value={newEntry.username}
                            onChange={(e) => setNewEntry({ ...newEntry, username: e.target.value })}
                            className="px-4 py-2 bg-accent/10 border border-foreground/10 rounded-lg text-foreground placeholder-foreground/40 focus:outline-none focus:border-accent"
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            value={newEntry.password}
                            onChange={(e) => setNewEntry({ ...newEntry, password: e.target.value })}
                            className="px-4 py-2 bg-accent/10 border border-foreground/10 rounded-lg text-foreground placeholder-foreground/40 focus:outline-none focus:border-accent"
                        />
                    </div>
                    <div className="flex gap-3 mt-4">
                        <button
                            onClick={addEntry}
                            className="px-6 py-2 bg-accent text-foreground rounded-lg font-semibold hover:bg-accent/90 transition-colors"
                        >
                            Save Password
                        </button>
                        <button
                            onClick={() => {
                                setShowAddForm(false);
                                setNewEntry({ site: '', username: '', password: '' });
                            }}
                            className="px-6 py-2 bg-foreground/10 text-foreground rounded-lg font-semibold hover:bg-foreground/20 transition-colors"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}

            {/* Password List */}
            <div className="flex-1 overflow-y-auto p-6">
                {filteredEntries.length === 0 ? (
                    <div className="flex items-center justify-center h-full">
                        <div className="text-center">
                            <VaultIcon weight="thin" size={64} className="text-foreground/20 mx-auto mb-4" />
                            <p className="text-foreground/60 text-lg">
                                {searchTerm ? 'No passwords match your search' : 'No passwords saved yet'}
                            </p>
                            {!searchTerm && (
                                <p className="text-foreground/40 mt-2">Click "Add Password" to get started</p>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {filteredEntries.map((entry) => (
                            <div
                                key={entry.id}
                                className="p-4 bg-foreground/5 border border-foreground/10 rounded-lg hover:bg-foreground/8 transition-colors"
                            >
                                <div className="flex items-center justify-between gap-4">
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-lg text-foreground">{entry.site}</h3>
                                        <p className="text-foreground/60 text-sm">
                                            Username: <span className="text-foreground">{entry.username}</span>
                                        </p>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        {/* Password Display */}
                                        <div className="px-4 py-2 bg-accent/10 rounded-lg font-mono text-sm">
                                            {revealedIds.has(entry.id) ? entry.password : '•'.repeat(entry.password.length || 8)}
                                        </div>

                                        {/* Reveal/Hide Button */}
                                        <button
                                            onClick={() => toggleReveal(entry.id)}
                                            className="p-2 text-foreground/60 hover:text-foreground transition-colors"
                                            title={revealedIds.has(entry.id) ? 'Hide password' : 'Show password'}
                                        >
                                            {revealedIds.has(entry.id) ? (
                                                <EyeSlashIcon weight="bold" size={20} />
                                            ) : (
                                                <EyeIcon weight="bold" size={20} />
                                            )}
                                        </button>

                                        {/* Copy Button */}
                                        <button
                                            onClick={() => copyToClipboard(entry.password, entry.id)}
                                            className={`p-2 transition-colors ${copiedId === entry.id
                                                ? 'text-accent'
                                                : 'text-foreground/60 hover:text-foreground'
                                                }`}
                                            title="Copy password"
                                        >
                                            <CopyIcon weight="bold" size={20} />
                                            {copiedId === entry.id && <span className="text-xs ml-1">Copied!</span>}
                                        </button>

                                        {/* Delete Button */}
                                        <button
                                            onClick={() => deleteEntry(entry.id)}
                                            className="p-2 text-red-500/60 hover:text-red-500 transition-colors"
                                            title="Delete password"
                                        >
                                            <TrashIcon weight="bold" size={20} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}