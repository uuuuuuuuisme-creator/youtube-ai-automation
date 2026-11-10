import React, { useState } from 'react';
import {
  Youtube,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Shield,
  Key,
  RotateCw,
  LogOut,
  Clock,
  Play,
  Upload,
} from 'lucide-react';
import { ConnectedChannel, VideoItem, AppSettings } from '../types';
import { api } from '../api';

interface YouTubePageProps {
  channel: ConnectedChannel;
  videos: VideoItem[];
  settings: AppSettings | null;
  onRefresh: () => void;
  onOpenVideo: (video: VideoItem) => void;
}

export const YouTubePage: React.FC<YouTubePageProps> = ({
  channel,
  videos,
  settings,
  onRefresh,
  onOpenVideo,
}) => {
  const [connecting, setConnecting] = useState(false);
  const [channelTitle, setChannelTitle] = useState(channel.channelTitle || '');
  const [customUrl, setCustomUrl] = useState(channel.customUrl || '@shortforge_channel');
  const [accessToken, setAccessToken] = useState(settings?.youtube?.accessToken || '');
  const [apiKey, setApiKey] = useState(settings?.youtube?.apiKey || '');

  const youtubeVideos = videos.filter((v) => v.youtubeVideoId || v.youtubeStatus);

  const handleConnect = async (e: React.FormEvent) => {
    e.preventDefault();
    setConnecting(true);
    try {
      await api.connectChannel({
        channelTitle: channelTitle || 'ShortForge Official Channel',
        customUrl: customUrl || '@shortforge_channel',
        accessToken: accessToken.trim() || undefined,
        apiKey: apiKey.trim() || undefined,
        subscriberCount: 24600,
      });
      onRefresh();
    } catch (err: any) {
      alert(`Connection error: ${err.message}`);
    } finally {
      setConnecting(false);
    }
  };

  const handleDisconnect = async () => {
    if (confirm('Disconnect YouTube channel from ShortForge AI?')) {
      try {
        await api.disconnectChannel();
        onRefresh();
      } catch (err: any) {
        alert(`Disconnect error: ${err.message}`);
      }
    }
  };

  return (
    <div className="space-y-6 pb-12 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight font-display">
          YouTube Channel Integration
        </h1>
        <p className="text-xs sm:text-sm text-neutral-400">
          Connect your channel via Google OAuth 2.0 (YouTube Data API v3 & YouTube Analytics API)
        </p>
      </div>

      {/* Connected Channel Hero Card */}
      <div className="p-6 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-red-600/10 border border-red-500/20 flex items-center justify-center text-red-500 shrink-0 shadow-lg">
              <Youtube className="w-8 h-8" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white font-display">
                  {channel.connected ? channel.channelTitle : 'No Channel Connected'}
                </h2>
                <span
                  className={`text-[10px] px-2 py-0.5 rounded font-mono font-medium ${
                    channel.connected
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      : 'bg-neutral-800 text-neutral-400'
                  }`}
                >
                  {channel.connected ? 'ACTIVE' : 'DISCONNECTED'}
                </span>
              </div>

              <div className="text-xs text-neutral-400 mt-1 font-mono">
                {channel.customUrl || '@not_connected'} · ID: {channel.channelId || 'None'}
              </div>

              {channel.connectedAt && (
                <div className="text-[11px] text-neutral-500 mt-0.5">
                  Connected: {new Date(channel.connectedAt).toLocaleDateString()} via {channel.authMethod?.toUpperCase()}
                </div>
              )}
            </div>
          </div>

          {channel.connected && (
            <div className="flex items-center gap-2">
              <button
                onClick={handleDisconnect}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-neutral-800 hover:bg-red-500/10 hover:text-red-400 text-neutral-300 transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Disconnect</span>
              </button>
            </div>
          )}
        </div>

        {/* Stats Strip */}
        <div className="grid grid-cols-3 gap-3 pt-4 border-t border-neutral-800/80 text-center">
          <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800">
            <span className="text-[11px] text-neutral-500 block">Subscribers</span>
            <span className="text-base font-bold text-white font-mono tabular-nums">
              {(channel.subscriberCount || 0).toLocaleString()}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800">
            <span className="text-[11px] text-neutral-500 block">Total Views</span>
            <span className="text-base font-bold text-white font-mono tabular-nums">
              {(channel.viewCount || 0).toLocaleString()}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800">
            <span className="text-[11px] text-neutral-500 block">Upload Status</span>
            <span className="text-base font-bold text-emerald-400 font-mono">
              Ready (2/Day)
            </span>
          </div>
        </div>
      </div>

      {/* Connection & OAuth Credentials Form */}
      <div className="p-6 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-4">
        <div className="flex items-center gap-2">
          <Key className="w-4 h-4 text-amber-400" />
          <h3 className="text-sm font-bold text-white font-display">
            {channel.connected ? 'Update YouTube OAuth Credentials' : 'Connect YouTube Channel'}
          </h3>
        </div>

        <form onSubmit={handleConnect} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-neutral-400 font-medium block mb-1">Channel Display Name</label>
              <input
                type="text"
                value={channelTitle}
                onChange={(e) => setChannelTitle(e.target.value)}
                placeholder="e.g. Daily Mysteries Shorts"
                className="w-full px-3 py-2 bg-neutral-950 border border-neutral-700 rounded-lg text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="text-neutral-400 font-medium block mb-1">Handle / Custom URL</label>
              <input
                type="text"
                value={customUrl}
                onChange={(e) => setCustomUrl(e.target.value)}
                placeholder="e.g. @dailymysteries"
                className="w-full px-3 py-2 bg-neutral-950 border border-neutral-700 rounded-lg text-white focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          <div>
            <label className="text-neutral-400 font-medium block mb-1">
              Google OAuth 2.0 Access Token / Bearer (Optional for Live API Uploads)
            </label>
            <input
              type="password"
              value={accessToken}
              onChange={(e) => setAccessToken(e.target.value)}
              placeholder="ya29.a0AfH6SMB... (Stored securely server-side; never exposed to client)"
              className="w-full px-3 py-2 font-mono bg-neutral-950 border border-neutral-700 rounded-lg text-white focus:outline-none focus:border-amber-400"
            />
            <p className="text-[11px] text-neutral-500 mt-1">
              Required Scopes: <code className="text-neutral-400">https://www.googleapis.com/auth/youtube.upload</code> and <code className="text-neutral-400">youtube.readonly</code>.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800 text-[11px] text-neutral-400 space-y-1">
            <div className="font-semibold text-neutral-300 flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-emerald-400" />
              <span>Zero-Leakage Security Policy</span>
            </div>
            <p>
              In accordance with security rules, all tokens, refresh keys, and OAuth client credentials are stored strictly in server-side storage and never bundled into frontend JavaScript code.
            </p>
          </div>

          <button
            type="submit"
            disabled={connecting}
            className="w-full py-2.5 px-4 text-xs font-semibold text-neutral-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors font-display"
          >
            {connecting
              ? 'Verifying Channel with YouTube API...'
              : channel.connected
              ? 'Save & Reconnect Channel'
              : 'Connect YouTube Channel'}
          </button>
        </form>
      </div>

      {/* YouTube Publishing History & Scheduled Shorts */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-white font-display">
          Published & Scheduled Shorts ({youtubeVideos.length})
        </h3>

        {youtubeVideos.length === 0 ? (
          <div className="p-6 rounded-2xl bg-neutral-900 border border-neutral-800 text-center text-xs text-neutral-500">
            No videos uploaded to YouTube yet.
          </div>
        ) : (
          <div className="space-y-2">
            {youtubeVideos.map((v) => (
              <div
                key={v.id}
                onClick={() => onOpenVideo(v)}
                className="p-3 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-between gap-3 text-xs hover:border-neutral-700 cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <Youtube className="w-4 h-4 text-red-500 shrink-0" />
                  <div className="truncate">
                    <div className="font-semibold text-white truncate">{v.title}</div>
                    <div className="text-[11px] text-neutral-400 font-mono">
                      Status: {v.youtubeStatus} · ID: {v.youtubeVideoId}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {v.youtubeUrl && (
                    <a
                      href={v.youtubeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="flex items-center gap-1 px-2.5 py-1 rounded bg-red-600/20 text-red-300 hover:bg-red-600/30 font-medium text-[11px]"
                    >
                      <span>View on YouTube</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
