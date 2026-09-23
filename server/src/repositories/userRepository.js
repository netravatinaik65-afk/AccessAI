import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';
import supabase, { isSupabaseConfigured } from '../config/supabase.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const DEFAULT_ACCESSIBILITY_PREFERENCES = {
  fontSize: 'medium',
  highContrast: false,
  reducedMotion: false,
  preferredLanguage: 'English',
  voiceEnabled: false,
};

// Local persistent file fallback for offline/development persistence
const LOCAL_STORAGE_DIR = path.resolve(__dirname, '../../.data');
const LOCAL_STORAGE_FILE = path.join(LOCAL_STORAGE_DIR, 'profiles.json');

const ensureLocalStore = () => {
  if (!fs.existsSync(LOCAL_STORAGE_DIR)) {
    fs.mkdirSync(LOCAL_STORAGE_DIR, { recursive: true });
  }
  if (!fs.existsSync(LOCAL_STORAGE_FILE)) {
    fs.writeFileSync(LOCAL_STORAGE_FILE, JSON.stringify([]), 'utf-8');
  }
};

const readLocalProfiles = () => {
  ensureLocalStore();
  try {
    const raw = fs.readFileSync(LOCAL_STORAGE_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch {
    return [];
  }
};

const writeLocalProfiles = (profiles) => {
  ensureLocalStore();
  fs.writeFileSync(LOCAL_STORAGE_FILE, JSON.stringify(profiles, null, 2), 'utf-8');
};

/**
 * Normalizes user record from Supabase snake_case or local store
 */
const normalizeUser = (record) => {
  if (!record) return null;
  return {
    id: record.id,
    name: record.name,
    email: record.email,
    passwordHash: record.password_hash || record.passwordHash,
    createdAt: record.created_at || record.createdAt,
    updatedAt: record.updated_at || record.updatedAt,
    accessibilityPreferences:
      record.accessibility_preferences ||
      record.accessibilityPreferences || { ...DEFAULT_ACCESSIBILITY_PREFERENCES },
  };
};

export const userRepository = {
  /**
   * Find a user profile by email (case-insensitive)
   * @param {string} email
   * @returns {Promise<object|null>}
   */
  async findUserByEmail(email) {
    if (!email) return null;
    const normalizedEmail = email.trim().toLowerCase();

    if (isSupabaseConfigured()) {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .ilike('email', normalizedEmail)
        .maybeSingle();

      if (error) {
        console.error('[Supabase Error in findUserByEmail]:', error.message);
        throw new Error('Database error occurred');
      }
      return normalizeUser(data);
    }

    // Persistent local file store fallback
    const profiles = readLocalProfiles();
    const found = profiles.find((p) => p.email.toLowerCase() === normalizedEmail);
    return normalizeUser(found);
  },

  /**
   * Find a user profile by unique ID
   * @param {string} id
   * @returns {Promise<object|null>}
   */
  async findUserById(id) {
    if (!id) return null;

    if (isSupabaseConfigured()) {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (error) {
        console.error('[Supabase Error in findUserById]:', error.message);
        throw new Error('Database error occurred');
      }
      return normalizeUser(data);
    }

    const profiles = readLocalProfiles();
    const found = profiles.find((p) => p.id === id);
    return normalizeUser(found);
  },

  /**
   * Create a new user profile record
   * @param {object} param0 { name, email, passwordHash, accessibilityPreferences }
   * @returns {Promise<object>}
   */
  async createUser({ name, email, passwordHash, accessibilityPreferences }) {
    const preferences = {
      ...DEFAULT_ACCESSIBILITY_PREFERENCES,
      ...(accessibilityPreferences || {}),
    };

    if (isSupabaseConfigured()) {
      const newRecord = {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password_hash: passwordHash,
        accessibility_preferences: preferences,
      };

      const { data, error } = await supabase
        .from('profiles')
        .insert([newRecord])
        .select('*')
        .single();

      if (error) {
        console.error('[Supabase Error in createUser]:', error.message);
        throw new Error('Failed to create profile in database');
      }
      return normalizeUser(data);
    }

    // Persistent local fallback
    const profiles = readLocalProfiles();
    const now = new Date().toISOString();
    const newUser = {
      id: crypto.randomUUID(),
      name: name.trim(),
      email: email.trim().toLowerCase(),
      passwordHash,
      createdAt: now,
      updatedAt: now,
      accessibilityPreferences: preferences,
    };

    profiles.push(newUser);
    writeLocalProfiles(profiles);
    return normalizeUser(newUser);
  },

  /**
   * Update accessibility preferences for a user
   * @param {string} id
   * @param {object} newPreferences
   * @returns {Promise<object|null>}
   */
  async updateAccessibilityPreferences(id, newPreferences) {
    const current = await this.findUserById(id);
    if (!current) return null;

    const merged = {
      ...current.accessibilityPreferences,
      ...newPreferences,
    };
    const now = new Date().toISOString();

    if (isSupabaseConfigured()) {
      const { data, error } = await supabase
        .from('profiles')
        .update({
          accessibility_preferences: merged,
          updated_at: now,
        })
        .eq('id', id)
        .select('*')
        .single();

      if (error) {
        console.error('[Supabase Error in updateAccessibilityPreferences]:', error.message);
        throw new Error('Failed to update accessibility preferences');
      }
      return normalizeUser(data);
    }

    // Persistent local fallback
    const profiles = readLocalProfiles();
    const index = profiles.findIndex((p) => p.id === id);
    if (index === -1) return null;

    profiles[index] = {
      ...profiles[index],
      accessibilityPreferences: merged,
      updatedAt: now,
    };
    writeLocalProfiles(profiles);
    return normalizeUser(profiles[index]);
  },

  /**
   * Strip sensitive fields (password_hash) from user profile
   * @param {object} user
   * @returns {object|null}
   */
  sanitizeUser(user) {
    if (!user) return null;
    const { passwordHash: _hash, password_hash: _dbHash, ...safeUser } = user;
    return safeUser;
  },
};

export default userRepository;
