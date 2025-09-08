'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
    Settings,
    ArrowLeft,
    Save,
    Globe,
    Mail,
    Bell,
    Shield,
    Database,
    Image,
    FileText,
    Palette,
    Key,
    User,
    Moon,
    Sun,
    Monitor,
    Check,
    X,
    RefreshCw,
    Download,
    Upload,
    Trash2,
    Info
} from 'lucide-react';

export default function SettingsPage() {
    const [settings, setSettings] = useState({
        site: {
            title: 'AlmaStack Blog',
            description: 'Blog tecnico su sviluppo web e tecnologie moderne',
            url: 'https://almastack.it',
            language: 'it',
            postsPerPage: 10,
            enableComments: false,
            enableNewsletter: false
        },
        seo: {
            metaTitle: 'AlmaStack - Sviluppo Web e Soluzioni Digitali',
            metaDescription: 'Blog tecnico su sviluppo web, cloud computing, AI e best practices',
            metaKeywords: 'web development, react, nextjs, cloud, AI',
            ogImage: '/images/og-image.jpg',
            twitterHandle: '@almastack'
        },
        media: {
            maxUploadSize: 10, // MB
            allowedFormats: ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'],
            autoOptimize: true,
            compressionQuality: 85,
            maxWidth: 1920,
            thumbnailSize: 300
        },
        email: {
            smtpHost: '',
            smtpPort: 587,
            smtpUser: '',
            smtpPassword: '',
            fromEmail: 'noreply@almastack.it',
            fromName: 'AlmaStack Blog'
        },
        security: {
            adminPassword: '',
            sessionDuration: 7, // days
            enableRecaptcha: false,
            recaptchaKey: '',
            recaptchaSecret: ''
        },
        appearance: {
            theme: 'system', // light, dark, system
            primaryColor: '#3B82F6',
            fontFamily: 'Inter',
            showAuthorImage: true,
            showReadingTime: true,
            showShareButtons: true
        }
    });

    const [activeTab, setActiveTab] = useState('site');
    const [isSaving, setIsSaving] = useState(false);
    const [hasChanges, setHasChanges] = useState(false);

    useEffect(() => {
        loadSettings();
    }, []);

    const loadSettings = async () => {
        // In produzione, caricheresti le impostazioni dal database
        const savedSettings = localStorage.getItem('blogSettings');
        if (savedSettings) {
            setSettings(JSON.parse(savedSettings));
        }
    };

    const saveSettings = async () => {
        setIsSaving(true);
        
        try {
            // In produzione, salveresti sul server
            localStorage.setItem('blogSettings', JSON.stringify(settings));
            
            showNotification('Impostazioni salvate con successo!', 'success');
            setHasChanges(false);
        } catch (error) {
            console.error('Error saving settings:', error);
            showNotification('Errore nel salvare le impostazioni', 'error');
        } finally {
            setIsSaving(false);
        }
    };

    const updateSettings = (section, key, value) => {
        setSettings(prev => ({
            ...prev,
            [section]: {
                ...prev[section],
                [key]: value
            }
        }));
        setHasChanges(true);
    };

    const exportSettings = () => {
        const dataStr = JSON.stringify(settings, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
        
        const exportFileDefaultName = `blog-settings-${new Date().toISOString().split('T')[0]}.json`;
        
        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
        
        showNotification('Settings esportate con successo', 'success');
    };

    const importSettings = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const importedSettings = JSON.parse(e.target.result);
                    setSettings(importedSettings);
                    setHasChanges(true);
                    showNotification('Settings importate con successo', 'success');
                } catch (error) {
                    showNotification('Errore nell\'importare le settings', 'error');
                }
            };
            reader.readAsText(file);
        }
    };

    const resetDatabase = async () => {
        if (!confirm('Sei sicuro di voler resettare il database? Questa azione è irreversibile!')) return;
        
        // In produzione, chiameresti l'API per resettare il database
        showNotification('Database resettato (simulato)', 'success');
    };

    const showNotification = (message, type) => {
        const notification = document.createElement('div');
        notification.className = `fixed bottom-4 right-4 px-6 py-3 rounded-lg shadow-lg z-50 ${
            type === 'success' ? 'bg-green-500' : 'bg-red-500'
        } text-white`;
        notification.textContent = message;
        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 3000);
    };

    const tabs = [
        { id: 'site', label: 'Generale', icon: Globe },
        { id: 'seo', label: 'SEO', icon: FileText },
        { id: 'media', label: 'Media', icon: Image },
        { id: 'email', label: 'Email', icon: Mail },
        { id: 'security', label: 'Sicurezza', icon: Shield },
        { id: 'appearance', label: 'Aspetto', icon: Palette },
        { id: 'database', label: 'Database', icon: Database }
    ];

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
            {/* Header */}
            <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-40">
                <div className="px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Link
                                href="/admin"
                                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                            >
                                <ArrowLeft className="w-5 h-5" />
                            </Link>
                            <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                                Impostazioni
                            </h1>
                            {hasChanges && (
                                <span className="px-2 py-1 text-xs bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 rounded-full">
                                    Modifiche non salvate
                                </span>
                            )}
                        </div>

                        <button
                            onClick={saveSettings}
                            disabled={!hasChanges || isSaving}
                            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white rounded-lg transition-colors flex items-center gap-2"
                        >
                            <Save className="w-4 h-4" />
                            {isSaving ? 'Salvataggio...' : 'Salva Modifiche'}
                        </button>
                    </div>
                </div>
            </header>

            <div className="max-w-7xl mx-auto p-6">
                <div className="flex gap-6">
                    {/* Sidebar */}
                    <aside className="w-64 space-y-2">
                        {tabs.map(tab => {
                            const Icon = tab.icon;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`w-full px-4 py-3 rounded-lg flex items-center gap-3 transition-colors ${
                                        activeTab === tab.id
                                            ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                                            : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'
                                    }`}
                                >
                                    <Icon className="w-5 h-5" />
                                    <span>{tab.label}</span>
                                </button>
                            );
                        })}
                    </aside>

                    {/* Content */}
                    <div className="flex-1 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
                        {/* Site Settings */}
                        {activeTab === 'site' && (
                            <div className="space-y-6">
                                <h2 className="text-lg font-semibold mb-4">Impostazioni Generali</h2>
                                
                                <div>
                                    <label className="block text-sm font-medium mb-2">Titolo del Sito</label>
                                    <input
                                        type="text"
                                        value={settings.site.title}
                                        onChange={(e) => updateSettings('site', 'title', e.target.value)}
                                        className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">Descrizione</label>
                                    <textarea
                                        value={settings.site.description}
                                        onChange={(e) => updateSettings('site', 'description', e.target.value)}
                                        rows={3}
                                        className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">URL del Sito</label>
                                    <input
                                        type="url"
                                        value={settings.site.url}
                                        onChange={(e) => updateSettings('site', 'url', e.target.value)}
                                        className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">Lingua</label>
                                    <select
                                        value={settings.site.language}
                                        onChange={(e) => updateSettings('site', 'language', e.target.value)}
                                        className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg"
                                    >
                                        <option value="it">Italiano</option>
                                        <option value="en">English</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">Articoli per Pagina</label>
                                    <input
                                        type="number"
                                        value={settings.site.postsPerPage}
                                        onChange={(e) => updateSettings('site', 'postsPerPage', parseInt(e.target.value))}
                                        className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg"
                                    />
                                </div>

                                <div className="space-y-3">
                                    <label className="flex items-center gap-3">
                                        <input
                                            type="checkbox"
                                            checked={settings.site.enableComments}
                                            onChange={(e) => updateSettings('site', 'enableComments', e.target.checked)}
                                            className="w-4 h-4 text-blue-600"
                                        />
                                        <span className="text-sm">Abilita Commenti</span>
                                    </label>

                                    <label className="flex items-center gap-3">
                                        <input
                                            type="checkbox"
                                            checked={settings.site.enableNewsletter}
                                            onChange={(e) => updateSettings('site', 'enableNewsletter', e.target.checked)}
                                            className="w-4 h-4 text-blue-600"
                                        />
                                        <span className="text-sm">Abilita Newsletter</span>
                                    </label>
                                </div>
                            </div>
                        )}

                        {/* SEO Settings */}
                        {activeTab === 'seo' && (
                            <div className="space-y-6">
                                <h2 className="text-lg font-semibold mb-4">Impostazioni SEO</h2>
                                
                                <div>
                                    <label className="block text-sm font-medium mb-2">Meta Title</label>
                                    <input
                                        type="text"
                                        value={settings.seo.metaTitle}
                                        onChange={(e) => updateSettings('seo', 'metaTitle', e.target.value)}
                                        className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">Meta Description</label>
                                    <textarea
                                        value={settings.seo.metaDescription}
                                        onChange={(e) => updateSettings('seo', 'metaDescription', e.target.value)}
                                        rows={3}
                                        className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">Meta Keywords</label>
                                    <input
                                        type="text"
                                        value={settings.seo.metaKeywords}
                                        onChange={(e) => updateSettings('seo', 'metaKeywords', e.target.value)}
                                        className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg"
                                        placeholder="Separati da virgola"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">Open Graph Image</label>
                                    <input
                                        type="text"
                                        value={settings.seo.ogImage}
                                        onChange={(e) => updateSettings('seo', 'ogImage', e.target.value)}
                                        className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">Twitter Handle</label>
                                    <input
                                        type="text"
                                        value={settings.seo.twitterHandle}
                                        onChange={(e) => updateSettings('seo', 'twitterHandle', e.target.value)}
                                        className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg"
                                    />
                                </div>
                            </div>
                        )}

                        {/* Media Settings */}
                        {activeTab === 'media' && (
                            <div className="space-y-6">
                                <h2 className="text-lg font-semibold mb-4">Impostazioni Media</h2>
                                
                                <div>
                                    <label className="block text-sm font-medium mb-2">Dimensione Max Upload (MB)</label>
                                    <input
                                        type="number"
                                        value={settings.media.maxUploadSize}
                                        onChange={(e) => updateSettings('media', 'maxUploadSize', parseInt(e.target.value))}
                                        className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">Formati Consentiti</label>
                                    <input
                                        type="text"
                                        value={settings.media.allowedFormats.join(', ')}
                                        onChange={(e) => updateSettings('media', 'allowedFormats', e.target.value.split(',').map(f => f.trim()))}
                                        className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">Qualità Compressione (%)</label>
                                    <input
                                        type="number"
                                        value={settings.media.compressionQuality}
                                        onChange={(e) => updateSettings('media', 'compressionQuality', parseInt(e.target.value))}
                                        min="1"
                                        max="100"
                                        className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">Larghezza Max (px)</label>
                                    <input
                                        type="number"
                                        value={settings.media.maxWidth}
                                        onChange={(e) => updateSettings('media', 'maxWidth', parseInt(e.target.value))}
                                        className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg"
                                    />
                                </div>

                                <div>
                                    <label className="flex items-center gap-3">
                                        <input
                                            type="checkbox"
                                            checked={settings.media.autoOptimize}
                                            onChange={(e) => updateSettings('media', 'autoOptimize', e.target.checked)}
                                            className="w-4 h-4 text-blue-600"
                                        />
                                        <span className="text-sm">Ottimizzazione Automatica Immagini</span>
                                    </label>
                                </div>
                            </div>
                        )}

                        {/* Database Settings */}
                        {activeTab === 'database' && (
                            <div className="space-y-6">
                                <h2 className="text-lg font-semibold mb-4">Gestione Database</h2>
                                
                                <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-300 dark:border-yellow-700 rounded-lg p-4">
                                    <div className="flex gap-3">
                                        <Info className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                                        <div>
                                            <p className="text-sm text-yellow-800 dark:text-yellow-200">
                                                Attenzione: le operazioni sul database sono irreversibili.
                                                Assicurati di avere un backup prima di procedere.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <button className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg flex items-center gap-2">
                                            <Download className="w-4 h-4" />
                                            Backup Database
                                        </button>
                                        <p className="text-sm text-gray-500 mt-1">
                                            Scarica un backup completo del database
                                        </p>
                                    </div>

                                    <div>
                                        <button
                                            onClick={exportSettings}
                                            className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg flex items-center gap-2"
                                        >
                                            <Upload className="w-4 h-4" />
                                            Esporta Settings
                                        </button>
                                        <p className="text-sm text-gray-500 mt-1">
                                            Esporta tutte le impostazioni in formato JSON
                                        </p>
                                    </div>

                                    <div>
                                        <input
                                            type="file"
                                            accept=".json"
                                            onChange={importSettings}
                                            className="hidden"
                                            id="import-settings"
                                        />
                                        <label
                                            htmlFor="import-settings"
                                            className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg cursor-pointer"
                                        >
                                            <Download className="w-4 h-4" />
                                            Importa Settings
                                        </label>
                                        <p className="text-sm text-gray-500 mt-1">
                                            Importa impostazioni da file JSON
                                        </p>
                                    </div>

                                    <div>
                                        <button className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg flex items-center gap-2">
                                            <RefreshCw className="w-4 h-4" />
                                            Ottimizza Database
                                        </button>
                                        <p className="text-sm text-gray-500 mt-1">
                                            Ottimizza le tabelle e gli indici del database
                                        </p>
                                    </div>

                                    <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                                        <button
                                            onClick={resetDatabase}
                                            className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg flex items-center gap-2"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                            Reset Database
                                        </button>
                                        <p className="text-sm text-gray-500 mt-1">
                                            Elimina tutti i dati e ricrea le tabelle
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Appearance Settings */}
                        {activeTab === 'appearance' && (
                            <div className="space-y-6">
                                <h2 className="text-lg font-semibold mb-4">Impostazioni Aspetto</h2>
                                
                                <div>
                                    <label className="block text-sm font-medium mb-2">Tema</label>
                                    <div className="flex gap-3">
                                        <button
                                            onClick={() => updateSettings('appearance', 'theme', 'light')}
                                            className={`px-4 py-2 rounded-lg border ${
                                                settings.appearance.theme === 'light'
                                                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                                                    : 'border-gray-300 dark:border-gray-700'
                                            }`}
                                        >
                                            <Sun className="w-5 h-5" />
                                        </button>
                                        <button
                                            onClick={() => updateSettings('appearance', 'theme', 'dark')}
                                            className={`px-4 py-2 rounded-lg border ${
                                                settings.appearance.theme === 'dark'
                                                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                                                    : 'border-gray-300 dark:border-gray-700'
                                            }`}
                                        >
                                            <Moon className="w-5 h-5" />
                                        </button>
                                        <button
                                            onClick={() => updateSettings('appearance', 'theme', 'system')}
                                            className={`px-4 py-2 rounded-lg border ${
                                                settings.appearance.theme === 'system'
                                                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                                                    : 'border-gray-300 dark:border-gray-700'
                                            }`}
                                        >
                                            <Monitor className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">Colore Primario</label>
                                    <div className="flex gap-3 items-center">
                                        <input
                                            type="color"
                                            value={settings.appearance.primaryColor}
                                            onChange={(e) => updateSettings('appearance', 'primaryColor', e.target.value)}
                                            className="h-10 w-20"
                                        />
                                        <input
                                            type="text"
                                            value={settings.appearance.primaryColor}
                                            onChange={(e) => updateSettings('appearance', 'primaryColor', e.target.value)}
                                            className="flex-1 px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">Font Family</label>
                                    <select
                                        value={settings.appearance.fontFamily}
                                        onChange={(e) => updateSettings('appearance', 'fontFamily', e.target.value)}
                                        className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg"
                                    >
                                        <option value="Inter">Inter</option>
                                        <option value="Roboto">Roboto</option>
                                        <option value="Open Sans">Open Sans</option>
                                        <option value="Lato">Lato</option>
                                        <option value="Poppins">Poppins</option>
                                    </select>
                                </div>

                                <div className="space-y-3">
                                    <label className="flex items-center gap-3">
                                        <input
                                            type="checkbox"
                                            checked={settings.appearance.showAuthorImage}
                                            onChange={(e) => updateSettings('appearance', 'showAuthorImage', e.target.checked)}
                                            className="w-4 h-4 text-blue-600"
                                        />
                                        <span className="text-sm">Mostra Immagine Autore</span>
                                    </label>

                                    <label className="flex items-center gap-3">
                                        <input
                                            type="checkbox"
                                            checked={settings.appearance.showReadingTime}
                                            onChange={(e) => updateSettings('appearance', 'showReadingTime', e.target.checked)}
                                            className="w-4 h-4 text-blue-600"
                                        />
                                        <span className="text-sm">Mostra Tempo di Lettura</span>
                                    </label>

                                    <label className="flex items-center gap-3">
                                        <input
                                            type="checkbox"
                                            checked={settings.appearance.showShareButtons}
                                            onChange={(e) => updateSettings('appearance', 'showShareButtons', e.target.checked)}
                                            className="w-4 h-4 text-blue-600"
                                        />
                                        <span className="text-sm">Mostra Pulsanti Condivisione</span>
                                    </label>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}