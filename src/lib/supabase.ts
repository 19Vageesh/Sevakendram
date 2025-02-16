import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env file.');
}

// Create the Supabase client with optimized settings
const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'pkce'
  },
  global: {
    headers: {
      'X-Client-Info': 'supabase-js-web'
    }
  },
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  }
});

// Connection status monitoring
let isConnected = false;
let connectionAttempts = 0;
const MAX_CONNECTION_ATTEMPTS = 5;
const CONNECTION_TIMEOUT = 10000; // 10 seconds

// Retry utility for Supabase operations with timeout
export async function withRetry<T>(
  operation: () => Promise<T>,
  maxRetries = 5,
  baseDelay = 500,
  timeout = CONNECTION_TIMEOUT
): Promise<T> {
  let lastError: any;
  
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      // Create a timeout promise
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Operation timed out')), timeout);
      });

      // Race between the operation and the timeout
      const result = await Promise.race([
        operation(),
        timeoutPromise
      ]) as T;

      // If successful, reset connection attempts
      if (attempt > 0) {
        console.log(`Operation succeeded after ${attempt + 1} attempts`);
      }
      connectionAttempts = 0;
      return result;
    } catch (error: any) {
      lastError = error;
      connectionAttempts++;
      
      // Check if we should retry based on the error and attempts
      if (!shouldRetry(error) || attempt === maxRetries - 1 || connectionAttempts >= MAX_CONNECTION_ATTEMPTS) {
        throw error;
      }
      
      // Exponential backoff with jitter and shorter initial delay
      const delay = Math.min(
        baseDelay * Math.pow(1.5, attempt) + Math.random() * 500,
        5000 // Cap at 5 seconds
      );
      
      console.log(`Retrying operation in ${Math.round(delay)}ms (attempt ${attempt + 1}/${maxRetries})`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  throw lastError;
}

// Helper to determine if an error is retryable
function shouldRetry(error: any): boolean {
  // Always retry on timeout
  if (error.message === 'Operation timed out') {
    return true;
  }

  // Network errors
  if (error.message?.includes('NetworkError') || 
      error.message?.includes('network') ||
      error.message?.includes('Failed to fetch')) {
    return true;
  }
  
  // Supabase specific errors that might be temporary
  if (error.message?.includes('upstream connect error') || 
      error.message?.includes('connection failure') ||
      error.message?.includes('timeout') ||
      error.status === 503 || 
      error.status === 504 ||
      error.status === 429) {
    return true;
  }
  
  return false;
}

// Enhanced connection check with timeout
async function checkConnection(): Promise<boolean> {
  try {
    const result = await withRetry(
      async () => {
        const { error } = await supabase.from('profiles').select('count');
        if (error) throw error;
        return true;
      },
      3, // Fewer retries for connection check
      200 // Shorter delay for connection check
    );
    
    isConnected = result;
    if (isConnected) {
      connectionAttempts = 0;
    }
    return isConnected;
  } catch (error) {
    console.warn('Connection check failed:', error);
    isConnected = false;
    return false;
  }
}

// Initial connection check with more aggressive retry
(async function initializeConnection() {
  let connected = false;
  let attempts = 0;
  const maxInitialAttempts = 3;

  while (!connected && attempts < maxInitialAttempts) {
    try {
      connected = await checkConnection();
      if (connected) {
        console.log('Successfully connected to Supabase');
        break;
      }
    } catch (error) {
      console.warn(`Initial connection attempt ${attempts + 1} failed:`, error);
    }
    attempts++;
    if (!connected && attempts < maxInitialAttempts) {
      await new Promise(resolve => setTimeout(resolve, 1000 * attempts));
    }
  }

  if (!connected) {
    console.error('Failed to establish initial connection to Supabase');
  }
})();

// Periodic connection check with dynamic interval
let connectionCheckInterval = 5000; // Start with 5 seconds
const MAX_CHECK_INTERVAL = 30000; // Max 30 seconds

function updateConnectionCheckInterval(connected: boolean) {
  if (connected) {
    // If connected, gradually increase the interval
    connectionCheckInterval = Math.min(connectionCheckInterval * 1.5, MAX_CHECK_INTERVAL);
  } else {
    // If disconnected, reset to more frequent checks
    connectionCheckInterval = 5000;
  }
  return connectionCheckInterval;
}

// Start connection monitoring
setInterval(async () => {
  const connected = await checkConnection();
  const nextInterval = updateConnectionCheckInterval(connected);
  if (connected !== isConnected) {
    console.log(`Connection status changed to: ${connected ? 'connected' : 'disconnected'}`);
    console.log(`Next check in ${nextInterval / 1000} seconds`);
  }
}, connectionCheckInterval);

// Export connection status checker
export function getConnectionStatus() {
  return isConnected;
}

export { supabase };