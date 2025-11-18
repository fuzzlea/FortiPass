import { useReadLocalStorage } from 'usehooks-ts';
import {
  VaultIcon,
  ShieldCheckIcon,
  SignOutIcon,
  GearIcon,
  LockIcon,
  ClockIcon
} from '@phosphor-icons/react';
import { useNavigate } from 'react-router-dom';

export default function DashboardPage() {
  const currentUser = useReadLocalStorage<{ user: string; password: string }>('user');
  const vaultEntries = useReadLocalStorage<any[]>('vault_entries') || [];
  const totalLogins = useReadLocalStorage<number>('totalLogins') || 0;
  const navigate = useNavigate();

  const currentDate = new Date();
  const formattedDate = `${String(currentDate.getMonth() + 1).padStart(2, '0')}/${String(currentDate.getDate()).padStart(2, '0')}/${currentDate.getFullYear()}`;

  // Calculate password strength (basic)
  const weakPasswords = vaultEntries.filter((entry) => entry.password.length < 8).length;
  const strongPasswords = vaultEntries.length - weakPasswords;

  const goToVault = () => navigate('/loggedin/vault');
  const logout = () => {
    sessionStorage.removeItem('loggedIn');
    navigate('/login');
  };

  return (
    <div className="w-full h-full flex flex-col bg-background">
      {/* Header */}
      <div className="p-6 bg-foreground/5 border-b border-foreground/10">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-foreground/60 mt-1">Welcome back, <span className="font-semibold text-foreground">{currentUser?.user || 'User'}</span></p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-accent">{formattedDate}</p>
            <p className="text-foreground/60 text-sm">{new Date().toLocaleTimeString()}</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="grid grid-cols-3 gap-6 mb-8">
          {/* Total Passwords Card */}
          <div className="p-6 bg-gradient-to-br from-blue-500/10 to-blue-500/5 border border-blue-500/20 rounded-lg hover:border-blue-500/40 transition-colors">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-foreground/80">Total Passwords</h3>
              <VaultIcon weight="fill" size={24} className="text-blue-500" />
            </div>
            <p className="text-4xl font-bold text-foreground mb-2">{vaultEntries.length}</p>
            <p className="text-sm text-foreground/60">
              {vaultEntries.length === 0 ? 'No passwords saved yet' : `${vaultEntries.length} password${vaultEntries.length !== 1 ? 's' : ''} stored securely`}
            </p>
            <button
              onClick={goToVault}
              className="mt-4 w-full px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-lg font-semibold transition-colors"
            >
              View Vault →
            </button>
          </div>

          {/* Security Status Card */}
          <div className="p-6 bg-gradient-to-br from-green-500/10 to-green-500/5 border border-green-500/20 rounded-lg hover:border-green-500/40 transition-colors">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-foreground/80">Security Status</h3>
              <ShieldCheckIcon weight="fill" size={24} className="text-green-500" />
            </div>
            <p className="text-4xl font-bold text-foreground mb-2">{strongPasswords}</p>
            <p className="text-sm text-foreground/60">
              {vaultEntries.length === 0 ? 'No passwords to analyze' : `Strong password${strongPasswords !== 1 ? 's' : ''} (8+ characters)`}
            </p>
            {weakPasswords > 0 && (
              <p className="text-sm text-yellow-400 mt-2">
                ⚠️ {weakPasswords} weak password{weakPasswords !== 1 ? 's' : ''} detected
              </p>
            )}
          </div>

          {/* Login Activity Card */}
          <div className="p-6 bg-gradient-to-br from-purple-500/10 to-purple-500/5 border border-purple-500/20 rounded-lg hover:border-purple-500/40 transition-colors">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-foreground/80">Login Activity</h3>
              <ClockIcon weight="fill" size={24} className="text-purple-500" />
            </div>
            <p className="text-4xl font-bold text-foreground mb-2">{totalLogins}</p>
            <p className="text-sm text-foreground/60">
              Total login{totalLogins !== 1 ? 's' : ''} to this device
            </p>
          </div>
        </div>

        {/* Quick Actions & Password Health */}
        <div className="grid grid-cols-2 gap-6">
          {/* Recent Passwords */}
          <div className="p-6 bg-foreground/5 border border-foreground/10 rounded-lg">
            <div className="flex items-center gap-2 mb-4">
              <LockIcon weight="bold" size={20} className="text-accent" />
              <h3 className="text-xl font-bold">Recent Passwords</h3>
            </div>
            {vaultEntries.length === 0 ? (
              <p className="text-foreground/60 py-8 text-center">No passwords added yet</p>
            ) : (
              <div className="space-y-3">
                {vaultEntries.slice(-3).reverse().map((entry) => (
                  <div key={entry.id} className="p-3 bg-foreground/5 rounded-lg border border-foreground/10">
                    <p className="font-semibold text-foreground">{entry.site}</p>
                    <p className="text-sm text-foreground/60">{entry.username}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Device Info & Security */}
          <div className="p-6 bg-foreground/5 border border-foreground/10 rounded-lg">
            <div className="flex items-center gap-2 mb-4">
              <GearIcon weight="bold" size={20} className="text-accent" />
              <h3 className="text-xl font-bold">Device Info</h3>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center pb-3 border-b border-foreground/10">
                <span className="text-foreground/60">Username</span>
                <span className="font-semibold">{currentUser?.user || 'Not set'}</span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-foreground/10">
                <span className="text-foreground/60">Encryption</span>
                <span className="font-semibold text-green-400">Local Storage</span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-foreground/10">
                <span className="text-foreground/60">Connection</span>
                <span className="font-semibold text-green-400">Offline Ready</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-foreground/60">Version</span>
                <span className="font-semibold">1.0.0</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-3 gap-4 mt-8">
          <button
            onClick={goToVault}
            className="p-4 bg-accent hover:bg-accent/90 text-background rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
          >
            <VaultIcon weight="bold" size={20} />
            Open Vault
          </button>
          <button
            onClick={() => navigate('/loggedin/customization')}
            className="p-4 bg-foreground/10 hover:bg-foreground/20 text-foreground rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
          >
            <GearIcon weight="bold" size={20} />
            Settings
          </button>
          <button
            onClick={logout}
            className="p-4 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
          >
            <SignOutIcon weight="bold" size={20} />
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
